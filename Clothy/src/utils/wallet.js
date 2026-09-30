/**
 * Clozari Wallet — the single place every coin rule is configured.
 *
 * Rules:
 *  1 coin = Rs. 1
 *  Earn 1 coin for every Rs. 100 paid (on the amount actually paid)
 *  Every new account receives a welcome bonus so the wallet can be demoed
 *  Coins can never go negative.
 */
export const WALLET_STORE_KEY = 'clozari-wallets';
export const COIN_VALUE_IN_RUPEES = 1;
export const RUPEES_PER_COIN_EARNED = 100;
export const WELCOME_BONUS_COINS = 50;

/** Rupees paid -> coins earned (whole coins only). */
export const coinsEarnedFor = (rupeesPaid) =>
  Math.max(0, Math.floor((Number(rupeesPaid) || 0) / RUPEES_PER_COIN_EARNED));

/** Coins -> rupees they are worth (1 coin = Re. 1). */
export const coinsToRupees = (coins) =>
  Math.max(0, Number(coins) || 0) * COIN_VALUE_IN_RUPEES;

/** Never allow a balance below zero. */
export const clampCoins = (coins) => Math.max(0, Math.round(Number(coins) || 0));

export const WALLET_TX_TYPES = {
  EARNED: 'earned',
  SPENT: 'spent',
  REFUNDED: 'refunded',
  REVERSED: 'reversed',
  BONUS: 'bonus',
};

export default coinsEarnedFor;
