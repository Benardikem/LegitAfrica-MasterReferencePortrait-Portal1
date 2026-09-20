import { Film, Sliders, Copy, Check, Download, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface FilmHeaderProps {
  completedCount: number;
  totalCount: number;
  onOpenContactSheet: () => void;
  onExportJSON: () => void;
  isBillingError?: boolean;
}

export function FilmHeader({
  completedCount,
  totalCount,
  onOpenContactSheet,
  onExportJSON,
  isBillingError,
}: FilmHeaderProps) {
  const [copiedAll, setCopiedAll] = useState(false);

  return (
    <header id="film-advert-header" className="border-b border-stone-800 bg-stone-950/90 backdrop-blur sticky top-0 z-30 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Project title & film stock specs */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold text-stone-100 tracking-wide">
                Lagos Film Advert — 11 Still Frames
              </h1>
              <span className="px-2 py-0.5 text-xs font-mono font-medium rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Kodak Portra 400 • 35mm
              </span>
            </div>
            <p className="text-xs text-stone-400 flex items-center gap-2 mt-0.5">
              <span>Vertical 4:5</span>
              <span>•</span>
              <span>Warm Lagos Colour Grade</span>
              <span>•</span>
              <span className="text-amber-400 font-medium">Consistent Character Continuity</span>
            </p>
          </div>
        </div>

        {/* Right: Progress & Action buttons */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-xs text-stone-300">
            <span className="text-stone-400">Frames:</span>
            <span className="font-mono font-semibold text-amber-400">{completedCount}</span>
            <span className="text-stone-500">/</span>
            <span className="font-mono text-stone-400">{totalCount}</span>
          </div>

          <button
            id="btn-contact-sheet"
            onClick={onOpenContactSheet}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-200 transition-colors"
          >
            <Sliders className="w-3.5 h-3.5 text-stone-400" />
            <span>Contact Sheet</span>
          </button>

          <button
            id="btn-export-storyboard"
            onClick={onExportJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Campaign</span>
          </button>
        </div>
      </div>
    </header>
  );
}
