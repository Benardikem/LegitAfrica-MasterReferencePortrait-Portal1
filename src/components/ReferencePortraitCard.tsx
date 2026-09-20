import { useState, useRef } from 'react';
import {
  Camera,
  Sparkles,
  Upload,
  Copy,
  Check,
  Eye,
  Lock,
  Unlock,
  RefreshCw,
  AlertCircle,
  Save,
  Trash2,
  X,
  FileImage,
} from 'lucide-react';
import { CharacterReference } from '../types';

interface ReferencePortraitCardProps {
  reference: CharacterReference;
  isGenerating: boolean;
  onGenerate: () => void;
  onSaveReference: (imageUrl: string) => Promise<void>;
  onClearReference?: () => void;
  onViewFullscreen: () => void;
  apiError?: string | null;
  isBillingError?: boolean;
}

export function ReferencePortraitCard({
  reference,
  isGenerating,
  onGenerate,
  onSaveReference,
  onClearReference,
  onViewFullscreen,
  apiError,
  isBillingError,
}: ReferencePortraitCardProps) {
  const [copied, setCopied] = useState(false);
  const [stagedImage, setStagedImage] = useState<string | null>(null);
  const [stagedFileName, setStagedFileName] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(reference.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const processSelectedFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setStagedImage(dataUrl);
      setStagedFileName(file.name);
      setSaveSuccessMsg(null);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleSaveAndLock = async () => {
    const imageToSave = stagedImage || reference.imageUrl;
    if (!imageToSave) return;

    setIsSaving(true);
    try {
      await onSaveReference(imageToSave);
      setStagedImage(null);
      setStagedFileName(null);
      setSaveSuccessMsg('Master Reference Portrait Saved & Locked as Character Anchor!');
      setTimeout(() => setSaveSuccessMsg(null), 5000);
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelStaging = () => {
    setStagedImage(null);
    setStagedFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUnlockAndClear = () => {
    if (confirm('Are you sure you want to unlock and clear the Master Reference Portrait?')) {
      setStagedImage(null);
      setStagedFileName(null);
      setSaveSuccessMsg(null);
      if (onClearReference) {
        onClearReference();
      }
    }
  };

  const activeDisplayImage = stagedImage || reference.imageUrl;
  const isPendingSave = !!stagedImage;
  const isCurrentlyLocked = !!reference.imageUrl && !stagedImage;

  return (
    <div
      id="reference-portrait-card"
      className="bg-stone-900 border-2 border-amber-500/40 rounded-2xl p-5 shadow-xl relative overflow-hidden"
    >
      {/* Top Banner Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-stone-800">
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isCurrentlyLocked
                ? 'bg-emerald-400 animate-pulse'
                : isPendingSave
                ? 'bg-amber-400 animate-ping'
                : 'bg-stone-500'
            }`}
          />
          <h2 className="text-base font-semibold text-stone-100 flex items-center gap-2">
            <span>Step 1: Master Reference Portrait</span>
            {isCurrentlyLocked ? (
              <span className="px-2 py-0.5 text-[11px] font-mono font-medium rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-400" />
                LOCKED ANCHOR (ACTIVE)
              </span>
            ) : isPendingSave ? (
              <span className="px-2 py-0.5 text-[11px] font-mono font-medium rounded bg-amber-500/20 border border-amber-500/50 text-amber-300 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-amber-400" />
                PHOTO STAGED • CLICK SAVE BELOW
              </span>
            ) : (
              <span className="px-2 py-0.5 text-[11px] font-mono font-medium rounded bg-stone-800 border border-stone-700 text-stone-400 flex items-center gap-1">
                <Unlock className="w-3 h-3" />
                AWAITING REFERENCE PHOTO
              </span>
            )}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-copy-ref-prompt"
            onClick={handleCopyPrompt}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors border border-stone-700 cursor-pointer"
            title="Copy reference prompt"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Prompt'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 4:5 Vertical Portrait Visual */}
        <div className="lg:col-span-5 flex flex-col items-center">
          {/* Master Reference Status Badge */}
          {isCurrentlyLocked ? (
            <div className="w-full max-w-[280px] mb-2 px-2.5 py-1.5 rounded-lg bg-emerald-950/70 border border-emerald-500/50 flex items-center justify-between text-[11px] text-emerald-300 shadow-sm">
              <span className="flex items-center gap-1.5 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                MASTER ANCHOR LOCKED
              </span>
              <span className="text-[10px] font-mono text-emerald-400/80">Active for all 11 scenes</span>
            </div>
          ) : isPendingSave ? (
            <div className="w-full max-w-[280px] mb-2 px-2.5 py-1.5 rounded-lg bg-amber-950/70 border border-amber-500/60 flex items-center justify-between text-[11px] text-amber-300 shadow-sm animate-pulse">
              <span className="flex items-center gap-1.5 font-semibold">
                <AlertCircle className="w-3 h-3 text-amber-400" />
                PHOTO READY TO SAVE
              </span>
              <span className="text-[10px] font-mono text-amber-300/90 font-bold">Unsaved Changes</span>
            </div>
          ) : (
            <div className="w-full max-w-[280px] mb-2 px-2.5 py-1.5 rounded-lg bg-stone-950/60 border border-stone-800 flex items-center justify-between text-[11px] text-stone-400">
              <span className="flex items-center gap-1.5 font-semibold">
                <span className="w-2 h-2 rounded-full bg-stone-500" />
                NO REFERENCE PHOTO YET
              </span>
              <span className="text-[10px] font-mono text-stone-500">Upload portrait photo</span>
            </div>
          )}

          {/* 4:5 Portrait Frame Box / Dropzone */}
          <div
            id="reference-frame-container"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative w-full max-w-[280px] aspect-[4/5] bg-stone-950 rounded-xl overflow-hidden border shadow-2xl group transition-all ${
              isDragging
                ? 'border-amber-400 ring-4 ring-amber-400/30 bg-amber-950/30'
                : isPendingSave
                ? 'border-amber-500 ring-2 ring-amber-500/40'
                : isCurrentlyLocked
                ? 'border-emerald-500/70 ring-2 ring-emerald-500/20'
                : 'border-stone-800'
            }`}
          >
            {/* Film Edge Slate Simulation */}
            <div className="absolute top-2 left-2 z-10 font-mono text-[9px] text-amber-400/90 bg-stone-950/90 px-1.5 py-0.5 rounded backdrop-blur">
              {isCurrentlyLocked ? 'LOCKED REFERENCE • 85mm' : isPendingSave ? 'PREVIEW (UNSAVED)' : 'PORTRA 400 • 35MM'}
            </div>
            <div className="absolute top-2 right-2 z-10 font-mono text-[9px] text-stone-400/90 bg-stone-950/90 px-1.5 py-0.5 rounded backdrop-blur">
              4:5 PORTRAIT
            </div>

            {/* If an image is uploaded or staged, show the REAL image */}
            {activeDisplayImage ? (
              <>
                <img
                  src={activeDisplayImage}
                  alt="Master Reference Portrait of the Nigerian man in faded blue shirt"
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />

                {/* Staged pending overlay badge */}
                {isPendingSave && (
                  <div className="absolute bottom-2 inset-x-2 bg-amber-950/90 border border-amber-500/60 p-2 rounded-lg text-center backdrop-blur-sm z-20">
                    <span className="text-[11px] font-bold text-amber-300 block">
                      Preview: {stagedFileName || 'Uploaded Photo'}
                    </span>
                    <span className="text-[10px] text-amber-200/90 block mt-0.5 font-mono">
                      Click "Save & Lock Master Reference" below
                    </span>
                  </div>
                )}
              </>
            ) : (
              /* Professional Darkroom Dropzone / Slate Placeholder (NO demo cartoon) */
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-full relative flex flex-col items-center justify-center p-6 text-center bg-stone-950 hover:bg-stone-900/60 cursor-pointer transition-colors"
              >
                {/* 35mm Frame Corner Marks */}
                <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-amber-500/50" />
                <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-amber-500/50" />
                <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-amber-500/50" />
                <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-amber-500/50" />

                <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-3 text-amber-400 group-hover:scale-105 transition-transform">
                  <Camera className="w-7 h-7" />
                </div>

                <span className="text-sm font-semibold text-stone-200 block">
                  Master Reference Portrait
                </span>
                <p className="text-[11px] text-stone-400 mt-1 leading-relaxed max-w-[210px]">
                  Drop or select a photo of the Nigerian character in his faded blue shirt
                </p>

                <div className="mt-4 px-3 py-1.5 rounded-lg bg-amber-500 text-stone-950 text-xs font-semibold flex items-center gap-1.5 shadow-md group-hover:bg-amber-400">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose Photo File</span>
                </div>

                <span className="text-[10px] font-mono text-stone-500 mt-2">
                  or drag and drop photo here
                </span>
              </div>
            )}

            {/* Hover Inspect Overlay Controls (if image is locked) */}
            {isCurrentlyLocked && (
              <button
                id="btn-inspect-reference"
                onClick={onViewFullscreen}
                className="absolute inset-0 bg-stone-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 text-xs font-medium text-stone-100 transition-opacity backdrop-blur-sm cursor-pointer z-20"
              >
                <Eye className="w-4 h-4 text-amber-400" />
                <span>Inspect 4:5 Master Frame</span>
              </button>
            )}
          </div>

          {/* Success Save Banner */}
          {saveSuccessMsg && (
            <div className="w-full max-w-[280px] mt-2 p-2 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2 animate-fadeIn shadow-md">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-semibold text-[11px]">{saveSuccessMsg}</span>
            </div>
          )}

          {/* Action Buttons & Save Controls */}
          <div className="w-full max-w-[280px] mt-3 flex flex-col gap-2">
            {/* PRIMARY SAVE BUTTON IF STAGED */}
            {isPendingSave ? (
              <div className="flex flex-col gap-1.5">
                <button
                  id="btn-save-lock-reference"
                  onClick={handleSaveAndLock}
                  disabled={isSaving}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:bg-stone-800 disabled:text-stone-500 text-white font-bold text-xs transition-all shadow-lg ring-2 ring-emerald-400/40 cursor-pointer animate-pulse"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving & Locking Reference...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>SAVE & LOCK MASTER REFERENCE</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleCancelStaging}
                  className="w-full flex items-center justify-center gap-1.5 py-1 px-3 rounded text-[11px] text-stone-400 hover:text-stone-200 hover:bg-stone-800/80 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Discard staged photo</span>
                </button>
              </div>
            ) : isCurrentlyLocked ? (
              /* ALREADY LOCKED STATE */
              <div className="flex flex-col gap-2">
                <div className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 font-semibold text-xs">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Master Reference Locked & Active</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <label
                    htmlFor="upload-ref-input-replace"
                    className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-[11px] font-medium border border-stone-700 cursor-pointer transition-colors"
                  >
                    <Upload className="w-3 h-3 text-stone-400" />
                    <span>Replace Photo</span>
                  </label>

                  <button
                    onClick={handleUnlockAndClear}
                    className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-stone-900 hover:bg-red-950/60 text-stone-400 hover:text-red-300 text-[11px] font-medium border border-stone-800 hover:border-red-800/50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Unlock / Clear</span>
                  </button>
                </div>
              </div>
            ) : (
              /* AWAITING PHOTO STATE */
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="upload-ref-input"
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md cursor-pointer transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Master Reference Photo</span>
                </label>

                <button
                  id="btn-generate-reference"
                  onClick={onGenerate}
                  disabled={isGenerating}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-stone-800 hover:bg-stone-700 disabled:bg-stone-900 disabled:text-stone-600 text-stone-300 text-xs font-medium border border-stone-700 cursor-pointer transition-colors"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Generating via Gemini...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Generate Sample via Gemini</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Hidden File Inputs */}
            <input
              ref={fileInputRef}
              id="upload-ref-input"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <input
              id="upload-ref-input-replace"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Right Column: Character DNA & Cinematography Anchor Info */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-amber-400">
              Character & Cinematography DNA
            </span>
            <p className="text-xs text-stone-300 mt-1 leading-relaxed">
              Every subsequent advert frame inherits these strict physical and photographic anchors to guarantee
              unwavering continuity across all 11 scenes.
            </p>
          </div>

          {/* Master Reference Active Notice */}
          {isCurrentlyLocked && (
            <div className="bg-emerald-950/50 border border-emerald-500/40 rounded-lg p-3 text-xs text-emerald-200 flex items-start gap-2.5 shadow-sm">
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-emerald-300 block">
                  Master Reference Portrait Locked & Active
                </span>
                <p className="text-[11px] text-emerald-200/80 mt-0.5 leading-relaxed">
                  Your uploaded portrait is permanently locked as the master character anchor across all 11 advert scenes. 
                  All scene prompts explicitly reference this exact face, skin tone, grooming, and faded blue shirt.
                </p>
              </div>
            </div>
          )}

          {/* Unsaved Warning Notice */}
          {isPendingSave && (
            <div className="bg-amber-950/50 border border-amber-500/50 rounded-lg p-3 text-xs text-amber-200 flex items-start gap-2.5 shadow-sm">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-amber-300 block">
                  Click "SAVE & LOCK MASTER REFERENCE" on the left
                </span>
                <p className="text-[11px] text-amber-200/80 mt-0.5 leading-relaxed">
                  Your uploaded photo is currently in preview mode. Click the green Save button to lock it into Step 1 and bind it to all 11 scenes.
                </p>
              </div>
            </div>
          )}

          {/* Spec Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="bg-stone-950/80 p-2.5 rounded-lg border border-stone-800">
              <span className="text-stone-500 text-[11px] block">Identity & Age</span>
              <span className="font-medium text-stone-200">Nigerian, Early 30s</span>
            </div>
            <div className="bg-stone-950/80 p-2.5 rounded-lg border border-stone-800">
              <span className="text-stone-500 text-[11px] block">Skin Tone</span>
              <span className="font-medium text-stone-200">Warm dark brown</span>
            </div>
            <div className="bg-stone-950/80 p-2.5 rounded-lg border border-stone-800">
              <span className="text-stone-500 text-[11px] block">Hair Grooming</span>
              <span className="font-medium text-stone-200">Short neat hair</span>
            </div>
            <div className="bg-stone-950/80 p-2.5 rounded-lg border border-stone-800">
              <span className="text-stone-500 text-[11px] block">Facial Hair</span>
              <span className="font-medium text-stone-200">Thin moustache, clean chin</span>
            </div>
            <div className="bg-stone-950/80 p-2.5 rounded-lg border border-stone-800">
              <span className="text-stone-500 text-[11px] block">Signature Wardrobe</span>
              <span className="font-medium text-amber-300">Faded blue shirt, dark trousers</span>
            </div>
            <div className="bg-stone-950/80 p-2.5 rounded-lg border border-stone-800">
              <span className="text-stone-500 text-[11px] block">Reference Lens</span>
              <span className="font-medium text-stone-200">85mm front-facing</span>
            </div>
            <div className="bg-stone-950/80 p-2.5 rounded-lg border border-stone-800">
              <span className="text-stone-500 text-[11px] block">Film Stock</span>
              <span className="font-medium text-stone-200">Kodak Portra 400</span>
            </div>
            <div className="bg-stone-950/80 p-2.5 rounded-lg border border-stone-800">
              <span className="text-stone-500 text-[11px] block">Color Grading</span>
              <span className="font-medium text-stone-200">Warm Lagos palette</span>
            </div>
            <div className="bg-stone-950/80 p-2.5 rounded-lg border border-stone-800">
              <span className="text-stone-500 text-[11px] block">Negative Rule</span>
              <span className="font-medium text-red-400">Zero text / watermarks</span>
            </div>
          </div>

          {/* Reference Prompt display */}
          <div className="bg-stone-950/90 rounded-xl p-3.5 border border-stone-800 text-xs">
            <div className="flex items-center justify-between text-stone-400 mb-1.5">
              <span className="font-mono text-[11px] uppercase tracking-wider text-amber-400 font-semibold">
                Reference Portrait Prompt (Active)
              </span>
              <span className="font-mono text-[10px] text-stone-500">4:5 Vertical • 85mm</span>
            </div>
            <p className="font-mono text-stone-300 leading-relaxed text-[11px] bg-stone-900/60 p-2.5 rounded-lg border border-stone-800/80 select-all">
              {reference.prompt}
            </p>
          </div>

          {/* Error Notice if API encountered error */}
          {apiError && (
            <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/60 text-xs text-red-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">
                  {isBillingError
                    ? "Google Cloud Prepayment Credits Depleted"
                    : "Image Generation Note"}
                </p>
                <p className="text-[11px] text-red-300/90 mt-0.5 leading-relaxed">
                  {isBillingError
                    ? "Your selected Google AI project has depleted its prepayment credits for image generation. You can manage project billing at ai.studio/projects, or use the prompt above directly in your image generation workflow or upload custom photo stills."
                    : apiError}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
