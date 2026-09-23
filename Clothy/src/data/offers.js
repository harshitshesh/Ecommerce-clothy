/**
 * CLOZARI — Flash Sale & Offers Data
 */
const offers = [
  {
    id: 'offer_01',
    title: 'End of Season Sale',
    subtitle: 'Up to 40% off on premium essentials',
    code: 'SEASON40',
    discount: 40,
    type: 'percentage',
    minOrder: 2999,
    endsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
    isFlashSale: true,
    applicableCategories: ['Shirts', 'T-Shirts', 'Jeans'],
  },
  {
    id: 'offer_02',
    title: 'Luxury Outerwear Event',
    subtitle: 'Flat ₹2,000 off on jackets & coats',
    code: 'JACKET2K',
    discount: 2000,
    type: 'flat',
    minOrder: 5999,
    endsAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    image: 'https://images.unsplash.com/photo-1544923246-77307dd270f9?w=800&q=80',
    isFlashSale: false,
    applicableCategories: ['Jackets'],
  },
  {
    id: 'offer_03',
    title: 'Flash Friday',
    subtitle: 'Extra 20% off on everything — limited time!',
    code: 'FLASH20',
    discount: 20,
    type: 'percentage',
    minOrder: 1499,
    endsAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
    isFlashSale: true,
    applicableCategories: [],
  },
  {
    id: 'offer_04',
    title: 'New Customer Welcome',
    subtitle: 'Flat ₹500 off on your first order',
    code: 'WELCOME500',
    discount: 500,
    type: 'flat',
    minOrder: 1999,
    endsAt: null,
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80',
    isFlashSale: false,
    applicableCategories: [],
  },
];

/** Valid coupon codes for cart */
export const coupons = {
  SEASON40: { discount: 40, type: 'percentage', minOrder: 2999, description: '40% off (min. ₹2,999)' },
  JACKET2K: { discount: 2000, type: 'flat', minOrder: 5999, description: '₹2,000 off (min. ₹5,999)' },
  FLASH20: { discount: 20, type: 'percentage', minOrder: 1499, description: '20% off (min. ₹1,499)' },
  WELCOME500: { discount: 500, type: 'flat', minOrder: 1999, description: '₹500 off (min. ₹1,999)' },
  CLOZARI10: { discount: 10, type: 'percentage', minOrder: 999, description: '10% off (min. ₹999)' },
};

export default offers;
