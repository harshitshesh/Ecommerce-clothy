/**
 * CompareTable — Side-by-side garment comparison matrix (up to 4 products)
 */
import { Link } from 'react-router-dom';
import { X, ShoppingBag, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import useCompareStore from '../../store/useCompareStore';
import useCartStore from '../../store/useCartStore';
import RatingStars from '../ui/RatingStars';
import { formatCurrency } from '../../utils/formatCurrency';

export default function CompareTable() {
  const { items, removeItem, clearAll } = useCompareStore();
  const addToCart = useCartStore((s) => s.addItem);

  const handleAddToCart = (prod) => {
    addToCart(prod, prod.sizes?.[0] || 'M', prod.colors?.[0] || null);
    toast.success(`Added ${prod.name} to bag!`, { icon: '🛍️' });
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="font-serif text-xl font-bold mb-2">No garments selected for comparison</h3>
        <p className="text-xs text-gray-500 max-w-sm mx-auto mb-6">
          Add up to 4 garments while browsing the shop to compare fabric compositions, cuts, and pricing.
        </p>
        <Link
          to="/shop"
          className="px-6 py-2.5 bg-charcoal text-cream dark:bg-cream dark:text-charcoal text-xs font-bold uppercase tracking-wider rounded-lg"
        >
          Explore Catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center pb-2">
        <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
          Comparing {items.length} of 4 Items
        </span>
        <button
          onClick={clearAll}
          className="text-xs text-error hover:underline flex items-center gap-1"
        >
          <Trash2 size={13} /> Clear All
        </button>
      </div>

      <div className="overflow-x-auto border border-gray-200/70 dark:border-gray-800 rounded-2xl bg-cream dark:bg-charcoal shadow-soft">
        <table className="w-full text-left text-xs border-collapse min-w-[650px]">
          <tbody>
            {/* Image & Title row */}
            <tr className="border-b border-gray-200/60 dark:border-gray-800">
              <td className="p-4 w-36 font-bold uppercase tracking-wider text-gray-400 bg-cream-dark/30 dark:bg-gray-800/30">
                Piece
              </td>
              {items.map((prod) => (
                <td key={prod.id} className="p-4 align-top w-56">
                  <div className="relative mb-3">
                    <img
                      src={prod.images[0]}
                      alt={prod.name}
                      className="w-full aspect-[3/4] object-cover rounded-xl bg-gray-100 dark:bg-gray-800"
                    />
                    <button
                      onClick={() => removeItem(prod.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-cream/80 dark:bg-charcoal/80 text-gray-400 hover:text-error transition-colors"
                      title="Remove"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <Link
                    to={`/product/${prod.slug}`}
                    className="font-serif font-bold text-sm text-charcoal dark:text-cream hover:text-gold transition-colors line-clamp-1 block mb-1"
                  >
                    {prod.name}
                  </Link>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest block">
                    {prod.category}
                  </span>
                </td>
              ))}
            </tr>

            {/* Price */}
            <tr className="border-b border-gray-200/60 dark:border-gray-800">
              <td className="p-4 font-bold uppercase tracking-wider text-gray-400 bg-cream-dark/30 dark:bg-gray-800/30">
                Price
              </td>
              {items.map((prod) => (
                <td key={prod.id} className="p-4">
                  <span className="text-sm font-bold text-charcoal dark:text-cream">
                    {formatCurrency(prod.discountPrice || prod.price)}
                  </span>
                  {prod.discountPrice && (
                    <span className="text-xs text-gray-400 line-through ml-2">
                      {formatCurrency(prod.price)}
                    </span>
                  )}
                </td>
              ))}
            </tr>

            {/* Rating */}
            <tr className="border-b border-gray-200/60 dark:border-gray-800">
              <td className="p-4 font-bold uppercase tracking-wider text-gray-400 bg-cream-dark/30 dark:bg-gray-800/30">
                Rating
              </td>
              {items.map((prod) => (
                <td key={prod.id} className="p-4">
                  <div className="flex items-center gap-1.5">
                    <RatingStars rating={prod.rating} size={12} />
                    <span className="text-xs text-gray-500">({prod.reviewsCount})</span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Fabric / Material */}
            <tr className="border-b border-gray-200/60 dark:border-gray-800">
              <td className="p-4 font-bold uppercase tracking-wider text-gray-400 bg-cream-dark/30 dark:bg-gray-800/30">
                Material
              </td>
              {items.map((prod) => (
                <td key={prod.id} className="p-4 text-gray-600 dark:text-gray-300">
                  {prod.material || '100% Organic Cotton'}
                </td>
              ))}
            </tr>

            {/* Available Sizes */}
            <tr className="border-b border-gray-200/60 dark:border-gray-800">
              <td className="p-4 font-bold uppercase tracking-wider text-gray-400 bg-cream-dark/30 dark:bg-gray-800/30">
                Sizes
              </td>
              {items.map((prod) => (
                <td key={prod.id} className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {prod.sizes?.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[10px] font-bold uppercase"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </td>
              ))}
            </tr>

            {/* Colors */}
            <tr className="border-b border-gray-200/60 dark:border-gray-800">
              <td className="p-4 font-bold uppercase tracking-wider text-gray-400 bg-cream-dark/30 dark:bg-gray-800/30">
                Colors
              </td>
              {items.map((prod) => (
                <td key={prod.id} className="p-4">
                  <div className="flex gap-1.5">
                    {prod.colors?.map((c) => (
                      <span
                        key={c.name}
                        className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-700 inline-block"
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </td>
              ))}
            </tr>

            {/* Care */}
            <tr className="border-b border-gray-200/60 dark:border-gray-800">
              <td className="p-4 font-bold uppercase tracking-wider text-gray-400 bg-cream-dark/30 dark:bg-gray-800/30">
                Care
              </td>
              {items.map((prod) => (
                <td key={prod.id} className="p-4 text-gray-600 dark:text-gray-300">
                  {prod.care || 'Dry clean or machine wash cold'}
                </td>
              ))}
            </tr>

            {/* Action button */}
            <tr>
              <td className="p-4 bg-cream-dark/30 dark:bg-gray-800/30" />
              {items.map((prod) => (
                <td key={prod.id} className="p-4">
                  <button
                    onClick={() => handleAddToCart(prod)}
                    className="w-full py-2.5 bg-charcoal text-cream dark:bg-cream dark:text-charcoal rounded-lg text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 shadow-soft"
                  >
                    <ShoppingBag size={14} /> Add to Bag
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
