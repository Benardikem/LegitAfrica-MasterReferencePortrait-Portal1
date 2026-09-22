import fs from "fs";

const STORAGE_FILE = "campaign-state.json";
let state = {};
try {
  if (fs.existsSync(STORAGE_FILE)) {
    state = JSON.parse(fs.readFileSync(STORAGE_FILE, "utf-8"));
  }
} catch (e) {}

state.masterReferenceImage = "/master-reference-portrait.png";
state.updatedAt = new Date().toISOString();

state.frames = [
  {
    id: 1,
    frameNumber: 1,
    title: "Scene 01 — Bedroom Morning",
    dialogue: '"Tell me why my sister go cry for her own wedding morning."',
    sceneDescription:
      "A cinematic film still, tight close-up on the exact same woman from the previous scene. She is in a bedroom with soft, dramatic early morning light streaming from a side window. She is not crying, but her eyes are glistening with tears and her jaw is firmly set, holding back emotion. Authentic bare skin, no makeup, hair styled in neat cornrows. Framed low in the shot with negative space above her head. Moody, intimate, 35mm film grain style.",
    lightingSetup: "Soft, dramatic early morning light streaming from a side window",
    emotion: "Glistening wet eyes, firmly set jaw, holding back deep emotion in quiet stillness",
    status: "completed",
    aspectRatio: "4:5",
    imageUrl: "/scene-01-bedroom-morning.jpg",
  },
  {
    id: 2,
    frameNumber: 2,
    title: "Scene 02 — Instagram Vendor Search",
    dialogue: '"Three months before the day, she find one makeup and gele vendor for Instagram."',
    sceneDescription:
      "Flashback 3 months earlier: Same woman, same film look, wearing casual home Ankara print loungewear top. She lies across a bed in a modest Lagos bedroom in the evening, propped on one elbow, scrolling a phone held in both hands. Relaxed, hopeful, a small smile. The phone screen glows bright with nothing legible on it. Warm lamplight.",
    lightingSetup: "Warm incandescent lamplight, gentle bedroom evening shadows",
    emotion: "Relaxed, hopeful, quiet anticipation with a genuine subtle smile",
    status: "completed",
    aspectRatio: "4:5",
    imageUrl: "/scene-02-instagram-vendor.jpg",
  },
  {
    id: 3,
    frameNumber: 3,
    title: "Scene 03 — Bridal Testimonies",
    dialogue: '"The page get plenty bridal fine pictures... Testimonies everywhere."',
    sceneDescription:
      "Same woman, same film look. Over her shoulder, close on the phone in her hands, her thumb mid-scroll. The screen glows plain and bright with nothing readable. Her face is soft focus behind, absorbed. Evening lamplight, shallow depth of field.",
    lightingSetup: "Evening bedside lamp glow, shallow depth of field, atmospheric bedroom interior",
    emotion: "Engrossed, trusting, absorbed in the glowing feed",
    status: "completed",
    aspectRatio: "4:5",
    imageUrl: "/scene-03-bridal-testimonies.jpg",
  },
  {
    id: 4,
    frameNumber: 4,
    title: "Scene 04 — Deposit Transfer",
    dialogue: '"Dem collect eighty-five thousand deposit."',
    sceneDescription:
      "Same woman, same film look. Her hands holding the phone flat, thumb just lifted off the screen, the screen glowing plain white. She is sitting on the edge of the bed. Her face is out of focus behind her hands, calm. Warm lamplight. Leave clear empty space above.",
    lightingSetup: "Warm lamplight, generous negative empty space above head",
    emotion: "Calm, decisive, transaction completed without hesitation",
    status: "completed",
    aspectRatio: "4:5",
    imageUrl: "/scene-04-deposit-sent.jpg",
  },
  {
    id: 5,
    frameNumber: 5,
    title: "Scene 05 — Weekly Messages",
    dialogue: '"Every week she go message: \'Sis, hope we dey alright?\'"',
    sceneDescription:
      "Same woman, same film look. She sits at the edge of a bed in daylight, phone held up in both hands, typing with both thumbs, head tilted, a patient half-smile. Plain bright screen, nothing legible. Soft window light.",
    lightingSetup: "Soft window daylight streaming into bedroom, gentle contrast",
    emotion: "Patient, smiling gently, reassuring and checking in",
    status: "completed",
    aspectRatio: "4:5",
    imageUrl: "/scene-05-weekly-messages.jpg",
  },
  {
    id: 6,
    frameNumber: 6,
    title: "Scene 06 — Wedding Morning Six A.M.",
    dialogue: '"Wedding morning. Six a.m. Nobody show."',
    sceneDescription:
      "No people in this image. A quiet Lagos bedroom at six in the morning, first grey-blue light through the curtains. A white wedding dress hangs on the wardrobe door. An empty chair sits in front of a dressing mirror, a clean towel folded on it. Still, silent, nobody there.",
    lightingSetup: "Cool grey-blue dawn light filtering through curtains, atmospheric stillness",
    emotion: "Eerie silence, quiet dread, pristine preparation waiting in vain",
    status: "completed",
    aspectRatio: "4:5",
    imageUrl: "/scene-06-empty-bedroom.jpg",
  },
  {
    id: 7,
    frameNumber: 7,
    title: "Scene 07 — The Dead Line",
    dialogue: '"She call — e ring, nobody pick. Seven a.m., the line don go off."',
    sceneDescription:
      "Same woman, same film look. She stands by the window in a white wrapper, phone pressed hard to her ear, other hand gripping the back of her neck. Her face is going still as she listens to nothing. Cool early morning light on one side of her face.",
    lightingSetup: "Cool early morning directional window light, sharp emotional shadows",
    emotion: "Stunned realization, sinking feeling, tense stillness",
    status: "completed",
    aspectRatio: "4:5",
    imageUrl: "/scene-07-line-dead.jpg",
  },
  {
    id: 8,
    frameNumber: 8,
    title: "Scene 08 — Mama Shouting & Photographer",
    dialogue: '"Her mama dey shout. The photographer don land."',
    sceneDescription:
      "Same woman, same film look, in the foreground seated and quiet. Behind her, out of focus, an older Nigerian woman in a headwrap stands in the doorway with her arms raised mid-argument, and a man with a camera on a strap waits awkwardly at the door. Morning light, crowded small room, chaos behind stillness.",
    lightingSetup: "Natural indoor morning light, dynamic depth of field with foreground stillness",
    emotion: "Subdued heartbreak in foreground contrasted with shouting family chaos behind",
    status: "completed",
    aspectRatio: "4:5",
    imageUrl: "/scene-08-mama-shouting.jpg",
  },
  {
    id: 9,
    frameNumber: 9,
    title: "Scene 09 — Bare-Faced Bride",
    dialogue: '"The bride sit down for chair, face bare, wrapper for her laps."',
    sceneDescription:
      "Same woman, same film look. She sits alone in a chair in front of a dressing mirror, bare face, no makeup, a wrapper across her lap, hands folded on it. She looks at her own reflection without expression. Morning light from the side. The empty chair beside her holds an untouched makeup bag.",
    lightingSetup: "Subtle side morning light, raw natural shadows, mirror reflections",
    emotion: "Numb quietude, stoic reflection, stripped of joy",
    status: "completed",
    aspectRatio: "4:5",
    imageUrl: "/scene-09-bride-bareface.jpg",
  },
  {
    id: 10,
    frameNumber: 10,
    title: "Scene 10 — Emergency Makeup",
    dialogue: '"Na her cousin friend rush come do am small thing with her own personal kit."',
    sceneDescription:
      "Same woman, same film look, sitting in the chair with her eyes closed. A second Nigerian woman in her twenties, in a t-shirt and jeans, leans in close and works on her face with a small brush from a everyday makeup pouch open on her knees. Kind, hurried, gentle. Morning light, close and warm.",
    lightingSetup: "Warm intimate morning light, tight sisterly bonding focus",
    emotion: "Reluctant resignation, gentle kindness, hurried communal rescue",
    status: "completed",
    aspectRatio: "4:5",
    imageUrl: "/scene-10-cousin-makeup.jpg",
  },
  {
    id: 11,
    frameNumber: 11,
    title: "Scene 11 — The Scam Discovered",
    dialogue: '"By afternoon, that same page don post another bride. Same gele. Same caption."',
    sceneDescription:
      "Same woman, same film look. She sits in full bridal gele and makeup now, at the edge of a party, holding her phone low in her lap and looking down at it. The screen glows plain with nothing legible. Her expression is flat, far away. Warm afternoon light, blurred celebration behind her.",
    lightingSetup: "Warm golden hour reception backlight, party bokeh, isolated subject",
    emotion: "Betrayed, detached, flat stare amidst celebration",
    status: "completed",
    aspectRatio: "4:5",
    imageUrl: "/scene-11-scam-discovered.jpg",
  },
  {
    id: 12,
    frameNumber: 12,
    title: "Scene 12 — Review on Legit Africa",
    dialogue: '"Now my sister don carry the whole matter go write for Legit Africa..."',
    sceneDescription:
      "Same woman, same film look. Evening, at home, out of the gele, sitting on the bed with the phone held in both hands, typing steadily with a set, resolved expression. Plain bright screen, nothing legible. Warm lamplight. Leave clear empty space above her. Put the review card here — one star, \"Dem collect deposit, dem block me\", top-centre.",
    lightingSetup: "Warm bedside lamplight, generous negative empty space above",
    emotion: "Determined, resolute, justice-seeking calm",
    status: "completed",
    aspectRatio: "4:5",
    imageUrl: "/scene-12-legit-africa-review.jpg",
    reviewCard: {
      platform: "Legit Africa",
      stars: 1,
      text: "Dem collect deposit, dem block me",
      subtext: "Verified Review • Vendor Scam Alert",
    },
  },
];

fs.writeFileSync(STORAGE_FILE, JSON.stringify(state, null, 2));
console.log("Successfully wrote all 12 scenes to campaign-state.json!");
