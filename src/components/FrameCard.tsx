import { useState } from 'react';
import { Sparkles, Copy, Check, Eye, Upload, RefreshCw, AlertCircle, Film, ArrowRight } from 'lucide-react';
import { AdvertFrame } from '../types';
import { buildScenePrompt } from '../utils/promptBuilder';

interface FrameCardProps {
  frame: AdvertFrame;
  masterReferenceImage?: string;
  onUpdateScene: (id: number, sceneDescription: string) => void;
  onGenerate: (id: number) => void;
  onUploadImage: (id: number, file: File) => void;
  onInspect: (frame: AdvertFrame) => void;
}

export function FrameCard({
  frame,
  masterReferenceImage,
  onUpdateScene,
  onGenerate,
  onUploadImage,
  onInspect,
}: FrameCardProps) {
  const [copied, setCopied] = useState(false);
  const [showPromptPreview, setShowPromptPreview] = useState(false);

  const fullPrompt = buildScenePrompt(frame.sceneDescription || `Scene ${frame.frameNumber}`);

  const handleCopy = () => {
    navigator.clipboard.writeText(fullPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadImage(frame.id, e.target.files[0]);
    }
  };

  return (
    <div
      id={`advert-frame-card-${frame.frameNumber}`}
      className={`bg-stone-900 border rounded-xl overflow-hidden transition-all duration-200 flex flex-col justify-between ${
        frame.imageUrl
          ? 'border-amber-500/50 shadow-lg bg-stone-900/90'
          : frame.sceneDescription
          ? 'border-stone-700 bg-stone-900'
          : 'border-stone-800 bg-stone-950/60'
      }`}
    >
      {/* Frame Slate Bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-stone-950/80 border-b border-stone-800">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-amber-400">
            FRAME #{frame.frameNumber < 10 ? `0${frame.frameNumber}` : frame.frameNumber}
          </span>
          <span className="text-[10px] text-stone-500 uppercase tracking-wider font-mono">
            / 11
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {masterReferenceImage ? (
            <div
              className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-[9px] font-mono text-emerald-300"
              title="Continuity locked to Master Reference Portrait"
            >
              <img
                src={masterReferenceImage}
                alt="Ref"
                className="w-3.5 h-3.5 rounded-full object-cover border border-emerald-400/50"
              />
              <span>REF ANCHORED</span>
            </div>
          ) : (
            <span className="text-[9px] font-mono text-stone-500">
              STEP 1 ANCHOR
            </span>
          )}

          {frame.imageUrl && (
            <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              READY
            </span>
          )}
          <button
            id={`btn-copy-prompt-frame-${frame.frameNumber}`}
            onClick={handleCopy}
            className="p-1 rounded text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
            title="Copy compiled prompt with continuity rules"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Frame Visual + Scene Input */}
      <div className="p-3.5 flex flex-col gap-3">
        {/* 4:5 Vertical Aspect Ratio Frame View */}
        <div className="relative aspect-[4/5] w-full bg-stone-950 rounded-lg overflow-hidden border border-stone-800 flex items-center justify-center group">
          {/* Film sprockets simulation */}
          <div className="absolute top-1 left-1.5 font-mono text-[8px] text-amber-400/70 z-10">
            PORTRA 400 • FRAME {frame.frameNumber}
          </div>

          {frame.imageUrl ? (
            <img
              src={frame.imageUrl}
              alt={`Frame ${frame.frameNumber}: ${frame.sceneDescription || 'Advert still'}`}
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
          ) : frame.frameNumber === 1 && frame.sceneDescription ? (
            /* Evocative 4:5 Composition Canvas for Scene 1 */
            <div className="w-full h-full relative flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#2a241e] via-[#221c17] to-[#120f0d]">
              {/* Slicing hard tropical morning sunbeam across the scene */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(125deg, rgba(251, 191, 36, 0.18) 0%, rgba(217, 119, 6, 0.08) 45%, transparent 70%)',
                }}
              />

              {/* Dust particles in sunbeam */}
              <div className="absolute top-6 left-8 w-1.5 h-1.5 rounded-full bg-amber-200/40 blur-[0.5px]" />
              <div className="absolute top-16 left-20 w-1 h-1 rounded-full bg-amber-200/30" />
              <div className="absolute top-24 left-12 w-2 h-2 rounded-full bg-amber-200/20 blur-[1px]" />
              <div className="absolute top-10 right-16 w-1 h-1 rounded-full bg-amber-200/40" />

              {/* Top area: Clear empty space above head */}
              <div className="relative z-10 pt-4 px-3 flex items-center justify-between">
                <span className="text-[9px] font-mono text-amber-400/90 bg-black/50 px-1.5 py-0.5 rounded border border-amber-500/20">
                  CLEAR SPACE ABOVE HEAD
                </span>
                <span className="text-[9px] font-mono text-stone-400 bg-black/50 px-1.5 py-0.5 rounded">
                  HARSH MORNING SUN
                </span>
              </div>

              {/* SVG Scene Composition: Low in frame on concrete kerb */}
              <div className="relative z-10 w-full h-[65%] flex items-end justify-center">
                <svg
                  viewBox="0 0 200 160"
                  className="w-full h-full"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Long dramatic morning shadow cast to the right */}
                  <ellipse cx="140" cy="148" rx="55" ry="10" fill="#0a0807" opacity="0.8" />

                  {/* Cracked dusty pavement background */}
                  <rect x="0" y="130" width="200" height="30" fill="#24211e" />
                  <line x1="0" y1="130" x2="200" y2="130" stroke="#3d3731" strokeWidth="1.5" />
                  {/* Cracks in pavement */}
                  <path d="M40 130 L48 138 L45 146 L55 158" stroke="#171513" strokeWidth="1" />
                  <path d="M150 130 L156 140 L165 148" stroke="#171513" strokeWidth="1" />

                  {/* Concrete Kerb (he sits on this edge) */}
                  <rect x="0" y="115" width="200" height="15" fill="#38332d" />
                  <line x1="0" y1="115" x2="200" y2="115" stroke="#4d463e" strokeWidth="1" />
                  <line x1="0" y1="130" x2="200" y2="130" stroke="#2b2722" strokeWidth="2" />

                  {/* Sitting Man: Low in the frame */}
                  {/* Dark trousers & bent seated legs */}
                  <path
                    d="M60 115 L62 145 L85 145 L85 125 L105 125 L105 145 L125 145 L120 115 Z"
                    fill="#18181b"
                  />

                  {/* Lap area: open worn brown paper envelope */}
                  <polygon points="78,112 112,112 116,124 74,124" fill="#8d5b34" />
                  <polygon points="76,112 95,104 114,112" fill="#754a29" />
                  {/* Blank unprinted paper slips spilling out */}
                  <rect x="80" y="114" width="14" height="9" transform="rotate(-10 80 114)" fill="#f4ede2" stroke="#d5c8b5" strokeWidth="0.5" />
                  <rect x="94" y="116" width="15" height="9" transform="rotate(15 94 116)" fill="#fdfbf7" stroke="#d5c8b5" strokeWidth="0.5" />
                  <rect x="86" y="120" width="12" height="7" transform="rotate(5 86 120)" fill="#ece3d2" stroke="#c8ba9f" strokeWidth="0.5" />

                  {/* Faded Blue Short-Sleeve Shirt (slumped forward posture) */}
                  <path
                    d="M72 112 L70 78 L85 70 L105 70 L118 78 L114 112 Z"
                    fill="#4b6785"
                  />
                  {/* Shirt folds and shading from harsh sunlight */}
                  <path d="M85 70 L95 82 L105 70" stroke="#364e6b" strokeWidth="1.5" />
                  <path d="M78 85 L76 102" stroke="#364e6b" strokeWidth="1.2" />

                  {/* Right Arm: Resting on knee / lap */}
                  <path d="M116 80 L122 102 L110 114" stroke="#523624" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />

                  {/* Left Arm: Raised, clutching forehead */}
                  <path d="M72 80 L62 92 L75 58" stroke="#523624" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
                  {/* Faded blue sleeve */}
                  <path d="M72 80 L66 88" stroke="#4b6785" strokeWidth="9" strokeLinecap="round" />

                  {/* Head: Warm dark brown skin, bowed slightly in grief */}
                  <ellipse cx="88" cy="56" rx="14" ry="16" fill="#523624" />

                  {/* Short neat hair */}
                  <path d="M75 54 C75 42 80 38 88 38 C96 38 101 42 101 54 C97 50 93 47 88 47 C82 47 78 50 75 54 Z" fill="#1c1613" />

                  {/* Hand clutching forehead */}
                  <ellipse cx="78" cy="52" rx="6" ry="4" fill="#5a3c28" transform="rotate(-25 78 52)" />
                  <line x1="75" y1="50" x2="81" y2="48" stroke="#3e2415" strokeWidth="1" />

                  {/* Downcast face, thin moustache */}
                  <path d="M85 64 Q88 65 91 64" stroke="#221914" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M86 67 Q88 68 90 67" stroke="#3a2215" strokeWidth="1" />
                </svg>
              </div>

              {/* Bottom tag */}
              <div className="relative z-10 px-2.5 py-1.5 bg-black/80 border-t border-stone-800/80 flex items-center justify-between text-[10px] font-mono">
                <span className="text-stone-300">CONCRETE KERB • LAGOS</span>
                <span className="text-amber-400">SLUMPED LOW • 4:5</span>
              </div>
            </div>
          ) : (
            <div className="w-full h-full p-4 flex flex-col items-center justify-center text-center bg-stone-950/80">
              <div className="w-12 h-12 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-600 mb-2 group-hover:border-amber-500/40 group-hover:text-amber-400 transition-colors">
                <Film className="w-5 h-5" />
              </div>
              <p className="text-xs text-stone-300 font-medium">
                {frame.sceneDescription ? 'Scene Staged' : 'Awaiting Scene'}
              </p>
              <p className="text-[10px] text-stone-500 mt-1 max-w-[180px]">
                {frame.sceneDescription
                  ? 'Ready to generate frame'
                  : 'Enter scene prompt below'}
              </p>
            </div>
          )}

          {/* Hover Overlay */}
          {frame.imageUrl && (
            <button
              onClick={() => onInspect(frame)}
              className="absolute inset-0 bg-stone-950/70 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1.5 text-xs text-stone-100 font-medium transition-opacity backdrop-blur-xs cursor-pointer"
            >
              <Eye className="w-4 h-4 text-amber-400" />
              <span>Inspect 4:5 Frame</span>
            </button>
          )}
        </div>

        {/* Scene Input */}
        <div>
          <label
            htmlFor={`scene-input-${frame.frameNumber}`}
            className="block text-[11px] font-medium text-stone-400 mb-1"
          >
            Scene Description:
          </label>
          <textarea
            id={`scene-input-${frame.frameNumber}`}
            rows={2}
            value={frame.sceneDescription}
            onChange={(e) => onUpdateScene(frame.id, e.target.value)}
            placeholder={`e.g. Walking past a yellow Danfo bus in Marina, bright afternoon sun, looking to the side...`}
            className="w-full text-xs bg-stone-950 border border-stone-800 rounded-lg p-2 text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500 transition-colors resize-none leading-relaxed"
          />
        </div>

        {/* Continuity Lock Badges */}
        <div className="flex flex-wrap gap-1 text-[9px] font-mono text-stone-400">
          <span className="px-1.5 py-0.5 rounded bg-stone-950 border border-stone-800">
            4:5 Portrait
          </span>
          <span className="px-1.5 py-0.5 rounded bg-stone-950 border border-stone-800 text-amber-400/90">
            Faded Blue Shirt
          </span>
          <span className="px-1.5 py-0.5 rounded bg-stone-950 border border-stone-800">
            Portra 400
          </span>
        </div>

        {/* Prompt Preview Toggle */}
        <div>
          <button
            type="button"
            onClick={() => setShowPromptPreview(!showPromptPreview)}
            className="text-[10px] text-amber-400/80 hover:text-amber-300 underline underline-offset-2 flex items-center gap-1 cursor-pointer"
          >
            <span>{showPromptPreview ? 'Hide full prompt' : 'View compiled prompt with continuity rules'}</span>
          </button>

          {showPromptPreview && (
            <p className="mt-1.5 p-2 bg-stone-950 border border-stone-800 rounded text-[10px] font-mono text-stone-300 leading-relaxed select-all">
              {fullPrompt}
            </p>
          )}
        </div>

        {/* Error message */}
        {frame.errorMessage && (
          <div className="p-2 rounded bg-red-950/40 border border-red-900/60 text-[11px] text-red-300 flex items-start gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
            <span className="leading-snug">{frame.errorMessage}</span>
          </div>
        )}
      </div>

      {/* Frame Actions Footer */}
      <div className="p-3 bg-stone-950/60 border-t border-stone-800 flex items-center gap-2">
        <button
          id={`btn-generate-frame-${frame.frameNumber}`}
          onClick={() => onGenerate(frame.id)}
          disabled={frame.status === 'generating'}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:bg-stone-800 disabled:text-stone-500 text-stone-950 text-xs font-semibold transition-colors cursor-pointer"
        >
          {frame.status === 'generating' ? (
            <>
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3 h-3" />
              <span>{frame.imageUrl ? 'Re-generate' : 'Generate'}</span>
            </>
          )}
        </button>

        <label
          htmlFor={`upload-frame-${frame.frameNumber}`}
          className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium border border-stone-700 cursor-pointer transition-colors"
          title="Upload still image for this frame"
        >
          <Upload className="w-3.5 h-3.5 text-stone-400" />
          <input
            id={`upload-frame-${frame.frameNumber}`}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
}
