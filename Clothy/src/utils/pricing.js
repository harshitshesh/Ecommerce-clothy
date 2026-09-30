import { getOfferByCode, isOfferExpired } from '../data/offers';

export const FREE_SHIPPING_THRESHOLD = 1999;
export const SHIPPING_FEE = 99;
export const EXPRESS_SHIPPING_FEE = 199;
export const GST_THRESHOLD = 2500;
export const GST_LOW_RATE = 5;
export const GST_HIGH_RATE = 18;

const num = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

/** Money is always whole rupees so PDF, cart and order pages never drift. */
const money = (value) => Math.round(num(value));

export const formatRs = (amount) => `Rs. ${Math.round(num(amount)).toLocaleString('en-IN')}`;

/** GST rate (inclusive) that applies to a single unit of a product. */
export const gstRateForUnit = (unitPrice) => (num(unitPrice) > GST_THRESHOLD ? GST_HIGH_RATE : GST_LOW_RATE);

const describeFailure = (offer, shortfall) => {
  if (isOfferExpired(offer)) {
    return `${offer.code} expired on ${new Date(offer.validTill).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })}.`;
  }
  if (shortfall > 0) {
    return `Add ${formatRs(shortfall)} more to use ${offer.code}.`;
  }
  if (offer.categories?.length) {
    return `${offer.code} only applies to ${offer.categories.join(', ')}.`;
  }
  return `${offer.code} cannot be applied to this cart.`;
};

/**
 * Pure eligibility + discount check for a single offer.
 * @returns {{ok: boolean, reason: 'invalid'|'expired'|'min-order'|'category'|null,
 *            discount: number, shortfall: number, freeShipping: boolean, message: string}}
 */
export function evaluateOffer(offer, { subtotal = 0, items = [] } = {}) {
  if (!offer) {
    return {
      ok: false,
      reason: 'invalid',
      discount: 0,
      shortfall: 0,
      freeShipping: false,
      message: "That promo code isn't valid. Check for typos and try again.",
    };
  }

  const cartSubtotal = money(subtotal);

  if (isOfferExpired(offer)) {
    return {
      ok: false,
      reason: 'expired',
      discount: 0,
      shortfall: 0,
      freeShipping: false,
      message: describeFailure(offer, 0),
    };
  }

  const shortfall = Math.max(0, money(offer.minOrder || 0) - cartSubtotal);
  if (shortfall > 0) {
    return {
      ok: false,
      reason: 'min-order',
      discount: 0,
      shortfall,
      freeShipping: false,
      message: describeFailure(offer, shortfall),
    };
  }

  const wanted = (offer.categories || []).map((c) => c.toLowerCase());
  if (wanted.length) {
    const matches = items.some((item) => {
      const category = String(item.category || item.productCategory || '').toLowerCase();
      return category && wanted.includes(category);
    });
    if (!matches) {
      return {
        ok: false,
        reason: 'category',
        discount: 0,
        shortfall: 0,
        freeShipping: false,
        message: describeFailure(offer, 0),
      };
    }
  }

  let discount = 0;
  if (offer.type === 'percent') {
    discount = Math.round((cartSubtotal * num(offer.value)) / 100);
    if (offer.maxDiscount) discount = Math.min(discount, money(offer.maxDiscount));
  } else if (offer.type === 'flat') {
    discount = Math.min(money(offer.value), cartSubtotal);
  }

  return {
    ok: true,
    reason: null,
    discount,
    shortfall: 0,
    freeShipping: offer.type === 'free-shipping',
    message: `${offer.code} applied — you saved ${formatRs(discount)}.`,
  };
}

const buildLines = (items) =>
  (items || []).map((item, index) => {
    const quantity = Math.max(1, num(item.quantity) || 1);
    const price = money(item.price);
    const mrp = money(item.originalPrice ?? item.price);
    const rate = gstRateForUnit(price);
    const lineTotal = price * quantity;
    const tax = Math.round((lineTotal * rate) / (100 + rate));
    const colour =
      typeof item.color === 'string' ? item.color : item.color?.name || item.colorName || '';

    return {
      sku: item.sku || item.id || item.productId || `SKU-${index + 1}`,
      name: item.name || 'Item',
      colour,
      size: item.size || '',
      quantity,
      price,
      mrp,
      discount: (mrp - price) * quantity,
      gstRate: rate,
      gstAmount: tax,
      total: lineTotal,
    };
  });

/**
 * The single pricing function for the whole app.
 * Cart, checkout, order confirmation, order detail and the PDF invoice all
 * read from this one result so the totals can never disagree.
 */
export function calculatePricing({
  items = [],
  offerCode = null,
  extraShipping = 0,
  walletCoinsUsed = 0,
} = {}) {
  const lines = buildLines(items);

  let mrpTotal = 0;
  let subtotal = 0;
  const gst = {
    [GST_LOW_RATE]: { rate: GST_LOW_RATE, taxable: 0, tax: 0 },
    [GST_HIGH_RATE]: { rate: GST_HIGH_RATE, taxable: 0, tax: 0 },
  };

  lines.forEach((line) => {
    mrpTotal += line.mrp * line.quantity;
    subtotal += line.total;
    const bucket = gst[line.gstRate] || gst[GST_LOW_RATE];
    bucket.taxable += line.total - line.gstAmount;
    bucket.tax += line.gstAmount;
  });

  mrpTotal = money(mrpTotal);
  subtotal = money(subtotal);
  const productDiscount = Math.max(0, mrpTotal - subtotal);

  const offer = getOfferByCode(offerCode);
  const evaluation = offer
    ? evaluateOffer(offer, { subtotal, items })
    : { ok: false, reason: null, discount: 0, shortfall: 0, freeShipping: false, message: '' };

  const offerApplied = Boolean(offer && evaluation.ok);
  const offerDiscount = offerApplied ? money(evaluation.discount) : 0;
  const freeShippingByOffer = offerApplied && evaluation.freeShipping;

  const shippingBase = subtotal === 0 ? 0 : subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const shipping = money((freeShippingByOffer ? 0 : shippingBase) + num(extraShipping));

  const grandTotal = Math.max(0, subtotal - offerDiscount + shipping);
  /* Clozari Wallet coins are worth Rs. 1 each and only ever reduce the amount
     still to be charged — they never change the order total itself. */
  const walletUsed = Math.max(0, Math.min(money(walletCoinsUsed), grandTotal));
  const amountDue = Math.max(0, grandTotal - walletUsed);
  const gstBreakdown = Object.values(gst)
    .filter((b) => b.taxable > 0 || b.tax > 0)
    .map((b) => ({
      rate: b.rate,
      taxable: money(b.taxable),
      tax: money(b.tax),
    }));
  const gstIncluded = gstBreakdown.reduce((sum, b) => sum + b.tax, 0);

  return {
    lines,
    itemCount: lines.reduce((sum, l) => sum + l.quantity, 0),
    mrpTotal,
    productDiscount,
    subtotal,
    offer: offerApplied ? offer : null,
    offerCode: offerApplied ? offer.code : null,
    offerDiscount,
    freeShippingApplied: freeShippingByOffer,
    offerError: offer && !evaluation.ok ? evaluation : null,
    offerMessage: offer && !evaluation.ok ? evaluation.message : '',
    shippingThreshold: FREE_SHIPPING_THRESHOLD,
    shippingFee: SHIPPING_FEE,
    shippingBase,
    extraShipping: money(extraShipping),
    shipping,
    gstBreakdown,
    gstIncluded,
    grandTotal,
    walletCoinsUsed: walletUsed,
    amountDue,
    totalSavings: productDiscount + offerDiscount,
  };
}

/**
 * Rebuilds a display-ready pricing object for orders that may predate the
 * pricing snapshot. Saved snapshots are returned untouched.
 */
export function pricingFromOrder(order) {
  if (order?.pricing) {
    const saved = order.pricing;
    const grandTotal = money(saved.grandTotal ?? order.total ?? 0);
    const walletCoinsUsed = Math.max(
      0,
      Math.min(money(saved.walletCoinsUsed ?? order.walletCoinsUsed ?? 0), grandTotal)
    );
    return {
      ...saved,
      grandTotal,
      walletCoinsUsed,
      amountDue: Math.max(0, grandTotal - walletCoinsUsed),
    };
  }

  const items = order?.items || [];
  const lines = buildLines(items);
  const subtotal = money(order?.subtotal ?? lines.reduce((sum, l) => sum + l.total, 0));
  const mrpTotal = money(lines.reduce((sum, l) => sum + l.mrp * l.quantity, 0));
  const productDiscount = Math.max(0, mrpTotal - subtotal);
  const offerDiscount = money(order?.discount ?? 0);
  const shipping = money(order?.shipping ?? 0);

  const gst = {
    [GST_LOW_RATE]: { rate: GST_LOW_RATE, taxable: 0, tax: 0 },
    [GST_HIGH_RATE]: { rate: GST_HIGH_RATE, taxable: 0, tax: 0 },
  };
  lines.forEach((line) => {
    const bucket = gst[line.gstRate] || gst[GST_LOW_RATE];
    bucket.taxable += line.total - line.gstAmount;
    bucket.tax += line.gstAmount;
  });
  const gstBreakdown = Object.values(gst)
    .filter((b) => b.taxable > 0 || b.tax > 0)
    .map((b) => ({ rate: b.rate, taxable: money(b.taxable), tax: money(b.tax) }));

  const grandTotal = money(order?.total ?? subtotal - offerDiscount + shipping);
  const walletCoinsUsed = Math.max(0, Math.min(money(order?.walletCoinsUsed || 0), grandTotal));

  return {
    lines,
    itemCount: lines.reduce((sum, l) => sum + l.quantity, 0),
    mrpTotal,
    productDiscount,
    subtotal,
    offer: null,
    offerCode: order?.offerCode || null,
    offerDiscount,
    freeShippingApplied: shipping === 0 && subtotal > 0,
    offerError: null,
    offerMessage: '',
    shippingThreshold: FREE_SHIPPING_THRESHOLD,
    shippingFee: SHIPPING_FEE,
    shippingBase: shipping,
    extraShipping: 0,
    shipping,
    gstBreakdown,
    gstIncluded: gstBreakdown.reduce((sum, b) => sum + b.tax, 0),
    grandTotal,
    walletCoinsUsed,
    amountDue: Math.max(0, grandTotal - walletCoinsUsed),
    totalSavings: productDiscount + offerDiscount,
  };
}

export default calculatePricing;
