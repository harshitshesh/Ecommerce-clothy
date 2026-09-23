/**
 * SizeSelector — Size picker with size guide trigger and stock warnings
 */
import { useState } from 'react';
import { Ruler } from 'lucide-react';
import SizeGuideModal from './SizeGuideModal';

export default function SizeSelector({ sizes = [], selectedSize, onSelectSize, stock = 10 }) {
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider mb-2.5">
        <span className="text-gray-500">
          Selected Size: <strong className="text-charcoal dark:text-cream">{selectedSize}</strong>
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
          const isSelected = selectedSize === s;
          return (
            <button
              key={s}
              type="button"
              onClick={() => onSelectSize(s)}
              className={`min-w-[46px] h-11 px-3 text-xs font-bold rounded-xl uppercase tracking-wider border transition-all ${
                isSelected
                  ? 'bg-charcoal text-cream dark:bg-cream dark:text-charcoal border-transparent shadow-soft scale-102'
                  : 'border-gray-200 dark:border-gray-700 text-charcoal dark:text-cream hover:border-gold'
              }`}
            >
              {s}
            </button>
          );
        })}
      </div>

      {stock <= 5 && stock > 0 && (
        <p className="text-[11px] text-warning font-semibold mt-2">
          Only {stock} items left in this size — order soon!
        </p>
      )}

      {/* Size Guide Modal */}
      <SizeGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </div>
  );
}
