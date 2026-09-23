/**
 * WishlistDrawer — Slide-out wishlist drawer
 * Allows quickly viewing saved pieces, moving to cart, or deleting
 */
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import useWishlistStore from '../../store/useWishlistStore';
import useCartStore from '../../store/useCartStore';
import useUIStore from '../../store/useUIStore';
import { formatCurrency } from '../../utils/formatCurrency';
import products from '../../data/products';

export default function WishlistDrawer() {
  const { isWishlistOpen, closeWishlist, openCart } = useUIStore();
  const { items, removeItem } = useWishlistStore();
  const addToCart = useCartStore((s) => s.addItem);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isWishlistOpen) closeWishlist();
    };
    if (isWishlistOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isWishlistOpen, closeWishlist]);

  const handleMoveToCart = (item) => {
    // Find full product details for default size & color
    const fullProduct = products.find((p) => p.id === item.id);
    const size = fullProduct?.sizes?.[0] || 'M';
    const color = fullProduct?.colors?.[0] || { name: 'Default', hex: '#000000' };

    addToCart(fullProduct || item, size, color);
    removeItem(item.id);
    toast.success(`Moved ${item.name} to bag!`, { icon: '🛍️' });
    closeWishlist();
    openCart();
  };

  return (
    <AnimatePresence>
      {isWishlistOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeWishlist}
            className="fixed inset-0 bg-charcoal/60 dark:bg-black/70 backdrop-blur-sm"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="w-screen max-w-md bg-cream dark:bg-charcoal text-charcoal dark:text-cream shadow-2xl flex flex-col border-l border-gray-200/60 dark:border-gray-800"
            >
              {/* Header */}
              <div className="p-5 border-b border-gray-200/60 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart size={20} className="text-error fill-error/20" />
                  <h2 className="font-serif text-lg font-bold">Saved Pieces</h2>
                  <span className="text-xs bg-error/10 text-error px-2 py-0.5 rounded-full font-semibold">
                    {items.length}
                  </span>
                </div>
                <button
                  onClick={closeWishlist}
                  className="p-1.5 rounded-full text-gray-500 hover:text-charcoal dark:hover:text-cream hover:bg-gray-200/50 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Close wishlist"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-5 divide-y divide-gray-200/50 dark:divide-gray-800 space-y-4">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-error/10 text-error flex items-center justify-center mb-4">
                      <Heart size={28} />
                    </div>
                    <h3 className="font-serif text-lg font-bold mb-1">Your wishlist is empty</h3>
                    <p className="text-xs text-gray-500 max-w-xs mb-6">
                      Save items you love to revisit and order anytime before they sell out.
                    </p>
                    <button
                      onClick={closeWishlist}
                      className="px-6 py-2.5 bg-charcoal text-cream dark:bg-cream dark:text-charcoal text-xs font-bold rounded-lg uppercase tracking-wider hover:opacity-90 transition-opacity"
                    >
                      Explore Catalogue
                    </button>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="pt-4 first:pt-0 flex gap-4">
                      <Link
                        to={`/product/${item.slug}`}
                        onClick={closeWishlist}
                        className="w-20 h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0 border border-gray-200/40 dark:border-gray-700"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover object-center"
                        />
                      </Link>

                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <Link
                              to={`/product/${item.slug}`}
                              onClick={closeWishlist}
                              className="text-sm font-medium hover:text-gold transition-colors line-clamp-1"
                            >
                              {item.name}
                            </Link>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-gray-400 hover:text-error transition-colors p-1"
                              aria-label="Remove item"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider mt-0.5">
                            {item.category}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <span className="text-sm font-bold text-charcoal dark:text-cream">
                            {formatCurrency(item.discountPrice || item.price)}
                          </span>

                          <button
                            onClick={() => handleMoveToCart(item)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-charcoal text-cream dark:bg-cream dark:text-charcoal rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity"
                          >
                            <ShoppingBag size={13} /> Move to Bag
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer View Wishlist link */}
              {items.length > 0 && (
                <div className="p-5 border-t border-gray-200/60 dark:border-gray-800 bg-cream-dark/30 dark:bg-charcoal-light/30">
                  <Link
                    to="/wishlist"
                    onClick={closeWishlist}
                    className="w-full py-3 bg-charcoal text-cream dark:bg-cream dark:text-charcoal rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-soft"
                  >
                    View Complete Wishlist <ArrowRight size={14} />
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
