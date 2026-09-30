import { useMemo } from 'react';
import useCartStore from '../store/useCartStore';
import { calculatePricing } from '../utils/pricing';

/**
 * Live pricing for the current cart.
 * Memoised so React never sees a brand-new object on every store tick.
 *
 * @param {number} extraShipping express shipping surcharge
 * @param {number} walletCoinsUsed Clozari Wallet coins applied at payment
 */
export default function usePricing(extraShipping = 0, walletCoinsUsed = 0) {
  const items = useCartStore((state) => state.items);
  const offerCode = useCartStore((state) => state.appliedOfferCode);

  return useMemo(
    () => calculatePricing({ items, offerCode, extraShipping, walletCoinsUsed }),
    [items, offerCode, extraShipping, walletCoinsUsed]
  );
}
