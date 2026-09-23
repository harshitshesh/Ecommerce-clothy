/**
 * QuickViewModal — Interactive modal preview of product details
 * Allows selecting size, color, quantity, and instantly adding to cart
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ShoppingBag, Plus, Minus, ArrowRight, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import useUIStore from '../../store/useUIStore';
import useCartStore from '../../store/useCartStore';
import useWishlistStore from '../../store/useWishlistStore';
import RatingStars from '../ui/RatingStars';
import { formatCurrency, getDiscountPercent } from '../../utils/formatCurrency';

export default function QuickViewModal() {
  const { quickViewProduct, closeQuickView, openCart } = useUIStore();
  const addItem = useCartStore((s) => s.addItem);
  const { toggleItem, isWishlisted } = useWishlistStore();

  const product = quickViewProduct;
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Sync state whenever product changes
  useEffect(() => {
    if (product) {
      setSelectedImage(0);
      setSelectedSize(product.sizes?.[0] || 'M');
      setSelectedColor(product.colors?.[0] || null);
      setQuantity(1);
    }
  }, [product]);

  // Handle ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && product) closeQuickView();
    };
    if (product) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [product, closeQuickView]);

  if (!product) return null;

  const wishlisted = isWishlisted(product.id);
  const discount = getDiscountPercent(product.price, product.discountPrice);

  const handleAddToCart = () => {
    addItem(product, selectedSize, selectedColor, quantity);
    toast.success(`${product.name} added to cart!`, { icon: '🛍️' });
    closeQuickView();
    openCart();
  };

  const handleToggleWishlist = () => {
    const added = toggleItem(product);
    toast.success(added ? 'Saved to wishlist ❤️' : 'Removed from wishlist', {
      icon: added ? '❤️' : '💔',
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeQuickView}
          className="fixed inset-0 bg-charcoal/70 dark:bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-4xl bg-cream dark:bg-charcoal rounded-2xl shadow-elevated border border-gray-200/50 dark:border-gray-800 overflow-hidden max-h-[90vh] flex flex-col md:flex-row"
        >
          {/* Close button */}
          <button
            onClick={closeQuickView}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-cream/80 dark:bg-charcoal/80 backdrop-blur-md text-charcoal dark:text-cream hover:bg-cream dark:hover:bg-charcoal shadow-sm transition-all"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          {/* Left: Gallery */}
          <div className="md:w-1/2 p-6 flex flex-col justify-between bg-cream-dark/30 dark:bg-gray-900/30">
            {/* Main Image */}
            <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-4">
              <img
                src={product.images[selectedImage] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
              {discount > 0 && (
                <span className="absolute top-3 left-3 bg-error text-white text-xs font-bold px-2.5 py-1 rounded-md">
                  -{discount}% OFF
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-14 h-18 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                      selectedImage === idx
                        ? 'border-gold shadow-sm scale-105'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info & Controls */}
          <div className="md:w-1/2 p-6 md:p-8 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-4">
              {/* Category & Rating */}
              <div>
                <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
                  {product.category}
                </span>
                <h2 className="font-serif text-2xl font-bold text-charcoal dark:text-cream mt-1">
                  {product.name}
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  <RatingStars rating={product.rating} size={15} />
                  <span className="text-xs text-gray-500">
                    ({product.reviewsCount} customer reviews)
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-2xl font-bold text-charcoal dark:text-cream">
                  {formatCurrency(product.discountPrice || product.price)}
                </span>
                {product.discountPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    {formatCurrency(product.price)}
                  </span>
                )}
              </div>

              {/* Short Description */}
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
                {product.description}
              </p>

              {/* Color Swatches */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider mb-2 text-gray-500">
                    <span>Color: <strong className="text-charcoal dark:text-cream">{selectedColor?.name}</strong></span>
                  </div>
                  <div className="flex gap-2.5">
                    {product.colors.map((c) => {
                      const isSelected = selectedColor?.name === c.name;
                      return (
                        <button
                          key={c.name}
                          onClick={() => setSelectedColor(c)}
                          className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all ${
                            isSelected ? 'ring-2 ring-gold ring-offset-2 scale-110' : 'border-gray-300 dark:border-gray-700'
                          }`}
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        >
                          {isSelected && (
                            <Check
                              size={12}
                              className={c.hex === '#FFFFFF' || c.hex === '#F5F5F0' ? 'text-charcoal' : 'text-white'}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider mb-2 text-gray-500">
                    <span>Size: <strong className="text-charcoal dark:text-cream">{selectedSize}</strong></span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`px-3.5 py-2 text-xs font-bold rounded-lg uppercase tracking-wider border transition-all ${
                          selectedSize === s
                            ? 'bg-charcoal text-cream dark:bg-cream dark:text-charcoal border-transparent shadow-sm'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gold'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 block mb-2">
                  Quantity
                </span>
                <div className="inline-flex items-center border border-gray-200 dark:border-gray-700 rounded-lg">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="p-2 text-gray-500 hover:text-charcoal dark:hover:text-cream disabled:opacity-30"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-bold px-3 min-w-[28px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-2 text-gray-500 hover:text-charcoal dark:hover:text-cream"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-gray-200/50 dark:border-gray-800 mt-6 space-y-3">
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 bg-charcoal text-cream dark:bg-cream dark:text-charcoal rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-soft"
                >
                  <ShoppingBag size={16} /> Add to Bag
                </button>
                <button
                  onClick={handleToggleWishlist}
                  className="p-3.5 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-cream-dark dark:hover:bg-gray-800 transition-colors"
                  aria-label="Toggle wishlist"
                >
                  <Heart
                    size={18}
                    className={wishlisted ? 'text-error fill-error' : 'text-charcoal dark:text-cream'}
                  />
                </button>
              </div>

              <div className="text-center">
                <Link
                  to={`/product/${product.slug}`}
                  onClick={closeQuickView}
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gold hover:underline"
                >
                  View Full Product Details <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
