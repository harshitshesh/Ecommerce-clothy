/**
 * Help / FAQ Page — Curated client service questions with smooth expand/collapse
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import Accordion from '../components/ui/Accordion';
import faqs from '../data/faqs';

export default function Help() {
  const [selectedCategory, setSelectedCategory] = useState(faqs[0]?.category || 'All');

  const categoriesList = ['All', ...faqs.map((f) => f.category)];

  const displayedFaqs =
    selectedCategory === 'All'
      ? faqs.flatMap((f) => f.items.map((item) => ({ title: item.q, content: item.a })))
      : (faqs.find((f) => f.category === selectedCategory)?.items || []).map((item) => ({
          title: item.q,
          content: item.a,
        }));

  return (
    <div className="pt-24 sm:pt-28 pb-20">
      <div className="container-custom max-w-4xl">
        {/* Breadcrumbs */}
        <div className="mb-4">
          <Breadcrumbs items={[{ label: 'Client Assistance & FAQ' }]} />
        </div>

        {/* Page Header */}
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest text-gold font-bold block mb-2">
            Client Assistance
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal dark:text-cream mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-lg mx-auto">
            Everything you need to know about our garment construction, deliveries, sizing, and returns.
          </p>
        </div>

        {/* Category Pills */}
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
        <div className="bg-cream dark:bg-charcoal p-6 sm:p-8 rounded-3xl border border-gray-200/60 dark:border-gray-800 shadow-card mb-12">
          <Accordion items={displayedFaqs} allowMultiple={false} />
        </div>

        {/* Still Need Assistance Banner */}
        <div className="p-8 rounded-2xl bg-cream-dark/50 dark:bg-charcoal-light/30 border border-gold/30 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h3 className="font-serif font-bold text-lg text-charcoal dark:text-cream">
              Require Bespoke Assistance?
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Our private concierge team is available to guide your wardrobe decisions.
            </p>
          </div>
          <Link
            to="/contact"
            className="px-6 py-3 bg-charcoal text-cream dark:bg-cream dark:text-charcoal rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center gap-2 shrink-0 shadow-soft"
          >
            <span>Contact Concierge</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
