import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel: string;
}

export function ResetConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
}: ResetModalProps) {
  if (!isOpen) return null;

  return (
    <div
      id="reset-confirm-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="reset-confirm-modal-card"
        className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div>
          <h3 className="text-lg font-bold text-stone-100">{title}</h3>
          <p className="text-xs text-stone-300 mt-1.5 leading-relaxed">{description}</p>
        </div>

        <div className="flex items-center justify-end gap-3 mt-2 pt-3 border-t border-stone-800">
          <button
            id="btn-cancel-reset"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
          >
            Cancel
          </button>
          <button
            id="btn-confirm-reset"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-xs font-bold rounded-lg bg-red-600 hover:bg-red-500 text-white flex items-center gap-1.5 transition-colors shadow-lg shadow-red-950"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
