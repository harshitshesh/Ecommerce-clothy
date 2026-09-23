/**
 * Search Page — Comprehensive search results page with direct query modification
 */
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, X } from 'lucide-react';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import ProductCard from '../components/ui/ProductCard';
import SortDropdown from '../components/features/SortDropdown';
import EmptyState from '../components/ui/EmptyState';
import products from '../data/products';

const POPULAR_TAGS = ['Shirts', 'Jackets', 'Dresses', 'Denim', 'Oversized', 'Linen'];

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ q: query.trim() });
  };

  const matchingProducts = useMemo(() => {
    const q = (searchParams.get('q') || '').toLowerCase().trim();
    if (!q) return [];

    const list = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.description.toLowerCase().includes(q)
    );

    switch (sortBy) {
      case 'newest':
        return list.filter((p) => p.tags.includes('new')).concat(list.filter((p) => !p.tags.includes('new')));
      case 'price-low':
        return list.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
      case 'price-high':
        return list.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
      case 'rating':
        return list.sort((a, b) => b.rating - a.rating);
      case 'discount':
        return list.sort((a, b) => {
          const discA = a.discountPrice ? (a.price - a.discountPrice) / a.price : 0;
          const discB = b.discountPrice ? (b.price - b.discountPrice) / b.price : 0;
          return discB - discA;
        });
      case 'featured':
      default:
        return list;
    }
  }, [searchParams, sortBy]);

  const activeQuery = searchParams.get('q') || '';

  return (
    <div className="pt-24 sm:pt-28 pb-20">
      <div className="container-custom">
        {/* Breadcrumbs */}
        <div className="mb-4">
          <Breadcrumbs
            items={[
              { label: 'Search' },
              ...(activeQuery ? [{ label: `"${activeQuery}"` }] : []),
            ]}
          />
        </div>

        {/* Search Bar Input Container */}
        <div className="max-w-2xl mx-auto my-8">
          <form onSubmit={handleSearch} className="relative">
            <SearchIcon
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search garments, categories, fabrics..."
              className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-cream dark:bg-charcoal border border-gray-200 dark:border-gray-700 text-charcoal dark:text-cream text-sm focus:outline-none focus:border-gold shadow-card"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-charcoal dark:hover:text-cream"
              >
                <X size={18} />
              </button>
            )}
          </form>

          {/* Quick Tag Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            <span className="text-xs text-gray-400">Trending:</span>
            {POPULAR_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setQuery(tag);
                  setSearchParams({ q: tag });
                }}
                className="px-3 py-1 rounded-full text-xs bg-cream-dark dark:bg-gray-800 text-charcoal dark:text-cream hover:bg-gold/20 hover:text-gold transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Results Header */}
        {activeQuery && (
          <div className="flex items-center justify-between pb-6 mb-8 border-b border-gray-200/60 dark:border-gray-800">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal dark:text-cream">
                Results for &ldquo;{activeQuery}&rdquo;
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                {matchingProducts.length} matching pieces discovered
              </p>
            </div>
            {matchingProducts.length > 0 && (
              <SortDropdown value={sortBy} onChange={setSortBy} />
            )}
          </div>
        )}

        {/* Results Grid / Empty State */}
        {!activeQuery ? (
          <div className="text-center py-16 text-gray-500 text-sm">
            Enter a search term above to explore our tailored wardrobe catalogue.
          </div>
        ) : matchingProducts.length === 0 ? (
          <EmptyState
            type="search"
            title={`No results found for "${activeQuery}"`}
            description="Try exploring another term or browse our complete clothing collections."
            actionText="View Complete Collection"
            actionHref="/shop"
          />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {matchingProducts.map((prod, idx) => (
              <ProductCard key={prod.id} product={prod} index={idx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
