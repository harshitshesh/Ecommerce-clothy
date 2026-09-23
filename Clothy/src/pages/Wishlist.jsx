/**
 * Wishlist Page — Complete saved wardrobe items with Move to Bag and direct removal
 */
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import EmptyState from '../components/ui/EmptyState';
import useWishlistStore from '../store/useWishlistStore';
import useCartStore from '../store/useCartStore';
import useUIStore from '../store/useUIStore';
import products from '../data/products';
import { formatCurrency } from '../utils/formatCurrency';

export default function Wishlist() {
  const { items, removeItem } = useWishlistStore();
  const addToCart = useCartStore((s) => s.addItem);
  const openCart = useUIStore((s) => s.openCart);

  const handleMoveToCart = (item) => {
    const fullProduct = products.find((p) => p.id === item.id);
    const size = fullProduct?.sizes?.[0] || 'M';
    const color = fullProduct?.colors?.[0] || { name: 'Standard', hex: '#000000' };

    addToCart(fullProduct || item, size, color);
    removeItem(item.id);
    toast.success(`Moved ${item.name} to your bag!`, { icon: '🛍️' });
    openCart();
  };

  const handleMoveAllToCart = () => {
    items.forEach((item) => {
      const fullProduct = products.find((p) => p.id === item.id);
      const size = fullProduct?.sizes?.[0] || 'M';
      const color = fullProduct?.colors?.[0] || { name: 'Standard', hex: '#000000' };
      addToCart(fullProduct || item, size, color);
      removeItem(item.id);
    });
    toast.success('Moved all saved garments to your bag!', { icon: '🛍️' });
    openCart();
  };

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-20 container-custom">
        <EmptyState
          type="wishlist"
          title="Your Wishlist is Empty"
          description="Save the garments you covet while exploring our curated seasonal drops."
          actionText="Discover Collections"
          actionHref="/shop"
        />
      </div>
    );
  }

  return (
    <div className="pt-24 sm:pt-28 pb-20">
      <div className="container-custom">
        {/* Breadcrumbs */}
        <div className="mb-4">
          <Breadcrumbs items={[{ label: 'Saved Pieces' }]} />
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 mb-8 border-b border-gray-200/60 dark:border-gray-800 gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal dark:text-cream">
              Saved Pieces
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              {items.length} garments preserved in your personal capsule
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleMoveAllToCart}
              className="px-5 py-2.5 bg-charcoal text-cream dark:bg-cream dark:text-charcoal rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <ShoppingBag size={14} /> Move All to Bag
            </button>
          </div>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="group rounded-2xl overflow-hidden bg-cream dark:bg-charcoal border border-gray-200/60 dark:border-gray-800 shadow-card flex flex-col justify-between"
            >
              <div className="relative aspect-[3/4] bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <Link to={`/product/${item.slug}`}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>

                <button
                  onClick={() => removeItem(item.id)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-cream/80 dark:bg-charcoal/80 text-gray-400 hover:text-error backdrop-blur-sm shadow-sm transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold block mb-1">
                    {item.category}
                  </span>
                  <Link
                    to={`/product/${item.slug}`}
                    className="font-serif font-bold text-sm text-charcoal dark:text-cream hover:text-gold transition-colors line-clamp-1 mb-2"
                  >
                    {item.name}
                  </Link>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm font-bold text-charcoal dark:text-cream">
                      {formatCurrency(item.discountPrice || item.price)}
                    </span>
                    {item.discountPrice && (
                      <span className="text-xs text-gray-400 line-through">
                        {formatCurrency(item.price)}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleMoveToCart(item)}
                  className="w-full py-2.5 bg-charcoal text-cream dark:bg-cream dark:text-charcoal rounded-lg text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 shadow-soft"
                >
                  <ShoppingBag size={14} /> Move to Bag
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
