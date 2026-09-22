import fs from 'fs';

const currentState = JSON.parse(fs.readFileSync('campaign-state.json', 'utf-8'));

// Insert new Frame 7, and adjust indices
const newFrame7 = {
  id: 7,
  frameNumber: 7,
  title: 'Scene 07 — Searching The Conversation',
  dialogue:
    'Wedding morning. She sits on the edge of the bed in a white wrapper, holding the phone close to her face in both hands, thumb scrolling up and then down again through the same conversation. Her lips are slightly parted, her brow pulled together — searching for a reason, not finding one.',
  sceneDescription:
    'Same woman, same film look. Wedding morning. She sits on the edge of the bed in a white wrapper, holding the phone close to her face in both hands, thumb scrolling up and then down again through the same conversation. Her lips are slightly parted, her brow pulled together — searching for a reason, not finding one. The phone glows plain with nothing legible on the screen. Cool early-morning window light on one side of her face.',
  lightingSetup: 'Cool early-morning window light on one side of her face, soft shadows',
  emotion: 'Searching for a reason, not finding one; lips parted, brow pulled together',
  status: 'completed',
  aspectRatio: '4:5',
  imageUrl: '/scene-07-searching-chat.jpg',
};

const updatedFrames = [];

for (const f of currentState.frames) {
  if (f.frameNumber < 7) {
    updatedFrames.push(f);
  } else if (f.frameNumber === 7) {
    updatedFrames.push(newFrame7);
    updatedFrames.push({
      ...f,
      id: f.id + 1,
      frameNumber: f.frameNumber + 1,
      title: f.title.replace('Scene 07', 'Scene 08'),
    });
  } else {
    const num = f.frameNumber + 1;
    const numStr = num < 10 ? `0${num}` : `${num}`;
    const oldNumStr = f.frameNumber < 10 ? `0${f.frameNumber}` : `${f.frameNumber}`;
    updatedFrames.push({
      ...f,
      id: num,
      frameNumber: num,
      title: f.title.replace(`Scene ${oldNumStr}`, `Scene ${numStr}`),
    });
  }
}

currentState.frames = updatedFrames;
fs.writeFileSync('campaign-state.json', JSON.stringify(currentState, null, 2));
console.log(`Updated campaign-state.json with ${updatedFrames.length} frames.`);
