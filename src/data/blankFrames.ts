import { AdvertFrame } from '../types';
import { CHIDI_CAMPAIGN_FRAMES } from './advertData';

export { CHIDI_CAMPAIGN_FRAMES };

export const DEMO_FRAMES: AdvertFrame[] = CHIDI_CAMPAIGN_FRAMES;

// Helper to generate a completely blank storyboard for starting a new campaign
export const createEmptyStoryboard = (): AdvertFrame[] =>
  CHIDI_CAMPAIGN_FRAMES.map((f) => ({
    ...f,
    imageUrl: undefined,
    status: 'empty' as const,
  }));

// Alias for backwards compatibility
export const BLANK_FRAMES: AdvertFrame[] = CHIDI_CAMPAIGN_FRAMES;
