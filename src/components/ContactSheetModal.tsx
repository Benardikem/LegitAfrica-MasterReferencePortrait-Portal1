import { useState } from 'react';
import { X, Copy, Check, Download, Film, Sparkles, LayoutTemplate } from 'lucide-react';
import { AdvertFrame, CharacterReference } from '../types';
import { buildScenePrompt } from '../utils/promptBuilder';
import { StudioTextCard } from './StudioTextCard';

interface ContactSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  reference: CharacterReference;
  frames: AdvertFrame[];
}

export function ContactSheetModal({
  isOpen,
  onClose,
  reference,
  frames,
}: ContactSheetModalProps) {
  const [copiedAll, setCopiedAll] = useState(false);

  if (!isOpen) return null;

  const handleCopyAllPrompts = () => {
    let text = `=== LAGOS FILM ADVERT: ${frames.length}-FRAME CAMPAIGN PROMPTS ===\n\n`;
    text += `MASTER REFERENCE PORTRAIT:\n${reference.prompt}\n\n`;
    frames.forEach((f) => {
      text += `--- FRAME ${f.frameNumber} / ${frames.length} ---\n`;
      text += `SCENE: ${f.sceneDescription || '[Pending user scene]'}\n`;
      text += `COMPILED PROMPT:\n${buildScenePrompt(f.sceneDescription || `Scene ${f.frameNumber}`)}\n\n`;
    });

    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div
      id="contact-sheet-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto"
    >
      <div
        id="contact-sheet-modal-container"
        className="bg-stone-950 border border-stone-800 rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-900/60">
          <div className="flex items-center gap-3">
            <Film className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-semibold text-stone-100">
                35mm Contact Sheet & Film Roll
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                KODAK PORTRA 400 • 35MM EXPOSURES • 4:5 VERTICAL FRAMING
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="btn-copy-all-prompts"
              onClick={handleCopyAllPrompts}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold transition-colors shadow-sm"
            >
              {copiedAll ? <Check className="w-4 h-4 text-emerald-950" /> : <Copy className="w-4 h-4" />}
              <span>{copiedAll ? 'All Prompts Copied!' : `Copy All ${frames.length} Prompts`}</span>
            </button>

            <button
              id="btn-close-contact-sheet"
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contact Sheet Grid */}
        <div className="p-6 overflow-y-auto bg-[#12100e]">
          {/* Film Strip Header Markings */}
          <div className="flex items-center justify-between text-[11px] font-mono text-amber-500/80 mb-4 px-2 py-1 bg-stone-900/80 rounded border border-stone-800">
            <span>◄ KODAK SAFETY FILM • 400-2</span>
            <span>LAGOS PRODUCTION ADVERT • {frames.length} FRAMES</span>
            <span>EASTMAN KODAK CO. ►</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
            {/* Master Reference Card in Contact Sheet */}
            <div className="flex flex-col bg-stone-900 border-2 border-amber-500/60 rounded-lg overflow-hidden">
              <div className="bg-amber-500/20 px-2 py-1 text-[10px] font-mono text-amber-300 font-bold border-b border-amber-500/30 flex justify-between">
                <span>REF 00</span>
                <span>MASTER</span>
              </div>
              <div className="relative aspect-[4/5] bg-stone-950 flex items-center justify-center">
                {reference.imageUrl ? (
                  <img
                    src={reference.imageUrl}
                    alt="Master Reference Portrait"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="p-2 text-center text-[10px] text-stone-400 font-mono">
                    85mm Front Portrait
                  </div>
                )}
              </div>
              <div className="p-1.5 text-[9px] font-mono text-stone-400 bg-stone-950/80 truncate">
                Plain Studio Daylight
              </div>
            </div>

            {/* 11 Frames */}
            {frames.map((frame) => (
              <div
                key={frame.id}
                className="flex flex-col bg-stone-900 border border-stone-800 rounded-lg overflow-hidden group hover:border-amber-500/40 transition-colors"
              >
                <div className="bg-stone-950 px-2 py-1 text-[10px] font-mono text-stone-400 border-b border-stone-800 flex justify-between">
                  <span className="font-bold text-amber-400/90">
                    FRAME #{frame.frameNumber < 10 ? `0${frame.frameNumber}` : frame.frameNumber}
                  </span>
                  <span>4:5</span>
                </div>

                <div className="relative aspect-[4/5] bg-stone-950 flex items-center justify-center overflow-hidden">
                  {frame.isStudioTextScene ? (
                    <div className="w-full h-full scale-90">
                      <StudioTextCard frame={frame} />
                    </div>
                  ) : frame.imageUrl ? (
                    <img
                      src={frame.imageUrl}
                      alt={`Frame ${frame.frameNumber}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="p-2 text-center text-[10px] text-stone-500 font-mono flex flex-col items-center">
                      <Film className="w-4 h-4 mb-1 text-stone-600" />
                      <span>{frame.sceneDescription ? 'Pending Still' : 'Empty Frame'}</span>
                    </div>
                  )}
                </div>

                <div className="p-1.5 text-[9px] font-mono text-stone-300 bg-stone-950/80 truncate">
                  {frame.sceneDescription || 'No scene yet'}
                </div>
              </div>
            ))}
          </div>

          {/* Film Strip Footer Markings */}
          <div className="flex items-center justify-between text-[11px] font-mono text-amber-500/80 mt-6 px-2 py-1 bg-stone-900/80 rounded border border-stone-800">
            <span>◄ 35MM NITRATE SAFE</span>
            <span>WARM LAGOS GRADE • NATURAL LIGHT REALISM</span>
            <span>FRAME CONTINUITY VERIFIED ►</span>
          </div>
        </div>
      </div>
    </div>
  );
}
