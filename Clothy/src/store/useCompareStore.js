/**
 * CLOZARI — Compare Store (Zustand)
 * Up to 4 products for side-by-side comparison
 */
import { create } from 'zustand';

const useCompareStore = create((set, get) => ({
  items: [],
  maxItems: 4,

  addItem: (product) => {
    set((state) => {
      if (state.items.length >= state.maxItems) return state;
      if (state.items.some((item) => item.id === product.id)) return state;
      return { items: [...state.items, product] };
    });
  },

  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== productId),
    }));
  },

  isComparing: (productId) => {
    return get().items.some((item) => item.id === productId);
  },

  clearAll: () => set({ items: [] }),

  getCount: () => get().items.length,
}));

export default useCompareStore;
