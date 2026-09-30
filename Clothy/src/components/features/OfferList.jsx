/**
 * OfferList — Available offers for the current cart.
 * Shows Apply, Applied, "Add Rs X more" or reason-based disabled states.
 */
import { useMemo } from 'react';
import { Check, Clock, Percent, Tag, Truck } from 'lucide-react';
import toast from 'react-hot-toast';
import offers, { getOfferStatus, daysUntilExpired, offerValueScore } from '../../data/offers';
import { evaluateOffer } from '../../utils/pricing';
import useCartStore from '../../store/useCartStore';
import { formatCurrency } from '../../utils/formatCurrency';

const OFFER_ICON = {
  percent: Percent,
  flat: Tag,
  'free-shipping': Truck,
};

export default function OfferList({ className = '' }) {
  const items = useCartStore((state) => state.items);
  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + (it.price || 0) * (it.quantity || 1), 0),
    [items]
  );
  const appliedOfferCode = useCartStore((state) => state.appliedOfferCode);
  const applyOffer = useCartStore((state) => state.applyOffer);

  const rows = useMemo(() => {
    return offers
      .map((offer) => {
        const status = getOfferStatus(offer);
        const evaluation = evaluateOffer(offer, { subtotal, items });
        return { offer, status, evaluation };
      })
      .sort((a, b) => {
        if (a.evaluation.ok !== b.evaluation.ok) return a.evaluation.ok ? -1 : 1;
        return offerValueScore(b.offer) - offerValueScore(a.offer);
      });
  }, [items, subtotal]);

  const bestCode = rows.find(
    (row) => row.evaluation.ok && row.status !== 'expired'
  )?.offer.code;

  const handleApply = (code) => {
    const res = applyOffer(code);
    if (res.success) toast.success(res.message, { icon: '🎉' });
    else toast.error(res.message);
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
          Available Offers
        </span>
        <span className="text-[11px] text-gray-400">{rows.length} deals</span>
      </div>

      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {rows.map(({ offer, status, evaluation }) => {
          const Icon = OFFER_ICON[offer.type] || Tag;
          const applied = appliedOfferCode === offer.code;
          const expired = status === 'expired';
          const days = daysUntilExpired(offer);

          let action;
          if (applied) {
            action = (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-success/15 text-success text-[10px] font-bold uppercase tracking-wider">
                <Check size={12} /> Applied
              </span>
            );
          } else if (expired) {
            action = (
              <span className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                Expired
              </span>
            );
          } else if (!evaluation.ok && evaluation.reason === 'min-order') {
            action = (
              <button
                type="button"
                onClick={() => handleApply(offer.code)}
                className="px-3 py-1.5 rounded-lg border border-gold/50 text-gold text-[10px] font-bold uppercase tracking-wider hover:bg-gold/10 transition-colors"
                title={evaluation.message}
              >
                Add {formatCurrency(evaluation.shortfall)} more
              </button>
            );
          } else if (!evaluation.ok) {
            action = (
              <span
                className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 text-[10px] font-bold uppercase tracking-wider cursor-not-allowed"
                title={evaluation.message}
              >
                Not eligible
              </span>
            );
          } else {
            action = (
              <button
                type="button"
                onClick={() => handleApply(offer.code)}
                className="px-3 py-1.5 rounded-lg bg-charcoal text-cream dark:bg-cream dark:text-charcoal text-[10px] font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
              >
                Apply
              </button>
            );
          }

          return (
            <div
              key={offer.code}
              className={`flex items-center gap-3 p-3 rounded-xl border text-xs transition-colors ${
                applied
                  ? 'border-success/40 bg-success/5'
                  : expired
                    ? 'border-gray-200/60 dark:border-gray-800 opacity-60'
                    : 'border-gray-200/60 dark:border-gray-800 hover:border-gold/50'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-gold/10 text-gold flex items-center justify-center shrink-0">
                <Icon size={15} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold tracking-widest text-charcoal dark:text-cream">
                    {offer.code}
                  </span>
                  {offer.code === bestCode && !applied && !expired && (
                    <span className="px-2 py-0.5 rounded-full bg-gold text-white text-[9px] font-bold uppercase tracking-wider">
                      Best for you
                    </span>
                  )}
                  {status === 'expiring-soon' && (
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase text-error">
                      <Clock size={10} /> {days}d left
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-500 truncate">{offer.description}</p>
                {offer.minOrder > 0 && (
                  <p className="text-[10px] text-gray-400">
                    Min. order {formatCurrency(offer.minOrder)}
                    {offer.categories?.length ? ` • ${offer.categories.join(', ')}` : ' • Sitewide'}
                  </p>
                )}
              </div>

              {action}
            </div>
          );
        })}
      </div>
    </div>
  );
}
