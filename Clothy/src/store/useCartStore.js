/**
 * CLOZARI — Cart Store (Zustand)
 * Manages cart items, quantities and the applied offer code.
 * Every rupee shown anywhere comes from utils/pricing.calculatePricing.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getOfferByCode } from '../data/offers';
import useOffersStore from './useOffersStore';
import { calculatePricing, evaluateOffer } from '../utils/pricing';
import { getVariantSku, getVariantStock } from '../utils/variantStock';

const APPLIED_OFFER_KEY = 'clozari-applied-offer';

const readAppliedOffer = () => {
  try {
    return window.localStorage.getItem(APPLIED_OFFER_KEY) || null;
  } catch {
    return null;
  }
};

const writeAppliedOffer = (code) => {
  try {
    if (code) window.localStorage.setItem(APPLIED_OFFER_KEY, code);
    else window.localStorage.removeItem(APPLIED_OFFER_KEY);
  } catch {
    /* storage unavailable */
  }
};

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      appliedOfferCode: readAppliedOffer(),

      /** Add item to cart (or increment quantity if exists with same size/color) */
      addItem: (product, size, color, quantity = 1) => {
        const cName = typeof color === 'string' ? color : color?.name;
        const liveStock = getVariantStock(product, cName, size);
        const sku = getVariantSku(product.id, cName, size);

        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) =>
              item.id === product.id &&
              item.size === size &&
              (typeof item.color === 'string' ? item.color : item.color?.name) === cName
          );
          if (existingIndex > -1) {
            const newItems = [...state.items];
            newItems[existingIndex] = {
              ...newItems[existingIndex],
              sku,
              quantity: newItems[existingIndex].quantity + quantity,
              stock: liveStock,
            };
            return { items: newItems };
          }
          return {
            items: [
              ...state.items,
              {
                id: product.id,
                productId: product.id,
                sku,
                name: product.name,
                slug: product.slug,
                price: product.discountPrice || product.price,
                originalPrice: product.price,
                image: product.images?.[0] || '',
                category: product.category,
                size,
                color,
                quantity,
                stock: liveStock,
              },
            ],
          };
        });
      },

      /** Remove item from cart by index */
      removeItem: (index) => {
        set((state) => ({
          items: state.items.filter((_, i) => i !== index),
        }));
      },

      /** Update item quantity */
      updateQuantity: (index, quantity) => {
        if (quantity < 1) return;
        set((state) => {
          const newItems = [...state.items];
          newItems[index] = { ...newItems[index], quantity };
          return { items: newItems };
        });
        get().reconcileOffer();
      },

      /** Clear all cart items */
      clearCart: () => {
        set({ items: [], appliedOfferCode: null });
        writeAppliedOffer(null);
      },

      /** Apply an offer by code. Returns { success, message }. */
      applyOffer: (code) => {
        const offer = useOffersStore.getState().getByCode(code) || getOfferByCode(code);
        if (!offer) {
          return {
            success: false,
            message: "That promo code isn't valid. Check for typos and try again.",
          };
        }

        const items = get().items;
        const subtotal = get().getSubtotal();
        const evaluation = evaluateOffer(offer, { subtotal, items });
        if (!evaluation.ok) {
          return { success: false, message: evaluation.message };
        }

        set({ appliedOfferCode: offer.code });
        writeAppliedOffer(offer.code);

        const saved = get().getPricing().offerDiscount;
        return {
          success: true,
          message: `${offer.code} applied — you saved Rs. ${saved.toLocaleString('en-IN')}.`,
        };
      },

      /** Remove the applied offer */
      removeOffer: () => {
        set({ appliedOfferCode: null });
        writeAppliedOffer(null);
      },

      /**
       * Drop the applied offer when the cart no longer qualifies for it.
       * Invoked by <Layout/> whenever the items or the applied code change.
       * Returns { code, message } when something was removed, else null.
       */
      reconcileOffer: () => {
        const code = get().appliedOfferCode;
        if (!code) return null;

        const offer = useOffersStore.getState().getByCode(code) || getOfferByCode(code);
        if (!offer) {
          set({ appliedOfferCode: null });
          writeAppliedOffer(null);
          return { code, message: `${code} is no longer available and was removed.` };
        }

        const evaluation = evaluateOffer(offer, {
          subtotal: get().getSubtotal(),
          items: get().items,
        });
        if (evaluation.ok) return null;

        const reason =
          evaluation.reason === 'min-order'
            ? `your cart is Rs. ${evaluation.shortfall} short of its Rs. ${offer.minOrder} minimum.`
            : evaluation.reason === 'expired'
              ? 'it has expired.'
              : 'it no longer applies to your cart.';

        set({ appliedOfferCode: null });
        writeAppliedOffer(null);
        return { code, message: `${code} removed — ${reason}` };
      },

      /** Full pricing breakdown (see utils/pricing.js). */
      getPricing: (extraShipping = 0) => {
        const { items, appliedOfferCode } = get();
        return calculatePricing({ items, offerCode: appliedOfferCode, extraShipping });
      },

      /** Get cart subtotal */
      getSubtotal: () => get().getPricing().subtotal,

      /** Get applied offer discount amount */
      getDiscount: () => get().getPricing().offerDiscount,

      /** Get shipping cost (free above Rs. 1,999) */
      getShipping: () => get().getPricing().shipping,

      /** Get final total */
      getTotal: () => get().getPricing().grandTotal,

      /** Get total item count */
      getItemCount: () =>
        get().items.reduce((count, item) => count + item.quantity, 0),
    }),
    {
      name: 'clothy-cart',
      partialize: (state) => ({ items: state.items, appliedOfferCode: state.appliedOfferCode }),
      merge: (persisted, current) => {
        const code = readAppliedOffer() || persisted?.appliedOfferCode || null;
        return { ...current, ...persisted, appliedOfferCode: code };
      },
      onRehydrateStorage: () => (state) => {
        writeAppliedOffer(state?.appliedOfferCode || null);
      },
    }
  )
);

export default useCartStore;
export { APPLIED_OFFER_KEY };
