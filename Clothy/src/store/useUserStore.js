/**
 * CLOZARI — User Store (Zustand)
 * Mock auth, recently viewed, addresses, notifications
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import orders from '../data/orders';

const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      recentlyViewed: [],
      addresses: [
        {
          id: 'addr_01',
          name: 'Arjun Mehta',
          line1: '42, Park Street',
          line2: 'Koramangala',
          city: 'Bangalore',
          state: 'Karnataka',
          pin: '560034',
          phone: '9876543210',
          isDefault: true,
        },
      ],
      notifications: [
        { id: 'notif_01', title: 'Order Shipped!', message: 'Your order ORD-2026-002 has been shipped.', date: '2026-09-21', read: false, type: 'order' },
        { id: 'notif_02', title: 'Flash Sale Live!', message: 'Extra 20% off everything — use code FLASH20', date: '2026-09-22', read: false, type: 'promo' },
        { id: 'notif_03', title: 'Welcome to CLOZARI', message: 'Thanks for joining! Enjoy ₹500 off your first order with code WELCOME500.', date: '2026-09-15', read: true, type: 'system' },
      ],

      /** Mock login */
      login: (name = 'Arjun Mehta', email = 'arjun@example.com') => {
        set({
          user: { name, email, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', joinedDate: '2026-01-15' },
          isLoggedIn: true,
        });
      },

      /** Mock logout */
      logout: () => {
        set({ user: null, isLoggedIn: false });
      },

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

      /** Get orders (mock) */
      getOrders: () => orders,

      /** Add address */
      addAddress: (address) => {
        set((state) => ({
          addresses: [...state.addresses, { ...address, id: `addr_${Date.now()}` }],
        }));
      },

      /** Remove address */
      removeAddress: (id) => {
        set((state) => ({
          addresses: state.addresses.filter((a) => a.id !== id),
        }));
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
        user: state.user,
        isLoggedIn: state.isLoggedIn,
        recentlyViewed: state.recentlyViewed,
        addresses: state.addresses,
      }),
    }
  )
);

export default useUserStore;
