/**
 * CLOZARI — User Store (Zustand)
 * Profile extras: recently viewed, notifications
 * NOTE: authentication, user records and per-user addresses live in `useAuthStore`.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUserStore = create(
  persist(
    (set, get) => ({
      recentlyViewed: [],
      notifications: [
        { id: 'notif_01', title: 'Order Shipped!', message: 'Your order has been shipped and is on its way.', date: '2026-09-21', read: false, type: 'order' },
        { id: 'notif_02', title: 'Flash Sale Live!', message: 'Extra 20% off everything — use code FLASH20', date: '2026-09-22', read: false, type: 'promo' },
        { id: 'notif_03', title: 'Welcome to CLOZARI', message: 'Thanks for joining! Enjoy 15% off your first order with code WELCOME15.', date: '2026-09-15', read: true, type: 'system' },
      ],

      /** Track recently viewed products */
      addToRecentlyViewed: (product) => {
        set((state) => {
          const filtered = state.recentlyViewed.filter((p) => p.id !== product.id);
          return {
            recentlyViewed: [
              { id: product.id, name: product.name, slug: product.slug, image: product.images[0], price: product.price, discountPrice: product.discountPrice },
              ...filtered,
            ].slice(0, 10), // Keep last 10
          };
        });
      },

      /** Mark notification as read */
      markNotificationRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }));
      },

      /** Get unread notification count */
      getUnreadCount: () => {
        return get().notifications.filter((n) => !n.read).length;
      },
    }),
    {
      name: 'clothy-user',
      partialize: (state) => ({
        recentlyViewed: state.recentlyViewed,
        notifications: state.notifications,
      }),
    }
  )
);

export default useUserStore;
