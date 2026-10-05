// ============================================================================
// RELOOP FORMATTERS & SAFE METRIC CALCULATORS
// Guards against division-by-zero, formats currencies, tonnages, and deltas
// ============================================================================

/**
 * Calculates percentage delta between current and baseline safely
 * Returns formatted string like "+48%" or "-32%", or "—" if baseline is 0
 */
export function calculateSafeDelta(
  current: number,
  baseline: number,
  options: { invertGoodBad?: boolean } = {}
): {
  percentStr: string;
  isPositive: boolean;
  isNeutral: boolean;
  isImprovement: boolean;
  ariaLabel: string;
} {
  if (!baseline || baseline === 0 || isNaN(current) || isNaN(baseline)) {
    return {
      percentStr: '—',
      isPositive: false,
      isNeutral: true,
      isImprovement: false,
      ariaLabel: 'Baseline not available for comparison',
    };
  }

  const delta = Math.round(((current - baseline) / Math.abs(baseline)) * 100);

  if (delta === 0) {
    return {
      percentStr: '0%',
      isPositive: false,
      isNeutral: true,
      isImprovement: true,
      ariaLabel: 'No change compared to baseline',
    };
  }

  const isPositive = delta > 0;
  // For cost/distance/overflow/landfill, negative delta is improvement (reduction)
  const isImprovement = options.invertGoodBad ? !isPositive : isPositive;
  const prefix = isPositive ? '+' : '';

  return {
    percentStr: `${prefix}${delta}%`,
    isPositive,
    isNeutral: false,
    isImprovement,
    ariaLabel: `${Math.abs(delta)} percent ${isPositive ? 'increase' : 'decrease'} compared to baseline`,
  };
}

/**
 * Formats Indian Rupees into Lakhs or standard locale format with ₹ symbol
 */
export function formatCurrencyINR(amountInr: number, inLakhs: boolean = true): string {
  if (isNaN(amountInr) || amountInr === undefined || amountInr === null) return '₹0';
  if (inLakhs) {
    const lakhs = amountInr / 100000;
    return `₹${lakhs.toLocaleString('en-IN', { minimumFractionDigits: 1, maximumFractionDigits: 2 })} Lakh`;
  }
  return `₹${Math.round(amountInr).toLocaleString('en-IN')}`;
}

/**
 * Formats tonnes with single decimal place
 */
export function formatTonnage(tonnes: number): string {
  if (isNaN(tonnes) || tonnes === undefined || tonnes === null) return '0.0 t';
  return `${Number(tonnes).toFixed(1)} t`;
}

/**
 * Returns "—" when value is zero or not yet computed, otherwise formats.
 * Use this for KPIs that should show a dash until the sim has run.
 */
export function safeFormatTonnage(tonnes: number): string {
  if (!Number.isFinite(tonnes) || tonnes <= 0) return '—';
  return `${Number(tonnes).toFixed(1)} t`;
}

export function safeFormatCurrencyINR(amountInr: number): string {
  if (!Number.isFinite(amountInr) || amountInr <= 0) return '—';
  const lakhs = amountInr / 100000;
  return `₹${lakhs.toLocaleString('en-IN', { minimumFractionDigits: 1, maximumFractionDigits: 2 })}L`;
}

export function safeFormatMwh(mwh: number): string {
  if (!Number.isFinite(mwh) || mwh <= 0) return '—';
  return `${Number(mwh).toFixed(1)} MWh`;
}
