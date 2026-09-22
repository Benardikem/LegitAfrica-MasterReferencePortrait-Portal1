import { Film, Sliders, Copy, Check, Download, RotateCcw, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface FilmHeaderProps {
  completedCount: number;
  totalCount: number;
  onOpenContactSheet: () => void;
  onExportJSON: () => void;
  onResetCampaign: () => void;
  onRestoreDemo?: () => void;
  isBillingError?: boolean;
}

export function FilmHeader({
  completedCount,
  totalCount,
  onOpenContactSheet,
  onExportJSON,
  onResetCampaign,
  onRestoreDemo,
  isBillingError,
}: FilmHeaderProps) {
  const [copiedAll, setCopiedAll] = useState(false);

  return (
    <header id="film-advert-header" className="border-b border-stone-800 bg-stone-950/90 backdrop-blur sticky top-0 z-30 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Project title & film stock specs */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base font-semibold text-stone-100 tracking-wide">
                Lagos Film Advert — Still Frame Production
              </h1>
              <span className="px-2 py-0.5 text-xs font-mono font-medium rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Kodak Portra 400 • 35mm
              </span>
            </div>
            <p className="text-xs text-stone-400 flex items-center gap-2 mt-0.5 flex-wrap">
              <span>Vertical 4:5</span>
              <span>•</span>
              <span>Warm Lagos Colour Grade</span>
              <span>•</span>
              <span className="text-amber-400 font-medium">Consistent Character Continuity</span>
            </p>
          </div>
        </div>

        {/* Right: Progress & Action buttons */}
        <div className="flex items-center flex-wrap gap-2.5 sm:gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-xs text-stone-300">
            <span className="text-stone-400">Frames:</span>
            <span className="font-mono font-semibold text-amber-400">{completedCount}</span>
            <span className="text-stone-500">/</span>
            <span className="font-mono text-stone-400">{totalCount}</span>
          </div>

          <button
            id="btn-contact-sheet"
            type="button"
            onClick={onOpenContactSheet}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-200 transition-colors cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-stone-400" />
            <span>Contact Sheet</span>
          </button>

          <button
            id="btn-export-storyboard"
            type="button"
            onClick={onExportJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-200 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-stone-400" />
            <span>Export Campaign</span>
          </button>

          {onRestoreDemo && (
            <button
              id="btn-restore-demo-stills"
              type="button"
              onClick={onRestoreDemo}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-stone-900 hover:bg-stone-800 border border-amber-500/30 text-amber-300 hover:text-amber-200 transition-colors shadow-sm cursor-pointer"
              title="Restore the completed 15-frame demonstration stills"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Load Demo Stills</span>
            </button>
          )}

          <button
            id="btn-reset-new-campaign"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onResetCampaign();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold transition-all shadow-md hover:shadow-amber-500/20 active:scale-95 cursor-pointer"
            title="Discard current campaign and start a fresh campaign with a new master reference"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Start New Campaign</span>
          </button>
        </div>
      </div>
    </header>
  );
}
