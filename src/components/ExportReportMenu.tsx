import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { computeMetrics, PILOT_30DAY_SNAPSHOT } from '../lib/metrics';
import { downloadReportCsv } from '../utils/exportCsv';
import { Download, Printer, FileText, ChevronDown, CheckCircle2 } from 'lucide-react';

interface ExportReportMenuProps {
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
}

export const ExportReportMenu: React.FC<ExportReportMenuProps> = ({ variant = 'secondary', className = '' }) => {
  const navigate = useNavigate();
  const { simState, config, mode, savedScenarios, activeScenarioId, showToast } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const activeScenario = savedScenarios.find((s) => s.id === activeScenarioId) || null;

  // Compute live metrics with snapshot fallback
  const metrics = computeMetrics(simState, config, mode);

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleDownloadCsv = () => {
    setIsOpen(false);
    const success = downloadReportCsv(metrics, config, mode, activeScenario);
    if (success) {
      showToast('Report downloaded as CSV (Excel compatible)', 'success');
    } else {
      showToast('Failed to export CSV report. Please try again.', 'error');
    }
  };

  const handlePrintPdf = () => {
    setIsOpen(false);
    navigate('/app/report?autoPrint=true');
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={menuRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white hover:bg-charcoal-50 text-navy-900 border border-charcoal-200 hover:border-charcoal-300 shadow-2xs transition-all cursor-pointer min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-600"
      >
        <Download className="w-4 h-4 text-emerald-600" aria-hidden="true" />
        <span>Export Report</span>
        <ChevronDown className={`w-3.5 h-3.5 text-charcoal-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-label="Report Export Options"
          className="absolute right-0 top-full mt-2 z-50 w-60 rounded-2xl bg-white border border-charcoal-200 shadow-xl p-2 space-y-1 animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="px-3 py-1.5 border-b border-charcoal-100 text-[11px] font-bold uppercase tracking-wider text-charcoal-400">
            Export Municipal Report
          </div>

          <button
            role="menuitem"
            type="button"
            onClick={handleDownloadCsv}
            className="w-full text-left px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-charcoal-800 hover:text-navy-900 hover:bg-emerald-50 flex items-center gap-2.5 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <div>
              <span className="block font-bold">Download CSV</span>
              <span className="text-[11px] text-charcoal-500 font-normal">Excel / Sheets with BOM</span>
            </div>
          </button>

          <button
            role="menuitem"
            type="button"
            onClick={handlePrintPdf}
            className="w-full text-left px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-charcoal-800 hover:text-navy-900 hover:bg-navy-50 flex items-center gap-2.5 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-navy-700 flex-shrink-0" />
            <div>
              <span className="block font-bold">Print / Save as PDF</span>
              <span className="text-[11px] text-charcoal-500 font-normal">Dedicated print-ready view</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};
