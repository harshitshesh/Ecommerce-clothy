/**
 * SortDropdown — Select control for sorting catalog products
 */
import { ArrowUpDown } from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Customer Rating' },
  { value: 'discount', label: 'Biggest Discount' },
];

export default function SortDropdown({ value, onChange }) {
  return (
    <div className="relative inline-flex items-center gap-2">
      <span className="text-xs text-gray-500 hidden sm:inline flex items-center gap-1">
        <ArrowUpDown size={13} /> Sort By:
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-xs font-semibold bg-cream dark:bg-charcoal text-charcoal dark:text-cream border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 cursor-pointer focus:outline-none focus:border-gold"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
