import { AdvertFrame, CharacterReference } from '../types';
import { FULL_24_SCENE_CAMPAIGN } from './campaign24Frames';

export const CHIDI_CHARACTER_REFERENCE: CharacterReference = {
  name: "Chidi (Protagonist)",
  ethnicity: "Nigerian man",
  age: "Late 20s to early 30s",
  complexion: "Warm dark brown skin",
  hair: "Neat haircut, well-groomed beard",
  facialHair: "Full neat short beard",
  wardrobeTop: "Light-blue button-up shirt",
  wardrobeBottom: "Casual trousers",
  lens: "85mm prime lens (portrait)",
  lighting: "Warm golden-hour / natural daylight",
  filmStock: "Kodak Portra 400 (35mm)",
  colorGrade: "Warm Lagos colour grade, natural documentary realism",
  aspectRatio: "4:5 (vertical portrait, taller than wide)",
  prompt:
    "Vertical portrait framing, 4:5 aspect ratio (taller than wide). 35mm documentary photograph of Chidi: a Nigerian man in his late 20s, warm dark brown skin, neat haircut, full neat short beard, wearing a light-blue button-up shirt. Shot on an 85mm prime lens, strictly front facing, looking directly into the camera lens with a calm, hopeful, thoughtful expression. Soft even daylight, plain neutral background, razor-sharp focus on his eyes, Kodak Portra 400 palette, warm Lagos colour grade. Authentic skin texture. Absolutely no text, no writing, no signage, no numbers, no watermarks anywhere in the image.",
};

export const INITIAL_CHARACTER_REFERENCE: CharacterReference = CHIDI_CHARACTER_REFERENCE;

export const CHIDI_CAMPAIGN_FRAMES: AdvertFrame[] = FULL_24_SCENE_CAMPAIGN;

export const INITIAL_FRAMES: AdvertFrame[] = CHIDI_CAMPAIGN_FRAMES;

