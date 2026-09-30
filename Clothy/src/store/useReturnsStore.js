/**
 * CLOZARI — Returns & Exchanges Store (Zustand + persist → `clozari-returns`)
 *
 * Request shape:
 * { id, orderId, userId, itemSku, itemIndex, itemName, itemImage, type: 'return' | 'exchange',
 *   reason, note, qty, newSize, refundTo, pickupSlot,
 *   status: 'requested' | 'approved' | 'picked-up' | 'completed' | 'rejected',
 *   timeline: [{ status, date, note }], createdAt }
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useWalletStore from './useWalletStore';
import { reserveVariantStock, restockVariantStock } from '../utils/variantStock';

export const RETURN_STATUSES = ['requested', 'approved', 'picked-up', 'completed', 'rejected'];

const stamp = () => new Date().toISOString();

/** Initial seeded mock return/exchange requests for demo/showcase */
const INITIAL_REQUESTS = [
  {
    id: 'ret_seed_001',
    orderId: 'ORD-2026-001',
    userId: 'usr_demo',
    itemSku: 'CLZ-001-CHA-L',
    itemIndex: 0,
    itemName: 'Oversized Cotton Shirt',
    itemImage: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&q=80',
    type: 'exchange',
    reason: 'Size too small',
    note: 'Would like to size up to XL for a looser drape',
    qty: 1,
    newSize: 'XL',
    refundTo: 'original',
    pickupSlot: 'Tomorrow · 9 AM – 1 PM',
    status: 'requested',
    createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    timeline: [
      {
        status: 'requested',
        date: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
        note: 'Customer requested size exchange for XL',
      },
    ],
  },
];

const useReturnsStore = create(
  persist(
    (set, get) => ({
      requests: INITIAL_REQUESTS,

      /** Create a request for one order line (never twice for the same line). */
      createRequest: (payload) => {
        const duplicate = get().requests.find(
          (r) =>
            r.orderId === payload.orderId &&
            r.itemIndex === payload.itemIndex &&
            r.userId === payload.userId
        );
        if (duplicate) {
          return {
            ok: false,
            error: `A ${duplicate.type} request already exists for this item (${duplicate.status}).`,
          };
        }

        const now = stamp();
        const request = {
          id: `ret_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          status: 'requested',
          createdAt: now,
          settled: true,
          timeline: [{ status: 'requested', date: now, note: 'Request submitted' }],
          ...payload,
        };
        set((state) => ({ requests: [request, ...state.requests] }));
        return { ok: true, request };
      },

      getForItem: (orderId, itemIndex, userId) =>
        get().requests.find(
          (r) =>
            r.orderId === orderId &&
            r.itemIndex === itemIndex &&
            (!userId || r.userId === userId)
        ) || null,

      getForOrder: (orderId, userId) =>
        get().requests.filter(
          (r) => r.orderId === orderId && (!userId || r.userId === userId)
        ),

      getForUser: (userId) =>
        userId ? get().requests.filter((r) => r.userId === userId) : [],

      /** ADMIN: Get all return and exchange requests across the store */
      getAllAdmin: () => get().requests,

      /**
       * ADMIN: Update status of an exchange/return request
       * Handles automated stock reservation for exchanges and wallet refunds for returns
       */
      updateRequestStatus: (requestId, newStatus, note = '') => {
        const target = get().requests.find((r) => r.id === requestId);
        if (!target) return { ok: false, error: 'Request not found' };

        const now = stamp();
        const defaultNotes = {
          approved: target.type === 'exchange' ? 'Exchange approved — replacement reserved' : 'Return approved — pickup scheduled',
          'picked-up': 'Original garment collected by logistics partner',
          completed: target.type === 'exchange' ? 'Replacement dispatched — exchange fulfilled' : 'Return inspected — refund released',
          rejected: note || 'Request rejected by store team',
        };

        const stepNote = note || defaultNotes[newStatus] || `Status updated to ${newStatus}`;

        // Stock effects on approval/completion
        if (newStatus === 'approved' && target.type === 'exchange' && target.newSize && target.productId) {
          reserveVariantStock(target.productId, target.colorName || target.color, target.newSize, target.qty || 1);
        }

        if (newStatus === 'completed' && target.type === 'return') {
          // Restock original item
          if (target.productId) {
            restockVariantStock(target.productId, target.colorName || target.color, target.size, target.qty || 1);
          }
          // If refund to wallet, credit coins
          if (target.refundTo === 'wallet' && target.refundAmount && target.userId) {
            useWalletStore.getState().credit(target.userId, target.refundAmount, {
              type: 'refund',
              orderId: target.orderId,
              note: `Refund for returned ${target.itemName || 'item'}`,
            });
          }
        }

        const updatedTimeline = [
          ...(target.timeline || []),
          { status: newStatus, date: now, note: stepNote },
        ];

        set((state) => ({
          requests: state.requests.map((r) =>
            r.id === requestId ? { ...r, status: newStatus, timeline: updatedTimeline } : r
          ),
        }));

        return { ok: true };
      },

      /**
       * Optional auto-progression: disabled by default when admin is managing requests
       */
      advanceStatuses: () => {
        // Keep status management authoritative via Admin panel
        return false;
      },
    }),
    {
      name: 'clozari-returns',
      partialize: (state) => ({ requests: state.requests }),
      merge: (persisted, current) => {
        const reqs = persisted?.requests;
        if (!Array.isArray(reqs) || reqs.length === 0) {
          return { ...current, requests: INITIAL_REQUESTS };
        }
        return { ...current, requests: reqs };
      },
    }
  )
);

export default useReturnsStore;
