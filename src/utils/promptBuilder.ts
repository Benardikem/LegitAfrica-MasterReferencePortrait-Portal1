export const CHIDI_CHARACTER_DESCRIPTION = 
  "Protagonist Chidi: Nigerian man in late 20s to early 30s, warm dark brown skin, neat haircut, full neat short beard, wearing a light-blue button-up shirt. Calm, thoughtful expression. The exact same face, facial bone structure, skin tone, and grooming in every frame.";

export const FIXED_CAMERA_STYLE = 
  "Vertical portrait framing, 4:5 aspect ratio (taller than wide), 35mm documentary photograph, Kodak Portra 400 film stock, organic film grain, warm Lagos colour grade, natural available light, shallow depth of field, gritty raw realism, no stylisation, authentic human emotion. Absolutely no text, no writing, no signage, no numbers, no typography, no logos, no watermarks anywhere in the image.";

export const REFERENCE_PORTRAIT_PROMPT = 
  "Vertical portrait framing, 4:5 aspect ratio (taller than wide). 35mm documentary photograph of Chidi: a Nigerian man in his late 20s, warm dark brown skin, neat haircut, full neat short beard, wearing a light-blue button-up shirt. Shot on an 85mm prime lens, strictly front facing, looking directly into the camera lens with a calm, hopeful, thoughtful expression. Soft even daylight, plain neutral background, razor-sharp focus on his eyes, Kodak Portra 400 palette, warm Lagos colour grade. Authentic skin texture. Absolutely no text, no writing, no signage, no numbers, no watermarks anywhere in the image.";

export function buildScenePrompt(sceneDescription: string, characterDescription?: string): string {
  const cleanScene = sceneDescription.trim();

  const hasReferenceDirective = 
    cleanScene.toLowerCase().includes("using the man in the attached image") || 
    cleanScene.toLowerCase().includes("attached image as the reference");

  const isCutawayOrCouple = 
    cleanScene.toLowerCase().includes("young nigerian couple") ||
    cleanScene.toLowerCase().includes("airport photo of the kind an agent would post");

  let continuityNote = "";
  if (!hasReferenceDirective && !isCutawayOrCouple) {
    continuityNote = characterDescription
      ? `Continuity Anchor: ${characterDescription}\n`
      : "Continuity Anchor: Featuring the exact same protagonist established in the attached Master Reference Portrait. Maintain 100% strict continuity: identical face, facial bone structure, skin tone, haircut, beard, and features.\n";
  }

  return `${cleanScene}

${continuityNote}Style & Quality:
- Framing: Vertical 4:5 format (taller than wide), 35mm film documentary style.
- Stock: Kodak Portra 400, warm natural Lagos colour grading, organic film grain, shallow depth of field.
- Negative constraints: Absolutely no text, no letters, no numbers, no watermarks, no logos, no captions anywhere in the image.`;
}
