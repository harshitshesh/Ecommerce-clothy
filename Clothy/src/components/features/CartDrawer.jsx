/**
 * CartDrawer — Slide-out cart drawer with Framer Motion
 * Shows real-time item count, free shipping progress, quantity modifiers, subtotal, and checkout CTA
 */
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import useCartStore from '../../store/useCartStore';
import useUIStore from '../../store/useUIStore';
import { formatCurrency } from '../../utils/formatCurrency';

const FREE_SHIPPING_THRESHOLD = 1999;

export default function CartDrawer() {
  const { isCartOpen, closeCart } = useUIStore();
  const {
    items,
    removeItem,
    updateQuantity,
    getSubtotal,
    getShipping,
    getTotal,
  } = useCartStore();

  const subtotal = getSubtotal();
  const shipping = getShipping();
  const total = getTotal();
  const progressToFreeShipping = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const amountNeeded = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isCartOpen) closeCart();
    };
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCartOpen, closeCart]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
            className="fixed inset-0 bg-charcoal/60 dark:bg-black/70 backdrop-blur-sm"
          />

          {/* Drawer Container */}
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
                  <ShoppingBag size={20} className="text-gold" />
                  <h2 className="font-serif text-lg font-bold">Shopping Bag</h2>
                  <span className="text-xs bg-gold/15 text-gold px-2 py-0.5 rounded-full font-semibold">
                    {items.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </div>
                <button
                  onClick={closeCart}
                  className="p-1.5 rounded-full text-gray-500 hover:text-charcoal dark:hover:text-cream hover:bg-gray-200/50 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Close cart"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Free Shipping Progress Indicator */}
              <div className="bg-cream-dark dark:bg-charcoal-light/50 px-5 py-3 border-b border-gray-200/50 dark:border-gray-800">
                <div className="flex items-center gap-2 text-xs font-medium mb-1.5">
                  <Truck size={15} className="text-gold shrink-0" />
                  {amountNeeded > 0 ? (
                    <span>
                      Add <strong className="text-gold">{formatCurrency(amountNeeded)}</strong> more to get <strong className="text-charcoal dark:text-cream">FREE SHIPPING</strong>
                    </span>
                  ) : (
                    <span className="text-success font-semibold flex items-center gap-1">
                      🎉 You qualified for FREE SHIPPING!
                    </span>
                  )}
                </div>
                <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gold rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressToFreeShipping}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto p-5 divide-y divide-gray-200/50 dark:divide-gray-800 space-y-4">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-gold/10 text-gold flex items-center justify-center mb-4">
                      <ShoppingBag size={28} />
                    </div>
                    <h3 className="font-serif text-lg font-bold mb-1">Your bag is empty</h3>
                    <p className="text-xs text-gray-500 max-w-xs mb-6">
                      Explore our handcrafted seasonal garments and timeless wardrobe staples.
                    </p>
                    <button
                      onClick={closeCart}
                      className="px-6 py-2.5 bg-charcoal text-cream dark:bg-cream dark:text-charcoal text-xs font-bold rounded-lg uppercase tracking-wider hover:opacity-90 transition-opacity"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  items.map((item, index) => (
                    <div key={`${item.id}-${item.size}-${item.color?.name || ''}`} className="pt-4 first:pt-0 flex gap-4">
                      <Link
                        to={`/product/${item.slug}`}
                        onClick={closeCart}
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
                              onClick={closeCart}
                              className="text-sm font-medium hover:text-gold transition-colors line-clamp-1"
                            >
                              {item.name}
                            </Link>
                            <button
                              onClick={() => removeItem(index)}
                              className="text-gray-400 hover:text-error transition-colors p-1"
                              aria-label="Remove item"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {item.size && <span>Size: <strong className="text-charcoal dark:text-cream">{item.size}</strong></span>}
                            {item.color && (
                              <span className="flex items-center gap-1">
                                Color:
                                <span
                                  className="inline-block w-2.5 h-2.5 rounded-full border border-gray-300"
                                  style={{ backgroundColor: item.color.hex }}
                                />
                                <strong className="text-charcoal dark:text-cream">{item.color.name}</strong>
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          {/* Quantity Stepper */}
                          <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg bg-cream-dark/40 dark:bg-gray-800/40">
                            <button
                              onClick={() => updateQuantity(index, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="p-1 px-2 text-gray-500 hover:text-charcoal dark:hover:text-cream disabled:opacity-30"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-xs font-semibold px-2 min-w-[20px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(index, item.quantity + 1)}
                              className="p-1 px-2 text-gray-500 hover:text-charcoal dark:hover:text-cream"
                              aria-label="Increase quantity"
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <span className="text-sm font-bold text-charcoal dark:text-cream">
                              {formatCurrency(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer Summary & Checkout */}
              {items.length > 0 && (
                <div className="p-5 border-t border-gray-200/60 dark:border-gray-800 bg-cream-dark/30 dark:bg-charcoal-light/30 space-y-3">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Subtotal</span>
                      <span className="font-semibold text-charcoal dark:text-cream">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Estimated Shipping</span>
                      <span>{shipping === 0 ? <span className="text-success font-semibold">FREE</span> : formatCurrency(shipping)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-charcoal dark:text-cream pt-2 border-t border-gray-200/40 dark:border-gray-700">
                      <span>Total</span>
                      <span className="text-gold">{formatCurrency(total)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Link
                      to="/cart"
                      onClick={closeCart}
                      className="w-full text-center py-3 border border-charcoal/20 dark:border-cream/20 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-cream-dark dark:hover:bg-gray-800 transition-colors"
                    >
                      View Bag
                    </Link>
                    <Link
                      to="/checkout"
                      onClick={closeCart}
                      className="w-full text-center py-3 bg-charcoal text-cream dark:bg-cream dark:text-charcoal rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 shadow-soft"
                    >
                      Checkout <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
