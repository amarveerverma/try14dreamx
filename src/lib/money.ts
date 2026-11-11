/**
 * DreamX Financial Math & Currency Engine
 * Target: India (CM-IN) • INR (₹) • Integer Paise Arithmetic
 * Strictly adheres to PRD §19.1 & §7: No floating-point inaccuracies.
 */

export interface PricingBreakdown {
  listPaise: number;
  discountPercent: number;
  discountPaise: number;
  finalPaise: number;
  gstPaise: number;
  netPaise: number;
  formattedFinalINR: string;
  formattedDiscountINR: string;
}

/**
 * Convert Rupees to Integer Paise
 */
export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

/**
 * Convert Integer Paise to Rupees
 */
export function paiseToRupees(paise: number): number {
  return paise / 100;
}

/**
 * Formats integer paise into Indian Rupee string (e.g., ₹1,499)
 * Follows the Indian numbering system format (lakhs/crores).
 */
export function formatINR(
  paise: number,
  options: { showPaise?: boolean } = {}
): string {
  const rupees = paiseToRupees(paise);
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: options.showPaise ? 2 : 0,
    minimumFractionDigits: options.showPaise ? 2 : 0,
  });
  return formatter.format(rupees);
}

/**
 * Calculate pricing breakdown inclusive of 18% GST (PRD §19.1)
 * Formula for inclusive GST: GST = Final * 18 / 118
 */
export function calculatePricingBreakdown(
  listPaise: number,
  tier: 'free' | 'pro' | 'elite' = 'free',
  isBundleEligible = false
): PricingBreakdown {
  // Determine best discount rate (no stacking per PRD §7)
  let discountPercent = 0;
  if (tier === 'elite') {
    discountPercent = 10;
  } else if (tier === 'pro' || isBundleEligible) {
    discountPercent = 5;
  }

  // Integer math for discount paise
  const discountPaise = Math.round((listPaise * discountPercent) / 100);
  const finalPaise = listPaise - discountPaise;

  // 18% GST is inclusive: Net = Final * 100 / 118
  const netPaise = Math.round((finalPaise * 100) / 118);
  const gstPaise = finalPaise - netPaise;

  return {
    listPaise,
    discountPercent,
    discountPaise,
    finalPaise,
    gstPaise,
    netPaise,
    formattedFinalINR: formatINR(finalPaise),
    formattedDiscountINR: formatINR(discountPaise),
  };
}

/**
 * Splits payment for mentor payouts and escrow holding.
 * DreamX standard platform commission is 20% on list price (PRD §13).
 */
export function calculateMentorPayout(listPaise: number): {
  mentorPaise: number;
  platformFeePaise: number;
} {
  const platformFeePaise = Math.round((listPaise * 20) / 100);
  const mentorPaise = listPaise - platformFeePaise;
  return {
    mentorPaise,
    platformFeePaise,
  };
}
