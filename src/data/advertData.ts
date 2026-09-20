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
      status: "prompted",
      aspectRatio: "4:5",
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
