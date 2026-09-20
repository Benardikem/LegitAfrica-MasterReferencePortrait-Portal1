import { useState, useEffect } from 'react';
import { FilmHeader } from './components/FilmHeader';
import { ReferencePortraitCard } from './components/ReferencePortraitCard';
import { FrameCard } from './components/FrameCard';
import { ContactSheetModal } from './components/ContactSheetModal';
import { FrameDetailModal } from './components/FrameDetailModal';
import { BillingNoticeBanner } from './components/BillingNoticeBanner';
import { INITIAL_CHARACTER_REFERENCE, INITIAL_FRAMES } from './data/advertData';
import { AdvertFrame, CharacterReference } from './types';
import { buildScenePrompt, REFERENCE_PORTRAIT_PROMPT } from './utils/promptBuilder';
import { Film, Sparkles, Check, Copy, Sliders, Layers } from 'lucide-react';

export default function App() {
  const [reference, setReference] = useState<CharacterReference>(INITIAL_CHARACTER_REFERENCE);
  const [frames, setFrames] = useState<AdvertFrame[]>(INITIAL_FRAMES);
  const [isGeneratingRef, setIsGeneratingRef] = useState(false);
  const [refApiError, setRefApiError] = useState<string | null>(null);
  const [isBillingError, setIsBillingError] = useState(true); // Initial state based on API test
  const [isRetryingBilling, setIsRetryingBilling] = useState(false);

  // Modals
  const [isContactSheetOpen, setIsContactSheetOpen] = useState(false);
  const [selectedInspectFrame, setSelectedInspectFrame] = useState<AdvertFrame | null>(null);

  // Restore Master Reference Image from persistent storage on mount
  useEffect(() => {
    try {
      const localRef = localStorage.getItem('lagos_master_ref_image');
      if (localRef) {
        setReference((prev) => ({ ...prev, imageUrl: localRef }));
      }
    } catch (e) {
      console.warn('LocalStorage read error:', e);
    }

    fetch('/api/reference-image')
      .then((res) => res.json())
      .then((data) => {
        if (data?.imageUrl) {
          setReference((prev) => ({ ...prev, imageUrl: data.imageUrl }));
          try {
            localStorage.setItem('lagos_master_ref_image', data.imageUrl);
          } catch (e) {}
        }
      })
      .catch((err) => console.warn('Reference sync notice:', err));
  }, []);

  // Completed count
  const completedCount = frames.filter((f) => !!f.imageUrl).length + (reference.imageUrl ? 1 : 0);
  const totalCount = 12; // 1 reference + 11 frames

  // Update scene description for a frame
  const handleUpdateScene = (id: number, sceneDescription: string) => {
    setFrames((prev) =>
      prev.map((frame) => (frame.id === id ? { ...frame, sceneDescription } : frame))
    );
  };

  // Generate Reference Portrait via API
  const handleGenerateReference = async () => {
    setIsGeneratingRef(true);
    setRefApiError(null);

    try {
      const res = await fetch('/api/generate-frame', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: REFERENCE_PORTRAIT_PROMPT,
          aspectRatio: '3:4', // 4:5 vertical framing
          model: 'gemini-3.1-flash-image',
        }),
      });

      const data = await res.json();
      if (data.imageUrl) {
        setReference((prev) => ({
          ...prev,
          imageUrl: data.imageUrl,
        }));
        setIsBillingError(false);
        setRefApiError(null);
      } else if (data.isBillingError) {
        setIsBillingError(true);
        setRefApiError(
          'Prepayment credits depleted on linked Google AI Studio project. Manage billing at ai.studio/projects or copy the locked prompt directly.'
        );
      } else {
        setRefApiError(data.error || 'Generation failed');
      }
    } catch {
      setIsBillingError(true);
      setRefApiError('Billing notice: Project prepayment credits need replenishment.');
    } finally {
      setIsGeneratingRef(false);
    }
  };

  // Generate a specific frame (1 to 11) via API
  const handleGenerateFrame = async (id: number) => {
    const targetFrame = frames.find((f) => f.id === id);
    if (!targetFrame) return;

    const fullPrompt = buildScenePrompt(targetFrame.sceneDescription || `Scene ${targetFrame.frameNumber}`);

    setFrames((prev) =>
      prev.map((f) =>
        f.id === id
          ? { ...f, status: 'generating', errorMessage: undefined }
          : f
      )
    );

    try {
      const res = await fetch('/api/generate-frame', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: fullPrompt,
          aspectRatio: '3:4',
          model: 'gemini-3.1-flash-image',
          referenceImage: reference.imageUrl,
        }),
      });

      const data = await res.json();
      if (data.imageUrl) {
        setFrames((prev) =>
          prev.map((f) =>
            f.id === id
              ? {
                  ...f,
                  imageUrl: data.imageUrl,
                  status: 'completed',
                  generatedPrompt: fullPrompt,
                }
              : f
          )
        );
        setIsBillingError(false);
      } else if (data.isBillingError) {
        setIsBillingError(true);
        setFrames((prev) =>
          prev.map((f) =>
            f.id === id
              ? {
                  ...f,
                  status: 'prompted',
                  errorMessage: 'Cloud credits depleted. Copy prompt below to generate.',
                }
              : f
          )
        );
      } else {
        setFrames((prev) =>
          prev.map((f) =>
            f.id === id
              ? {
                  ...f,
                  status: 'error',
                  errorMessage: data.error || 'Failed to generate image',
                }
              : f
          )
        );
      }
    } catch {
      setIsBillingError(true);
      setFrames((prev) =>
        prev.map((f) =>
          f.id === id
            ? {
                ...f,
                status: 'prompted',
                errorMessage: 'Cloud credits depleted. Copy prompt below to generate.',
              }
            : f
        )
      );
    }
  };

  // Save and lock image for Master Reference
  const handleSaveReferenceImage = async (dataUrl: string) => {
    setReference((prev) => ({
      ...prev,
      imageUrl: dataUrl,
    }));

    // Cache locally
    try {
      localStorage.setItem('lagos_master_ref_image', dataUrl);
    } catch (e) {
      console.warn('LocalStorage limit reached for image:', e);
    }

    // Persist to server
    try {
      await fetch('/api/save-reference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: dataUrl }),
      });
    } catch (err) {
      console.warn('Could not save reference to server:', err);
    }
  };

  // Clear / unlock reference image
  const handleClearReferenceImage = async () => {
    setReference((prev) => ({
      ...prev,
      imageUrl: undefined,
    }));
    try {
      localStorage.removeItem('lagos_master_ref_image');
    } catch (e) {}

    try {
      await fetch('/api/save-reference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: null }),
      });
    } catch (err) {
      console.warn('Could not clear reference on server:', err);
    }
  };

  // Upload image for a frame
  const handleUploadFrameImage = (id: number, file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setFrames((prev) =>
        prev.map((f) =>
          f.id === id
            ? {
                ...f,
                imageUrl: reader.result as string,
                status: 'completed',
              }
            : f
        )
      );
    };
    reader.readAsDataURL(file);
  };

  // Safe retry billing check via /api/check-billing
  const handleRetryBilling = async () => {
    setIsRetryingBilling(true);
    try {
      const res = await fetch('/api/check-billing');
      const data = await res.json();
      if (data.billingActive) {
        setIsBillingError(false);
        setRefApiError(null);
      } else {
        setIsBillingError(true);
      }
    } catch {
      setIsBillingError(true);
    } finally {
      setIsRetryingBilling(false);
    }
  };

  // Export full advert campaign as JSON
  const handleExportJSON = () => {
    const exportData = {
      project: "Lagos Film Advert (11 Frames)",
      aspectRatio: "4:5 vertical portrait",
      medium: "35mm documentary photography, Kodak Portra 400",
      colorGrade: "Warm Lagos colour grade, organic grain, hard natural light",
      continuityCharacter: {
        identity: "Nigerian man, early 30s, warm dark brown skin",
        hair: "Short neat hair, neatly trimmed thin moustache, clean-shaven cheeks & chin",
        wardrobe: "Faded blue short-sleeve shirt, dark trousers",
      },
      referencePortrait: {
        lens: "85mm",
        framing: "Front facing, looking directly into camera lens, soft even daylight",
        prompt: reference.prompt,
      },
      frames: frames.map((f) => ({
        frameNumber: f.frameNumber,
        sceneDescription: f.sceneDescription,
        compiledPrompt: buildScenePrompt(f.sceneDescription || `Scene ${f.frameNumber}`),
        status: f.status,
      })),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lagos_film_advert_campaign.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0e0d0c] text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-stone-950">
      {/* Header */}
      <FilmHeader
        completedCount={completedCount}
        totalCount={totalCount}
        onOpenContactSheet={() => setIsContactSheetOpen(true)}
        onExportJSON={handleExportJSON}
        isBillingError={isBillingError}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 flex flex-col gap-8">
        {/* Billing notice if credits need managing */}
        {isBillingError && (
          <BillingNoticeBanner
            onRetry={handleRetryBilling}
            isRetrying={isRetryingBilling}
          />
        )}

        {/* SECTION 1: MASTER REFERENCE PORTRAIT */}
        <section id="section-master-reference" className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-amber-500 font-semibold block">
                Step 01 • Production Foundation
              </span>
              <h2 className="text-xl font-bold text-stone-100 tracking-tight">
                Character Reference Anchor
              </h2>
            </div>
            <span className="text-xs text-stone-400 font-mono hidden sm:inline-block">
              85mm Portrait • Portra 400 • Front-Facing
            </span>
          </div>

          <ReferencePortraitCard
            reference={reference}
            isGenerating={isGeneratingRef}
            onGenerate={handleGenerateReference}
            onSaveReference={handleSaveReferenceImage}
            onClearReference={handleClearReferenceImage}
            onViewFullscreen={() =>
              setSelectedInspectFrame({
                id: 0,
                frameNumber: 0,
                title: 'Master Reference Portrait',
                sceneDescription: 'Master Reference Portrait (85mm Lens)',
                lightingSetup: 'Soft even daylight',
                emotion: 'Authentic calm emotion',
                imageUrl: reference.imageUrl,
                status: 'completed',
                aspectRatio: '4:5',
              })
            }
            apiError={refApiError}
            isBillingError={isBillingError}
          />
        </section>

        {/* SECTION 2: THE 11 ADVERT FRAMES */}
        <section id="section-advert-frames" className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-amber-500 font-semibold block">
                Step 02 • Scene-by-Scene Continuity
              </span>
              <h2 className="text-xl font-bold text-stone-100 tracking-tight">
                11 Advert Film Frames
              </h2>
            </div>
            <p className="text-xs text-stone-400 max-w-md sm:text-right">
              Give each scene description one by one. The same Nigerian man and faded blue shirt
              are guaranteed in every single 4:5 frame.
            </p>
          </div>

          {/* Grid of 11 frames */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {frames.map((frame) => (
              <FrameCard
                key={frame.id}
                frame={frame}
                masterReferenceImage={reference.imageUrl}
                onUpdateScene={handleUpdateScene}
                onGenerate={handleGenerateFrame}
                onUploadImage={handleUploadFrameImage}
                onInspect={(f) => setSelectedInspectFrame(f)}
              />
            ))}
          </div>
        </section>
      </main>

      {/* Modals */}
      <ContactSheetModal
        isOpen={isContactSheetOpen}
        onClose={() => setIsContactSheetOpen(false)}
        reference={reference}
        frames={frames}
      />

      <FrameDetailModal
        frame={selectedInspectFrame}
        masterReferenceImage={reference.imageUrl}
        onClose={() => setSelectedInspectFrame(null)}
      />

      {/* Footer */}
      <footer className="border-t border-stone-800/80 bg-stone-950 py-4 px-4 text-center text-xs text-stone-500 font-mono">
        Lagos Advert Production • 35mm Kodak Portra 400 • 4:5 Vertical Aspect Ratio • 11 Sequential Film Frames
      </footer>
    </div>
  );
}
