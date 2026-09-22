import { useState, useEffect } from 'react';
import { FilmHeader } from './components/FilmHeader';
import { ReferencePortraitCard } from './components/ReferencePortraitCard';
import { FrameCard } from './components/FrameCard';
import { ContactSheetModal } from './components/ContactSheetModal';
import { FrameDetailModal } from './components/FrameDetailModal';
import { BillingNoticeBanner } from './components/BillingNoticeBanner';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { INITIAL_CHARACTER_REFERENCE, CHIDI_CAMPAIGN_FRAMES } from './data/advertData';
import { BLANK_FRAMES, DEMO_FRAMES, createEmptyStoryboard } from './data/blankFrames';
import { AdvertFrame, CharacterReference } from './types';
import { buildScenePrompt, REFERENCE_PORTRAIT_PROMPT } from './utils/promptBuilder';
import { Film, Sparkles, Check, Copy, Sliders, Layers } from 'lucide-react';

export default function App() {
  const [reference, setReference] = useState<CharacterReference>(INITIAL_CHARACTER_REFERENCE);
  const [frames, setFrames] = useState<AdvertFrame[]>(BLANK_FRAMES);
  const [isGeneratingRef, setIsGeneratingRef] = useState(false);
  const [refApiError, setRefApiError] = useState<string | null>(null);
  const [isBillingError, setIsBillingError] = useState(false);
  const [isRetryingBilling, setIsRetryingBilling] = useState(false);

  // Modals
  const [isContactSheetOpen, setIsContactSheetOpen] = useState(false);
  const [selectedInspectFrame, setSelectedInspectFrame] = useState<AdvertFrame | null>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [statusToast, setStatusToast] = useState<string | null>(null);

  // Restore Master Reference Image from persistent storage on mount & check billing
  useEffect(() => {
    // Check billing status
    fetch('/api/check-billing')
      .then((res) => res.json())
      .then((data) => {
        if (data?.billingActive) {
          setIsBillingError(false);
        } else if (data?.isBillingDepleted) {
          setIsBillingError(true);
        }
      })
      .catch(() => {});
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

    // Fetch frames state from server or fallback to local
    fetch('/api/frames-state')
      .then((res) => res.json())
      .then((data) => {
        const serverFrames: AdvertFrame[] = Array.isArray(data?.frames) ? data.frames : [];
        
        // Merge with all 24 campaign frames
        const merged = CHIDI_CAMPAIGN_FRAMES.map((cf) => {
          const matched = serverFrames.find((sf) => sf.id === cf.id);
          const img = matched?.imageUrl || cf.imageUrl;
          const status = cf.isStudioTextScene
            ? ('completed' as const)
            : img
            ? ('completed' as const)
            : matched?.status || cf.status || 'empty';
          return {
            ...cf,
            ...(matched || {}),
            imageUrl: img,
            status,
            isStudioTextScene: cf.isStudioTextScene,
            studioCardType: cf.studioCardType,
          };
        });

        setFrames(merged);
        try {
          localStorage.setItem('lagos_campaign_frames', JSON.stringify(merged));
        } catch (e) {}
      })
      .catch((err) => {
        console.warn('Frames state sync notice:', err);
        setFrames(CHIDI_CAMPAIGN_FRAMES);
      });
  }, []);

  // Completed count
  const completedCount =
    frames.filter((f) => !!f.imageUrl || f.isStudioTextScene).length + (reference.imageUrl ? 1 : 0);
  const totalCount = frames.length + (reference.imageUrl ? 1 : 0);

  // Sync frames locally and to server
  const syncFrames = (updatedFrames: AdvertFrame[]) => {
    try {
      localStorage.setItem('lagos_campaign_frames', JSON.stringify(updatedFrames));
    } catch (e) {}
    fetch('/api/save-frames-state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ frames: updatedFrames }),
    }).catch((err) => console.warn('Frames save notice:', err));
  };

  // Update scene description for a frame
  const handleUpdateScene = (id: number, sceneDescription: string) => {
    setFrames((prev) => {
      const updated = prev.map((frame) => (frame.id === id ? { ...frame, sceneDescription } : frame));
      syncFrames(updated);
      return updated;
    });
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
        setFrames((prev) => {
          const updated = prev.map((f) =>
            f.id === id
              ? {
                  ...f,
                  imageUrl: data.imageUrl,
                  status: 'completed' as const,
                  generatedPrompt: fullPrompt,
                }
              : f
          );
          syncFrames(updated);
          return updated;
        });
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
      isLocked: true,
    }));

    // Cache locally
    try {
      localStorage.setItem('lagos_master_ref_image', dataUrl);
    } catch (e) {
      console.warn('LocalStorage limit reached for image:', e);
    }

    // Persist to server
    try {
      const res = await fetch('/api/save-reference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: dataUrl }),
      });
      const data = await res.json();
      if (data?.imageUrl) {
        const finalUrl = data.imageUrl.startsWith('/')
          ? `${data.imageUrl}?t=${Date.now()}`
          : data.imageUrl;
        setReference((prev) => ({
          ...prev,
          imageUrl: finalUrl,
          isLocked: true,
        }));
        try {
          localStorage.setItem('lagos_master_ref_image', finalUrl);
        } catch (e) {}
      }
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
      setFrames((prev) => {
        const updated = prev.map((f) =>
          f.id === id
            ? {
                ...f,
                imageUrl: reader.result as string,
                status: 'completed' as const,
              }
            : f
        );
        syncFrames(updated);
        return updated;
      });
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

  // Reset campaign to start fresh
  const handleExecuteResetCampaign = async () => {
    setIsResetModalOpen(false);

    // 1. Reset reference state to unlocked & empty
    setReference((prev) => ({
      ...prev,
      imageUrl: undefined,
      isLocked: false,
    }));

    // 2. Reset frames to empty storyboard slots
    const emptyFrames = createEmptyStoryboard();
    setFrames(emptyFrames);

    // 3. Clear and sync local storage
    try {
      localStorage.removeItem('lagos_master_ref_image');
      localStorage.removeItem('lagos_film_frames_v1');
      localStorage.setItem('lagos_campaign_frames', JSON.stringify(emptyFrames));
    } catch (e) {}

    // 4. Notify server to persist reset state
    try {
      await fetch('/api/reset-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ frames: emptyFrames }),
      });
    } catch (err) {
      console.warn('Could not reset campaign on server:', err);
    }

    setStatusToast('Campaign Reset: Storyboard slots cleared and Master Reference unlocked for new production.');
    setTimeout(() => setStatusToast(null), 5000);
  };

  // Restore the 15 completed Lagos demo stills
  const handleRestoreDemoCampaign = async () => {
    setReference((prev) => ({
      ...prev,
      imageUrl: '/reference-candidate-2.jpg',
      isLocked: true,
    }));
    setFrames(DEMO_FRAMES);

    try {
      localStorage.setItem('lagos_master_ref_image', '/reference-candidate-2.jpg');
      localStorage.setItem('lagos_campaign_frames', JSON.stringify(DEMO_FRAMES));
    } catch (e) {}

    try {
      await fetch('/api/save-reference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: '/reference-candidate-2.jpg' }),
      });
      await fetch('/api/save-frames-state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ frames: DEMO_FRAMES }),
      });
    } catch (err) {
      console.warn('Could not restore demo on server:', err);
    }

    setStatusToast('Demo Stills Restored: 15 sequential Lagos advert frames loaded.');
    setTimeout(() => setStatusToast(null), 5000);
  };

  const handleResetCampaign = () => {
    setIsResetModalOpen(true);
  };

  // Export full advert campaign as JSON
  const handleExportJSON = () => {
    const exportData = {
      project: "Lagos Film Advert — Still Frame Production",
      aspectRatio: "4:5 vertical portrait",
      medium: "35mm documentary photography, Kodak Portra 400",
      colorGrade: "Warm Lagos colour grade, organic film grain, natural available light",
      continuityCharacter: {
        identity: "Nigerian woman (the bride), late 20s, warm dark brown skin",
        features: "Oval face, full lips, neat natural eyebrows, dark brown eyes",
        hair: "Neat cornrows going straight back",
        wardrobe: "Plain sleeveless top / wrapper at chest; bridal gele in wedding scene only",
        expression: "Contained stillness, set jaw, wet eyes that don't spill, flat faraway look",
      },
      referencePortrait: {
        lens: "85mm prime lens",
        framing: "Front facing, looking directly into camera lens, soft even daylight on both sides of face, plain background, minimal grain, no makeup",
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
        onResetCampaign={handleResetCampaign}
        onRestoreDemo={handleRestoreDemoCampaign}
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
                {frames.length} Advert Film Frames
              </h2>
            </div>
            <p className="text-xs text-stone-400 max-w-md sm:text-right">
              Scene-by-scene storyboard continuity. The exact same protagonist, facial structure,
              skin tone, and 35mm Kodak Portra 400 film look are maintained across every 4:5 frame.
            </p>
          </div>

          {/* Grid of frames */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {frames.map((frame) => (
              <FrameCard
                key={frame.id}
                frame={frame}
                masterReferenceImage={reference.imageUrl}
                totalFrames={frames.length}
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
        totalFrames={frames.length}
        onClose={() => setSelectedInspectFrame(null)}
      />

      {/* Confirmation Modal for Resetting Entire Campaign */}
      <ResetConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleExecuteResetCampaign}
        title="Start a Brand New Campaign?"
        description={`This will clear all ${frames.length} scene images and unlock the Master Reference Portrait, resetting the entire storyboard to empty slots so you can establish a new character and campaign.`}
        confirmLabel="Reset Everything"
      />

      {/* Floating Status Notification */}
      {statusToast && (
        <aside
          aria-label="Campaign notification"
          id="campaign-status-toast"
          className="fixed bottom-6 right-6 z-50 max-w-md bg-stone-900/95 border border-amber-500/50 text-stone-100 px-4 py-3 rounded-xl shadow-2xl backdrop-blur flex items-center justify-between gap-3 animate-pulse"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
            <p className="text-xs font-medium text-stone-200">{statusToast}</p>
          </div>
          <button
            type="button"
            onClick={() => setStatusToast(null)}
            className="text-stone-400 hover:text-stone-200 text-xs p-1 rounded hover:bg-stone-800 transition-colors ml-2"
          >
            ✕
          </button>
        </aside>
      )}

      {/* Footer */}
      <footer className="border-t border-stone-800/80 bg-stone-950 py-4 px-4 text-center text-xs text-stone-500 font-mono">
        Lagos Advert Production • 35mm Kodak Portra 400 • 4:5 Vertical Aspect Ratio • {frames.length} Sequential Film Frames
      </footer>
    </div>
  );
}
