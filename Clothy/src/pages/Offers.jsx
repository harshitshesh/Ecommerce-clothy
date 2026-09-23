/**
 * Offers Page — Curated seasonal campaigns, active coupons, and discounted collections
 */
import { useState } from 'react';
import { Copy, Check, Flame, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import CountdownTimer from '../components/ui/CountdownTimer';
import ProductCard from '../components/ui/ProductCard';
import offers, { coupons } from '../data/offers';
import products from '../data/products';

export default function Offers() {
  const [copiedCode, setCopiedCode] = useState(null);

  const saleProducts = products.filter((p) => p.discountPrice && p.discountPrice < p.price);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon code "${code}" copied!`, { icon: '✨' });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="pt-24 sm:pt-28 pb-20">
      <div className="container-custom">
        {/* Breadcrumbs */}
        <div className="mb-4">
          <Breadcrumbs items={[{ label: 'Exclusive Offers' }]} />
        </div>

        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
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

        {/* Active Promotional Coupons Cards */}
        <div className="mb-14">
          <h2 className="text-xs font-bold uppercase tracking-wider text-charcoal dark:text-cream mb-4 flex items-center gap-1.5">
            <Tag size={14} className="text-gold" /> Active Promo Codes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(coupons).map(([code, details]) => (
              <div
                key={code}
                className="p-5 rounded-2xl bg-cream dark:bg-charcoal border border-gray-200/60 dark:border-gray-800 shadow-card flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm font-bold text-gold tracking-widest bg-gold/10 px-2.5 py-1 rounded">
                      {code}
                    </span>
                    <span className="text-xs font-bold text-charcoal dark:text-cream">
                      {details.type === 'percentage' ? `${details.discount}% OFF` : `₹${details.discount} OFF`}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">
                    {details.description}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    Min order: ₹{details.minOrder.toLocaleString('en-IN')}
                  </p>
                </div>

                <button
                  onClick={() => handleCopyCode(code)}
                  className="mt-4 w-full py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-semibold hover:bg-cream-dark dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-1.5"
                >
                  {copiedCode === code ? (
                    <>
                      <Check size={13} className="text-success" /> Code Copied
                    </>
                  ) : (
                    <>
                      <Copy size={13} /> Copy Code
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Flash Sales Section */}
        <div className="mb-14">
          <h2 className="text-xs font-bold uppercase tracking-wider text-charcoal dark:text-cream mb-4 flex items-center gap-1.5">
            <Flame size={14} className="text-error" /> Limited Time Flash Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {offers.filter((o) => o.endsAt).map((sale) => (
              <div
                key={sale.id}
                className="relative rounded-3xl overflow-hidden bg-charcoal text-cream p-6 sm:p-8 flex flex-col justify-between min-h-[260px] border border-gold/30 shadow-elevated"
              >
                <div className="absolute inset-0 opacity-25">
                  <img src={sale.image} alt={sale.title} className="w-full h-full object-cover" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/90 to-charcoal/70" />

                <div className="relative z-10">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-error bg-error/20 px-2 py-0.5 rounded-full inline-block mb-3">
                    Ending Soon
                  </span>
                  <h3 className="font-serif text-2xl font-bold mb-1">{sale.title}</h3>
                  <p className="text-xs text-gray-300 mb-4">{sale.subtitle}</p>
                  <CountdownTimer targetDate={sale.endsAt} size="sm" />
                </div>

                <div className="relative z-10 pt-4 flex items-center justify-between border-t border-gray-800">
                  <span className="font-mono text-xs text-gold">Code: {sale.code}</span>
                  <button
                    onClick={() => handleCopyCode(sale.code)}
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
