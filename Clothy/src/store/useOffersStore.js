/**
 * CLOZARI — Offers Store (Zustand + persist → localStorage `clozari-offers`)
 *
 * Full CRUD for promotional codes & offers, shared between:
 *  - Customer cart checkout (apply promo code)
 *  - Customer Offers page catalogue
 *  - Admin Offers management module
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import initialOffers, { getOfferStatus, OFFER_STATUS } from '../data/offers';

export const OFFERS_STORE_KEY = 'clozari-offers';

const useOffersStore = create(
  persist(
    (set, get) => ({
      offers: initialOffers,

      getAll: () => get().offers,

      getActiveOffers: () =>
        get().offers.filter((o) => getOfferStatus(o) !== OFFER_STATUS.EXPIRED),

      getByCode: (code) => {
        if (!code) return null;
        const key = String(code).trim().toUpperCase();
        return get().offers.find((o) => o.code === key) || null;
      },

      addOffer: (newOffer) => {
        const code = String(newOffer.code || '').trim().toUpperCase();
        if (!code) return { ok: false, error: 'Promo code is required.' };

        if (get().offers.some((o) => o.code === code)) {
          return { ok: false, error: `Promo code "${code}" already exists.` };
        }

        const offer = {
          code,
          title: newOffer.title || code,
          description: newOffer.description || '',
          type: newOffer.type || 'percent',
          value: Number(newOffer.value) || 10,
          maxDiscount: newOffer.maxDiscount ? Number(newOffer.maxDiscount) : null,
          minOrder: Number(newOffer.minOrder) || 0,
          categories: Array.isArray(newOffer.categories) ? newOffer.categories : [],
          validTill: newOffer.validTill || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          image: newOffer.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
          subtitle: newOffer.subtitle || newOffer.description || '',
          isFlashSale: Boolean(newOffer.isFlashSale),
          createdAt: new Date().toISOString(),
        };

        set((state) => ({ offers: [offer, ...state.offers] }));
        return { ok: true, offer };
      },

      updateOffer: (code, updates) => {
        const key = String(code).trim().toUpperCase();
        set((state) => ({
          offers: state.offers.map((o) => (o.code === key ? { ...o, ...updates } : o)),
        }));
        return { ok: true };
      },

      deleteOffer: (code) => {
        const key = String(code).trim().toUpperCase();
        set((state) => ({
          offers: state.offers.filter((o) => o.code !== key),
        }));
        return { ok: true };
      },

      resetToDefault: () => set({ offers: initialOffers }),
    }),
    {
      name: OFFERS_STORE_KEY,
      partialize: (state) => ({ offers: state.offers }),
      merge: (persisted, current) => {
        const stored = persisted?.offers;
        if (!Array.isArray(stored) || stored.length === 0) {
          return { ...current, offers: initialOffers };
        }
        return { ...current, offers: stored };
      },
    }
  )
);

export default useOffersStore;
