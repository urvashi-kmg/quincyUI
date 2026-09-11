import { useEffect, useRef, type PropsWithChildren } from 'react';
import { X } from 'lucide-react';

export interface PopupProps extends PropsWithChildren {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

/**
 * Shared modal/popup primitive. Traps focus to the dialog and restores it on
 * close — see .claude/rules/accessibility.md (keyboard operability, focus).
 */
export function Popup({ isOpen, onClose, title, children }: PopupProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previouslyFocused?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-title"
        tabIndex={-1}
        className="w-full max-w-md rounded-card bg-white p-6 shadow-xl outline-none"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 id="popup-title" className="text-lg font-semibold">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-card p-1 text-slate-500 hover:bg-muted-light"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
