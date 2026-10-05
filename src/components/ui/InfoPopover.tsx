import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, X } from 'lucide-react';

export interface InfoPopoverProps {
  content: string;
  title?: string;
  className?: string;
  label?: string;
}

export const InfoPopover: React.FC<InfoPopoverProps> = ({
  content,
  title = 'How this is computed',
  className = '',
  label = 'Information on this metric',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverId = React.useId();

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onFocus={() => setIsOpen(true)}
        onBlur={(e) => {
          if (!popoverRef.current?.contains(e.relatedTarget as Node)) {
            setIsOpen(false);
          }
        }}
        aria-expanded={isOpen}
        aria-controls={popoverId}
        aria-label={label}
        className="p-1 rounded-full text-fg-subtle hover:text-fg hover:bg-surface-muted transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1"
      >
        <HelpCircle className="w-4 h-4" aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          ref={popoverRef}
          id={popoverId}
          role="tooltip"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          className="absolute right-0 bottom-full mb-2 z-50 w-72 sm:w-80 p-3.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs shadow-xl border border-slate-700/80 space-y-1.5 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center justify-between pb-1 border-b border-slate-700">
            <span className="font-bold text-amber-400 tracking-wide text-xs">
              {title}
            </span>
            <button
              onClick={() => {
                setIsOpen(false);
                buttonRef.current?.focus();
              }}
              className="p-0.5 text-slate-300 hover:text-white rounded hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
              aria-label="Close information popover"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-slate-200 text-xs leading-relaxed">
            {content}
          </p>
        </div>
      )}
    </div>
  );
};
