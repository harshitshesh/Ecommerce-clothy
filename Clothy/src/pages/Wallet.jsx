/**
 * Clozari Wallet — balance, how it works and the full coin transaction history.
 * 1 coin = Rs. 1 · earn 1 coin per Rs. 100 paid · never goes negative.
 */
import { Link } from 'react-router-dom';
import { Coins, Gift, ShoppingBag, TrendingUp, Wallet as WalletIcon } from 'lucide-react';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import useAuthStore from '../store/useAuthStore';
import useWallet from '../hooks/useWallet';
import { COIN_VALUE_IN_RUPEES, RUPEES_PER_COIN_EARNED, WELCOME_BONUS_COINS } from '../utils/wallet';
import { formatCurrency } from '../utils/formatCurrency';

const TX_META = {
  earned: { label: 'Earned', className: 'text-success bg-success/10', sign: '+' },
  spent: { label: 'Spent', className: 'text-error bg-error/10', sign: '−' },
  refunded: { label: 'Refunded', className: 'text-info bg-info/10', sign: '+' },
  reversed: { label: 'Reversed', className: 'text-warning bg-warning/10', sign: '−' },
  bonus: { label: 'Bonus', className: 'text-gold bg-gold/10', sign: '+' },
};

const HOW_IT_WORKS = [
  {
    icon: Gift,
    title: `${WELCOME_BONUS_COINS}-coin welcome bonus`,
    text: 'Every new account starts with coins so the wallet can be used straight away.',
  },
  {
    icon: TrendingUp,
    title: `Earn 1 coin per Rs. ${RUPEES_PER_COIN_EARNED} paid`,
    text: 'Credited the moment your order is placed, on the amount you actually paid.',
  },
  {
    icon: ShoppingBag,
    title: 'Spend at checkout',
    text: 'Switch on "Use wallet coins" on the payment step — pay partially or in full.',
  },
];

export default function Wallet() {
  const session = useAuthStore((s) => s.session);
  const { coins, transactions } = useWallet(session?.id);

  return (
    <div className="pt-24 sm:pt-28 pb-20">
      <div className="container-custom max-w-4xl">
        <div className="mb-4">
          <Breadcrumbs
            items={[
              { label: 'My Account', path: '/account' },
              { label: 'Clozari Wallet' },
            ]}
          />
        </div>

        <div className="flex items-end justify-between pb-6 mb-8 border-b border-gray-200/60 dark:border-gray-800">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal dark:text-cream">
              Clozari Wallet
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Coins you earn, spend and get back — 1 coin = Rs. {COIN_VALUE_IN_RUPEES}
            </p>
          </div>
        </div>

        {/* Balance + how it works */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="md:col-span-1 p-6 rounded-2xl bg-charcoal text-cream border border-gold/40 shadow-elevated flex flex-col justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-gold font-bold">
                <WalletIcon size={12} /> Available balance
              </span>
              <div className="flex items-end gap-2 mt-3">
                <Coins size={30} className="text-gold" />
                <span className="font-serif text-4xl font-bold leading-none">{coins}</span>
                <span className="text-xs text-gray-300 pb-1">coins</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-2">
                Worth {formatCurrency(coins * COIN_VALUE_IN_RUPEES)}
              </p>
            </div>

            <Link
              to="/checkout"
              className="mt-6 px-4 py-3 bg-gold text-white rounded-xl text-xs font-bold uppercase tracking-widest text-center hover:bg-gold-dark transition-colors"
            >
              Use at Checkout
            </Link>
          </div>

          <div className="md:col-span-2 p-6 rounded-2xl bg-cream dark:bg-charcoal border border-gray-200/60 dark:border-gray-800 shadow-card">
            <h2 className="font-serif font-bold text-lg text-charcoal dark:text-cream pb-3 mb-4 border-b border-gray-200/60 dark:border-gray-800">
              How it works
            </h2>
            <div className="space-y-4">
              {HOW_IT_WORKS.map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.title} className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-lg bg-gold/10 text-gold flex items-center justify-center shrink-0">
                      <Icon size={15} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-charcoal dark:text-cream">
                        {step.title}
                      </p>
                      <p className="text-[11px] text-gray-500 leading-relaxed">{step.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Transaction history */}
        <div className="bg-cream dark:bg-charcoal rounded-2xl border border-gray-200/60 dark:border-gray-800 shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200/60 dark:border-gray-800">
            <h2 className="font-serif font-bold text-lg text-charcoal dark:text-cream">
              Transaction History
            </h2>
            <span className="text-xs text-gray-400">{transactions.length} entries</span>
          </div>

          {transactions.length === 0 ? (
            <p className="p-8 text-center text-xs text-gray-500">
              No coin activity yet — place your first order to start earning.
            </p>
          ) : (
            <div className="divide-y divide-gray-200/50 dark:divide-gray-800">
              {transactions.map((tx) => {
                const meta = TX_META[tx.type] || TX_META.earned;
                return (
                  <div
                    key={tx.id}
                    className="px-6 py-4 flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${meta.className}`}
                        >
                          {meta.label}
                        </span>
                        {tx.orderId && (
                          <Link
                            to={`/account/orders/${tx.orderId}`}
                            className="font-mono text-[11px] text-gold hover:underline"
                          >
                            {tx.orderId}
                          </Link>
                        )}
                      </div>
                      <p className="text-xs text-charcoal dark:text-cream mt-1 line-clamp-1">
                        {tx.note}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {new Date(tx.date).toLocaleString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <span
                      className={`font-bold text-sm shrink-0 ${
                        meta.sign === '+' ? 'text-success' : 'text-error'
                      }`}
                    >
                      {meta.sign}
                      {tx.coins} coins
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
