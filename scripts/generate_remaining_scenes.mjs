import fs from "fs";
import path from "path";

const scenes = [
  {
    num: 6,
    title: "Scene 06 — Wedding Morning Empty Room",
    dialogue: '"Wedding morning. Six a.m. Nobody show."',
    prompt:
      "Cinematic film still, 35mm film grain, 4:5 vertical framing. No people in this image, completely empty quiet room. A quiet Lagos bedroom at six in the morning, first grey-blue cool morning light filtering through the window curtains. A white wedding dress hangs on the wardrobe door. An empty wooden chair sits in front of a dressing mirror, a clean folded white towel on it. Still, silent, moody, nobody there.",
    noReference: true,
    file: "public/scene-06-empty-bedroom.jpg",
  },
  {
    num: 7,
    title: "Scene 07 — Line Disconnected",
    dialogue: '"She call — e ring, nobody pick. Seven a.m., the line don go off."',
    prompt:
      "Cinematic film still, 35mm film grain, 4:5 vertical framing. The exact same Nigerian woman from the reference portrait with neat cornrows, authentic dark brown skin. She stands by the window in a white towel wrapper, phone pressed hard to her ear, other hand gripping the back of her neck in stress. Her face is going still as she listens to silence on the dead line. Cool early morning grey-blue light on one side of her face.",
    noReference: false,
    file: "public/scene-07-line-dead.jpg",
  },
  {
    num: 8,
    title: "Scene 08 — Mama Shouting & Photographer Arrives",
    dialogue: '"Her mama dey shout. The photographer don land."',
    prompt:
      "Cinematic film still, 35mm film grain, 4:5 vertical framing. The exact same Nigerian woman with neat cornrows from the reference portrait, in the foreground seated and quiet in distress. Behind her, out of focus, an older Nigerian mother in a traditional headwrap stands in the bedroom doorway with her arms raised mid-argument shouting, and a photographer with a camera on a strap waits awkwardly at the door. Morning light, crowded small room, chaos behind stillness.",
    noReference: false,
    file: "public/scene-08-mama-shouting.jpg",
  },
  {
    num: 9,
    title: "Scene 09 — Bride Waiting Bare-Faced",
    dialogue: '"The bride sit down for chair, face bare, wrapper for her laps."',
    prompt:
      "Cinematic film still, 35mm film grain, 4:5 vertical framing. The exact same Nigerian woman from the reference portrait with neat cornrows. She sits alone in a chair in front of a dressing mirror, bare face, no makeup, a traditional wrapper across her lap, hands folded on it. She looks at her own reflection in the mirror without expression, heartbroken stillness. Morning light from the side. The empty chair beside her holds an untouched makeup bag.",
    noReference: false,
    file: "public/scene-09-bride-bareface.jpg",
  },
  {
    num: 10,
    title: "Scene 10 — Cousin Friend Emergency Makeup",
    dialogue: '"Na her cousin friend rush come do am small thing with her own personal kit."',
    prompt:
      "Cinematic film still, 35mm film grain, 4:5 vertical framing. The exact same Nigerian woman with neat cornrows from the reference portrait, sitting in the chair with her eyes closed. A second Nigerian woman in her twenties, in a casual t-shirt and jeans, leans in close and works on her face with a small brush from an everyday personal makeup zipper pouch open on her knees. Kind, hurried, gentle sisterly care. Morning light, close and warm.",
    noReference: false,
    file: "public/scene-10-cousin-makeup.jpg",
  },
  {
    num: 11,
    title: "Scene 11 — The Scammer Posts Another Bride",
    dialogue: '"By afternoon, that same page don post another bride. Same gele. Same caption."',
    prompt:
      "Cinematic film still, 35mm film grain, 4:5 vertical framing. The exact same Nigerian woman from the reference portrait. She sits in full bridal gele and makeup now, at the edge of the party, holding her smartphone low in her lap and looking down at it. The screen glows plain with nothing legible. Her expression is flat, far away, staring down. Warm afternoon light, blurred wedding celebration and dancing guests in bokeh behind her.",
    noReference: false,
    file: "public/scene-11-scam-discovered.jpg",
  },
  {
    num: 12,
    title: "Scene 12 — Review on Legit Africa",
    dialogue: '"Now my sister don carry the whole matter go write for Legit Africa..."',
    prompt:
      "Cinematic film still, 35mm film grain, 4:5 vertical framing. The exact same Nigerian woman from the reference portrait. Evening, at home, out of the gele, neat cornrows, comfortable clothing, sitting on the bed with the phone held in both hands, typing steadily with a set, resolved, determined expression. Plain bright screen, nothing legible. Warm evening lamplight. Leave clear generous empty space above her head.",
    noReference: false,
    file: "public/scene-12-legit-africa-review.jpg",
  },
];

async function run() {
  for (const scene of scenes) {
    console.log(`\n>>> Generating Scene ${scene.num}: ${scene.title}...`);
    try {
      const resp = await fetch("http://localhost:3000/api/generate-frame", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: scene.prompt,
          aspectRatio: "3:4",
          noReference: scene.noReference,
        }),
      });
      const data = await resp.json();
      if (data.success && data.imageUrl) {
        const base64Data = data.imageUrl.replace(/^data:image\/\w+;base64,/, "");
        fs.writeFileSync(scene.file, Buffer.from(base64Data, "base64"));
        console.log(`Successfully saved ${scene.file} (${fs.statSync(scene.file).size} bytes)`);
      } else {
        console.error(`Failed to generate Scene ${scene.num}:`, data.error || data);
      }
    } catch (err) {
      console.error(`Error in Scene ${scene.num}:`, err.message);
    }
  }
}

run();
