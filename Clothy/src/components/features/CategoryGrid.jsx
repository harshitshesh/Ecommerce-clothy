/**
 * CategoryGrid — Curated fashion category showcase
 * Asymmetric editorial grid with hover zoom & subtle parallax feel
 */
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import categories from '../../data/categories';

export default function CategoryGrid() {
  return (
    <section className="home-section">
      <div className="container-custom">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
          <div>
            <span className="text-xs uppercase tracking-widest text-gold font-bold block mb-2">
              Curated Wardrobes
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal dark:text-cream">
              Shop By Category
            </h2>
          </div>
          <p className="text-sm text-gray-500 max-w-sm mt-3 md:mt-0">
            From precision-tailored jackets to everyday organic tees, explore thoughtfully designed silhouettes.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
          {categories.map((cat, idx) => {
            // Give first category a prominent span
            const isFeatured = idx === 0 || idx === 4;
            return (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className={`group relative rounded-2xl overflow-hidden shadow-card border border-gray-200/50 dark:border-gray-800 ${
                  isFeatured ? 'md:col-span-2 aspect-[16/10]' : 'aspect-[4/5]'
                }`}
              >
                {/* Background Image — fully visible at rest; zoom is hover enhancement */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/30 to-transparent group-hover:from-charcoal/90 transition-all duration-300 pointer-events-none" />

                {/* Content Overlay */}
                <div className="absolute inset-0 p-5 sm:p-7 flex flex-col justify-end">
                  <div className="flex items-end justify-between gap-3">
                    <div className="min-w-0">
                      <span className="text-xs text-cream/70 uppercase tracking-widest font-medium block mb-1.5">
                        {cat.productCount} Pieces
                      </span>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-white group-hover:text-gold-light transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-cream/80 hidden sm:block mt-1.5 line-clamp-1 max-w-xs">
                        {cat.description}
                      </p>
                    </div>

                    {/* Arrow Button */}
                    <div className="w-10 h-10 shrink-0 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center group-hover:bg-gold group-hover:text-white transition-all transform group-hover:translate-x-1 group-hover:-translate-y-1">
                      <ArrowUpRight size={18} />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
