/**
 * Navbar — Premium sticky navbar with GSAP scroll-based shrink/expand
 *
 * Behavior:
 * - At top: Tall/expanded, transparent background
 * - Scroll DOWN past hero: Smoothly shrinks, solid/blurred background
 * - Scroll UP: Smoothly expands back
 * - Mobile: Hamburger → slide-in drawer
 */
import { useRef, useEffect, useState } from 'react';
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
} from 'lucide-react';
import useScrollDirection from '../../hooks/useScrollDirection';
import useCartStore from '../../store/useCartStore';
import useWishlistStore from '../../store/useWishlistStore';
import useUIStore from '../../store/useUIStore';
import useUserStore from '../../store/useUserStore';
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

export default function Navbar() {
  const navRef = useRef(null);
  const logoRef = useRef(null);
  const { scrollDirection, isAtTop } = useScrollDirection();
  const location = useLocation();
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const cartCount = useCartStore((s) => s.getItemCount());
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const { openCart, openWishlist, openSearch, openMobileMenu, isMobileMenuOpen, closeMobileMenu, darkMode, toggleDarkMode } = useUIStore();
  const { isLoggedIn, user, login, logout } = useUserStore();

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
        className="fixed top-0 left-0 right-0 z-40 flex items-center"
        style={{ height: 80 }}
      >
        <div className="container-custom w-full flex items-center justify-between">
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
                onMouseEnter={() => link.hasDropdown && setShowCategoryDropdown(true)}
                onMouseLeave={() => link.hasDropdown && setShowCategoryDropdown(false)}
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

                {/* Category Dropdown */}
                {link.hasDropdown && (
                  <AnimatePresence>
                    {showCategoryDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-3 w-[240px] bg-white dark:bg-charcoal-light rounded-xl shadow-elevated border border-gray-200/60 dark:border-gray-700/60 p-2"
                      >
                        <span className="block px-4 pt-2 pb-2.5 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 dark:border-gray-700/70">
                          Shop by Category
                        </span>
                        <div className="flex flex-col gap-0.5">
                          {categoryDropdown.map((cat) => (
                            <Link
                              key={cat.path}
                              to={cat.path}
                              className="group flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-charcoal dark:text-cream hover:bg-gold/10 hover:text-gold transition-all duration-200 hover:translate-x-0.5"
                            >
                              {cat.label}
                              <ChevronRight
                                size={14}
                                className="text-gray-300 dark:text-gray-600 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-gold transition-all duration-200"
                              />
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
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
