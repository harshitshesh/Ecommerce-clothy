/**
 * SearchOverlay — Fullscreen dynamic search with live filtering & instant preview
 */
import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import useUIStore from '../../store/useUIStore';
import useDebounce from '../../hooks/useDebounce';
import products from '../../data/products';
import { formatCurrency } from '../../utils/formatCurrency';

const POPULAR_SEARCHES = ['Linen Shirt', 'Leather Jacket', 'Maxi Dress', 'Oversized Tee', 'Trench Coat', 'Chelsea Boots'];

export default function SearchOverlay() {
  const { isSearchOpen, closeSearch } = useUIStore();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 250);
  const [recentSearches, setRecentSearches] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('clothy_recent_searches') || '[]');
      setRecentSearches(stored);
    } catch {
      // ignore
    }
  }, [isSearchOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSearchOpen]);

  // Handle ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isSearchOpen) closeSearch();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, closeSearch]);

  // Filter products
  const searchResults = debouncedQuery.trim()
    ? products.filter((p) => {
        const q = debouncedQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q)
        );
      }).slice(0, 6)
    : [];

  const handleSaveSearch = (text) => {
    const updated = [text, ...recentSearches.filter((s) => s.toLowerCase() !== text.toLowerCase())].slice(0, 6);
    setRecentSearches(updated);
    try {
      localStorage.setItem('clothy_recent_searches', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (!query.trim()) return;
    handleSaveSearch(query.trim());
    closeSearch();
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const handleSelectRecentOrPopular = (text) => {
    setQuery(text);
    handleSaveSearch(text);
    closeSearch();
    navigate(`/search?q=${encodeURIComponent(text)}`);
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-start">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeSearch}
            className="fixed inset-0 bg-charcoal/70 dark:bg-black/85 backdrop-blur-md"
          />

          {/* Search Box Container */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative z-10 w-full bg-cream dark:bg-charcoal border-b border-gray-200/60 dark:border-gray-800 shadow-2xl pt-6 sm:pt-8 pb-8 sm:pb-10"
          >
            <div className="container-custom max-w-4xl">
              {/* Top Row: Search Input */}
              <div className="flex items-center gap-3 sm:gap-4 pb-5 border-b border-gray-200 dark:border-gray-700">
                <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center">
                  <div className="flex-1 flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3 min-h-[54px] rounded-2xl bg-cream-dark/60 dark:bg-charcoal-light/60 border border-gray-200/80 dark:border-gray-700/80 focus-within:border-gold/60 focus-within:shadow-soft transition-all duration-200">
                    <Search size={20} className="text-gold shrink-0" />
                    <input
                      ref={inputRef}
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search tailored shirts, dresses, trench coats, accessories..."
                      className="w-full text-base sm:text-lg font-medium bg-transparent text-charcoal dark:text-cream placeholder:text-gray-400 focus:outline-none"
                    />
                    {query && (
                      <button
                        type="button"
                        onClick={() => setQuery('')}
                        className="p-1.5 shrink-0 rounded-full text-gray-400 hover:text-charcoal dark:hover:text-cream hover:bg-gray-200/60 dark:hover:bg-gray-800 transition-colors"
                        aria-label="Clear search"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                </form>
                <button
                  onClick={closeSearch}
                  className="p-2.5 shrink-0 rounded-xl text-gray-500 hover:text-charcoal dark:hover:text-cream hover:bg-cream-dark dark:hover:bg-gray-800 transition-colors"
                  aria-label="Close search"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Suggestions / Results */}
              <div className="mt-7">
                {query.trim() === '' ? (
                  <div className="space-y-6">
                    {/* Recent Searches */}
                    {recentSearches.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                            <Clock size={13} /> Recent Searches
                          </span>
                          <button
                            onClick={() => {
                              setRecentSearches([]);
                              localStorage.removeItem('clothy_recent_searches');
                            }}
                            className="text-xs text-gray-400 hover:text-charcoal dark:hover:text-cream"
                          >
                            Clear
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {recentSearches.map((term) => (
                            <button
                              key={term}
                              onClick={() => handleSelectRecentOrPopular(term)}
                              className="px-3 py-1.5 rounded-full text-xs bg-cream-dark dark:bg-gray-800 text-charcoal dark:text-cream hover:bg-gold/20 hover:text-gold transition-colors"
                            >
                              {term}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Popular Tags */}
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5 mb-3">
                        <TrendingUp size={13} /> Trending Searches
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {POPULAR_SEARCHES.map((term) => (
                          <button
                            key={term}
                            onClick={() => handleSelectRecentOrPopular(term)}
                            className="px-3.5 py-1.5 rounded-full text-xs bg-cream-dark dark:bg-gray-800 text-charcoal dark:text-cream hover:bg-gold hover:text-white transition-all font-medium"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    {searchResults.length > 0 ? (
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">
                          Found {searchResults.length} matching pieces
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {searchResults.map((product) => (
                            <Link
                              key={product.id}
                              to={`/product/${product.slug}`}
                              onClick={() => {
                                handleSaveSearch(query.trim());
                                closeSearch();
                              }}
                              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-cream-dark/60 dark:hover:bg-gray-800/60 transition-colors group"
                            >
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-14 h-16 rounded-lg object-cover bg-gray-100 dark:bg-gray-700 shrink-0"
                              />
                              <div className="min-w-0 flex-1">
                                <span className="text-[10px] text-gray-400 uppercase tracking-wide">
                                  {product.category}
                                </span>
                                <h4 className="text-xs font-semibold text-charcoal dark:text-cream line-clamp-1 group-hover:text-gold transition-colors">
                                  {product.name}
                                </h4>
                                <span className="text-xs font-bold text-gold">
                                  {formatCurrency(product.discountPrice || product.price)}
                                </span>
                              </div>
                            </Link>
                          ))}
                        </div>

                        <div className="mt-5 pt-3 border-t border-gray-200 dark:border-gray-800 text-center">
                          <button
                            onClick={handleSearchSubmit}
                            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold hover:underline"
                          >
                            View all results for &ldquo;{query}&rdquo; <ArrowRight size={14} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-sm text-gray-500 mb-2">
                          No matching pieces found for &ldquo;{query}&rdquo;
                        </p>
                        <p className="text-xs text-gray-400">
                          Try searching for categories like shirts, jackets, dresses or explore our all-time bestsellers.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
