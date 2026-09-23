/**
 * OrderDetail Page — Detailed receipt, parcel timeline, and shipment breakdown
 */
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import OrderTracker from '../components/features/OrderTracker';
import EmptyState from '../components/ui/EmptyState';
import orders, { getOrderById } from '../data/orders';
import { formatCurrency } from '../utils/formatCurrency';

export default function OrderDetail() {
  const { id } = useParams();
  const order = getOrderById(id) || orders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="pt-32 pb-20 container-custom">
        <EmptyState
          type="cart"
          title="Order Not Found"
          description="We could not find the order reference you requested."
          actionText="View Order History"
          actionHref="/account/orders"
        />
      </div>
    );
  }

  const handleDownloadInvoice = () => {
    toast.success(`Invoice for ${order.id} downloaded!`, { icon: '📄' });
  };

  return (
    <div className="pt-24 sm:pt-28 pb-20">
      <div className="container-custom max-w-4xl">
        {/* Breadcrumbs */}
        <div className="mb-4">
          <Breadcrumbs
            items={[
              { label: 'My Account', path: '/account' },
              { label: 'Orders', path: '/account/orders' },
              { label: order.id },
            ]}
          />
        </div>

        {/* Header with back button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-gray-200/60 dark:border-gray-800 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <Link
                to="/account/orders"
                className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-cream-dark dark:hover:bg-gray-800 text-charcoal dark:text-cream"
                aria-label="Back to orders"
              >
                <ArrowLeft size={16} />
              </Link>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal dark:text-cream">
                Order {order.id}
              </h1>
            </div>
            <p className="text-xs text-gray-500 mt-1 pl-9">
              Placed on {order.date} • {order.items.length} garments
            </p>
          </div>

          <button
            onClick={handleDownloadInvoice}
            className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-semibold hover:bg-cream-dark dark:hover:bg-gray-800 transition-colors flex items-center gap-2 self-start sm:self-auto"
          >
            <Download size={14} /> Download Invoice
          </button>
        </div>

        {/* Visual Timeline Tracking */}
        <div className="p-6 sm:p-8 rounded-3xl bg-cream dark:bg-charcoal border border-gray-200/60 dark:border-gray-800 shadow-card mb-8">
          <div className="flex items-center justify-between pb-4 border-b border-gray-200/40 dark:border-gray-800">
            <h3 className="font-serif font-bold text-base text-charcoal dark:text-cream">
              Delivery Milestones
            </h3>
            <span className="text-xs font-bold text-gold uppercase tracking-wider">
              {order.status}
            </span>
          </div>

          <OrderTracker tracking={order.tracking} />
        </div>

        {/* 2-Column Details: Items List + Delivery/Summary */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Purchased Items (Col 7) */}
          <div className="md:col-span-7 bg-cream dark:bg-charcoal p-6 rounded-2xl border border-gray-200/60 dark:border-gray-800 shadow-card space-y-4">
            <h3 className="font-serif font-bold text-base text-charcoal dark:text-cream pb-3 border-b border-gray-200/40 dark:border-gray-800">
              Reserved Garments
            </h3>

            <div className="divide-y divide-gray-200/40 dark:divide-gray-800 space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="pt-3 first:pt-0 flex gap-4 items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-20 rounded-xl object-cover bg-gray-100 dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-bold text-xs sm:text-sm text-charcoal dark:text-cream line-clamp-1">
                      {item.name}
                    </h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Size: {item.size} • Color: {item.color}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Qty: {item.quantity} × {formatCurrency(item.price)}
                    </p>
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-charcoal dark:text-cream">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery & Payment Info (Col 5) */}
          <div className="md:col-span-5 space-y-6">
            {/* Address */}
            <div className="bg-cream dark:bg-charcoal p-6 rounded-2xl border border-gray-200/60 dark:border-gray-800 shadow-card text-xs space-y-2">
              <h4 className="font-serif font-bold text-sm text-charcoal dark:text-cream pb-2 border-b border-gray-200/40 dark:border-gray-800">
                Delivery Destination
              </h4>
              <p className="font-bold text-charcoal dark:text-cream">{order.address?.name}</p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {order.address?.line1}, {order.address?.line2 && `${order.address.line2}, `}
                {order.address?.city}, {order.address?.state} — {order.address?.pin}
              </p>
              <p className="text-gray-400">Phone: {order.address?.phone}</p>
            </div>

            {/* Financial Summary */}
            <div className="bg-cream dark:bg-charcoal p-6 rounded-2xl border border-gray-200/60 dark:border-gray-800 shadow-card text-xs space-y-2.5">
              <h4 className="font-serif font-bold text-sm text-charcoal dark:text-cream pb-2 border-b border-gray-200/40 dark:border-gray-800">
                Billing Summary
              </h4>

              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span className="font-semibold text-charcoal dark:text-cream">{formatCurrency(order.subtotal)}</span>
              </div>

              {order.discount > 0 && (
                <div className="flex justify-between text-success">
                  <span>Savings</span>
                  <span className="font-semibold">-{formatCurrency(order.discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-500">
                <span>Delivery</span>
                <span>{order.shipping === 0 ? <strong className="text-success">FREE</strong> : formatCurrency(order.shipping)}</span>
              </div>

              <div className="flex justify-between text-gray-500">
                <span>Payment Mode</span>
                <span className="font-semibold text-charcoal dark:text-cream">{order.payment?.method}</span>
              </div>

              <div className="flex justify-between text-sm font-bold text-charcoal dark:text-cream pt-3 border-t border-gray-200/40 dark:border-gray-700">
                <span>Total Paid</span>
                <span className="text-gold font-serif text-base">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
