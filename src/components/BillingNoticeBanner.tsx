import { AlertTriangle, ExternalLink, RefreshCw } from 'lucide-react';

interface BillingNoticeBannerProps {
  onRetry: () => void;
  isRetrying: boolean;
}

export function BillingNoticeBanner({ onRetry, isRetrying }: BillingNoticeBannerProps) {
  return (
    <div
      id="billing-notice-banner"
      className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-200"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-300">
            Google AI Studio Project Prepayment Notice
          </p>
          <p className="text-amber-200/80 text-[11px] mt-0.5 leading-relaxed">
            The linked Google Cloud project for image generation currently has depleted prepayment credits (HTTP 402). 
            You can replenish credits or manage billing at{' '}
            <a
              href="https://ai.studio/projects"
              target="_blank"
              rel="noreferrer"
              className="underline font-medium hover:text-amber-100 inline-flex items-center gap-0.5"
            >
              ai.studio/projects
              <ExternalLink className="w-3 h-3" />
            </a>
            . Meanwhile, all continuity prompts are automatically compiled below and ready to copy or test!
          </p>
        </div>
      </div>

      <button
        id="btn-retry-api-check"
        onClick={onRetry}
        disabled={isRetrying}
        className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-medium transition-colors"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
        <span>Check Billing Status</span>
      </button>
    </div>
  );
}
