/**
 * Cart Page — Full shopping bag review with order calculation and coupon management
 */
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import EmptyState from '../components/ui/EmptyState';
import CouponInput from '../components/features/CouponInput';
import useCartStore from '../store/useCartStore';
import { formatCurrency } from '../utils/formatCurrency';

const FREE_SHIPPING_THRESHOLD = 1999;

export default function Cart() {
  const {
    items,
    removeItem,
    updateQuantity,
    getSubtotal,
    getDiscount,
    getShipping,
    getTotal,
    clearCart,
  } = useCartStore();

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const shipping = getShipping();
  const total = getTotal();
  const amountNeeded = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progressToFreeShipping = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-20 container-custom">
        <EmptyState
          type="cart"
          title="Your Shopping Bag is Empty"
          description="You haven't reserved any garments yet. Explore our timeless collections to curate your wardrobe."
          actionText="Start Exploring"
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
          <Breadcrumbs items={[{ label: 'Shopping Bag' }]} />
        </div>

        {/* Page Header */}
        <div className="flex items-end justify-between pb-6 mb-8 border-b border-gray-200/60 dark:border-gray-800">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal dark:text-cream">
              Shopping Bag
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              {items.reduce((s, i) => s + i.quantity, 0)} garments reserved in your bag
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-error hover:underline flex items-center gap-1 font-medium"
          >
            <Trash2 size={13} /> Clear Bag
          </button>
        </div>

        {/* Layout: Items + Order Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: Cart Items Table/List (Col 8) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Free Shipping Progress */}
            <div className="p-4 rounded-2xl bg-cream-dark/50 dark:bg-charcoal-light/30 border border-gray-200/60 dark:border-gray-800 mb-6">
              <div className="flex items-center justify-between text-xs font-medium mb-2">
                <span className="flex items-center gap-2">
                  <Truck size={15} className="text-gold" />
                  {amountNeeded > 0 ? (
                    <span>
                      Add <strong className="text-gold">{formatCurrency(amountNeeded)}</strong> more to unlock <strong className="text-charcoal dark:text-cream">Complimentary Shipping</strong>
                    </span>
                  ) : (
                    <span className="text-success font-semibold">
                      🎉 You have qualified for complimentary express delivery!
                    </span>
                  )}
                </span>
                <span className="font-bold">{progressToFreeShipping}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold rounded-full transition-all duration-500"
                  style={{ width: `${progressToFreeShipping}%` }}
                />
              </div>
            </div>

            {/* Items */}
            <div className="divide-y divide-gray-200/60 dark:divide-gray-800 border border-gray-200/60 dark:border-gray-800 rounded-2xl bg-cream dark:bg-charcoal overflow-hidden shadow-card">
              {items.map((item, index) => (
                <div
                  key={`${item.id}-${item.size}-${item.color?.name || ''}`}
                  className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
                >
                  <div className="flex gap-4 items-center min-w-0">
                    <Link
                      to={`/product/${item.slug}`}
                      className="w-20 h-24 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0 border border-gray-200/50 dark:border-gray-700"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover object-center"
                      />
                    </Link>

                    <div className="min-w-0">
                      <Link
                        to={`/product/${item.slug}`}
                        className="font-serif font-bold text-base text-charcoal dark:text-cream hover:text-gold transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>

                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                        {item.size && (
                          <span>
                            Size: <strong className="text-charcoal dark:text-cream">{item.size}</strong>
                          </span>
                        )}
                        {item.color && (
                          <span className="flex items-center gap-1.5">
                            Color:
                            <span
                              className="w-3 h-3 rounded-full border border-gray-300"
                              style={{ backgroundColor: item.color.hex }}
                            />
                            <strong className="text-charcoal dark:text-cream">{item.color.name}</strong>
                          </span>
                        )}
                      </div>

                      <div className="text-xs font-bold text-gold mt-1.5">
                        {formatCurrency(item.price)} each
                      </div>
                    </div>
                  </div>

                  {/* Quantity and Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-200/40 dark:border-gray-800">
                    <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl bg-cream-dark/30 dark:bg-gray-800/30">
                      <button
                        onClick={() => updateQuantity(index, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="p-1.5 px-3 text-gray-500 hover:text-charcoal dark:hover:text-cream disabled:opacity-30"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-xs font-bold px-2 min-w-[24px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(index, item.quantity + 1)}
                        className="p-1.5 px-3 text-gray-500 hover:text-charcoal dark:hover:text-cream"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <div className="text-right min-w-[90px]">
                      <span className="text-base font-bold text-charcoal dark:text-cream">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>

                    <button
                      onClick={() => removeItem(index)}
                      className="p-2 text-gray-400 hover:text-error transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-between">
              <Link
                to="/shop"
                className="text-xs font-bold uppercase tracking-wider text-charcoal dark:text-cream hover:text-gold transition-colors inline-flex items-center gap-1.5"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Right: Order Summary (Col 4) */}
          <div className="lg:col-span-4 bg-cream dark:bg-charcoal rounded-2xl p-6 border border-gray-200/60 dark:border-gray-800 shadow-card space-y-6">
            <h3 className="font-serif font-bold text-lg text-charcoal dark:text-cream pb-4 border-b border-gray-200/60 dark:border-gray-800">
              Order Summary
            </h3>

            {/* Cost Breakdown */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>Bag Subtotal</span>
                <span className="font-semibold text-charcoal dark:text-cream">{formatCurrency(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-success">
                  <span>Promotional Savings</span>
                  <span className="font-semibold">-{formatCurrency(discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>Estimated Delivery</span>
                <span>{shipping === 0 ? <span className="text-success font-semibold">FREE</span> : formatCurrency(shipping)}</span>
              </div>

              <div className="flex justify-between text-base font-bold text-charcoal dark:text-cream pt-4 border-t border-gray-200/60 dark:border-gray-800">
                <span>Estimated Total</span>
                <span className="text-gold font-serif text-xl">{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Coupon Code Component */}
            <div className="pt-2">
              <CouponInput />
            </div>

            {/* Checkout CTA */}
            <Link
              to="/checkout"
              className="w-full py-4 bg-charcoal text-cream dark:bg-cream dark:text-charcoal rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-soft"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={15} />
            </Link>

            {/* Trust Guarantee */}
            <div className="pt-4 border-t border-gray-200/60 dark:border-gray-800 text-center">
              <div className="inline-flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                <ShieldCheck size={16} className="text-gold" />
                <span>256-Bit Encrypted Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
