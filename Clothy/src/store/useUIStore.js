/**
 * CLOZARI — UI Store (Zustand)
 * Controls drawers, modals, dark mode, search state
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUIStore = create(
  persist(
    (set) => ({
      isCartOpen: false,
      isWishlistOpen: false,
      isSearchOpen: false,
      isMobileMenuOpen: false,
      darkMode: false,
      quickViewProduct: null,

      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set((s) => ({ isCartOpen: !s.isCartOpen })),

      openWishlist: () => set({ isWishlistOpen: true }),
      closeWishlist: () => set({ isWishlistOpen: false }),

      openSearch: () => set({ isSearchOpen: true }),
      closeSearch: () => set({ isSearchOpen: false }),

      openMobileMenu: () => set({ isMobileMenuOpen: true }),
      closeMobileMenu: () => set({ isMobileMenuOpen: false }),

      toggleDarkMode: () =>
        set((s) => {
          const next = !s.darkMode;
          if (next) {
            document.body.classList.add('dark');
          } else {
            document.body.classList.remove('dark');
          }
          return { darkMode: next };
        }),

      setQuickViewProduct: (product) => set({ quickViewProduct: product }),
      closeQuickView: () => set({ quickViewProduct: null }),
    }),
    {
      name: 'clothy-ui',
      partialize: (state) => ({ darkMode: state.darkMode }),
      onRehydrateStorage: () => (state) => {
        // Re-apply dark mode class on page load
        if (state?.darkMode) {
          document.body.classList.add('dark');
        }
      },
    }
  )
);

export default useUIStore;
