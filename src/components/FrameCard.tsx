import { useState } from 'react';
import { Sparkles, Copy, Check, Eye, Upload, RefreshCw, AlertCircle, Film, ArrowRight, LayoutTemplate } from 'lucide-react';
import { AdvertFrame } from '../types';
import { buildScenePrompt } from '../utils/promptBuilder';
import { StudioTextCard } from './StudioTextCard';

interface FrameCardProps {
  frame: AdvertFrame;
  masterReferenceImage?: string;
  totalFrames?: number;
  onUpdateScene: (id: number, sceneDescription: string) => void;
  onGenerate: (id: number) => void;
  onUploadImage: (id: number, file: File) => void;
  onInspect: (frame: AdvertFrame) => void;
}

export function FrameCard({
  frame,
  masterReferenceImage,
  totalFrames = 13,
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
            / {totalFrames}
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

      {/* Frame Dialogue & Motion Bar */}
      {(frame.dialogue || frame.studioMotion || frame.expectedVisual) && (
        <div className="px-3 py-2 bg-amber-500/10 border-b border-amber-500/20 text-xs flex flex-col gap-1">
          {frame.dialogue && (
            <div className="flex items-start gap-1.5">
              <span className="text-[9px] font-mono uppercase tracking-wider text-amber-400 font-bold px-1 py-0.5 rounded bg-amber-500/20 border border-amber-500/30 shrink-0">
                DIALOGUE
              </span>
              <span className="font-serif italic text-stone-200 text-xs leading-tight">{frame.dialogue}</span>
            </div>
          )}
          {frame.studioMotion && (
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-stone-400">
              <span className="text-amber-400/90 font-semibold uppercase text-[9px]">Motion:</span>
              <span className="text-stone-300">{frame.studioMotion}</span>
            </div>
          )}
          {frame.expectedVisual && (
            <div className="text-[10px] text-stone-400 flex items-start gap-1">
              <span className="text-amber-400/80 font-mono text-[9px] uppercase font-semibold shrink-0">Expect:</span>
              <span className="text-stone-300 italic leading-snug">{frame.expectedVisual}</span>
            </div>
          )}
        </div>
      )}

      {/* Frame Visual + Scene Input */}
      <div className="p-3.5 flex flex-col gap-3">
        {/* 4:5 Vertical Aspect Ratio Frame View */}
        <div className="relative aspect-[4/5] w-full bg-stone-950 rounded-lg overflow-hidden border border-stone-800 flex items-center justify-center group">
          {/* Film sprockets simulation */}
          <div className="absolute top-1 left-1.5 font-mono text-[8px] text-amber-400/70 z-10">
            PORTRA 400 • FRAME {frame.frameNumber}
          </div>

          {frame.isStudioTextScene ? (
            <StudioTextCard frame={frame} />
          ) : frame.imageUrl ? (
            <img
              src={frame.imageUrl}
              alt={`Frame ${frame.frameNumber}: ${frame.sceneDescription || 'Advert still'}`}
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
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

          {/* Review Card Overlay (top-centre) */}
          {frame.reviewCard && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 w-[90%] bg-stone-900/95 border border-amber-500/50 shadow-2xl rounded-lg p-2.5 backdrop-blur-md text-left pointer-events-none">
              <div className="flex items-center justify-between gap-1 mb-1 border-b border-stone-800 pb-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span className="text-[9px] font-bold tracking-wider uppercase text-emerald-400 font-mono">
                    {frame.reviewCard.platform}
                  </span>
                </div>
                <span className="text-[8px] font-mono text-stone-500 uppercase">Verified Review</span>
              </div>
              <div className="flex items-center gap-0.5 mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-xs leading-none ${
                      star <= frame.reviewCard!.stars ? 'text-amber-400 font-bold' : 'text-stone-700'
                    }`}
                  >
                    ★
                  </span>
                ))}
                <span className="text-[9px] font-mono text-amber-300 font-semibold ml-1">
                  {frame.reviewCard.stars}.0 / 5
                </span>
              </div>
              <p className="text-[11px] font-semibold text-stone-100 leading-snug">
                "{frame.reviewCard.text}"
              </p>
              {frame.reviewCard.subtext && (
                <p className="text-[9px] text-stone-400 mt-0.5 font-mono">
                  {frame.reviewCard.subtext}
                </p>
              )}
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
            rows={3}
            value={frame.sceneDescription}
            onChange={(e) => onUpdateScene(frame.id, e.target.value)}
            placeholder={`e.g. Tight on her face in a bedroom, early morning light from a window...`}
            className="w-full text-xs bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500 transition-colors resize-none leading-relaxed"
          />
        </div>

        {/* Continuity Lock Badges */}
        <div className="flex flex-wrap gap-1 text-[9px] font-mono text-stone-400">
          <span className="px-1.5 py-0.5 rounded bg-stone-950 border border-stone-800 text-stone-300">
            4:5 Vertical
          </span>
          <span className="px-1.5 py-0.5 rounded bg-stone-950 border border-stone-800 text-emerald-400/90 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Master Ref Locked
          </span>
          <span className="px-1.5 py-0.5 rounded bg-stone-950 border border-stone-800 text-stone-300">
            35mm Documentary
          </span>
          <span className="px-1.5 py-0.5 rounded bg-stone-950 border border-stone-800 text-amber-400/90">
            Portra 400
          </span>
          <span className="px-1.5 py-0.5 rounded bg-stone-950 border border-stone-800 text-stone-400">
            Zero Text/Logos
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
        {frame.isStudioTextScene ? (
          <div className="flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg bg-stone-900 border border-stone-800 text-stone-300 text-xs font-mono">
            <LayoutTemplate className="w-3.5 h-3.5 text-amber-400" />
            <span>Studio Text & Graphic Asset Ready</span>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}
