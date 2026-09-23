/**
 * ProductCard — Premium product card with GSAP scroll reveal + Framer Motion hover
 */
import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import useCartStore from '../../store/useCartStore';
import useWishlistStore from '../../store/useWishlistStore';
import useUIStore from '../../store/useUIStore';
import { formatCurrency, getDiscountPercent } from '../../utils/formatCurrency';
import RatingStars from './RatingStars';

gsap.registerPlugin(ScrollTrigger);

export default function ProductCard({ product, index = 0 }) {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const { toggleItem, isWishlisted } = useWishlistStore();
  const setQuickViewProduct = useUIStore((s) => s.setQuickViewProduct);
  const wishlisted = isWishlisted(product.id);
  const discount = getDiscountPercent(product.price, product.discountPrice);

  // GSAP scroll-triggered entrance animation (fail-open: visible if GSAP never runs)
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(card, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: (index % 4) * 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 95%',
            toggleActions: 'play none none none',
            once: true,
          },
        }
      );
    });

    // Ensure triggers evaluate current scroll position (Lenis / late layout)
    ScrollTrigger.refresh();

    // Fail-open safety: never leave an on-screen card stuck invisible
    const safety = window.setTimeout(() => {
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (inView && Number(window.getComputedStyle(card).opacity) < 0.05) {
        gsap.to(card, { opacity: 1, y: 0, duration: 0.4, overwrite: true });
      }
    }, 2500);

    return () => {
      window.clearTimeout(safety);
      ctx.revert();
    };
  }, [index]);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, product.sizes[0], product.colors[0]);
    toast.success(`${product.name} added to cart!`, { icon: '🛍️' });
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleItem(product);
    toast.success(
      added ? `Added to wishlist ❤️` : 'Removed from wishlist',
      { icon: added ? '❤️' : '💔' }
    );
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  return (
    <div
      ref={cardRef}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.slug}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-3.5 sm:mb-4">
          {/* Primary Image — always fully visible at rest */}
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-500 ease-out group-hover:scale-[1.03] ${
              isHovered && product.images[1] ? 'opacity-0' : 'opacity-100'
            }`}
          />
          {/* Secondary Image — hover-only enhancement */}
          {product.images[1] && (
            <img
              src={product.images[1]}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className={`absolute inset-0 w-full h-full object-cover object-center pointer-events-none transition-all duration-500 ease-out group-hover:scale-[1.03] ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {discount > 0 && (
              <span className="bg-error text-white text-[10px] font-bold px-2 py-1 rounded-md">
                -{discount}%
              </span>
            )}
            {product.tags.includes('new') && (
              <span className="bg-charcoal text-cream text-[10px] font-bold px-2 py-1 rounded-md">
                NEW
              </span>
            )}
            {product.tags.includes('bestseller') && (
              <span className="bg-gold text-white text-[10px] font-bold px-2 py-1 rounded-md">
                BESTSELLER
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <motion.button
            onClick={handleToggleWishlist}
            whileTap={{ scale: 0.8 }}
            className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 dark:bg-charcoal/80 backdrop-blur-sm shadow-sm hover:bg-white dark:hover:bg-charcoal transition-colors"
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <motion.div
              animate={wishlisted ? { scale: [1, 1.3, 1] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Heart
                size={18}
                className={wishlisted ? 'fill-error text-error' : 'text-charcoal dark:text-cream'}
              />
            </motion.div>
          </motion.button>

          {/* Hover Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
            transition={{ duration: 0.25 }}
            className="absolute bottom-3 left-3 right-3 z-10 flex gap-2"
          >
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 min-h-[40px] py-2.5 bg-charcoal text-cream dark:bg-cream dark:text-charcoal text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              <ShoppingBag size={14} /> Add to Cart
            </button>
            <button
              onClick={handleQuickView}
              className="p-2.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-colors"
              aria-label="Quick view"
            >
              <Eye size={16} className="text-charcoal dark:text-cream" />
            </button>
          </motion.div>

          {/* Low Stock Warning */}
          {product.stock <= 5 && (
            <div className="absolute bottom-3 left-3 right-3 z-[5]">
              <p className="text-[10px] font-semibold text-warning bg-warning/10 backdrop-blur-sm px-2 py-1 rounded text-center">
                Only {product.stock} left in stock
              </p>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="px-1">
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
            {product.category}
          </p>
          <h3 className="text-sm font-medium text-charcoal dark:text-cream line-clamp-1 mb-2 group-hover:text-gold transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-1.5 mb-2">
            <RatingStars rating={product.rating} size={12} />
            <span className="text-[11px] text-gray-500">({product.reviewsCount})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-charcoal dark:text-cream">
              {formatCurrency(product.discountPrice || product.price)}
            </span>
            {product.discountPrice && (
              <span className="text-xs text-gray-400 line-through">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
