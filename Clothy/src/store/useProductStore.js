/**
 * CLOZARI — Product Store (Zustand + persist → localStorage `clozari-products`)
 *
 * Provides a dynamic, live product catalogue shared seamlessly between:
 *  - Customer public site (Home, Shop, PDP, Category, Search)
 *  - Admin management modules (Products catalogue, Variant Matrix stock management)
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import initialProducts from '../data/products';

export const PRODUCTS_STORE_KEY = 'clozari-products';

const useProductStore = create(
  persist(
    (set, get) => ({
      products: initialProducts,

      /** Get all active (unarchived) products for the public store */
      getActiveProducts: () => get().products.filter((p) => !p.isArchived),

      /** Get all products including archived ones for the admin panel */
      getAllProducts: () => get().products,

      getProductById: (id) => get().products.find((p) => p.id === id) || null,

      getProductBySlug: (slug) => get().products.find((p) => p.slug === slug) || null,

      /** Add a brand new product */
      addProduct: (newProduct) => {
        const id = newProduct.id || `prod_${Date.now()}`;
        const slug =
          newProduct.slug ||
          newProduct.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');

        const product = {
          id,
          slug,
          rating: 4.5,
          reviewsCount: 0,
          tags: ['new'],
          isArchived: false,
          createdAt: new Date().toISOString(),
          ...newProduct,
        };

        set((state) => ({ products: [product, ...state.products] }));
        return product;
      },

      /** Update an existing product */
      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }));
      },

      /** Toggle archive status */
      archiveProduct: (id) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, isArchived: !p.isArchived } : p
          ),
        }));
      },

      /** Delete a product permanently */
      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },

      /** Reset back to factory seed data */
      resetToDefault: () => {
        set({ products: initialProducts });
      },
    }),
    {
      name: PRODUCTS_STORE_KEY,
      partialize: (state) => ({ products: state.products }),
      merge: (persisted, current) => {
        const prods = persisted?.products;
        if (!Array.isArray(prods) || prods.length === 0) {
          return { ...current, products: initialProducts };
        }
        return { ...current, products: prods };
      },
    }
  )
);

export default useProductStore;
