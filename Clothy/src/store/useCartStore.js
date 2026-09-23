/**
 * CLOZARI — Cart Store (Zustand)
 * Manages cart items, quantities, coupon application
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { coupons } from '../data/offers';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      coupon: null, // { code, discount, type }

      /** Add item to cart (or increment quantity if exists with same size/color) */
      addItem: (product, size, color, quantity = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) =>
              item.id === product.id &&
              item.size === size &&
              item.color?.name === color?.name
          );
          if (existingIndex > -1) {
            const newItems = [...state.items];
            newItems[existingIndex] = {
              ...newItems[existingIndex],
              quantity: newItems[existingIndex].quantity + quantity,
            };
            return { items: newItems };
          }
          return {
            items: [
              ...state.items,
              {
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.discountPrice || product.price,
                originalPrice: product.price,
                image: product.images[0],
                size,
                color,
                quantity,
                stock: product.stock,
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
      },

      /** Clear all cart items */
      clearCart: () => set({ items: [], coupon: null }),

      /** Apply coupon code */
      applyCoupon: (code) => {
        const upperCode = code.toUpperCase();
        const couponData = coupons[upperCode];
        if (!couponData) {
          return { success: false, message: 'Invalid coupon code' };
        }
        const subtotal = get().getSubtotal();
        if (subtotal < couponData.minOrder) {
          return {
            success: false,
            message: `Minimum order of ₹${couponData.minOrder.toLocaleString('en-IN')} required`,
          };
        }
        set({ coupon: { code: upperCode, ...couponData } });
        return { success: true, message: `Coupon "${upperCode}" applied! ${couponData.description}` };
      },

      /** Remove applied coupon */
      removeCoupon: () => set({ coupon: null }),

      /** Get cart subtotal */
      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      /** Get coupon discount amount */
      getDiscount: () => {
        const { coupon } = get();
        if (!coupon) return 0;
        const subtotal = get().getSubtotal();
        if (coupon.type === 'percentage') {
          return Math.round((subtotal * coupon.discount) / 100);
        }
        return coupon.discount;
      },

      /** Get shipping cost (free above ₹1999) */
      getShipping: () => {
        const subtotal = get().getSubtotal();
        return subtotal >= 1999 ? 0 : 149;
      },

      /** Get final total */
      getTotal: () => {
        return get().getSubtotal() - get().getDiscount() + get().getShipping();
      },

      /** Get total item count */
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'clothy-cart',
    }
  )
);

export default useCartStore;
