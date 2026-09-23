/**
 * ProductDetail Page — Editorial single product showcase
 * Zoomable gallery, interactive swatches, size guide modal, tabbed technical specs, reviews, and related pieces
 */
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ShoppingBag, Truck, RefreshCw, ShieldCheck, Share2, Layers } from 'lucide-react';
import toast from 'react-hot-toast';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import RatingStars from '../components/ui/RatingStars';
import ProductGallery from '../components/features/ProductGallery';
import SizeSelector from '../components/features/SizeSelector';
import ColorSwatch from '../components/features/ColorSwatch';
import ReviewCard from '../components/features/ReviewCard';
import ProductCard from '../components/ui/ProductCard';
import EmptyState from '../components/ui/EmptyState';
import products from '../data/products';
import { getReviewsByProductId } from '../data/reviews';
import useCartStore from '../store/useCartStore';
import useWishlistStore from '../store/useWishlistStore';
import useCompareStore from '../store/useCompareStore';
import useUserStore from '../store/useUserStore';
import useUIStore from '../store/useUIStore';
import { formatCurrency, getDiscountPercent } from '../utils/formatCurrency';

export default function ProductDetail() {
  const { slug } = useParams();
  const product = products.find((p) => p.slug === slug);

  const addItem = useCartStore((s) => s.addItem);
  const { toggleItem, isWishlisted } = useWishlistStore();
  const { addItem: addToCompare, isComparing, removeItem: removeFromCompare } = useCompareStore();
  const addToRecentlyViewed = useUserStore((s) => s.addToRecentlyViewed);
  const openCart = useUIStore((s) => s.openCart);

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description'); // 'description', 'reviews', 'shipping'

  // Sync state & record recently viewed
  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes?.[0] || 'M');
      setSelectedColor(product.colors?.[0] || null);
      setQuantity(1);
      addToRecentlyViewed(product);
      window.scrollTo(0, 0);
    }
  }, [product, addToRecentlyViewed]);

  if (!product) {
    return (
      <div className="pt-32 pb-16 container-custom">
        <EmptyState
          type="search"
          title="Garment Not Found"
          description="The piece you requested is no longer available in our atelier."
          actionText="Return to Catalogue"
          actionHref="/shop"
        />
      </div>
    );
  }

  const wishlisted = isWishlisted(product.id);
  const comparing = isComparing(product.id);
  const discount = getDiscountPercent(product.price, product.discountPrice);
  const reviews = getReviewsByProductId(product.id);
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addItem(product, selectedSize, selectedColor, quantity);
    toast.success(`${product.name} added to your bag!`, { icon: '🛍️' });
    openCart();
  };

  const handleToggleWishlist = () => {
    const added = toggleItem(product);
    toast.success(added ? 'Saved to wishlist ❤️' : 'Removed from wishlist', {
      icon: added ? '❤️' : '💔',
    });
  };

  const handleToggleCompare = () => {
    if (comparing) {
      removeFromCompare(product.id);
      toast.success('Removed from comparison');
    } else {
      addToCompare(product);
      toast.success('Added to comparison matrix', { icon: '⚖️' });
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!', { icon: '🔗' });
  };

  return (
    <div className="pt-24 sm:pt-28 pb-16">
      <div className="container-custom">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs
            items={[
              { label: 'Shop', path: '/shop' },
              { label: product.category, path: `/category/${product.category.toLowerCase()}` },
              { label: product.name },
            ]}
          />
        </div>

        {/* Top Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 mb-16">
          {/* Left: Gallery (Col 7) */}
          <div className="lg:col-span-7">
            <ProductGallery
              images={product.images}
              name={product.name}
              tags={product.tags}
              price={product.price}
              discountPrice={product.discountPrice}
            />
          </div>

          {/* Right: Details & Order Box (Col 5) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Category & Title */}
              <div>
                <span className="text-xs uppercase tracking-widest text-gold font-bold block mb-1">
                  {product.category}
                </span>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal dark:text-cream leading-tight">
                  {product.name}
                </h1>

                {/* Rating & Reviews Jump */}
                <div className="flex items-center gap-2 mt-2">
                  <RatingStars rating={product.rating} size={15} />
                  <button
                    onClick={() => {
                      setActiveTab('reviews');
                      document.getElementById('tabs-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-xs text-gray-500 hover:text-gold transition-colors"
                  >
                    ({product.reviewsCount} verified reviews)
                  </button>
                </div>
              </div>

              {/* Price Display */}
              <div className="flex items-baseline gap-3 pb-4 border-b border-gray-200/60 dark:border-gray-800">
                <span className="font-serif text-3xl font-bold text-charcoal dark:text-cream">
                  {formatCurrency(product.discountPrice || product.price)}
                </span>
                {product.discountPrice && (
                  <span className="text-base text-gray-400 line-through">
                    {formatCurrency(product.price)}
                  </span>
                )}
                {discount > 0 && (
                  <span className="text-xs font-bold text-error bg-error/10 px-2 py-0.5 rounded">
                    Save {discount}%
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-sans">
                {product.description}
              </p>

              {/* Color Swatch */}
              {product.colors && (
                <ColorSwatch
                  colors={product.colors}
                  selectedColor={selectedColor}
                  onSelectColor={setSelectedColor}
                />
              )}

              {/* Size Selector */}
              {product.sizes && (
                <SizeSelector
                  sizes={product.sizes}
                  selectedSize={selectedSize}
                  onSelectSize={setSelectedSize}
                  stock={product.stock}
                />
              )}

              {/* Quantity Stepper */}
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 block mb-2">
                  Quantity
                </span>
                <div className="inline-flex items-center border border-gray-200 dark:border-gray-700 rounded-xl bg-cream-dark/30 dark:bg-gray-800/30">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="px-3.5 py-2 text-gray-500 hover:text-charcoal dark:hover:text-cream disabled:opacity-30"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold px-3 min-w-[28px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3.5 py-2 text-gray-500 hover:text-charcoal dark:hover:text-cream"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 py-4 bg-charcoal text-cream dark:bg-cream dark:text-charcoal rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center gap-2.5 shadow-soft"
                  >
                    <ShoppingBag size={16} /> Add to Bag
                  </button>

                  <button
                    onClick={handleToggleWishlist}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-cream-dark dark:hover:bg-gray-800 transition-colors"
                    aria-label="Wishlist"
                  >
                    <Heart
                      size={20}
                      className={wishlisted ? 'fill-error text-error' : 'text-charcoal dark:text-cream'}
                    />
                  </button>

                  <button
                    onClick={handleShare}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-cream-dark dark:hover:bg-gray-800 transition-colors"
                    aria-label="Share"
                  >
                    <Share2 size={18} className="text-charcoal dark:text-cream" />
                  </button>
                </div>

                {/* Compare Button */}
                <button
                  onClick={handleToggleCompare}
                  className="w-full py-2.5 border border-gray-200/80 dark:border-gray-800 rounded-xl text-xs font-medium text-gray-500 hover:text-charcoal dark:hover:text-cream flex items-center justify-center gap-2 transition-colors"
                >
                  <Layers size={14} />
                  <span>{comparing ? 'Remove from Comparison' : 'Add to Compare Matrix'}</span>
                </button>
              </div>

              {/* Assurance Badges */}
              <div className="pt-4 border-t border-gray-200/60 dark:border-gray-800 space-y-2 text-xs text-gray-500">
                <div className="flex items-center gap-2.5">
                  <Truck size={15} className="text-gold" />
                  <span>Complimentary express delivery on orders over ₹1,999</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <RefreshCw size={15} className="text-gold" />
                  <span>30-day effortless doorstep return & size exchange</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck size={15} className="text-gold" />
                  <span>Certified 100% genuine couture garment</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Specs, Reviews & Shipping */}
        <div id="tabs-section" className="border-t border-gray-200/60 dark:border-gray-800 pt-12 mb-16">
          {/* Tab Navigation */}
          <div className="flex gap-8 border-b border-gray-200 dark:border-gray-800 mb-8">
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-4 text-xs sm:text-sm font-bold uppercase tracking-wider relative transition-colors ${
                activeTab === 'description'
                  ? 'text-gold'
                  : 'text-gray-400 hover:text-charcoal dark:hover:text-cream'
              }`}
            >
              Fabric & Details
              {activeTab === 'description' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 text-xs sm:text-sm font-bold uppercase tracking-wider relative transition-colors ${
                activeTab === 'reviews'
                  ? 'text-gold'
                  : 'text-gray-400 hover:text-charcoal dark:hover:text-cream'
              }`}
            >
              Patron Reviews ({reviews.length})
              {activeTab === 'reviews' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('shipping')}
              className={`pb-4 text-xs sm:text-sm font-bold uppercase tracking-wider relative transition-colors ${
                activeTab === 'shipping'
                  ? 'text-gold'
                  : 'text-gray-400 hover:text-charcoal dark:hover:text-cream'
              }`}
            >
              Delivery & Care
              {activeTab === 'shipping' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />
              )}
            </button>
          </div>

          {/* Tab 1: Description & Technical Specs */}
          {activeTab === 'description' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              <div>
                <h4 className="font-serif font-bold text-lg text-charcoal dark:text-cream mb-3">
                  Design Narrative
                </h4>
                <p className="mb-4">
                  {product.description} Cut with deliberate balance between structural discipline and relaxed drape, this piece effortlessly bridges casual weekend wear and refined evening engagements.
                </p>
                <p>
                  Every seam is reinforced with double-needle stitching, and custom hardware has been hand-selected to age with an alluring patina.
                </p>
              </div>

              <div className="space-y-4 bg-cream-dark/30 dark:bg-charcoal-light/20 p-6 rounded-2xl border border-gray-200/50 dark:border-gray-800">
                <h4 className="font-serif font-bold text-base text-charcoal dark:text-cream mb-2">
                  Material Composition
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between py-1.5 border-b border-gray-200/40 dark:border-gray-700">
                    <span className="text-gray-400 font-medium">Textile:</span>
                    <span className="font-semibold text-charcoal dark:text-cream">{product.material || '100% Organic Pima Cotton'}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-200/40 dark:border-gray-700">
                    <span className="text-gray-400 font-medium">Fit Profile:</span>
                    <span className="font-semibold text-charcoal dark:text-cream">Tailored Modern Relaxed</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-200/40 dark:border-gray-700">
                    <span className="text-gray-400 font-medium">Country of Origin:</span>
                    <span className="font-semibold text-charcoal dark:text-cream">India / Portugal Atelier</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-gray-400 font-medium">Product Code:</span>
                    <span className="font-mono font-semibold text-charcoal dark:text-cream">{product.id.toUpperCase()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-6 max-w-3xl">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200/60 dark:border-gray-800">
                <div>
                  <h4 className="font-serif font-bold text-xl text-charcoal dark:text-cream">
                    Customer Experience
                  </h4>
                  <p className="text-xs text-gray-500">
                    Rated {product.rating} out of 5 based on verified purchases.
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-serif text-3xl font-bold text-gold">{product.rating}</span>
                  <span className="text-xs text-gray-400 block">out of 5</span>
                </div>
              </div>

              {reviews.length === 0 ? (
                <p className="text-xs text-gray-500 py-6">
                  No written reviews yet. Be the first to review this garment!
                </p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((rev) => (
                    <ReviewCard key={rev.id} review={rev} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Shipping & Care */}
          {activeTab === 'shipping' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              <div>
                <h4 className="font-serif font-bold text-lg text-charcoal dark:text-cream mb-3">
                  Care Guidelines
                </h4>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Machine wash delicate cycle in cold water (max 30°C / 85°F).</li>
                  <li>Wash inside out with similar neutral tones.</li>
                  <li>Do not bleach or tumble dry. Reshape while damp and dry flat in shade.</li>
                  <li>Warm steam iron on reverse if desired.</li>
                  <li>Professional eco-friendly dry clean recommended for outer jackets.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-serif font-bold text-lg text-charcoal dark:text-cream mb-3">
                  Shipping & Delivery
                </h4>
                <p className="mb-3">
                  All garments are packed in signature breathable dust covers and recycled paper boxes.
                </p>
                <p className="mb-2">
                  • <strong>Standard Delivery:</strong> 3-5 business days across all metros.
                </p>
                <p>
                  • <strong>Returns:</strong> Complimentary 30-day exchange window. Simply trigger a return from your account profile.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Complete The Look / Related Products */}
        {relatedProducts.length > 0 && (
          <section className="pt-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-xs uppercase tracking-widest text-gold font-bold block mb-1">
                  Harmonious Pairings
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal dark:text-cream">
                  Complete The Silhouette
                </h3>
              </div>
              <Link
                to={`/category/${product.category.toLowerCase()}`}
                className="text-xs font-bold uppercase tracking-wider text-gold hover:underline"
              >
                Explore More {product.category}
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p, idx) => (
                <ProductCard key={p.id} product={p} index={idx} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
