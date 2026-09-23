/**
 * EmptyState — Empty state display for cart, wishlist, search, etc.
 */
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Search, Package } from 'lucide-react';

const icons = {
  cart: ShoppingBag,
  wishlist: Heart,
  search: Search,
  orders: Package,
};

export default function EmptyState({ type = 'cart', title, description, actionLabel, actionPath, actionText, actionHref, onAction }) {
  const Icon = icons[type] || ShoppingBag;

  const defaults = {
    cart: {
      title: 'Your cart is empty',
      description: 'Looks like you haven\'t added anything to your cart yet.',
      actionLabel: 'Start Shopping',
      actionPath: '/shop',
    },
    wishlist: {
      title: 'Your wishlist is empty',
      description: 'Save items you love to your wishlist and come back to them later.',
      actionLabel: 'Explore Collection',
      actionPath: '/shop',
    },
    search: {
      title: 'No results found',
      description: 'Try adjusting your search or filters to find what you\'re looking for.',
      actionLabel: 'Browse All Products',
      actionPath: '/shop',
    },
    orders: {
      title: 'No orders yet',
      description: 'When you place an order, it will appear here.',
      actionLabel: 'Start Shopping',
      actionPath: '/shop',
    },
  };

  const d = defaults[type] || defaults.cart;
  const finalLabel = actionLabel || actionText || d.actionLabel;
  const finalPath = actionPath || actionHref || d.actionPath;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-cream-dark dark:bg-charcoal-light flex items-center justify-center mb-6">
        <Icon size={32} className="text-gray-400" />
      </div>
      <h3 className="font-serif text-xl font-semibold text-charcoal dark:text-cream mb-2">
        {title || d.title}
      </h3>
      <p className="text-sm text-gray-500 max-w-sm mb-6">
        {description || d.description}
      </p>
      {onAction ? (
        <button
          onClick={onAction}
          className="btn btn-primary"
        >
          {finalLabel}
        </button>
      ) : (
        <Link
          to={finalPath}
          className="btn btn-primary"
        >
          {finalLabel}
        </Link>
      )}
    </div>
  );
}
