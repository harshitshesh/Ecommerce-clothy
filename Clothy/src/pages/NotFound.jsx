/**
 * NotFound Page — Luxury 404 page
 */
import { Link } from 'react-router-dom';
import { ArrowRight, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="pt-32 pb-24 container-custom text-center min-h-[70vh] flex flex-col items-center justify-center">
      <div className="w-16 h-16 rounded-full bg-gold/15 text-gold flex items-center justify-center mb-6">
        <Compass size={32} />
      </div>

      <span className="font-mono text-xs uppercase tracking-widest text-gold font-bold block mb-2">
        Error 404 — Page Missing
      </span>
      <h1 className="font-serif text-4xl sm:text-6xl font-bold text-charcoal dark:text-cream mb-4">
        Silhouette Not Found
      </h1>
      <p className="text-xs sm:text-base text-gray-500 max-w-md mx-auto mb-8 leading-relaxed">
        The archive page or bespoke piece you are seeking might have been retired or moved to another capsule.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/"
          className="px-8 py-3.5 bg-charcoal text-cream dark:bg-cream dark:text-charcoal rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity shadow-soft"
        >
          Return to Home
        </Link>
        <Link
          to="/shop"
          className="px-8 py-3.5 border border-charcoal/20 dark:border-cream/20 text-charcoal dark:text-cream rounded-xl text-xs font-bold uppercase tracking-widest hover:border-gold hover:text-gold transition-colors flex items-center gap-2"
        >
          <span>Explore Catalogue</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
