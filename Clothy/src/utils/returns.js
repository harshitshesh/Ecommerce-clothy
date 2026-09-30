/**
 * returns.js — rules for the return / exchange flow.
 * One 7-day window from delivery, item shares of an order, and the shared
 * reason / pickup-slot option lists.
 */
import { pricingFromOrder } from './pricing';

export const RETURN_WINDOW_DAYS = 7;
const DAY = 24 * 60 * 60 * 1000;

export const RETURN_REASONS = [
  'Size too small',
  'Size too large',
  'Fit / cut not as expected',
  'Colour different from the photos',
  'Quality or fabric issue',
  'Wrong item or size delivered',
  'Changed my mind',
];

export const REFUND_METHODS = [
  { value: 'original', label: 'Original payment method', note: 'Takes 5–7 business days' },
  { value: 'wallet', label: 'Clozari Wallet coins', note: 'Instant — spend it on your next order' },
];

export const PICKUP_SLOTS = [
  'Tomorrow · 9 AM – 1 PM',
  'Tomorrow · 4 PM – 8 PM',
  'Day after tomorrow · 9 AM – 1 PM',
  'Day after tomorrow · 4 PM – 8 PM',
];

export const colorNameOf = (item) =>
  typeof item.color === 'string' ? item.color : item?.color?.name || item?.colorName || '';

/** Stable identity of a line item inside one order. */
export const itemSkuOf = (item, index = 0) =>
  item.sku ||
  `${item.id || item.productId || 'item'}-${colorNameOf(item).replace(/\s+/g, '') || 'STD'}-${
    item.size || 'OS'
  }-${index}`;

/** '2026-09-18 03:30 PM' | 'Sep 18, 2026 3:30 PM' | ISO → Date | null */
export const parseDateTime = (value) => {
  if (!value) return null;
  const raw = String(value).trim();

  const spaced = raw.match(/^(\d{4}-\d{2}-\d{2})\s+(\d{1,2}:\d{2})\s*(AM|PM)?$/i);
  if (spaced) {
    const [y, m, d] = spaced[1].split('-').map(Number);
    const [h, min] = spaced[2].split(':').map(Number);
    const meridiem = spaced[3]?.toUpperCase();
    let hour = h;
    if (meridiem === 'PM' && hour < 12) hour += 12;
    if (meridiem === 'AM' && hour === 12) hour = 0;
    return new Date(y, m - 1, d, hour, min);
  }

  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

/** When the parcel was actually delivered (ISO string or null). */
export function getDeliveredAt(order) {
  if (order?.deliveredAt) {
    const explicit = parseDateTime(order.deliveredAt);
    if (explicit) return explicit;
  }
  const step = order?.tracking?.find((t) => t.status === 'Delivered' && t.completed && t.date);
  return step ? parseDateTime(step.date) : null;
}

/**
 * Can this order's items still be returned/exchanged?
 * @returns {{ok: boolean, reason: string}}
 */
export function getReturnWindow(order) {
  if (!order || order.status !== 'Delivered') {
    return { ok: false, reason: 'Available once the order is delivered' };
  }
  const deliveredAt = getDeliveredAt(order);
  if (!deliveredAt) {
    return { ok: false, reason: 'Delivery date unknown — contact support' };
  }
  const elapsed = Date.now() - deliveredAt.getTime();
  if (elapsed < 0 || elapsed > RETURN_WINDOW_DAYS * DAY) {
    const daysLeft = Math.max(
      0,
      RETURN_WINDOW_DAYS - Math.floor(elapsed / DAY)
    );
    return {
      ok: false,
      reason:
        daysLeft > 0
          ? `Only ${daysLeft} day${daysLeft === 1 ? '' : 's'} left in the 7-day window`
          : `Return window closed — exchanges and returns are accepted within ${RETURN_WINDOW_DAYS} days of delivery`,
    };
  }
  const daysLeft = RETURN_WINDOW_DAYS - Math.floor(elapsed / DAY);
  return { ok: true, reason: `Eligible for ${daysLeft} more day${daysLeft === 1 ? '' : 's'}` };
}

/**
 * The share of the order total, wallet coins used and coins earned that one
 * line item is responsible for — so a partial return only reverses its own part.
 */
export function getItemShares(order, itemIndex) {
  const pricing = pricingFromOrder(order);
  const item = order?.items?.[itemIndex];
  const quantity = Math.max(1, Number(item?.quantity) || 1);
  const itemSubtotal = Math.max(0, (Number(item?.price) || 0) * quantity);
  const subtotal = Math.max(0, Number(pricing.subtotal) || 0);
  const ratio = subtotal > 0 ? itemSubtotal / subtotal : 0;

  return {
    itemSubtotal,
    itemCharge: Math.round(ratio * pricing.grandTotal),
    walletShare: Math.round(ratio * (pricing.walletCoinsUsed || 0)),
    earnedShare: Math.round(ratio * (order?.coinsEarned || 0)),
  };
}
