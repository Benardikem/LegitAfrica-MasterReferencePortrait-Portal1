export const FIXED_CHARACTER_DESCRIPTION = 
  "The man: Nigerian, early 30s, warm dark brown skin, short neat hair, neatly trimmed thin moustache, clean-shaven cheeks and chin, faded blue short-sleeve shirt, dark trousers. The exact same face, facial bone structure, skin tone, hair and faded blue shirt.";

export const FIXED_CAMERA_STYLE = 
  "Vertical portrait framing, 4:5 ratio (taller than wide), 35mm documentary photograph, Kodak Portra 400 film stock, organic film grain, warm Lagos colour grade, hard natural light with raw gritty realism, authentic candid human emotion. No text, no writing, no signage, no numbers, no watermarks anywhere in the image.";

export const REFERENCE_PORTRAIT_PROMPT = 
  "Vertical portrait (4:5 aspect ratio, taller than wide). A plain reference documentary portrait of a Nigerian man in his early 30s with warm dark brown skin, short neat hair, a neatly trimmed thin moustache, and clean-shaven cheeks and chin. He is wearing a faded blue short-sleeve shirt. Shot on an 85mm portrait lens, strictly front facing, looking directly into the camera lens with calm authentic human expression. Soft even daylight on both sides of his face, plain neutral studio backdrop, razor-sharp focus on his eyes, minimal film grain, Kodak Portra 400 palette, warm Lagos colour tone. Absolutely no text, no writing, no signage, no numbers, no watermarks.";

export function buildScenePrompt(sceneDescription: string): string {
  const cleanScene = sceneDescription.trim();
  return `Vertical portrait framing (4:5 aspect ratio, taller than wide). 35mm documentary photograph, Kodak Portra 400 film stock, organic film grain, warm Lagos colour grade, hard natural light, gritty raw realism, authentic human emotion.
Featuring the exact same man from the Master Reference Portrait: Nigerian in his early 30s with warm dark brown skin, short neat hair, a neatly trimmed thin moustache, clean-shaven cheeks and chin, wearing the identical faded blue short-sleeve shirt and dark trousers. Maintain 100% strict continuity: identical face, facial bone structure, skin tone, haircut, and faded blue shirt as established in the Step 1 Master Reference Portrait.
Scene: ${cleanScene}
Strict negative constraints: Absolutely no text, no writing, no signage, no numbers, no typography, no logos, no watermarks anywhere in the image.`;
}
