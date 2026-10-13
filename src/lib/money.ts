// ============================================
// BUYMECART - Currency Utilities
// All monetary values stored as integers (paise)
// 1 INR = 100 paise
// ============================================

/**
 * Convert rupees to paise for storage
 */
export function toPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

/**
 * Convert paise to rupees for display
 */
export function toRupees(paise: number): number {
  return paise / 100;
}

/**
 * Format paise as INR currency string
 * e.g., 149900 → "₹1,499.00"
 */
export function formatINR(paise: number): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rupees);
}

/**
 * Format paise as short INR (no decimals if whole rupees)
 * e.g., 149900 → "₹1,499"
 */
export function formatINRShort(paise: number): string {
  const rupees = paise / 100;
  const hasDecimal = rupees % 1 !== 0;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: hasDecimal ? 2 : 0,
    maximumFractionDigits: hasDecimal ? 2 : 0,
  }).format(rupees);
}

/**
 * Calculate discount percentage from MRP and selling price (both in paise)
 */
export function calculateDiscountPercent(
  mrpPaise: number,
  sellingPricePaise: number
): number {
  if (mrpPaise <= 0) return 0;
  if (sellingPricePaise >= mrpPaise) return 0;
  const discount = ((mrpPaise - sellingPricePaise) / mrpPaise) * 100;
  return Math.round(discount);
}

/**
 * Calculate tax amount in paise
 */
export function calculateTax(amountPaise: number, taxRatePercent: number): number {
  return Math.round((amountPaise * taxRatePercent) / 100);
}

/**
 * GST rate mapping
 */
export const GST_RATES: Record<string, number> = {
  GST_0: 0,
  GST_5: 5,
  GST_12: 12,
  GST_18: 18,
  GST_28: 28,
};

/**
 * Validate that a paise amount is a non-negative integer
 */
export function isValidPaise(paise: number): boolean {
  return Number.isInteger(paise) && paise >= 0;
}
