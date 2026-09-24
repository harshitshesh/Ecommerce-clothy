/**
 * Navbar — Premium sticky navbar with GSAP scroll-based shrink/expand
 *
 * Behavior:
 * - At top: Tall/expanded, transparent background
 * - Scroll DOWN past hero: Smoothly shrinks, solid/blurred background
 * - Scroll UP: Smoothly expands back
 * - Mobile: Hamburger → slide-in drawer
 */
import { useRef, useEffect, useState, useLayoutEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  Sun,
  Moon,
  LogIn,
  LogOut,
  ChevronDown,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import useScrollDirection from '../../hooks/useScrollDirection';
import useCartStore from '../../store/useCartStore';
import useWishlistStore from '../../store/useWishlistStore';
import useUIStore from '../../store/useUIStore';
import useUserStore from '../../store/useUserStore';
import categories from '../../data/categories';
import { cn } from '../../utils/cn';
import MobileMenu from './MobileMenu';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/shop', label: 'Shop' },
  { path: '/categories', label: 'Categories', hasDropdown: true },
  { path: '/offers', label: 'Offers' },
  { path: '/about', label: 'About' },
  { path: '/contact', label: 'Contact' },
];

const categoryDropdown = [
  { path: '/category/shirts', label: 'Shirts' },
  { path: '/category/t-shirts', label: 'T-Shirts' },
  { path: '/category/jeans', label: 'Jeans' },
  { path: '/category/dresses', label: 'Dresses' },
  { path: '/category/jackets', label: 'Jackets' },
  { path: '/category/footwear', label: 'Footwear' },
  { path: '/category/accessories', label: 'Accessories' },
];

// Mega menu groups — related categories bundled together
const APPAREL_SLUGS = ['shirts', 't-shirts', 'jeans', 'dresses', 'jackets'];

const megaMenuGroups = [
  {
    title: 'Apparel',
    items: categories
      .filter((c) => APPAREL_SLUGS.includes(c.slug))
      .map((c) => ({ ...c, path: `/category/${c.slug}` })),
  },
  {
    title: 'Footwear & Accessories',
    items: categories
      .filter((c) => !APPAREL_SLUGS.includes(c.slug))
      .map((c) => ({ ...c, path: `/category/${c.slug}` })),
  },
];

// Grace period so moving from the link into the panel never flickers
const CLOSE_DELAY = 150;

export default function Navbar() {
  const navRef = useRef(null);
  const logoRef = useRef(null);
  const { scrollDirection, isAtTop, scrollY } = useScrollDirection();
  const location = useLocation();
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [announcementHeight, setAnnouncementHeight] = useState(0);
  const closeTimerRef = useRef(null);

  const cartCount = useCartStore((s) => s.getItemCount());
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const { openCart, openWishlist, openSearch, openMobileMenu, isMobileMenuOpen, closeMobileMenu, darkMode, toggleDarkMode, announcementVisible } = useUIStore();
  const { isLoggedIn, user, login, logout } = useUserStore();

  // Mega menu hover — immediate open, delayed close (prevents flicker while
  // the cursor travels between the Categories link and the panel)
  const openCategories = () => {
    clearTimeout(closeTimerRef.current);
    setShowCategoryDropdown(true);
  };

  const scheduleCategoriesClose = () => {
    clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => setShowCategoryDropdown(false), CLOSE_DELAY);
  };

  const closeCategories = () => {
    clearTimeout(closeTimerRef.current);
    setShowCategoryDropdown(false);
  };

  useEffect(() => () => clearTimeout(closeTimerRef.current), []);

  // Close the mega menu on navigation
  useEffect(() => {
    setShowCategoryDropdown(false);
  }, [location.pathname]);

  // Measure the welcome/announcement bar so the navbar always sits directly
  // below it (and never overlaps), then glides to top:0 as the bar scrolls away
  useLayoutEffect(() => {
    if (!announcementVisible) {
      setAnnouncementHeight(0);
      return;
    }
    const bar = document.querySelector('.announcement-ticker');
    if (!bar) return;
    const measure = () => setAnnouncementHeight(bar.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(bar);
    return () => ro.disconnect();
  }, [announcementVisible]);

  const navTop = Math.max(0, announcementHeight - scrollY);

  // GSAP scroll-based navbar animation
  useEffect(() => {
    const nav = navRef.current;
    const logo = logoRef.current;
    if (!nav || !logo) return;

    if (isAtTop) {
      // Expanded state at top
      gsap.to(nav, {
        height: 80,
        backgroundColor: 'rgba(248, 246, 242, 0)',
        backdropFilter: 'blur(0px)',
        boxShadow: '0 0 0 0 rgba(0,0,0,0)',
        duration: 0.4,
        ease: 'power2.out',
      });
      gsap.to(logo, {
        scale: 1,
        duration: 0.4,
        ease: 'power2.out',
      });
    } else if (scrollDirection === 'down') {
      // Shrink on scroll down
      gsap.to(nav, {
        height: 64,
        backgroundColor: darkMode ? 'rgba(26, 26, 26, 0.97)' : 'rgba(248, 246, 242, 0.97)',
        backdropFilter: 'blur(16px)',
        boxShadow: darkMode
          ? '0 1px 0 rgba(255,255,255,0.05), 0 4px 20px rgba(0,0,0,0.15)'
          : '0 1px 0 rgba(0,0,0,0.04), 0 4px 20px rgba(0,0,0,0.06)',
        duration: 0.4,
        ease: 'power2.out',
      });
      gsap.to(logo, {
        scale: 0.85,
        duration: 0.4,
        ease: 'power2.out',
      });
    } else {
      // Expand on scroll up
      gsap.to(nav, {
        height: 72,
        backgroundColor: darkMode ? 'rgba(26, 26, 26, 0.97)' : 'rgba(248, 246, 242, 0.97)',
        backdropFilter: 'blur(16px)',
        boxShadow: darkMode
          ? '0 1px 0 rgba(255,255,255,0.05), 0 4px 20px rgba(0,0,0,0.15)'
          : '0 1px 0 rgba(0,0,0,0.04), 0 4px 20px rgba(0,0,0,0.06)',
        duration: 0.4,
        ease: 'power2.out',
      });
      gsap.to(logo, {
        scale: 0.92,
        duration: 0.4,
        ease: 'power2.out',
      });
    }
  }, [scrollDirection, isAtTop, darkMode]);

  return (
    <>
      <nav
        ref={navRef}
        className="fixed left-0 right-0 z-40 flex items-center"
        style={{ height: 80, top: navTop }}
      >
        <div className="container-custom relative z-10 w-full flex items-center justify-between">
          {/* Mobile Hamburger */}
          <button
            className="btn-icon inline-flex lg:hidden -ml-2"
            onClick={openMobileMenu}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center" ref={logoRef}>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-widest text-charcoal dark:text-cream">
              CLOZARI
            </h1>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1.5 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path || 
                (link.path === '/shop' && location.pathname.startsWith('/shop') && !location.search.includes('tag='));
              return (
              <div
                key={link.path}
                className="relative"
                onMouseEnter={() => link.hasDropdown && openCategories()}
                onMouseLeave={() => link.hasDropdown && scheduleCategoriesClose()}
              >
                <Link
                  to={link.path === '/categories' ? '/shop' : link.path}
                  className={cn(
                    'px-3.5 xl:px-4 py-2.5 text-sm font-semibold tracking-wide uppercase transition-colors duration-200 flex items-center gap-1.5 rounded-lg relative',
                    'hover:text-gold hover:bg-gold/5',
                    isActive
                      ? 'text-gold'
                      : 'text-charcoal dark:text-cream'
                  )}
                >
                  {link.label}
                  {link.hasDropdown && <ChevronDown size={14} className={cn('transition-transform duration-200', showCategoryDropdown && 'rotate-180')} />}
                  {isActive && (
                    <span className="absolute bottom-0.5 left-3.5 right-3.5 xl:left-4 xl:right-4 h-[2px] bg-gold rounded-full" />
                  )}
                </Link>
              </div>
              );
            })}
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="btn-icon hidden sm:inline-flex"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Search */}
            <button
              onClick={openSearch}
              className="btn-icon inline-flex"
              aria-label="Open search"
            >
              <Search size={20} />
            </button>

            {/* Wishlist */}
            <button
              onClick={openWishlist}
              className="btn-icon relative inline-flex"
              aria-label="Open wishlist"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <motion.span
                  key={wishlistCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-0 right-0 bg-gold text-white text-[9px] font-bold min-w-[16px] h-4 rounded-full flex items-center justify-center leading-none"
                >
                  {wishlistCount}
                </motion.span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={openCart}
              className="btn-icon relative inline-flex"
              aria-label="Open cart"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                  className="absolute top-0 right-0 bg-gold text-white text-[9px] font-bold min-w-[16px] h-4 rounded-full flex items-center justify-center leading-none"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>

            {/* User */}
            <div
              className="relative hidden sm:block"
              onMouseEnter={() => setShowUserDropdown(true)}
              onMouseLeave={() => setShowUserDropdown(false)}
            >
              <button className="btn-icon inline-flex" aria-label="Account">
                <User size={20} />
              </button>
              <AnimatePresence>
                {showUserDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-3 w-[240px] bg-white dark:bg-charcoal-light rounded-xl shadow-elevated border border-gray-200/60 dark:border-gray-700/60 p-2"
                  >
                    {isLoggedIn ? (
                      <>
                        <div className="px-4 py-3 mb-1.5 border-b border-gray-100 dark:border-gray-700/70">
                          <p className="text-sm font-semibold text-charcoal dark:text-cream">{user?.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{user?.email}</p>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <Link to="/account" className="rounded-lg px-4 py-2.5 text-sm text-charcoal dark:text-cream hover:bg-gold/10 hover:text-gold transition-all duration-200 hover:translate-x-0.5">My Profile</Link>
                          <Link to="/account/orders" className="rounded-lg px-4 py-2.5 text-sm text-charcoal dark:text-cream hover:bg-gold/10 hover:text-gold transition-all duration-200 hover:translate-x-0.5">My Orders</Link>
                          <Link to="/account/wishlist" className="rounded-lg px-4 py-2.5 text-sm text-charcoal dark:text-cream hover:bg-gold/10 hover:text-gold transition-all duration-200 hover:translate-x-0.5">Wishlist</Link>
                          <Link to="/account/addresses" className="rounded-lg px-4 py-2.5 text-sm text-charcoal dark:text-cream hover:bg-gold/10 hover:text-gold transition-all duration-200 hover:translate-x-0.5">Addresses</Link>
                          <hr className="my-1 border-gray-100 dark:border-gray-700/70" />
                          <button
                            onClick={logout}
                            className="w-full text-left rounded-lg px-4 py-2.5 text-sm text-error hover:bg-error/10 transition-colors flex items-center gap-2"
                          >
                            <LogOut size={16} /> Sign Out
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="px-4 py-3">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Sign in for a personalized experience</p>
                          <button
                            onClick={() => login()}
                            className="btn btn-primary w-full !min-h-[44px] !py-2.5 !px-4 !text-sm !tracking-normal !normal-case"
                          >
                            <LogIn size={16} /> Sign In
                          </button>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Categories Mega Menu — full-width panel sliding down from the navbar */}
        <AnimatePresence>
          {showCategoryDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={openCategories}
              onMouseLeave={scheduleCategoriesClose}
              className="hidden lg:block absolute top-full left-0 right-0 bg-white dark:bg-charcoal-light border-t border-b border-gray-200/70 dark:border-gray-700/70 shadow-elevated"
            >
              <div className="container-custom py-6 sm:py-8 max-h-[calc(100dvh_-_8rem)] overflow-y-auto">
                {/* Panel header */}
                <div className="flex items-end justify-between gap-4 mb-5 sm:mb-7">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
                      Shop by Category
                    </p>
                    <h3 className="mt-1 font-serif text-lg sm:text-xl font-semibold text-charcoal dark:text-cream">
                      Browse Our Collections
                    </h3>
                  </div>
                  <Link
                    to="/shop"
                    onClick={closeCategories}
                    className="group inline-flex shrink-0 items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-charcoal dark:text-cream hover:text-gold transition-colors"
                  >
                    View All
                    <ArrowRight
                      size={14}
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </Link>
                </div>

                {/* Grouped category grid */}
                <div className="flex flex-col gap-8 lg:flex-row">
                  {megaMenuGroups.map((group, gi) => (
                    <div
                      key={group.title}
                      className={cn(
                        'min-w-0',
                        gi === 0
                          ? 'lg:flex-[5]'
                          : 'lg:flex-[2] lg:border-l lg:border-gray-200/70 dark:lg:border-gray-700/70 lg:pl-10'
                      )}
                    >
                      <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500">
                        {group.title}
                      </p>
                      <div
                        className={cn(
                          'grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4',
                          gi === 0 ? 'lg:grid-cols-5' : 'lg:grid-cols-2'
                        )}
                      >
                        {group.items.map((cat) => (
                          <Link
                            key={cat.slug}
                            to={cat.path}
                            onClick={closeCategories}
                            className="group block overflow-hidden rounded-xl border border-gray-200/70 dark:border-gray-700/70 bg-cream/60 dark:bg-charcoal/40 hover:border-gold/50 hover:shadow-soft transition-all duration-300"
                          >
                            <div className="aspect-[16/10] overflow-hidden bg-cream-dark dark:bg-charcoal-light">
                              <img
                                src={cat.image}
                                alt={cat.name}
                                loading="lazy"
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            </div>
                            <div className="p-3">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-sm font-semibold text-charcoal dark:text-cream group-hover:text-gold transition-colors">
                                  {cat.name}
                                </span>
                                <ChevronRight
                                  size={14}
                                  className="shrink-0 text-gray-300 dark:text-gray-600 group-hover:text-gold group-hover:translate-x-0.5 transition-all duration-200"
                                />
                              </div>
                              <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
                                {cat.description}
                              </p>
                              <p className="mt-1.5 text-[11px] font-semibold text-gold">
                                {cat.productCount} products
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile Menu Drawer */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        navLinks={navLinks}
        categoryLinks={categoryDropdown}
      />
    </>
  );
}
