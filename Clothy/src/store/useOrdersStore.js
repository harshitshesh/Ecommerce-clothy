/**
 * CLOZARI — Orders Store (Zustand + persist → localStorage `clozari-orders`)
 * Newly placed orders live here; the mock catalogue orders stay in data/orders.
 * Orders are scoped to the signed-in user for customers, while admin has full visibility.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import mockOrders, { getOrderById as getMockOrderById } from '../data/orders';
import useAuthStore from './useAuthStore';

const currentUserId = () => useAuthStore.getState().session?.id || null;

/** Own orders only (placed + seeded), newest first. */
const scopedOrders = (placed, userId) => {
  if (!userId) return [];
  // Merge placed with mockOrders, avoiding duplicate IDs if mock order was modified and saved into placed
  const placedIds = new Set(placed.map((o) => o.id));
  const remainingMocks = mockOrders.filter((o) => !placedIds.has(o.id));
  return [...placed, ...remainingMocks].filter((order) => order.userId === userId);
};

const useOrdersStore = create(
  persist(
    (set, get) => ({
      placed: [],

      /** Persist a freshly placed order (with its frozen pricing snapshot). */
      addOrder: (order) => set((state) => ({ placed: [order, ...state.placed] })),

      /** Orders belonging to the signed-in account. */
      getAll: () => scopedOrders(get().placed, currentUserId()),

      getById: (id) =>
        scopedOrders(get().placed, currentUserId()).find((o) => o.id === id) || null,

      /**
       * ADMIN: Get all orders across all users (both placed and seeded mock orders)
       */
      getAllAdmin: () => {
        const placed = get().placed;
        const placedIds = new Set(placed.map((o) => o.id));
        const remainingMocks = mockOrders.filter((o) => !placedIds.has(o.id));
        return [...placed, ...remainingMocks];
      },

      /**
       * ADMIN: Get specific order by ID (regardless of user)
       */
      getOrderAdmin: (id) => {
        const all = get().getAllAdmin();
        return all.find((o) => o.id === id) || null;
      },

      /**
       * ADMIN: Update status with timeline progression
       */
      updateOrderStatus: (orderId, newStatus, note = '') => {
        const placed = get().placed;
        const existingPlaced = placed.find((o) => o.id === orderId);
        const orderToUpdate = existingPlaced || mockOrders.find((o) => o.id === orderId);

        if (!orderToUpdate) return false;

        const now = new Date();
        const dateStr = now.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
        const timeStr = now.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
        });
        const fullDateStr = `${dateStr} ${timeStr}`;

        const updatedTracking = (orderToUpdate.tracking || []).map((step) => {
          if (step.status.toLowerCase() === newStatus.toLowerCase()) {
            return { ...step, completed: true, date: step.date || fullDateStr, note: note || step.note };
          }
          return step;
        });

        // If new status isn't in existing tracking steps, append it
        if (!updatedTracking.some((s) => s.status.toLowerCase() === newStatus.toLowerCase())) {
          updatedTracking.push({
            status: newStatus,
            date: fullDateStr,
            completed: true,
            note,
          });
        }

        const updatedOrder = {
          ...orderToUpdate,
          status: newStatus,
          tracking: updatedTracking,
          ...(newStatus.toLowerCase() === 'delivered' ? { deliveredAt: now.toISOString() } : {}),
        };

        if (existingPlaced) {
          set((state) => ({
            placed: state.placed.map((o) => (o.id === orderId ? updatedOrder : o)),
          }));
        } else {
          // Promote modified mock order into placed list
          set((state) => ({
            placed: [updatedOrder, ...state.placed],
          }));
        }

        return true;
      },

      /**
       * ADMIN: General update to an order record
       */
      updateOrder: (orderId, updates) => {
        const placed = get().placed;
        const existingPlaced = placed.find((o) => o.id === orderId);
        const orderToUpdate = existingPlaced || mockOrders.find((o) => o.id === orderId);
        if (!orderToUpdate) return false;

        const updatedOrder = { ...orderToUpdate, ...updates };
        if (existingPlaced) {
          set((state) => ({
            placed: state.placed.map((o) => (o.id === orderId ? updatedOrder : o)),
          }));
        } else {
          set((state) => ({
            placed: [updatedOrder, ...state.placed],
          }));
        }
        return true;
      },
    }),
    {
      name: 'clozari-orders',
      partialize: (state) => ({ placed: state.placed }),
    }
  )
);

/** Own orders only, re-rendered whenever a new one is saved. */
export function useAllOrders() {
  const placed = useOrdersStore((state) => state.placed);
  const userId = useAuthStore((state) => state.session?.id);
  return scopedOrders(placed, userId);
}

export function useOrder(id) {
  const placed = useOrdersStore((state) => state.placed);
  const userId = useAuthStore((state) => state.session?.id);
  if (!userId) return null;
  return (
    placed.find((o) => o.id === id && o.userId === userId) ||
    (getMockOrderById(id)?.userId === userId ? getMockOrderById(id) : null) ||
    null
  );
}

export default useOrdersStore;
