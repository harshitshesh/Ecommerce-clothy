/**
 * CLOZARI — Offers catalogue (mock, localStorage-only app)
 *
 * Schema:
 *   code          unique promo code (uppercase)
 *   title         display name
 *   description   one-line human explanation
 *   type          'percent' | 'flat' | 'free-shipping'
 *   value         percent -> % off, flat -> Rs off, free-shipping -> shipping value covered
 *   maxDiscount   cap in Rs for percent offers (null = uncapped)
 *   minOrder      minimum eligible subtotal in Rs
 *   categories    [] means sitewide, otherwise only these product categories
 *   validTill     ISO date; past = expired
 */

const DAY = 24 * 60 * 60 * 1000;
const NOW = Date.now();
const inDays = (days) => new Date(NOW + days * DAY).toISOString();

const IMG = {
  seasonal: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
  jackets: 'https://images.unsplash.com/photo-1544923246-77307dd270f9?w=800&q=80',
  flash: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
  denim: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80',
  dresses: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
  welcome: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80',
};

const offers = [
  {
    code: 'WELCOME15',
    title: 'New Patron Welcome',
    description: '15% off your first order across the entire atelier.',
    type: 'percent',
    value: 15,
    maxDiscount: 1500,
    minOrder: 1499,
    categories: [],
    validTill: inDays(30),
    image: IMG.welcome,
    subtitle: 'A warm welcome for first-time patrons',
    isFlashSale: false,
  },
  {
    code: 'FLASH20',
    title: 'Flash Friday',
    description: 'Extra 20% off everything — this weekend only.',
    type: 'percent',
    value: 20,
    maxDiscount: 2500,
    minOrder: 1499,
    categories: [],
    validTill: inDays(1),
    image: IMG.flash,
    subtitle: 'Extra 20% off on everything — limited time',
    isFlashSale: true,
  },
  {
    code: 'SEASON40',
    title: 'End of Season Sale',
    description: 'Up to 40% off shirts, tees and denim staples.',
    type: 'percent',
    value: 40,
    maxDiscount: 2000,
    minOrder: 2999,
    categories: ['Shirts', 'T-Shirts', 'Jeans'],
    validTill: inDays(3),
    image: IMG.seasonal,
    subtitle: 'Up to 40% off on premium essentials',
    isFlashSale: true,
  },
  {
    code: 'JACKET1200',
    title: 'Luxury Outerwear Event',
    description: 'Flat Rs. 1,200 off jackets, coats and blazers.',
    type: 'flat',
    value: 1200,
    maxDiscount: null,
    minOrder: 5999,
    categories: ['Jackets'],
    validTill: inDays(7),
    image: IMG.jackets,
    subtitle: 'Flat Rs. 12,000 off on jackets & coats',
    isFlashSale: false,
  },
  {
    code: 'DENIM500',
    title: 'Indigo Denim Days',
    description: 'Flat Rs. 500 off when you buy denim worth Rs. 1,999+.',
    type: 'flat',
    value: 500,
    maxDiscount: null,
    minOrder: 1999,
    categories: ['Jeans'],
    validTill: inDays(10),
    image: IMG.denim,
    subtitle: 'Flat Rs. 500 off on all jeans',
    isFlashSale: false,
  },
  {
    code: 'DRESS25',
    title: 'Occasion Dress Edit',
    description: '25% off dresses, capped at Rs. 1,500.',
    type: 'percent',
    value: 25,
    maxDiscount: 1500,
    minOrder: 2499,
    categories: ['Dresses'],
    validTill: inDays(5),
    image: IMG.dresses,
    subtitle: '25% off on selected occasion wear',
    isFlashSale: false,
  },
  {
    code: 'FREESHIP',
    title: 'Complimentary Shipping',
    description: 'Free express shipping on any order above Rs. 999.',
    type: 'free-shipping',
    value: 99,
    maxDiscount: null,
    minOrder: 999,
    categories: [],
    validTill: inDays(14),
    image: IMG.seasonal,
    subtitle: 'Shipping on us, always',
    isFlashSale: false,
  },
  {
    code: 'SUMMER10',
    title: 'Everyday Essentials',
    description: '10% off sitewide on light, breathable summer layers.',
    type: 'percent',
    value: 10,
    maxDiscount: 800,
    minOrder: 999,
    categories: [],
    validTill: inDays(20),
    image: IMG.flash,
    subtitle: '10% off on everyday essentials',
    isFlashSale: false,
  },
  /* ---- Expired ---- */
  {
    code: 'MONSOON30',
    title: 'Monsoon Markdown',
    description: '30% off across all categories during the monsoon drop.',
    type: 'percent',
    value: 30,
    maxDiscount: 2000,
    minOrder: 1999,
    categories: [],
    validTill: inDays(-5),
    image: IMG.seasonal,
    subtitle: '30% off monsoon drop',
    isFlashSale: false,
  },
  {
    code: 'DIWALI500',
    title: 'Festive First Light',
    description: 'Flat Rs. 500 off festive orders above Rs. 2,499.',
    type: 'flat',
    value: 500,
    maxDiscount: null,
    minOrder: 2499,
    categories: [],
    validTill: inDays(-1),
    image: IMG.dresses,
    subtitle: 'Flat Rs. 500 off festive picks',
    isFlashSale: false,
  },
];

/** Offer lifecycle labels used by filters + cards. */
export const OFFER_STATUS = {
  ACTIVE: 'active',
  EXPIRING: 'expiring-soon',
  EXPIRED: 'expired',
};

/** Anything valid within this window is flagged as "expiring soon". */
export const EXPIRING_SOON_MS = 3 * DAY;

/** Normalised, case-insensitive lookup for a promo code. */
export const getOfferByCode = (code) => {
  if (!code) return null;
  const key = String(code).trim().toUpperCase();
  return offers.find((o) => o.code === key) || null;
};

/** active | expiring-soon | expired */
export const getOfferStatus = (offer) => {
  if (!offer?.validTill) return OFFER_STATUS.ACTIVE;
  const ends = new Date(offer.validTill).getTime();
  if (Number.isNaN(ends)) return OFFER_STATUS.ACTIVE;
  if (ends <= Date.now()) return OFFER_STATUS.EXPIRED;
  if (ends - Date.now() <= EXPIRING_SOON_MS) return OFFER_STATUS.EXPIRING;
  return OFFER_STATUS.ACTIVE;
};

export const isOfferExpired = (offer) => getOfferStatus(offer) === OFFER_STATUS.EXPIRED;

/** Days (rounded up) until expiry; null when already expired or open-ended. */
export const daysUntilExpired = (offer) => {
  if (!offer?.validTill) return null;
  const diff = new Date(offer.validTill).getTime() - Date.now();
  if (diff <= 0) return null;
  return Math.max(1, Math.ceil(diff / DAY));
};

/** Rough rupee value of an offer on a Rs. 2,500 cart — used for "best value" sort. */
export const offerValueScore = (offer) => {
  if (!offer) return 0;
  if (offer.type === 'percent') return Math.round((2500 * offer.value) / 100);
  if (offer.type === 'flat') return offer.value;
  if (offer.type === 'free-shipping') return offer.value || 99;
  return 0;
};

/** Every category referenced by the catalogue (for filter dropdowns). */
export const offerCategories = [
  ...new Set(offers.flatMap((o) => o.categories || [])),
];

export default offers;
