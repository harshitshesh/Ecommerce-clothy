/**
 * Testimonials — Client editorial reviews carousel / showcase
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import RatingStars from '../ui/RatingStars';
import testimonials from '../../data/testimonials';

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));

  const t = testimonials[current];

  return (
    <section className="home-section bg-cream-dark/30 dark:bg-charcoal-light/10 border-y border-gray-200/50 dark:border-gray-800">
      <div className="container-custom max-w-5xl">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs uppercase tracking-widest text-gold font-bold block mb-2.5">
            The Clothiers Community
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal dark:text-cream">
            Worn & Cherished
          </h2>
        </div>

        {/* Carousel Card */}
        <div className="relative bg-cream dark:bg-charcoal rounded-3xl p-10 sm:p-14 lg:p-16 border border-gray-200/60 dark:border-gray-800 shadow-soft">
          {/* Quote Icon */}
          <div className="absolute -top-5 left-10 sm:left-14 lg:left-16 w-11 h-11 rounded-full bg-gold text-white flex items-center justify-center shadow-md">
            <Quote size={20} />
          </div>

          <div className="min-h-[240px] flex flex-col justify-between gap-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="space-y-7"
              >
                <div className="flex items-center gap-3">
                  <RatingStars rating={t.rating} size={16} />
                  <span className="text-xs font-semibold text-gold">Verified Patron</span>
                </div>

                <blockquote className="font-serif text-xl sm:text-2xl md:text-3xl text-charcoal dark:text-cream leading-relaxed italic">
                  &ldquo;{t.text}&rdquo;
                </blockquote>

                <div className="flex items-center gap-4 pt-6 border-t border-gray-200/50 dark:border-gray-800">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gold/40 shrink-0"
                  />
                  <div>
                    <h4 className="font-sans font-bold text-sm text-charcoal dark:text-cream">
                      {t.name}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {t.location} • Purchased <strong className="text-gold font-medium">{t.product}</strong>
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200/40 dark:border-gray-800/60">
              <div className="flex gap-2">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrent(idx)}
                    className={`h-1.5 rounded-full transition-all ${
                      current === idx ? 'w-8 bg-gold' : 'w-2 bg-gray-300 dark:bg-gray-700'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={prev}
                  className="p-2.5 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-cream-dark dark:hover:bg-gray-800 text-charcoal dark:text-cream transition-colors"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={next}
                  className="p-2.5 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-cream-dark dark:hover:bg-gray-800 text-charcoal dark:text-cream transition-colors"
                  aria-label="Next testimonial"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
