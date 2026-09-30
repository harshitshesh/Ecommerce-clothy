/**
 * Help / FAQ Page — Searchable accordion of client service questions
 * One answer open at a time, filtered by category tab and free-text search.
 */
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, X } from 'lucide-react';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import Accordion from '../components/ui/Accordion';
import faqs from '../data/faqs';

const ALL = 'All';

export default function Help() {
  const [selectedCategory, setSelectedCategory] = useState(ALL);
  const [query, setQuery] = useState('');

  const categoriesList = useMemo(() => [ALL, ...faqs.map((f) => f.category)], []);

  const displayedFaqs = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const source = faqs
      .filter((group) => selectedCategory === ALL || group.category === selectedCategory)
      .flatMap((group) =>
        group.items.map((item) => ({ ...item, category: group.category }))
      );

    if (!needle) return source;

    return source.filter(
      (item) =>
        item.q.toLowerCase().includes(needle) ||
        item.a.toLowerCase().includes(needle) ||
        item.category.toLowerCase().includes(needle)
    );
  }, [selectedCategory, query]);

  return (
    <div className="pt-24 sm:pt-28 pb-20">
      <div className="container-custom max-w-4xl">
        {/* Breadcrumbs */}
        <div className="mb-4">
          <Breadcrumbs items={[{ label: 'Client Assistance & FAQ' }]} />
        </div>

        {/* Page Header */}
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-widest text-gold font-bold block mb-2">
            Client Assistance
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal dark:text-cream mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-lg mx-auto">
            Everything you need to know about sizing, deliveries, payments, offers, wallet coins
            and returns.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="SEARCH FOR AN ANSWER (e.g. RETURN, COUPON, SIZE)"
            aria-label="Search questions"
            className="w-full pl-11 pr-11 py-3.5 text-xs tracking-wide bg-cream dark:bg-charcoal border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-gold text-charcoal dark:text-cream"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gold"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-charcoal text-cream dark:bg-cream dark:text-charcoal shadow-sm'
                  : 'bg-cream-dark dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-gold'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="bg-cream dark:bg-charcoal p-6 sm:p-8 rounded-3xl border border-gray-200/60 dark:border-gray-800 shadow-card mb-6">
          {displayedFaqs.length === 0 ? (
            <div className="py-10 text-center">
              <p className="font-serif font-bold text-lg text-charcoal dark:text-cream mb-1">
                No questions match “{query}”
              </p>
              <p className="text-xs text-gray-500">
                Try a different word, or clear the search to browse every category.
              </p>
            </div>
          ) : (
            /* key forces a fresh accordion whenever the list changes */
            <Accordion
              key={`${selectedCategory}-${query}`}
              items={displayedFaqs.map((item) => ({ q: item.q, a: item.a }))}
              allowMultiple={false}
            />
          )}
        </div>

        <p className="text-[11px] text-gray-400 text-center mb-12">
          Showing {displayedFaqs.length} of {faqs.reduce((n, g) => n + g.items.length, 0)}{' '}
          questions
        </p>

        {/* Still Need Assistance Banner */}
        <div className="p-8 rounded-2xl bg-cream-dark/50 dark:bg-charcoal-light/30 border border-gold/30 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h3 className="font-serif font-bold text-lg text-charcoal dark:text-cream">
              Still need help? Contact us
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Our private concierge team replies within one business day.
            </p>
          </div>
          <Link
            to="/contact"
            className="px-6 py-3 bg-charcoal text-cream dark:bg-cream dark:text-charcoal rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center gap-2 shrink-0 shadow-soft"
          >
            <span>Contact Us</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
