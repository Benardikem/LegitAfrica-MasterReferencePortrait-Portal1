import { useState } from 'react';
import { X, Copy, Check, Download, Film, Sliders } from 'lucide-react';
import { AdvertFrame } from '../types';
import { buildScenePrompt } from '../utils/promptBuilder';

interface FrameDetailModalProps {
  frame: AdvertFrame | null;
  masterReferenceImage?: string;
  onClose: () => void;
}

export function FrameDetailModal({ frame, masterReferenceImage, onClose }: FrameDetailModalProps) {
  const [grainIntensity, setGrainIntensity] = useState(25);
  const [copied, setCopied] = useState(false);
  const [showComparison, setShowComparison] = useState(true);

  if (!frame) return null;

  const fullPrompt = buildScenePrompt(frame.sceneDescription || `Scene ${frame.frameNumber}`);

  const handleCopy = () => {
    navigator.clipboard.writeText(fullPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!frame.imageUrl) return;
    const a = document.createElement('a');
    a.href = frame.imageUrl;
    a.download = `lagos_film_frame_${frame.frameNumber}.png`;
    a.click();
  };

  return (
    <div
      id="frame-detail-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
    >
      <div
        id="frame-detail-modal"
        className="bg-stone-950 border border-stone-800 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-stone-800 bg-stone-900/70">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-sm font-bold text-amber-400">
              FRAME #{frame.frameNumber < 10 ? `0${frame.frameNumber}` : frame.frameNumber} / 11
            </span>
            <span className="text-xs text-stone-400 font-mono">
              • 4:5 Vertical Portrait • Kodak Portra 400
            </span>
            {masterReferenceImage && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-[10px] font-mono text-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Step 1 Anchor Active
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {masterReferenceImage && (
              <button
                onClick={() => setShowComparison(!showComparison)}
                className={`px-2.5 py-1 rounded text-xs font-mono border transition-colors ${
                  showComparison
                    ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                    : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                {showComparison ? 'Split View: Active' : 'Show Ref Comparison'}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-start overflow-y-auto">
          {/* Left: Visual Display (or Side-by-Side if Master Reference present) */}
          <div className="md:col-span-7 flex flex-col items-center gap-3">
            {masterReferenceImage && showComparison ? (
              <div className="w-full grid grid-cols-2 gap-3">
                {/* Master Reference (Step 1) */}
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-mono uppercase text-emerald-400 mb-1.5">
                    Step 1 Master Reference
                  </span>
                  <div className="relative w-full aspect-[4/5] bg-stone-900 rounded-lg overflow-hidden border border-emerald-500/40 shadow-lg">
                    <img
                      src={masterReferenceImage}
                      alt="Step 1 Master Reference"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-1 left-1 bg-black/70 px-1.5 py-0.5 rounded text-[9px] font-mono text-emerald-300">
                      85mm ANCHOR
                    </div>
                  </div>
                </div>

                {/* Current Frame */}
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-mono uppercase text-amber-400 mb-1.5">
                    Frame #{frame.frameNumber} (Scene)
                  </span>
                  <div className="relative w-full aspect-[4/5] bg-stone-900 rounded-lg overflow-hidden border border-stone-800 shadow-lg flex items-center justify-center">
                    {frame.imageUrl ? (
                      <img
                        src={frame.imageUrl}
                        alt={`Frame ${frame.frameNumber}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="p-3 text-center text-stone-500 font-mono text-[10px]">
                        <Film className="w-6 h-6 mx-auto mb-1 text-stone-600" />
                        <span>Awaiting Image</span>
                      </div>
                    )}
                    <div className="absolute bottom-1 left-1 bg-black/70 px-1.5 py-0.5 rounded text-[9px] font-mono text-amber-300">
                      4:5 SCENE
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative w-full max-w-[340px] aspect-[4/5] bg-stone-900 rounded-xl overflow-hidden border border-stone-800 shadow-2xl flex items-center justify-center">
                {frame.imageUrl ? (
                  <>
                    <img
                      src={frame.imageUrl}
                      alt={`Frame ${frame.frameNumber}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {/* Organic film grain simulation overlay */}
                    <div
                      className="absolute inset-0 pointer-events-none mix-blend-overlay"
                      style={{
                        opacity: grainIntensity / 100,
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                      }}
                    />
                  </>
                ) : (
                  <div className="p-6 text-center text-stone-500 font-mono text-xs flex flex-col items-center">
                    <Film className="w-8 h-8 text-stone-600 mb-2" />
                    <span>No image generated yet for Frame #{frame.frameNumber}</span>
                  </div>
                )}
              </div>
            )}

            {/* Grain Intensity Slider */}
            {frame.imageUrl && (
              <div className="w-full max-w-[340px] p-2.5 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-between text-xs text-stone-400">
                <span className="flex items-center gap-1.5 font-mono text-[11px]">
                  <Sliders className="w-3.5 h-3.5 text-amber-400" />
                  Portra 400 Grain: {grainIntensity}%
                </span>
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={grainIntensity}
                  onChange={(e) => setGrainIntensity(Number(e.target.value))}
                  className="w-32 accent-amber-500 cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Right: Technical Slate & Prompt Details */}
          <div className="md:col-span-5 flex flex-col gap-4 text-xs">
            <div>
              <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider block">
                Scene Specification
              </span>
              <p className="text-sm font-medium text-stone-100 mt-1">
                {frame.sceneDescription || "Awaiting scene description..."}
              </p>
            </div>

            {/* Strict Continuity Mandates Check */}
            <div className="p-3 bg-stone-900/90 rounded-xl border border-stone-800 space-y-1.5 font-mono text-[11px]">
              <span className="text-stone-400 uppercase tracking-wider font-semibold block text-[10px]">
                Continuity Safeguards Applied:
              </span>
              <div className="text-stone-300 flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                <span>Subject: Nigerian man, early 30s, warm dark brown skin</span>
              </div>
              <div className="text-stone-300 flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                <span>Grooming: Short neat hair, thin moustache, clean cheeks & chin</span>
              </div>
              <div className="text-stone-300 flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                <span>Wardrobe: Identical faded blue short-sleeve shirt</span>
              </div>
              <div className="text-stone-300 flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                <span>Framing: Vertical 4:5, 35mm documentary photography</span>
              </div>
              <div className="text-stone-300 flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                <span>Negative: Zero text, numbers, signage, or watermarks</span>
              </div>
            </div>

            {/* Compiled Prompt */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-mono text-stone-400 uppercase tracking-wider">
                  Full Compiled Prompt:
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-[11px] font-mono text-amber-400 hover:text-amber-300"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="p-3 bg-stone-900 border border-stone-800 rounded-lg font-mono text-[11px] text-stone-300 leading-relaxed select-all">
                {fullPrompt}
              </p>
            </div>

            {/* Download still button */}
            {frame.imageUrl && (
              <button
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium text-xs border border-stone-700 transition-colors"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Download Frame #{frame.frameNumber} (PNG)</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
