import { AdvertFrame, CharacterReference } from '../types';
import { REFERENCE_PORTRAIT_PROMPT } from '../utils/promptBuilder';

export const INITIAL_CHARACTER_REFERENCE: CharacterReference = {
  name: "Protagonist (Lagos Advert)",
  ethnicity: "Nigerian",
  age: "Early 30s",
  complexion: "Warm dark brown skin",
  hair: "Short neat hair",
  facialHair: "Neatly trimmed thin moustache, clean-shaven cheeks & chin",
  wardrobeTop: "Faded blue short-sleeve shirt",
  wardrobeBottom: "Dark trousers",
  lens: "85mm prime lens (portrait)",
  lighting: "Soft even daylight on both sides of face",
  filmStock: "Kodak Portra 400 (35mm)",
  colorGrade: "Warm Lagos colour grade, rich earth & golden tones",
  aspectRatio: "4:5 (vertical portrait, taller than wide)",
  prompt: REFERENCE_PORTRAIT_PROMPT,
};

export const INITIAL_FRAMES: AdvertFrame[] = Array.from({ length: 11 }, (_, i) => {
  const frameNum = i + 1;
  if (frameNum === 1) {
    return {
      id: 1,
      frameNumber: 1,
      title: "Frame 01 — Defeat on the Kerb",
      sceneDescription:
        "He sits defeated on a low concrete kerb beside a cracked, dusty Lagos pavement on a hot Saturday morning. He clutches his forehead with one hand in stunned grief and quiet devastation. On his lap a worn brown paper envelope lies open and flattened, with blank unprinted paper slips spilling out of it. Hard bright morning tropical sunlight slices across the scene, casting long dramatic shadows, dust hanging in the light. He sits low in the frame with clear empty space above his head.",
      lightingSetup: "Hard bright morning tropical sunlight slicing across with long dramatic shadows, dust particles hanging in the light",
      emotion: "Stunned grief and quiet devastation",
      status: "completed",
      aspectRatio: "4:5",
      imageUrl: "/scene-01-kerb-defeat.jpg",
    };
  }
  if (frameNum === 2) {
    return {
      id: 2,
      frameNumber: 2,
      title: "Frame 02 — Walking Past 'TO LET'",
      sceneDescription:
        "Side-on profile of him walking steadily along a Lagos street lined with high compound walls and locked metal gates, a brown envelope tucked under his arm. He glances up at the buildings he passes, his face tired and patient. On the weathered concrete wall behind him, a plain hand-painted sign in bold black block capitals reads TO LET — those two words only, nothing else written anywhere in the image. Hard midday sun, long shadows, dust in the light.",
      lightingSetup: "Hard midday equatorial sun, sharp contrasting shadows, bright dust in the air",
      emotion: "Tired persistence, patient endurance, weary determination",
      status: "completed",
      aspectRatio: "4:5",
      imageUrl: "/scene-02-walking-to-let.jpg",
    };
  }
  if (frameNum === 3) {
    return {
      id: 3,
      frameNumber: 3,
      title: "Frame 03 — The Empty Flat Inspection",
      sceneDescription:
        "Inside an empty rented flat — bare cream walls, dusty tiled floor, one window with burglary bars, no furniture at all. He stands in the middle of the room looking up at a dark water stain spreading across the ceiling, his mouth tight, unimpressed. Behind him and to his left, a second man in a short-sleeve shirt stands in an open inner doorway with one hand on the door frame and the other held out toward the next room, showing him around. Daylight falls in a hard slab from the window across the bare floor.",
      lightingSetup: "Hard slab of daylight from the barred window cutting across dusty tiled floor, moody indoor contrast",
      emotion: "Skeptical disappointment, tight-lipped frustration, unimpressed scrutiny",
      status: "completed",
      aspectRatio: "4:5",
      imageUrl: "/scene-03-flat-inspection.jpg",
    };
  }
  if (frameNum === 4) {
    return {
      id: 4,
      frameNumber: 4,
      title: "Frame 04 — Tenement Room Exhaustion",
      sceneDescription:
        "Night. He sits slumped in total physical and emotional exhaustion on the edge of a thin worn foam mattress in a cramped dark Lagos tenement room. His shirt is dusty with sweat rings. His dust-caked black shoes are kicked off on the bare concrete floor. On a low wooden stool beside him rests the thick creased brown envelope. Fading amber twilight through iron-barred louvered windows mixes with the dim warm glow of a single low-wattage yellow bulb. Deep shadows, heavy atmosphere, unposed and candid.",
      lightingSetup: "Fading amber twilight through iron-barred louvered windows mixed with dim warm glow of single low-wattage yellow bulb",
      emotion: "Total physical and emotional exhaustion, heavy weary slump, unposed defeat",
      status: "completed",
      aspectRatio: "4:5",
      imageUrl: "/scene-04-exhaustion-night.jpg",
    };
  }
  if (frameNum === 5) {
    return {
      id: 5,
      frameNumber: 5,
      title: "Frame 05 — The Late-Night Call",
      sceneDescription:
        "He still sits on the mattress edge, but a plain black phone on the wooden stool beside him has lit up. He has turned his head toward it, one hand lifting off his knee to reach for it. Exhaustion is still on his face, with a small flicker of hope in his eyes — not a smile. The white glow of the screen catches one side of his face. Nothing legible on the screen.",
      lightingSetup: "Cool white screen light glancing across cheekbone contrasting against warm low-wattage yellow bulb and deep room shadows",
      emotion: "Weary exhaustion meeting a cautious, subtle flicker of hope",
      status: "completed",
      aspectRatio: "4:5",
      imageUrl: "/scene-05-phone-lights-up.jpg",
    };
  }
  if (frameNum === 6) {
    return {
      id: 6,
      frameNumber: 6,
      title: "Frame 06 — The Perfect Yaba Flat",
      sceneDescription:
        "A bright, smart, freshly painted empty two-bedroom flat living room in Lagos. Clean tiled floor, fresh cream walls, a large window with daylight pouring in, a ceiling fan overhead. Completely empty of people and furniture. Warm, inviting, appealing light — the kind of picture that sells a flat. Same film look and grain as the other images.",
      lightingSetup: "Bright, warm, inviting daylight pouring through large window, soft gradients across fresh walls",
      emotion: "Aspirational real estate appeal, crisp cleanliness, inviting optimism",
      status: "completed",
      aspectRatio: "4:5",
      imageUrl: "/scene-06-bright-yaba-flat.jpg",
    };
  }
  if (frameNum === 7) {
    return {
      id: 7,
      frameNumber: 7,
      title: "Frame 07 — The Desperate Money Transfer",
      sceneDescription:
        "He sits on the mattress edge, head bent over a plain black phone held in both hands, his thumb pressing the screen. The screen glows bright white with nothing legible on it, lighting his face and hands from below. His expression is tense and committed, not happy. He sits low in the frame with clear empty space above his head. One dim yellow bulb, deep shadows.",
      lightingSetup: "Bright upward white underlight from phone screen illuminating face and hands against deep room darkness and single dim overhead bulb",
      emotion: "Tense commitment, anxious determination, high-stakes resolve",
      status: "completed",
      aspectRatio: "4:5",
      imageUrl: "/scene-07-transfer-money.jpg",
    };
  }
  if (frameNum === 8) {
    return {
      id: 8,
      frameNumber: 8,
      title: "Frame 08 — Saturday Arrival at the Gate",
      sceneDescription:
        "Bright Saturday morning. He walks beside his wife along a Lagos street, a large holdall bag carried between them, approaching a closed metal compound gate. Both are looking up at the building beyond the gate with quiet hope. Hard morning sunlight, long shadows, dust in the air.",
      lightingSetup: "Hard, brilliant Saturday morning sunlight, long diagonal morning shadows, fine dust motes in the air",
      emotion: "Quiet hope, cautious relief, shared anticipation",
      status: "completed",
      aspectRatio: "4:5",
      imageUrl: "/scene-08-saturday-arrival.jpg",
    };
  }
  if (frameNum === 9) {
    return {
      id: 9,
      frameNumber: 9,
      title: "Frame 09 — The Unreachable Number",
      sceneDescription:
        "He has stepped a few paces away from the group at the gate and stands with the plain black phone pressed hard to his ear, his other hand gripping the back of his neck. His face has gone still — jaw tight, eyes fixed on nothing, the hope drained out of it. Behind him, out of focus, his wife and the other families wait by the gate with their bags. Hard morning sunlight, long shadows, dust in the air.",
      lightingSetup: "Hard morning sunlight casting long shadows and fine airborne dust, with sharp focus on his devastated stillness and shallow depth of field on the background",
      emotion: "Numb shock, drained hope, frozen disbelief, tense realization",
      status: "completed",
      aspectRatio: "4:5",
      imageUrl: "/scene-09-phone-dead.jpg",
    };
  }
  if (frameNum === 10) {
    return {
      id: 10,
      frameNumber: 10,
      title: "Frame 10 — Dawning Confusion at the Locked Gate",
      sceneDescription:
        "Outside that same closed metal compound gate. He and his wife stand holding their holdall bag, facing two other small families who are also standing there with bags and suitcases. Everyone is looking at each other in dawning confusion — quiet and still, no shouting, no argument, no raised hands. Hard morning sunlight, long shadows, dust.",
      lightingSetup: "Hard unforgiving morning sunlight, sharp high-contrast shadows, golden airborne dust motes",
      emotion: "Dawning confusion, quiet disbelief, tense stillness",
      status: "completed",
      aspectRatio: "4:5",
      imageUrl: "/scene-10-dawning-confusion.jpg",
    };
  }
  return {
    id: frameNum,
    frameNumber: frameNum,
    title: `Frame ${frameNum < 10 ? `0${frameNum}` : frameNum}`,
    sceneDescription: "",
    lightingSetup: "Hard natural daylight (Lagos)",
    emotion: "Authentic human emotion",
    status: 'empty',
    aspectRatio: '4:5',
  };
});
