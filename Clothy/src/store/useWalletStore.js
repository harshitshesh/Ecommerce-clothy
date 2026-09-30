/**
 * CLOZARI — Wallet Store (Zustand + persist → localStorage `clozari-wallets`)
 *
 * Shape: [{ userId, coins, transactions: [{ id, type, coins, orderId, date, note }] }]
 * 1 coin = Rs. 1. Balances are clamped so coins can never go negative.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  WALLET_STORE_KEY,
  WELCOME_BONUS_COINS,
  clampCoins,
} from '../utils/wallet';

const stamp = () => new Date().toISOString();

const txId = () => `wtx_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

const buildTx = ({ type, coins, orderId = null, note = '' }) => ({
  id: txId(),
  type,
  coins: clampCoins(coins),
  orderId,
  date: stamp(),
  note,
});

const useWalletStore = create(
  persist(
    (set, get) => ({
      wallets: [],

      /** Create the wallet on first touch and hand out the signup bonus. */
      ensureWallet: (userId) => {
        if (!userId) return null;
        const existing = get().wallets.find((w) => w.userId === userId);
        if (existing) return existing;

        const wallet = {
          userId,
          coins: WELCOME_BONUS_COINS,
          transactions: [
            buildTx({
              type: 'bonus',
              coins: WELCOME_BONUS_COINS,
              note: 'Welcome bonus for joining Clozari',
            }),
          ],
        };
        set((state) => ({ wallets: [...state.wallets, wallet] }));
        return wallet;
      },

      getWallet: (userId) => get().wallets.find((w) => w.userId === userId) || null,

      /** Add coins (never below zero, never NaN). */
      credit: (userId, coins, entry = {}) => {
        const amount = clampCoins(coins);
        if (!userId || amount <= 0) return 0;
        let credited = 0;
        set((state) => ({
          wallets: state.wallets.map((w) => {
            if (w.userId !== userId) return w;
            credited = amount;
            return {
              ...w,
              coins: clampCoins(w.coins + amount),
              transactions: [buildTx({ ...entry, coins: amount }), ...w.transactions],
            };
          }),
        }));
        return credited;
      },

      /**
       * Spend coins. Returns the amount actually deducted — never pushes the
       * balance below zero.
       */
      debit: (userId, coins, entry = {}) => {
        const requested = clampCoins(coins);
        if (!userId || requested <= 0) return 0;
        let deducted = 0;
        set((state) => ({
          wallets: state.wallets.map((w) => {
            if (w.userId !== userId) return w;
            deducted = Math.min(requested, w.coins);
            if (deducted <= 0) return w;
            return {
              ...w,
              coins: clampCoins(w.coins - deducted),
              transactions: [buildTx({ ...entry, coins: deducted }), ...w.transactions],
            };
          }),
        }));
        return deducted;
      },
    }),
    { name: WALLET_STORE_KEY, partialize: (state) => ({ wallets: state.wallets }) }
  )
);

export default useWalletStore;
