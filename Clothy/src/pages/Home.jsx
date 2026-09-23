/**
 * Home Page — Flagship editorial landing page
 * GSAP animations, curated collections, marquee banners, and personalized recs
 */
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import HeroSection from '../components/features/HeroSection';
import CategoryGrid from '../components/features/CategoryGrid';
import FlashSaleBanner from '../components/features/FlashSaleBanner';
import Testimonials from '../components/features/Testimonials';
import NewsletterForm from '../components/features/NewsletterForm';
import ProductGrid from '../components/ui/ProductGrid';
import products from '../data/products';
import useUserStore from '../store/useUserStore';

export default function Home() {
  const { recentlyViewed, user, isLoggedIn } = useUserStore();

  const bestsellers = products.filter((p) => p.tags.includes('bestseller')).slice(0, 4);
  const newArrivals = products.filter((p) => p.tags.includes('new')).slice(0, 4);

  return (
    <div className="space-y-0">
      {/* 1. Hero Section with GSAP Staggered Entrance */}
      <HeroSection />

      {/* Welcome Back Banner for Logged In User */}
      {isLoggedIn && user && (
        <section className="home-section">
          <div className="container-custom">
            <div className="p-5 sm:p-7 rounded-2xl bg-gold/10 border border-gold/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="w-10 h-10 rounded-full bg-gold text-white flex items-center justify-center font-bold font-serif text-base shrink-0">
                  {user.name[0]}
                </span>
                <div>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-charcoal dark:text-cream">
                    Welcome back, {user.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    You have an exclusive 20% privilege code waiting in your account.
                  </p>
                </div>
              </div>
              <Link to="/shop" className="btn btn-primary !min-h-[44px] !py-2.5 !px-5 shrink-0">
                Resume Shopping
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 2. Featured Bestsellers / The Signature Edit */}
      <section className="home-section">
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16">
            <div>
              <span className="text-xs uppercase tracking-widest text-gold font-bold block mb-2">
                Iconic Silhouettes
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal dark:text-cream">
                The Signature Edit
              </h2>
            </div>
            <Link
              to="/shop?tag=bestseller"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gold hover:underline mt-4 sm:mt-0"
            >
              <span>View All Bestsellers</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <ProductGrid products={bestsellers} columns={4} className="mt-4" />
        </div>
      </section>

      {/* 3. Category Grid Showcase */}
      <CategoryGrid />

      {/* 4. Editorial Split Story Banner */}
      <section className="home-section">
        <div className="container-custom">
          <div className="relative rounded-3xl overflow-hidden bg-charcoal-light text-cream shadow-elevated border border-gray-800">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Image */}
              <div className="relative aspect-[4/3] lg:aspect-auto min-h-[360px] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1000&q=85"
                  alt="Autumn Campaign Editorial"
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Editorial Copy */}
              <div className="p-8 sm:p-14 lg:p-16 xl:p-20 flex flex-col justify-center">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 text-gold text-xs font-bold uppercase tracking-widest w-fit mb-6">
                  <Sparkles size={12} /> The Craft Philosophy
                </span>

                <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 leading-tight">
                  Designed with Intent. <br />
                  Constructed for Decades.
                </h3>

                <p className="text-sm sm:text-base text-gray-300 mb-8 leading-relaxed font-sans">
                  Every thread in our Autumn capsule is traceable to sustainable mills across Europe and Asia.
                  We eliminate trends in pursuit of timeless, quiet luxury.
                </p>

                <div className="flex flex-wrap gap-3 sm:gap-4">
                  <Link to="/about" className="btn btn-primary !bg-cream !text-charcoal hover:!bg-gold hover:!text-white">
                    Our Philosophy
                  </Link>
                  <Link to="/shop" className="btn btn-secondary !border-cream/40 !text-cream hover:!border-gold hover:!text-gold hover:!bg-gold/10">
                    Explore Collection
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Flash Sale Urgency Banner */}
      <FlashSaleBanner />

      {/* 6. New Arrivals Showcase */}
      <section className="home-section">
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16">
            <div>
              <span className="text-xs uppercase tracking-widest text-gold font-bold block mb-2">
                Fresh Off The Atelier
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal dark:text-cream">
                New Arrivals
              </h2>
            </div>
            <Link
              to="/shop?tag=new"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gold hover:underline mt-4 sm:mt-0"
            >
              <span>Explore All Drops</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <ProductGrid products={newArrivals} columns={4} className="mt-4" />
        </div>
      </section>

      {/* 7. Recently Viewed (if available) */}
      {recentlyViewed && recentlyViewed.length > 0 && (
        <section className="home-section">
          <div className="container-custom">
            <div className="mb-8">
              <span className="text-xs uppercase tracking-widest text-gray-400 font-bold block mb-1.5">
                Personalized History
              </span>
              <h3 className="font-serif text-2xl font-bold text-charcoal dark:text-cream">
                Recently Contemplated
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
              {recentlyViewed.slice(0, 6).map((item) => (
                <Link
                  key={item.id}
                  to={`/product/${item.slug}`}
                  className="group rounded-xl overflow-hidden bg-cream dark:bg-charcoal border border-gray-200/50 dark:border-gray-800 p-3 sm:p-4 transition-transform hover:-translate-y-1"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="aspect-[3/4] w-full object-cover object-center rounded-lg mb-3"
                  />
                  <h4 className="text-xs font-semibold text-charcoal dark:text-cream line-clamp-1 mb-1.5 group-hover:text-gold transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-xs font-bold text-gold">
                    ₹{(item.discountPrice || item.price).toLocaleString('en-IN')}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. Patron Testimonials */}
      <Testimonials />

      {/* 9. Newsletter Subscription */}
      <NewsletterForm />
    </div>
  );
}
