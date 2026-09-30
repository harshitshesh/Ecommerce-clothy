/**
 * SizeSelector — Size picker with size guide trigger and variant-level stock enforcement
 * In accordance with PRD 3.1 & 6.1:
 *  - Sizes with 0 stock are struck through, greyed out, and unclickable
 *  - Live stock indicators display for low stock (<= 5) or out-of-stock
 */
import { useState } from 'react';
import { Ruler, AlertCircle } from 'lucide-react';
import SizeGuideModal from './SizeGuideModal';

export default function SizeSelector({
  sizes = [],
  selectedSize,
  onSelectSize,
  stock = 10,
  stockMap = {},
}) {
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const getSizeStock = (size) => {
    if (Object.prototype.hasOwnProperty.call(stockMap, size)) {
      return Number(stockMap[size]) || 0;
    }
    return Number(stock) || 0;
  };

  const selectedSizeStock = selectedSize ? getSizeStock(selectedSize) : 0;

  return (
    <div>
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider mb-2.5">
        <span className="text-gray-500">
          Selected Size:{' '}
          <strong className="text-charcoal dark:text-cream">
            {selectedSize || 'None chosen'}
          </strong>
        </span>
        <button
          type="button"
          onClick={() => setIsGuideOpen(true)}
          className="text-gold hover:underline flex items-center gap-1 normal-case font-medium"
        >
          <Ruler size={13} /> Size Guide
        </button>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {sizes.map((s) => {
          const sStock = getSizeStock(s);
          const isOutOfStock = sStock <= 0;
          const isSelected = selectedSize === s;

          return (
            <button
              key={s}
              type="button"
              disabled={isOutOfStock}
              onClick={() => !isOutOfStock && onSelectSize(s)}
              title={isOutOfStock ? `Size ${s} is out of stock` : `Size ${s} (${sStock} available)`}
              className={`relative min-w-[46px] h-11 px-3 text-xs font-bold rounded-xl uppercase tracking-wider border transition-all ${
                isOutOfStock
                  ? 'opacity-35 bg-gray-100 dark:bg-gray-800/60 text-gray-400 line-through cursor-not-allowed border-dashed border-gray-300 dark:border-gray-700 select-none'
                  : isSelected
                    ? 'bg-charcoal text-cream dark:bg-cream dark:text-charcoal border-transparent shadow-soft scale-102 ring-2 ring-gold/40'
                    : 'border-gray-200 dark:border-gray-700 text-charcoal dark:text-cream hover:border-gold bg-cream/30 dark:bg-charcoal-light/30'
              }`}
            >
              {s}
            </button>
          );
        })}
      </div>

      {selectedSize && selectedSizeStock === 0 && (
        <p className="flex items-center gap-1.5 text-[11px] text-error font-semibold mt-2">
          <AlertCircle size={13} /> Size {selectedSize} is currently out of stock. Please pick another size.
        </p>
      )}

      {selectedSize && selectedSizeStock > 0 && selectedSizeStock <= 5 && (
        <p className="text-[11px] text-warning font-semibold mt-2">
          Only {selectedSizeStock} item{selectedSizeStock === 1 ? '' : 's'} left in size {selectedSize} — order soon!
        </p>
      )}

      {/* Size Guide Modal */}
      <SizeGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </div>
  );
}
