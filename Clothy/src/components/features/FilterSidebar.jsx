/**
 * FilterSidebar — Multi-facet filter for catalog browsing
 * Supports Categories, Price, Size, Color, Stock, and Sale toggles
 */
import { X, RotateCcw } from 'lucide-react';
import categories from '../../data/categories';

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const AVAILABLE_COLORS = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Beige', hex: '#D2B48C' },
  { name: 'Navy', hex: '#000080' },
  { name: 'Brown', hex: '#8B4513' },
  { name: 'Olive', hex: '#556B2F' },
  { name: 'Burgundy', hex: '#800020' },
];

const PRICE_RANGES = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under ₹2,000', min: 0, max: 2000 },
  { label: '₹2,000 – ₹4,000', min: 2000, max: 4000 },
  { label: '₹4,000 – ₹7,000', min: 4000, max: 7000 },
  { label: 'Above ₹7,000', min: 7000, max: Infinity },
];

export default function FilterSidebar({
  filters,
  setFilters,
  onReset,
  isMobile = false,
  onCloseMobile,
}) {
  const handleCategoryToggle = (slug) => {
    const current = filters.categories || [];
    const next = current.includes(slug)
      ? current.filter((c) => c !== slug)
      : [...current, slug];
    setFilters({ ...filters, categories: next });
  };

  const handleSizeToggle = (size) => {
    const current = filters.sizes || [];
    const next = current.includes(size)
      ? current.filter((s) => s !== size)
      : [...current, size];
    setFilters({ ...filters, sizes: next });
  };

  const handleColorToggle = (colorName) => {
    const current = filters.colors || [];
    const next = current.includes(colorName)
      ? current.filter((c) => c !== colorName)
      : [...current, colorName];
    setFilters({ ...filters, colors: next });
  };

  const handlePriceSelect = (range) => {
    setFilters({ ...filters, priceRange: range });
  };

  const handleToggle = (key) => {
    setFilters({ ...filters, [key]: !filters[key] });
  };

  const hasActiveFilters =
    (filters.categories?.length > 0) ||
    (filters.sizes?.length > 0) ||
    (filters.colors?.length > 0) ||
    (filters.priceRange && filters.priceRange.label !== 'All Prices') ||
    filters.inStockOnly ||
    filters.onSaleOnly;

  return (
    <div className={`space-y-7 ${isMobile ? 'p-6' : ''}`}>
      {/* Top Mobile Bar */}
      {isMobile && (
        <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
          <h3 className="font-serif text-lg font-bold text-charcoal dark:text-cream">
            Filters
          </h3>
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-full text-gray-400 hover:text-charcoal dark:hover:text-cream"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* Reset Button */}
      {hasActiveFilters && (
        <button
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-error bg-error/10 hover:bg-error/15 rounded-lg transition-colors"
        >
          <RotateCcw size={13} /> Reset All Filters
        </button>
      )}

      {/* Categories */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal dark:text-cream mb-3">
          Categories
        </h4>
        <div className="space-y-2">
          {categories.map((cat) => {
            const isChecked = filters.categories?.includes(cat.slug);
            return (
              <label
                key={cat.id}
                className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-300 hover:text-charcoal dark:hover:text-cream cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleCategoryToggle(cat.slug)}
                    className="w-3.5 h-3.5 rounded border-gray-300 accent-gold text-gold"
                  />
                  <span>{cat.name}</span>
                </div>
                <span className="text-[10px] text-gray-400">({cat.productCount})</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal dark:text-cream mb-3">
          Price
        </h4>
        <div className="space-y-2">
          {PRICE_RANGES.map((range, idx) => {
            const isSelected =
              filters.priceRange?.label === range.label ||
              (!filters.priceRange && idx === 0);
            return (
              <label
                key={range.label}
                className="flex items-center gap-2.5 text-xs text-gray-600 dark:text-gray-300 hover:text-charcoal dark:hover:text-cream cursor-pointer"
              >
                <input
                  type="radio"
                  name="priceRange"
                  checked={isSelected}
                  onChange={() => handlePriceSelect(range)}
                  className="w-3.5 h-3.5 accent-gold text-gold"
                />
                <span>{range.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal dark:text-cream mb-3">
          Sizes
        </h4>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_SIZES.map((size) => {
            const isSelected = filters.sizes?.includes(size);
            return (
              <button
                key={size}
                onClick={() => handleSizeToggle(size)}
                className={`w-9 h-9 rounded-lg text-xs font-bold uppercase border transition-all ${
                  isSelected
                    ? 'bg-charcoal text-cream dark:bg-cream dark:text-charcoal border-transparent shadow-sm'
                    : 'border-gray-200 dark:border-gray-700 text-charcoal dark:text-cream hover:border-gold'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Colors */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal dark:text-cream mb-3">
          Colors
        </h4>
        <div className="flex flex-wrap gap-2.5">
          {AVAILABLE_COLORS.map((c) => {
            const isSelected = filters.colors?.includes(c.name);
            return (
              <button
                key={c.name}
                onClick={() => handleColorToggle(c.name)}
                className={`w-7 h-7 rounded-full border transition-all ${
                  isSelected
                    ? 'ring-2 ring-gold ring-offset-2 scale-110'
                    : 'border-gray-300 dark:border-gray-700 opacity-80 hover:opacity-100'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            );
          })}
        </div>
      </div>

      {/* Toggles */}
      <div className="pt-4 border-t border-gray-200/60 dark:border-gray-800 space-y-3">
        <label className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-300 cursor-pointer">
          <span>In Stock Only</span>
          <input
            type="checkbox"
            checked={!!filters.inStockOnly}
            onChange={() => handleToggle('inStockOnly')}
            className="w-4 h-4 accent-gold"
          />
        </label>
        <label className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-300 cursor-pointer">
          <span>On Sale Only</span>
          <input
            type="checkbox"
            checked={!!filters.onSaleOnly}
            onChange={() => handleToggle('onSaleOnly')}
            className="w-4 h-4 accent-gold"
          />
        </label>
      </div>

      {/* Apply button for mobile */}
      {isMobile && (
        <button
          onClick={onCloseMobile}
          className="w-full py-3 bg-charcoal text-cream dark:bg-cream dark:text-charcoal rounded-xl text-xs font-bold uppercase tracking-wider shadow-soft"
        >
          View Results
        </button>
      )}
    </div>
  );
}
