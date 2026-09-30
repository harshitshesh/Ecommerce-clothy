import { useEffect } from 'react';
import useWalletStore from '../store/useWalletStore';

/**
 * Reactive wallet for a user: guarantees the wallet exists (welcome bonus is
 * issued exactly once, on first touch) and returns its balance + history.
 */
export default function useWallet(userId) {
  const wallets = useWalletStore((state) => state.wallets);
  const ensureWallet = useWalletStore((state) => state.ensureWallet);

  useEffect(() => {
    if (userId) ensureWallet(userId);
  }, [userId, ensureWallet]);

  const wallet = userId ? wallets.find((w) => w.userId === userId) : null;

  return {
    wallet,
    coins: wallet?.coins ?? 0,
    transactions: wallet?.transactions ?? [],
  };
}
