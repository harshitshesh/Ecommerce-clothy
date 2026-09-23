/**
 * CLOZARI — Wishlist Store (Zustand)
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],

      /** Add product to wishlist */
      addItem: (product) => {
        set((state) => {
          if (state.items.some((item) => item.id === product.id)) {
            return state; // Already in wishlist
          }
          return {
            items: [
              ...state.items,
              {
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                discountPrice: product.discountPrice,
                image: product.images[0],
                category: product.category,
              },
            ],
          };
        });
      },

      /** Remove product from wishlist */
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },

      /** Toggle wishlist (add/remove) */
      toggleItem: (product) => {
        const { items } = get();
        if (items.some((item) => item.id === product.id)) {
          get().removeItem(product.id);
          return false; // Removed
        }
        get().addItem(product);
        return true; // Added
      },

      /** Check if product is in wishlist */
      isWishlisted: (productId) => {
        return get().items.some((item) => item.id === productId);
      },

      /** Get wishlist count */
      getCount: () => get().items.length,
    }),
    {
      name: 'clothy-wishlist',
    }
  )
);

export default useWishlistStore;
