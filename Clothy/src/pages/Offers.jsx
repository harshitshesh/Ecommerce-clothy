/**
 * Offers Page — Searchable offer catalogue with filters, sorting and cart hand-off
 */
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, Check, Flame, Search, ArrowRight, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import CountdownTimer from '../components/ui/CountdownTimer';
import EmptyState from '../components/ui/EmptyState';
import ProductCard from '../components/ui/ProductCard';
import {
  OFFER_STATUS,
  getOfferStatus,
  daysUntilExpired,
  offerValueScore,
} from '../data/offers';
import useOffersStore from '../store/useOffersStore';
import products from '../data/products';
import useDebounce from '../hooks/useDebounce';
import useCartStore from '../store/useCartStore';
import { formatCurrency } from '../utils/formatCurrency';

const STATUS_FILTERS = [
  { value: 'all', label: 'All Status' },
  { value: OFFER_STATUS.ACTIVE, label: 'Active' },
  { value: OFFER_STATUS.EXPIRING, label: 'Expiring Soon' },
  { value: OFFER_STATUS.EXPIRED, label: 'Expired' },
];

const TYPE_FILTERS = [
  { value: 'all', label: 'All Types' },
  { value: 'percent', label: '% Off' },
  { value: 'flat', label: 'Flat Rs. Off' },
  { value: 'free-shipping', label: 'Free Shipping' },
];

const SORTS = [
  { value: 'value', label: 'Best Value' },
  { value: 'expiring', label: 'Expiring Soon' },
];

const STATUS_LABEL = {
  [OFFER_STATUS.ACTIVE]: { text: 'Active', className: 'bg-success/15 text-success border-success/30' },
  [OFFER_STATUS.EXPIRING]: { text: 'Expiring Soon', className: 'bg-error/15 text-error border-error/30' },
  [OFFER_STATUS.EXPIRED]: { text: 'Expired', className: 'bg-gray-100 dark:bg-gray-800 text-gray-400 border-gray-300 dark:border-gray-700' },
};

const valueLabel = (offer) => {
  if (offer.type === 'percent') return `${offer.value}% OFF`;
  if (offer.type === 'flat') return `${formatCurrency(offer.value)} OFF`;
  return 'FREE SHIPPING';
};

export default function Offers() {
  const navigate = useNavigate();
  const [copiedCode, setCopiedCode] = useState(null);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('value');
  const debouncedSearch = useDebounce(search, 300);
  const appliedOfferCode = useCartStore((state) => state.appliedOfferCode);
  const offers = useOffersStore((state) => state.offers);

  const offerCategories = useMemo(
    () => [...new Set(offers.flatMap((o) => o.categories || []))],
    [offers]
  );

  const saleProducts = products.filter((p) => p.discountPrice && p.discountPrice < p.price);

  const filteredOffers = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();

    const matches = offers.filter((offer) => {
      if (query) {
        const haystack = [
          offer.code,
          offer.title,
          offer.description,
          (offer.categories || []).join(' '),
          offer.categories?.length ? '' : 'sitewide',
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(query)) return false;
      }

      if (type !== 'all' && offer.type !== type) return false;

      if (category !== 'all') {
        const cats = (offer.categories || []).map((c) => c.toLowerCase());
        if (cats.length && !cats.includes(category.toLowerCase())) return false;
      }

      if (status !== 'all' && getOfferStatus(offer) !== status) return false;

      return true;
    });

    return matches.sort((a, b) => {
      if (sort === 'expiring') {
        const aTime = a.validTill ? new Date(a.validTill).getTime() : Infinity;
        const bTime = b.validTill ? new Date(b.validTill).getTime() : Infinity;
        return aTime - bTime;
      }
      return offerValueScore(b) - offerValueScore(a);
    });
  }, [debouncedSearch, type, category, status, sort]);

  const hasFilters =
    Boolean(debouncedSearch.trim()) || type !== 'all' || category !== 'all' || status !== 'all';

  const clearFilters = () => {
    setSearch('');
    setType('all');
    setCategory('all');
    setStatus('all');
    setSort('value');
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon code "${code}" copied!`, { icon: '✨' });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleUseInCart = (code) => {
    toast.success(`${code} will be applied in your bag`, { icon: '🛍️' });
    navigate(`/cart?offer=${code}`);
  };

  return (
    <div className="pt-24 sm:pt-28 pb-20">
      <div className="container-custom">
        {/* Breadcrumbs */}
        <div className="mb-4">
          <Breadcrumbs items={[{ label: 'Exclusive Offers' }]} />
        </div>

        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest text-gold font-bold block mb-2">
            Private Privileges
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal dark:text-cream mb-3">
            Seasonal Promotions
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            Take advantage of exclusive seasonal savings on limited-quantity tailored staples.
          </p>
        </div>

        {/* Search + Filters */}
        <div className="p-4 rounded-2xl bg-cream dark:bg-charcoal border border-gray-200/60 dark:border-gray-800 shadow-card mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="relative lg:col-span-2">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="SEARCH CODES, TITLES, CATEGORIES…"
                aria-label="Search offers"
                className="w-full pl-9 pr-3 py-2.5 text-xs tracking-wider bg-cream dark:bg-charcoal border border-gray-200 dark:border-gray-700 rounded-xl uppercase focus:outline-none focus:border-gold"
              />
            </div>

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              aria-label="Filter by offer type"
              className="px-3 py-2.5 text-xs font-semibold bg-cream dark:bg-charcoal border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-gold"
            >
              {TYPE_FILTERS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Filter by category"
              className="px-3 py-2.5 text-xs font-semibold bg-cream dark:bg-charcoal border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-gold"
            >
              <option value="all">All Categories</option>
              {offerCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <div className="grid grid-cols-2 gap-3">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                aria-label="Filter by status"
                className="px-3 py-2.5 text-xs font-semibold bg-cream dark:bg-charcoal border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-gold"
              >
                {STATUS_FILTERS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="Sort offers"
                className="px-3 py-2.5 text-xs font-semibold bg-cream dark:bg-charcoal border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-gold"
              >
                {SORTS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Result count + reset */}
        <div className="flex items-center justify-between mb-5 text-xs text-gray-500">
          <span>
            Showing <strong className="text-charcoal dark:text-cream">{filteredOffers.length}</strong>{' '}
            of {offers.length} offers
          </span>
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 font-semibold text-gold hover:underline"
            >
              <RotateCcw size={12} /> Clear filters
            </button>
          )}
        </div>

        {/* Offer cards */}
        {filteredOffers.length === 0 ? (
          <div className="rounded-2xl border border-gray-200/60 dark:border-gray-800 bg-cream dark:bg-charcoal mb-14">
            <EmptyState
              type="search"
              title="No Offers Match Those Filters"
              description="Try a different code, category or status to find a privilege that fits your bag."
              actionText="Clear Filters"
              onAction={clearFilters}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-14">
            {filteredOffers.map((offer) => {
              const offerStatus = getOfferStatus(offer);
              const badge = STATUS_LABEL[offerStatus];
              const days = daysUntilExpired(offer);
              const isApplied = appliedOfferCode === offer.code;
              const expired = offerStatus === OFFER_STATUS.EXPIRED;

              return (
                <div
                  key={offer.code}
                  className={`p-5 rounded-2xl bg-cream dark:bg-charcoal border shadow-card flex flex-col justify-between transition-all ${
                    expired
                      ? 'opacity-60 border-gray-200/60 dark:border-gray-800'
                      : isApplied
                        ? 'border-success/50 ring-1 ring-success/30'
                        : 'border-gray-200/60 dark:border-gray-800 hover:border-gold/60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${badge.className}`}
                      >
                        {badge.text}
                        {offerStatus === OFFER_STATUS.EXPIRING && days ? ` • ${days}d` : ''}
                      </span>
                      <span className="text-xs font-bold text-charcoal dark:text-cream">
                        {valueLabel(offer)}
                      </span>
                    </div>

                    <span className="font-mono text-sm font-bold text-gold tracking-widest bg-gold/10 px-2.5 py-1 rounded inline-block mb-3">
                      {offer.code}
                    </span>
                    <h3 className="font-serif font-bold text-base text-charcoal dark:text-cream mb-1">
                      {offer.title}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                      {offer.description}
                    </p>

                    <div className="text-[11px] text-gray-400 space-y-1">
                      <p>
                        Min. order {formatCurrency(offer.minOrder)} •{' '}
                        {offer.categories?.length ? offer.categories.join(', ') : 'Sitewide'}
                      </p>
                      <p>
                        {expired ? 'Expired on' : 'Valid until'}{' '}
                        {new Date(offer.validTill).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      type="button"
                      onClick={() => handleCopyCode(offer.code)}
                      className="flex-1 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-semibold hover:bg-cream-dark dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-1.5"
                    >
                      {copiedCode === offer.code ? (
                        <>
                          <Check size={13} className="text-success" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy size={13} /> Copy
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      disabled={expired}
                      onClick={() => handleUseInCart(offer.code)}
                      className="flex-1 py-2.5 rounded-lg bg-charcoal text-cream dark:bg-cream dark:text-charcoal text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {isApplied ? 'In Bag' : expired ? 'Expired' : 'Use in Cart'}
                      {!expired && <ArrowRight size={13} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Flash Sales Section */}
        <div className="mb-14">
          <h2 className="text-xs font-bold uppercase tracking-wider text-charcoal dark:text-cream mb-4 flex items-center gap-1.5">
            <Flame size={14} className="text-error" /> Limited Time Flash Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {offers.filter((o) => o.isFlashSale && o.validTill && getOfferStatus(o) !== OFFER_STATUS.EXPIRED).map((sale) => (
              <div
                key={sale.code}
                className="relative rounded-3xl overflow-hidden bg-charcoal text-cream p-6 sm:p-8 flex flex-col justify-between min-h-[260px] border border-gold/30 shadow-elevated"
              >
                <div className="absolute inset-0 opacity-25">
                  <img src={sale.image} alt="Sale Banner" className="w-full h-full object-cover" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/90 to-charcoal/70" />

                <div className="relative z-10">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-error bg-error/20 px-2 py-0.5 rounded-full inline-block mb-3">
                    Ending Soon
                  </span>
                  <h3 className="font-serif text-2xl font-bold mb-1">{sale.title}</h3>
                  <p className="text-xs text-gray-300 mb-4">{sale.subtitle}</p>
                  <CountdownTimer targetDate={sale.validTill} size="sm" />
                </div>

                <div className="relative z-10 pt-4 flex items-center justify-between border-t border-gray-800">
                  <span className="font-mono text-xs text-gold">Code: {sale.code}</span>
                  <button
                    onClick={() => handleUseInCart(sale.code)}
                    className="px-4 py-1.5 rounded-lg bg-gold text-white text-xs font-bold uppercase tracking-wider hover:bg-gold-dark transition-colors"
                  >
                    Claim Deal
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Discounted Product Grid */}
        <div>
          <div className="flex items-end justify-between pb-4 mb-8 border-b border-gray-200/60 dark:border-gray-800">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal dark:text-cream">
                All Promotional Pieces
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Showing {saleProducts.length} pieces on seasonal markdown
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {saleProducts.map((prod, idx) => (
              <ProductCard key={prod.id} product={prod} index={idx} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
