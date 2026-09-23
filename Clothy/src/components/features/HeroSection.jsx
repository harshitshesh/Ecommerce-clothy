/**
 * HeroSection — Editorial luxury hero with GSAP staggered entrance
 * High-fashion aesthetics, grain overlay, and marquee value bar
 */
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowRight, Sparkles, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export default function HeroSection() {
  const containerRef = useRef(null);
  const headlineRef = useRef(null);
  const subtextRef = useRef(null);
  const ctaRef = useRef(null);
  const badgeRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fail-open: content stays visible if GSAP/reduced-motion skips the entrance
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(
          [badgeRef.current, headlineRef.current, subtextRef.current, ctaRef.current],
          { opacity: 1, y: 0 }
        );
        gsap.set(imageRef.current, { scale: 1, opacity: 1 });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        badgeRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.2 }
      )
        .fromTo(
          headlineRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1 },
          '-=0.5'
        )
        .fromTo(
          subtextRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.6'
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.6'
        )
        .fromTo(
          imageRef.current,
          { scale: 1.08, opacity: 0.9 },
          { scale: 1, opacity: 1, duration: 1.5, ease: 'power2.out' },
          '0'
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative pt-24 sm:pt-28 pb-12 overflow-hidden">
      {/* Background Subtle Gradient & Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-radial from-gold/10 via-transparent to-transparent pointer-events-none -z-10" />
      {/* Soft ambient animated tint (A → B → C → A) */}
      <div className="absolute inset-0 hero-ambient-gradient pointer-events-none -z-10" aria-hidden="true" />

      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center min-h-[75vh]">
          {/* Left: Editorial Copy */}
          <div className="lg:col-span-7 flex flex-col justify-center z-10">
            {/* Tag badge */}
            <div ref={badgeRef} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-charcoal/5 dark:bg-cream/10 border border-charcoal/10 dark:border-cream/15 text-xs font-semibold uppercase tracking-widest text-charcoal dark:text-cream">
                <Sparkles size={13} className="text-gold" />
                Fall / Winter &apos;26 Capsule
              </span>
            </div>

            {/* Main Headline */}
            <h1
              ref={headlineRef}
              className="font-serif text-4xl sm:text-6xl xl:text-7xl font-bold leading-[1.08] tracking-tight text-charcoal dark:text-cream mb-6"
            >
              Tailored for the <br />
              <span className="italic font-normal font-serif text-gold">Discerning</span> Mind.
            </h1>

            {/* Subtext */}
            <p
              ref={subtextRef}
              className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-xl leading-relaxed mb-8 sm:mb-10 font-sans"
            >
              Architectural silhouettes, heritage fabrics, and timeless design.
              Each garment is purposefully cut in limited batches to celebrate effortless elegance.
            </p>

            {/* CTA Buttons */}
            <div ref={ctaRef} className="flex flex-wrap items-center gap-3 sm:gap-4">
              <Link to="/shop" className="btn btn-primary group">
                <span>Shop Collection</span>
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              </Link>
              <Link to="/shop?tag=new" className="btn btn-secondary group">
                <span>New Arrivals</span>
              </Link>
            </div>

            {/* Micro Stats */}
            <div className="grid grid-cols-3 gap-6 pt-10 sm:pt-14 mt-10 border-t border-gray-200/60 dark:border-gray-800/80 max-w-lg">
              <div>
                <span className="block font-serif text-2xl sm:text-3xl font-bold text-charcoal dark:text-cream">
                  100%
                </span>
                <span className="text-xs text-gray-500 uppercase tracking-wider">Organic Fabrics</span>
              </div>
              <div>
                <span className="block font-serif text-2xl sm:text-3xl font-bold text-charcoal dark:text-cream">
                  50k+
                </span>
                <span className="text-xs text-gray-500 uppercase tracking-wider">Wardrobes Styled</span>
              </div>
              <div>
                <span className="block font-serif text-2xl sm:text-3xl font-bold text-charcoal dark:text-cream">
                  4.9★
                </span>
                <span className="text-xs text-gray-500 uppercase tracking-wider">Client Rating</span>
              </div>
            </div>
          </div>

          {/* Right: Editorial Visual Composition */}
          <div className="lg:col-span-5 relative flex flex-col gap-4 sm:gap-5">
            <div
              ref={imageRef}
              className="relative aspect-[4/5] sm:aspect-[3/4] rounded-2xl overflow-hidden shadow-elevated border border-gray-200/50 dark:border-gray-800"
            >
              <img
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&q=85"
                alt="Luxury Fashion Model"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

              {/* Floating Label Card */}
              <div className="absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-6 sm:right-6 p-4 sm:p-5 rounded-2xl bg-white/90 dark:bg-charcoal/90 backdrop-blur-md border border-white/20 dark:border-gray-700 shadow-soft flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[10px] uppercase tracking-widest text-gold font-bold block mb-0.5">
                    Featured Look
                  </span>
                  <span className="text-sm font-semibold text-charcoal dark:text-cream">
                    Double-Breasted Wool Coat
                  </span>
                </div>
                <Link
                  to="/shop?category=jackets"
                  className="shrink-0 p-2.5 rounded-full bg-charcoal text-cream dark:bg-cream dark:text-charcoal hover:bg-gold hover:text-white transition-colors duration-300"
                  aria-label="View look"
                >
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Explore CTA — subtle horizontal swipe reveal on hover */}
            <Link
              to="/shop"
              className="swipe-btn group w-full rounded-xl border border-charcoal/20 dark:border-cream/20 bg-white/60 dark:bg-charcoal-light/40 backdrop-blur-sm"
            >
              <span>Explore Collection</span>
              <ArrowRight
                size={15}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Value Pillars Banner */}
      <div className="mt-20 border-y border-gray-200/60 dark:border-gray-800 bg-cream-dark/40 dark:bg-charcoal-light/20 py-8 sm:py-10">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold/15 text-gold flex items-center justify-center shrink-0">
                <Truck size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal dark:text-cream">
                  Free Express Delivery
                </h4>
                <p className="text-[11px] text-gray-500">On all orders above ₹1,999</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold/15 text-gold flex items-center justify-center shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal dark:text-cream">
                  Artisanal Craftsmanship
                </h4>
                <p className="text-[11px] text-gray-500">Ethically crafted & sustainably cut</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold/15 text-gold flex items-center justify-center shrink-0">
                <RefreshCw size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal dark:text-cream">
                  Hassle-Free Returns
                </h4>
                <p className="text-[11px] text-gray-500">30-day doorstep exchange</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold/15 text-gold flex items-center justify-center shrink-0">
                <Sparkles size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal dark:text-cream">
                  Boutique Packaging
                </h4>
                <p className="text-[11px] text-gray-500">Recycled luxury garment bag included</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
