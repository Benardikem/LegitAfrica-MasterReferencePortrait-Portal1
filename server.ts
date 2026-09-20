import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Persistence storage file path
const STORAGE_FILE = path.join(process.cwd(), "campaign-state.json");
const MASTER_REF_FILE = path.join(process.cwd(), "public", "master-reference-portrait.png");

// In-memory cache
let masterReferenceImage: string | null = null;
let savedFramesState: any[] | null = null;

// Load existing from disk if available
try {
  if (fs.existsSync(MASTER_REF_FILE)) {
    masterReferenceImage = "/master-reference-portrait.png";
  }
  if (fs.existsSync(STORAGE_FILE)) {
    const raw = fs.readFileSync(STORAGE_FILE, "utf-8");
    const data = JSON.parse(raw);
    if (data.masterReferenceImage) masterReferenceImage = data.masterReferenceImage;
    if (data.frames) savedFramesState = data.frames;
  }
} catch (e) {
  console.warn("Storage load notice:", e);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // Shared Gemini client helper
  function getGenAI() {
    return new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      hasApiKey: !!process.env.GEMINI_API_KEY,
      hasMasterReference: !!masterReferenceImage,
    });
  });

  // Reference image state endpoints
  app.get("/api/reference-image", (req, res) => {
    res.json({
      imageUrl: masterReferenceImage,
      hasImage: !!masterReferenceImage,
    });
  });

  app.post("/api/save-reference", (req, res) => {
    try {
      const { imageUrl } = req.body;
      
      if (!imageUrl) {
        masterReferenceImage = null;
        if (fs.existsSync(MASTER_REF_FILE)) {
          try { fs.unlinkSync(MASTER_REF_FILE); } catch (e) {}
        }
      } else {
        masterReferenceImage = imageUrl;

        // If data URL, save file to disk
        if (typeof imageUrl === "string" && imageUrl.startsWith("data:image/")) {
          const matches = imageUrl.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
          if (matches && matches[2]) {
            const buffer = Buffer.from(matches[2], "base64");
            fs.writeFileSync(MASTER_REF_FILE, buffer);
            masterReferenceImage = "/master-reference-portrait.png";
          }
        }
      }

      // Persist metadata
      fs.writeFileSync(
        STORAGE_FILE,
        JSON.stringify(
          {
            masterReferenceImage,
            frames: savedFramesState,
            updatedAt: new Date().toISOString(),
          },
          null,
          2
        )
      );

      return res.json({
        success: true,
        imageUrl: masterReferenceImage,
      });
    } catch (err: any) {
      console.warn("Error saving reference:", err);
      return res.status(500).json({ error: err.message || "Failed to save reference image" });
    }
  });

  // Frames state persistence
  app.get("/api/frames-state", (req, res) => {
    res.json({
      frames: savedFramesState,
    });
  });

  app.post("/api/save-frames-state", (req, res) => {
    try {
      const { frames } = req.body;
      savedFramesState = frames;
      fs.writeFileSync(
        STORAGE_FILE,
        JSON.stringify(
          {
            masterReferenceImage,
            frames: savedFramesState,
            updatedAt: new Date().toISOString(),
          },
          null,
          2
        )
      );
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Safe billing status check endpoint
  app.get("/api/check-billing", async (req, res) => {
    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        billingActive: false,
        hasApiKey: false,
        message: "GEMINI_API_KEY is not configured.",
      });
    }

    try {
      const ai = getGenAI();
      await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: "status check",
      });
      return res.json({
        billingActive: true,
        hasApiKey: true,
        message: "Billing and API access active.",
      });
    } catch (err: any) {
      const isDepleted =
        err?.status === 402 ||
        err?.message?.includes("prepayment credits") ||
        err?.message?.includes("RESOURCE_EXHAUSTED");

      return res.json({
        billingActive: !isDepleted,
        hasApiKey: true,
        isBillingDepleted: isDepleted,
        message: isDepleted
          ? "Prepayment credits are depleted. Manage billing at https://ai.studio/projects"
          : err?.message || "API connection check failed.",
      });
    }
  });

  // Generate image endpoint
  app.post("/api/generate-frame", async (req, res) => {
    try {
      const {
        prompt,
        aspectRatio = "3:4",
        model = "gemini-3.1-flash-image",
        referenceImage: clientRefImage,
      } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          success: false,
          error: "GEMINI_API_KEY is not configured.",
        });
      }

      if (!prompt) {
        return res.json({ success: false, error: "Prompt is required." });
      }

      const ai = getGenAI();

      // Check if we have a reference portrait image to provide for identity continuity
      let referenceInlinePart: any = null;
      const refToUse = clientRefImage || masterReferenceImage;

      if (refToUse && typeof refToUse === "string") {
        if (refToUse.startsWith("data:image/")) {
          const match = refToUse.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
          if (match && match[2]) {
            referenceInlinePart = {
              inlineData: {
                data: match[2],
                mimeType: `image/${match[1]}`,
              },
            };
          }
        }
      }

      // If not data url, check if file exists on disk
      if (!referenceInlinePart && fs.existsSync(MASTER_REF_FILE)) {
        try {
          const fileBuf = fs.readFileSync(MASTER_REF_FILE);
          referenceInlinePart = {
            inlineData: {
              data: fileBuf.toString("base64"),
              mimeType: "image/png",
            },
          };
        } catch (e) {
          console.warn("Could not read master reference file:", e);
        }
      }

      const parts: any[] = [];
      if (referenceInlinePart) {
        parts.push(referenceInlinePart);
      }
      parts.push({ text: prompt });

      const response = await ai.models.generateContent({
        model: model || "gemini-3.1-flash-image",
        contents: {
          parts,
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio === "4:5" ? "3:4" : aspectRatio,
            imageSize: "1K",
          },
        },
      });

      const responseParts = response.candidates?.[0]?.content?.parts || [];
      let base64Image: string | null = null;
      let textOutput: string | null = null;

      for (const part of responseParts) {
        if (part.inlineData?.data) {
          base64Image = `data:${part.inlineData.mimeType || "image/png"};base64,${part.inlineData.data}`;
        }
        if (part.text) {
          textOutput = part.text;
        }
      }

      if (!base64Image) {
        return res.json({
          success: false,
          error: "Model returned no image data.",
          text: textOutput,
        });
      }

      return res.json({
        success: true,
        imageUrl: base64Image,
        text: textOutput,
      });
    } catch (err: any) {
      const isQuotaOrBilling =
        err?.status === 402 ||
        err?.status === 429 ||
        err?.message?.includes("prepayment credits") ||
        err?.message?.includes("RESOURCE_EXHAUSTED");

      if (isQuotaOrBilling) {
        // Informational log rather than error log to avoid trigger noise
        console.log("Image generation notice: Project prepayment credits depleted (HTTP 402).");
        return res.json({
          success: false,
          isBillingError: true,
          error: "Your prepayment credits are depleted. Please go to AI Studio at https://ai.studio/projects to manage your project and billing.",
          billingUrl: "https://ai.studio/projects",
        });
      }

      console.warn("Image generation notice:", err?.message || err);
      return res.json({
        success: false,
        error: err?.message || "Failed to generate image.",
        isBillingError: false,
      });
    }
  });

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
