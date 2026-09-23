/**
 * Format a number as Indian Rupee currency string.
 * @param {number} amount
 * @returns {string} e.g., "₹1,899"
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Calculate discount percentage.
 * @param {number} original
 * @param {number} discounted
 * @returns {number} percentage off
 */
export function getDiscountPercent(original, discounted) {
  if (!original || !discounted || discounted >= original) return 0;
  return Math.round(((original - discounted) / original) * 100);
}
