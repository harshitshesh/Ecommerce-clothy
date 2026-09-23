/**
 * MobileMenu — Slide-in drawer for mobile navigation
 * Framer Motion staggered entrance animation
 */
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Sun, Moon, LogIn, LogOut } from 'lucide-react';
import { useState } from 'react';
import useUIStore from '../../store/useUIStore';
import useUserStore from '../../store/useUserStore';

const menuVariants = {
  closed: { x: '-100%' },
  open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30, staggerChildren: 0.05, delayChildren: 0.1 } },
  exit: { x: '-100%', transition: { duration: 0.3, ease: 'easeInOut' } },
};

const itemVariants = {
  closed: { x: -20, opacity: 0 },
  open: { x: 0, opacity: 1 },
};

const backdropVariants = {
  closed: { opacity: 0 },
  open: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function MobileMenu({ isOpen, onClose, navLinks, categoryLinks }) {
  const location = useLocation();
  const [showCategories, setShowCategories] = useState(false);
  const { darkMode, toggleDarkMode } = useUIStore();
  const { isLoggedIn, user, login, logout } = useUserStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="closed"
            animate="open"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          />

          {/* Drawer */}
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="exit"
            className="fixed top-0 left-0 bottom-0 w-[300px] max-w-[85vw] bg-cream dark:bg-charcoal z-50 lg:hidden overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
              <h2 className="font-serif text-2xl font-bold tracking-widest text-charcoal dark:text-cream">
                CLOZARI
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-charcoal dark:text-cream hover:text-gold transition-colors"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            {/* User Info */}
            {isLoggedIn && (
              <motion.div variants={itemVariants} className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm font-semibold text-charcoal dark:text-cream">Welcome, {user?.name?.split(' ')[0]}</p>
                <p className="text-xs text-gray-500 mt-0.5">{user?.email}</p>
              </motion.div>
            )}

            {/* Nav Links */}
            <nav className="py-4">
              {navLinks.map((link) => (
                <motion.div key={link.path} variants={itemVariants}>
                  {link.hasDropdown ? (
                    <div>
                      <button
                        onClick={() => setShowCategories(!showCategories)}
                        className="w-full flex items-center justify-between px-5 py-3.5 text-base font-medium text-charcoal dark:text-cream hover:text-gold hover:bg-cream-dark dark:hover:bg-charcoal-light transition-colors"
                      >
                        {link.label}
                        <ChevronRight
                          size={18}
                          className={`transition-transform duration-200 ${showCategories ? 'rotate-90' : ''}`}
                        />
                      </button>
                      <AnimatePresence>
                        {showCategories && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden bg-cream-dark/50 dark:bg-charcoal-light/50"
                          >
                            {categoryLinks.map((cat) => (
                              <Link
                                key={cat.path}
                                to={cat.path}
                                onClick={onClose}
                                className="block pl-10 pr-5 py-3 text-sm text-gray-600 dark:text-gray-400 hover:text-gold transition-colors"
                              >
                                {cat.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      to={link.path}
                      onClick={onClose}
                      className={`block px-5 py-3.5 text-base font-medium transition-colors hover:text-gold hover:bg-cream-dark dark:hover:bg-charcoal-light ${
                        location.pathname === link.path
                          ? 'text-gold'
                          : 'text-charcoal dark:text-cream'
                      }`}
                    >
                      {link.label}
                    </Link>
                  )}
                </motion.div>
              ))}
            </nav>

            {/* Account Links */}
            <div className="border-t border-gray-200 dark:border-gray-700 py-4">
              {isLoggedIn ? (
                <>
                  <motion.div variants={itemVariants}>
                    <Link to="/account" onClick={onClose} className="block px-5 py-3 text-sm text-charcoal dark:text-cream hover:text-gold transition-colors">My Profile</Link>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <Link to="/account/orders" onClick={onClose} className="block px-5 py-3 text-sm text-charcoal dark:text-cream hover:text-gold transition-colors">My Orders</Link>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <Link to="/account/addresses" onClick={onClose} className="block px-5 py-3 text-sm text-charcoal dark:text-cream hover:text-gold transition-colors">Addresses</Link>
                  </motion.div>
                </>
              ) : null}
            </div>

            {/* Footer Actions */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-5 space-y-3">
              <button
                onClick={toggleDarkMode}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-charcoal dark:text-cream rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gold transition-colors"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </button>

              {isLoggedIn ? (
                <button
                  onClick={() => { logout(); onClose(); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-error rounded-lg border border-error/30 hover:bg-error/5 transition-colors"
                >
                  <LogOut size={18} /> Sign Out
                </button>
              ) : (
                <button
                  onClick={() => { login(); onClose(); }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-charcoal dark:bg-cream text-cream dark:text-charcoal rounded-lg hover:opacity-90 transition-opacity"
                >
                  <LogIn size={18} /> Sign In
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
