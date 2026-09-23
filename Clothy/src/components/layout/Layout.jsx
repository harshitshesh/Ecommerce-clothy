/**
 * Layout — Main layout wrapper with AnnouncementBar, Navbar, Footer, Lenis smooth scroll
 * Wraps all page content & global interactive drawers/modals
 */
import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnnouncementBar from './AnnouncementBar';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from '../features/CartDrawer';
import WishlistDrawer from '../features/WishlistDrawer';
import SearchOverlay from '../features/SearchOverlay';
import QuickViewModal from '../features/QuickViewModal';

gsap.registerPlugin(ScrollTrigger);

export default function Layout() {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Lenis smooth scrolling integrated with GSAP ScrollTrigger
  // (disabled if user prefers reduced motion)
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    // Keep ScrollTrigger in sync with Lenis-driven scroll position
    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  // Refresh triggers after route content mounts (images/layout settle)
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener('load', onLoad);
    };
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-cream dark:bg-charcoal text-charcoal dark:text-cream">
      <AnnouncementBar />
      <Navbar />

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />

      {/* Overlays & Drawers */}
      <CartDrawer />
      <WishlistDrawer />
      <SearchOverlay />
      <QuickViewModal />
    </div>
  );
}
