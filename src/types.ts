export interface AdvertFrame {
  id: number;
  frameNumber: number;
  title: string;
  dialogue?: string;
  sceneDescription: string;
  lightingSetup: string;
  emotion: string;
  studioMotion?: string;
  expectedVisual?: string;
  imageUrl?: string;
  status: 'empty' | 'prompted' | 'generating' | 'completed' | 'error';
  errorMessage?: string;
  generatedPrompt?: string;
  aspectRatio: string;
  reviewCard?: {
    platform: string;
    stars: number;
    text: string;
    subtext?: string;
  };
  isStudioTextScene?: boolean;
  studioCardType?: 'text-scene' | 'legit-screen' | 'legit-search' | 'end-card';
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
