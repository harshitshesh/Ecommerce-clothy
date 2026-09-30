/**
 * PriceBreakdown — The single pricing presentation for cart, checkout,
 * order confirmation, order detail and the invoice. Driven entirely by
 * utils/pricing.calculatePricing (or pricingFromOrder for saved orders).
 */
import { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

const Row = ({ label, value, muted = false, negative = false, strong = false }) => (
  <div
    className={`flex justify-between gap-4 ${
      strong
        ? 'text-base font-bold text-charcoal dark:text-cream pt-3 border-t border-gray-200/60 dark:border-gray-800'
        : muted
          ? 'text-gray-500'
          : 'text-gray-600 dark:text-gray-300'
    }`}
  >
    <span>{label}</span>
    <span
      className={
        strong
          ? 'text-gold font-serif text-xl'
          : negative
            ? 'font-semibold text-success'
            : 'font-semibold text-charcoal dark:text-cream'
      }
    >
      {value}
    </span>
  </div>
);

export default function PriceBreakdown({ pricing, className = '', title = 'Order Breakdown' }) {
  const [gstOpen, setGstOpen] = useState(false);

  if (!pricing) return null;

  const {
    mrpTotal,
    productDiscount,
    subtotal,
    offerCode,
    offerDiscount,
    shipping,
    gstBreakdown,
    gstIncluded,
    grandTotal,
    walletCoinsUsed = 0,
    amountDue,
    totalSavings,
  } = pricing;

  return (
    <div className={`space-y-3 text-xs ${className}`}>
      {title && (
        <h3 className="font-serif font-bold text-lg text-charcoal dark:text-cream pb-3 border-b border-gray-200/60 dark:border-gray-800">
          {title}
        </h3>
      )}

      <Row label="MRP Total" value={formatCurrency(mrpTotal)} />
      <Row label="Product Discount" value={`-${formatCurrency(productDiscount)}`} negative={productDiscount > 0} />
      <Row label="Subtotal" value={formatCurrency(subtotal)} />

      {offerCode && (
        <Row
          label={`Offer ${offerCode}`}
          value={`-${formatCurrency(offerDiscount)}`}
          negative={offerDiscount > 0}
        />
      )}

      <Row label="Shipping" value={shipping === 0 ? 'FREE' : formatCurrency(shipping)} />

      {/* GST (inclusive) — expandable */}
      <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
        <button
          type="button"
          onClick={() => setGstOpen((open) => !open)}
          className="flex items-center gap-1.5 hover:text-gold transition-colors"
          aria-expanded={gstOpen}
        >
          <span>GST included</span>
          {gstOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
        <span className="font-semibold text-charcoal dark:text-cream">{formatCurrency(gstIncluded)}</span>
      </div>

      {gstOpen && (
        <div className="pl-3 border-l-2 border-gold/40 space-y-1.5 text-[11px] text-gray-500">
          {gstBreakdown.length === 0 && <span>No GST applies to this order.</span>}
          {gstBreakdown.map((bucket) => (
            <div key={bucket.rate} className="flex justify-between">
              <span>
                {bucket.rate}% on {formatCurrency(bucket.taxable)}
              </span>
              <span className="font-semibold">{formatCurrency(bucket.tax)}</span>
            </div>
          ))}
          <p className="flex items-start gap-1.5 pt-1">
            <Info size={12} className="mt-0.5 shrink-0" />
            <span>5% GST applies up to Rs. 2,500 per piece, 18% above.</span>
          </p>
        </div>
      )}

      {walletCoinsUsed > 0 && (
        <Row
          label="Wallet coins used"
          value={`-${formatCurrency(walletCoinsUsed)}`}
          negative
        />
      )}

      <Row label="Total Payable" value={formatCurrency(grandTotal)} strong />

      {walletCoinsUsed > 0 && (
        <div className="flex justify-between items-center p-2.5 rounded-xl bg-gold/10 border border-gold/30 text-gold text-xs font-bold">
          <span>Payable Now</span>
          <span>{formatCurrency(amountDue ?? grandTotal - walletCoinsUsed)}</span>
        </div>
      )}

      {totalSavings > 0 && (
        <div className="flex justify-between items-center p-2.5 rounded-xl bg-success/10 border border-success/30 text-success text-xs font-bold">
          <span>You saved</span>
          <span>{formatCurrency(totalSavings)}</span>
        </div>
      )}
    </div>
  );
}
