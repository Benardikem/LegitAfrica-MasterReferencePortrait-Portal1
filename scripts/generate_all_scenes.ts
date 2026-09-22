import fs from 'fs';
import path from 'path';
import { CHIDI_CAMPAIGN_FRAMES } from '../src/data/advertData';
import { buildScenePrompt } from '../src/utils/promptBuilder';

async function main() {
  console.log("Starting generation of 5 Chidi campaign scenes...");

  const publicDir = path.join(process.cwd(), 'public');
  const campaignStateFile = path.join(process.cwd(), 'campaign-state.json');

  const updatedFrames = [...CHIDI_CAMPAIGN_FRAMES];

  for (let i = 0; i < updatedFrames.length; i++) {
    const frame = updatedFrames[i];
    const frameNum = frame.frameNumber;
    const filename = `chidi-scene-0${frameNum}.jpg`;
    const destPath = path.join(publicDir, filename);

    console.log(`\n--- Generating Scene 0${frameNum}: ${frame.title} ---`);
    const prompt = buildScenePrompt(frame.sceneDescription);

    const isCutaway = frameNum === 3; // Scene 3 is the couple at the airport, doesn't need Chidi's face ref
    const bodyPayload = {
      prompt,
      aspectRatio: "3:4",
      referenceImage: isCutaway ? "none" : "/master-reference-portrait.png",
      noReference: isCutaway,
    };

    try {
      const res = await fetch('http://localhost:3000/api/generate-frame', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload),
      });

      const data = await res.json();
      if (!data.success || !data.imageUrl) {
        console.error(`Failed to generate scene 0${frameNum}:`, data.error || data);
        continue;
      }

      // Convert data url to buffer and save
      const base64Data = data.imageUrl.replace(/^data:image\/[a-z]+;base64,/, '');
      fs.writeFileSync(destPath, Buffer.from(base64Data, 'base64'));
      console.log(`Saved image to ${filename} (${Math.round(base64Data.length * 0.75 / 1024)} KB)`);

      updatedFrames[i] = {
        ...frame,
        imageUrl: `/${filename}`,
        status: 'completed',
        generatedPrompt: prompt,
      };
    } catch (err: any) {
      console.error(`Error generating scene 0${frameNum}:`, err.message);
    }
  }

  // Update campaign-state.json
  const statePayload = {
    masterReferenceImage: "/master-reference-portrait.png",
    frames: updatedFrames,
    updatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(campaignStateFile, JSON.stringify(statePayload, null, 2));
  console.log("\nUpdated campaign-state.json successfully.");

  // Also call save-frames-state endpoint
  try {
    await fetch('http://localhost:3000/api/save-frames-state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ frames: updatedFrames }),
    });
    console.log("Synced to server state.");
  } catch (e) {
    console.warn("Server sync note:", e);
  }

  console.log("\nAll done!");
}

main().catch(console.error);
