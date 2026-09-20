export interface AdvertFrame {
  id: number;
  frameNumber: number;
  title: string;
  sceneDescription: string;
  lightingSetup: string;
  emotion: string;
  imageUrl?: string;
  status: 'empty' | 'prompted' | 'generating' | 'completed' | 'error';
  errorMessage?: string;
  generatedPrompt?: string;
  aspectRatio: string;
}

export interface CharacterReference {
  name: string;
  ethnicity: string;
  age: string;
  complexion: string;
  hair: string;
  facialHair: string;
  wardrobeTop: string;
  wardrobeBottom: string;
  lens: string;
  lighting: string;
  filmStock: string;
  colorGrade: string;
  aspectRatio: string;
  prompt: string;
  imageUrl?: string;
}
