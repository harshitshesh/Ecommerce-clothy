/**
 * About Page — Brand story, craftsmanship narrative, and sustainable philosophy
 */
import { Sparkles, Leaf, Award, HeartHandshake } from 'lucide-react';
import Breadcrumbs from '../components/ui/Breadcrumbs';

export default function About() {
  return (
    <div className="pt-24 sm:pt-28 pb-20">
      <div className="container-custom">
        {/* Breadcrumbs */}
        <div className="mb-4">
          <Breadcrumbs items={[{ label: 'About CLOZARI' }]} />
        </div>

        {/* Hero Narrative */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-gold font-bold block mb-2">
            The Atelier Story
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-charcoal dark:text-cream mb-6 leading-tight">
            Quiet Luxury, Cut with Conviction.
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 font-sans leading-relaxed">
            CLOZARI was founded on an unyielding belief: that fashion should not be ephemeral.
            We rebel against trends by sculpting garments rooted in architectural proportion,
            heritage natural fibers, and timeless poise.
          </p>
        </div>

        {/* Editorial Imagery Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20 items-center">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-elevated border border-gray-200/50 dark:border-gray-800">
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&q=80"
              alt="Atelier workshop"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4 sm:p-8 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-gold block">
              Slow Fashion Manifesto
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal dark:text-cream leading-snug">
              Every Stitch Tells a Tale of Patience.
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-sans">
              Unlike mass-manufactured fast fashion, every CLOZARI garment undergoes over 40 distinct quality checks.
              From spinning organic cotton yarns to hand-finishing horn buttons, our tailors bring decades of generational craft to every seam.
            </p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-sans">
              We produce in micro-batches to guarantee zero surplus waste, creating garments designed to be worn for decades and passed on as family heirlooms.
            </p>
          </div>
        </div>

        {/* 4 Core Pillars */}
        <div className="mb-20">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal dark:text-cream">
              Our Guiding Principles
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-cream dark:bg-charcoal border border-gray-200/60 dark:border-gray-800 shadow-card">
              <div className="w-12 h-12 rounded-xl bg-gold/15 text-gold flex items-center justify-center mb-4">
                <Leaf size={22} />
              </div>
              <h4 className="font-serif font-bold text-base text-charcoal dark:text-cream mb-2">
                100% Organic Fibers
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Zero polyester microplastics. We work solely with certified organic cotton, European flax linen, and mulberry silks.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-cream dark:bg-charcoal border border-gray-200/60 dark:border-gray-800 shadow-card">
              <div className="w-12 h-12 rounded-xl bg-gold/15 text-gold flex items-center justify-center mb-4">
                <Award size={22} />
              </div>
              <h4 className="font-serif font-bold text-base text-charcoal dark:text-cream mb-2">
                Generational Craft
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Our master pattern-makers spend months perfecting each drape, ensuring effortless posture and timeless movement.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-cream dark:bg-charcoal border border-gray-200/60 dark:border-gray-800 shadow-card">
              <div className="w-12 h-12 rounded-xl bg-gold/15 text-gold flex items-center justify-center mb-4">
                <HeartHandshake size={22} />
              </div>
              <h4 className="font-serif font-bold text-base text-charcoal dark:text-cream mb-2">
                Ethical Atelier Living
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                All craftspeople receive over 2.5x the living wage benchmark, comprehensive healthcare, and work in sunlit ateliers.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-cream dark:bg-charcoal border border-gray-200/60 dark:border-gray-800 shadow-card">
              <div className="w-12 h-12 rounded-xl bg-gold/15 text-gold flex items-center justify-center mb-4">
                <Sparkles size={22} />
              </div>
              <h4 className="font-serif font-bold text-base text-charcoal dark:text-cream mb-2">
                Zero Plastic Packaging
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Garments arrive cocooned in organic cotton dust cases within 100% recycled biodegradable paper boxes.
              </p>
            </div>
          </div>
        </div>

        {/* Quote Section */}
        <div className="p-8 sm:p-14 rounded-3xl bg-charcoal text-cream text-center max-w-4xl mx-auto border border-gold/30 shadow-elevated">
          <blockquote className="font-serif text-xl sm:text-2xl md:text-3xl italic leading-relaxed mb-6">
            &ldquo;True style does not shout for attention in crowded rooms. It commands reverence through the quiet grace of exquisite drape and authentic craftsmanship.&rdquo;
          </blockquote>
          <p className="text-xs font-bold uppercase tracking-widest text-gold">
            Aarav Deshmukh — Founder & Creative Director
          </p>
        </div>
      </div>
    </div>
  );
}
