import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = 'lg',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
          return;
        }

        // Focus trap
        if (e.key === 'Tab' && modalRef.current) {
          const focusable = modalRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusable.length === 0) return;

          const first = focusable[0];
          const last = focusable[focusable.length - 1];

          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';

      // Focus modal content
      setTimeout(() => {
        modalRef.current?.focus();
      }, 50);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
        previousActiveElement.current?.focus();
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  }[maxWidth];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-dialog-title' : undefined}
        aria-describedby={description ? 'modal-dialog-desc' : undefined}
        tabIndex={-1}
        className={`bg-white rounded-2xl w-full ${maxWidthClass} border border-navy-100 shadow-2xl overflow-hidden flex flex-col focus:outline-hidden animate-in zoom-in-95 duration-150`}
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-navy-50">
            <div>
              {title && (
                <h2
                  id="modal-dialog-title"
                  className="text-lg font-bold text-navy-800 font-['Outfit']"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p id="modal-dialog-desc" className="text-xs text-charcoal-500 mt-0.5">
                  {description}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-charcoal-400 hover:text-navy-800 hover:bg-navy-50 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-navy-600"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        <div className="p-6 overflow-y-auto max-h-[calc(85vh-8rem)]">
          {children}
        </div>

        {footer && (
          <div className="px-6 py-4 bg-[#F8FAFC]/90 border-t border-navy-50 flex items-center justify-end gap-2.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
