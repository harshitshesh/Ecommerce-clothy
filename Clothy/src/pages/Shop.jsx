/**
 * Shop Page — Full catalog browsing with multi-facet filters & sorting
 */
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import ProductCard from '../components/ui/ProductCard';
import EmptyState from '../components/ui/EmptyState';
import FilterSidebar from '../components/features/FilterSidebar';
import SortDropdown from '../components/features/SortDropdown';
import products from '../data/products';
import categories from '../data/categories';

const ITEMS_PER_PAGE = 12;

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Initialize filters from query params
  const initialCategory = searchParams.get('category');
  const initialTag = searchParams.get('tag');

  const [filters, setFilters] = useState({
    categories: initialCategory ? [initialCategory] : [],
    sizes: [],
    colors: [],
    priceRange: { label: 'All Prices', min: 0, max: Infinity },
    inStockOnly: false,
    onSaleOnly: false,
    tag: initialTag || null,
  });

  const [sortBy, setSortBy] = useState('featured');

  // Sync when URL params change
  useEffect(() => {
    const cat = searchParams.get('category');
    const t = searchParams.get('tag');
    if (cat) {
      setFilters((prev) => ({ ...prev, categories: [cat] }));
    }
    if (t) {
      setFilters((prev) => ({ ...prev, tag: t }));
    }
  }, [searchParams]);

  // Reset all filters
  const handleResetFilters = () => {
    setFilters({
      categories: [],
      sizes: [],
      colors: [],
      priceRange: { label: 'All Prices', min: 0, max: Infinity },
      inStockOnly: false,
      onSaleOnly: false,
      tag: null,
    });
    setSearchParams({});
    setCurrentPage(1);
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (
        filters.categories?.length > 0 &&
        !filters.categories.includes(p.category.toLowerCase())
      ) {
        return false;
      }

      // Tag filter (e.g. 'new', 'bestseller')
      if (filters.tag && !p.tags?.includes(filters.tag)) {
        return false;
      }

      // Sizes filter
      if (filters.sizes?.length > 0) {
        const hasSize = p.sizes?.some((s) => filters.sizes.includes(s));
        if (!hasSize) return false;
      }

      // Colors filter
      if (filters.colors?.length > 0) {
        const hasColor = p.colors?.some((c) => filters.colors.includes(c.name));
        if (!hasColor) return false;
      }

      // Price Range filter
      const price = p.discountPrice || p.price;
      if (filters.priceRange) {
        if (price < filters.priceRange.min || price > filters.priceRange.max) {
          return false;
        }
      }

      // In Stock filter
      if (filters.inStockOnly && p.stock <= 0) {
        return false;
      }

      // On Sale filter
      if (filters.onSaleOnly && (!p.discountPrice || p.discountPrice >= p.price)) {
        return false;
      }

      return true;
    });
  }, [filters]);

  // Sort logic
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
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
  }, [filteredProducts, sortBy]);

  // Pagination slice
  const paginatedProducts = sortedProducts.slice(0, currentPage * ITEMS_PER_PAGE);
  const hasMore = paginatedProducts.length < sortedProducts.length;

  return (
    <div className="pt-24 sm:pt-28 pb-16">
      <div className="container-custom">
        {/* Breadcrumbs */}
        <div className="mb-4">
          <Breadcrumbs
            items={[
              { label: 'Shop', path: '/shop' },
              ...(filters.categories?.[0]
                ? [{ label: filters.categories[0].toUpperCase() }]
                : []),
            ]}
          />
        </div>

        {/* Page Title & Count */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 mb-8 border-b border-gray-200/60 dark:border-gray-800">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal dark:text-cream">
              {filters.categories?.[0]
                ? categories.find((c) => c.slug === filters.categories[0])?.name || 'Collection'
                : filters.tag === 'new'
                ? 'New Arrivals'
                : filters.tag === 'bestseller'
                ? 'Signature Bestsellers'
                : 'The Complete Wardrobe'}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              Showing {paginatedProducts.length} of {sortedProducts.length} architectural garments
            </p>
          </div>

          {/* Quick Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 mt-4 md:mt-0 no-scrollbar">
            <button
              onClick={() => setFilters({ ...filters, categories: [] })}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                filters.categories?.length === 0
                  ? 'bg-charcoal text-cream dark:bg-cream dark:text-charcoal'
                  : 'bg-cream-dark dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-gold'
              }`}
            >
              All Pieces
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilters({ ...filters, categories: [cat.slug] })}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  filters.categories?.includes(cat.slug)
                    ? 'bg-charcoal text-cream dark:bg-cream dark:text-charcoal'
                    : 'bg-cream-dark dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-gold'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Bar Controls & Sort */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden inline-flex items-center gap-2 px-4 py-2 bg-cream-dark dark:bg-gray-800 rounded-lg text-xs font-bold uppercase tracking-wider text-charcoal dark:text-cream"
          >
            <SlidersHorizontal size={14} />
            <span>Filters</span>
          </button>

          <div className="hidden lg:block text-xs font-semibold uppercase tracking-wider text-gray-400">
            Refine Catalog
          </div>

          <SortDropdown value={sortBy} onChange={setSortBy} />
        </div>

        {/* Active Filter Chips */}
        {(filters.categories?.length > 0 ||
          filters.sizes?.length > 0 ||
          filters.colors?.length > 0 ||
          filters.tag ||
          (filters.priceRange && filters.priceRange.label !== 'All Prices')) && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs text-gray-400 mr-1">Active:</span>

            {filters.categories?.map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold/15 text-gold text-xs font-medium rounded-full"
              >
                {cat}
                <button
                  onClick={() =>
                    setFilters({
                      ...filters,
                      categories: filters.categories.filter((c) => c !== cat),
                    })
                  }
                >
                  <X size={12} />
                </button>
              </span>
            ))}

            {filters.sizes?.map((size) => (
              <span
                key={size}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-charcoal/10 dark:bg-cream/10 text-charcoal dark:text-cream text-xs font-medium rounded-full"
              >
                Size {size}
                <button
                  onClick={() =>
                    setFilters({
                      ...filters,
                      sizes: filters.sizes.filter((s) => s !== size),
                    })
                  }
                >
                  <X size={12} />
                </button>
              </span>
            ))}

            {filters.colors?.map((col) => (
              <span
                key={col}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-charcoal/10 dark:bg-cream/10 text-charcoal dark:text-cream text-xs font-medium rounded-full"
              >
                Color: {col}
                <button
                  onClick={() =>
                    setFilters({
                      ...filters,
                      colors: filters.colors.filter((c) => c !== col),
                    })
                  }
                >
                  <X size={12} />
                </button>
              </span>
            ))}

            {filters.priceRange && filters.priceRange.label !== 'All Prices' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-charcoal/10 dark:bg-cream/10 text-charcoal dark:text-cream text-xs font-medium rounded-full">
                {filters.priceRange.label}
                <button
                  onClick={() =>
                    setFilters({
                      ...filters,
                      priceRange: { label: 'All Prices', min: 0, max: Infinity },
                    })
                  }
                >
                  <X size={12} />
                </button>
              </span>
            )}

            <button
              onClick={handleResetFilters}
              className="text-xs text-error font-semibold hover:underline ml-2"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Main Layout: Sidebar + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-28 bg-cream dark:bg-charcoal p-6 rounded-2xl border border-gray-200/60 dark:border-gray-800 shadow-card">
            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
              onReset={handleResetFilters}
            />
          </aside>

          {/* Product Grid Area */}
          <main className="lg:col-span-9">
            {sortedProducts.length === 0 ? (
              <EmptyState
                type="search"
                title="No matching garments found"
                description="Try loosening your filters or resetting the category selection."
                actionText="Reset All Filters"
                actionHref="#"
                onAction={handleResetFilters}
              />
            ) : (
              <div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                  {paginatedProducts.map((prod, idx) => (
                    <ProductCard key={prod.id} product={prod} index={idx} />
                  ))}
                </div>

                {/* Load More Button */}
                {hasMore && (
                  <div className="text-center mt-12 pt-8 border-t border-gray-200/60 dark:border-gray-800">
                    <p className="text-xs text-gray-500 mb-3">
                      Viewing {paginatedProducts.length} of {sortedProducts.length} items
                    </p>
                    <button
                      onClick={() => setCurrentPage((p) => p + 1)}
                      className="px-8 py-3.5 bg-charcoal text-cream dark:bg-cream dark:text-charcoal text-xs font-bold uppercase tracking-widest rounded-xl hover:opacity-90 transition-opacity shadow-soft"
                    >
                      Load More Garments
                    </button>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>

        {/* Mobile Filter Drawer */}
        <AnimatePresence>
          {isMobileFilterOpen && (
            <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileFilterOpen(false)}
                className="fixed inset-0 bg-charcoal/60 dark:bg-black/70 backdrop-blur-sm"
              />
              <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                  className="w-screen max-w-xs bg-cream dark:bg-charcoal overflow-y-auto"
                >
                  <FilterSidebar
                    filters={filters}
                    setFilters={setFilters}
                    onReset={handleResetFilters}
                    isMobile={true}
                    onCloseMobile={() => setIsMobileFilterOpen(false)}
                  />
                </motion.div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
