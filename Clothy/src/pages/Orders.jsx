/**
 * Orders Page — Complete purchase history, delivery status and the
 * Returns & Exchanges list for the signed-in account.
 */
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, RefreshCw } from 'lucide-react';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import EmptyState from '../components/ui/EmptyState';
import { useAllOrders } from '../store/useOrdersStore';
import useAuthStore from '../store/useAuthStore';
import useReturnsStore from '../store/useReturnsStore';
import { formatCurrency } from '../utils/formatCurrency';

const STATUS_BADGES = {
  Delivered: 'bg-success/15 text-success border border-success/30',
  Shipped: 'bg-gold/15 text-gold border border-gold/30',
  Processing: 'bg-info/15 text-info border border-info/30',
};

const REQUEST_BADGES = {
  requested: 'bg-info/15 text-info border border-info/30',
  approved: 'bg-gold/15 text-gold border border-gold/30',
  'picked-up': 'bg-warning/15 text-warning border border-warning/30',
  completed: 'bg-success/15 text-success border border-success/30',
  rejected: 'bg-error/15 text-error border border-error/30',
};

const REQUEST_LABELS = {
  requested: 'Requested',
  approved: 'Approved',
  'picked-up': 'Picked Up',
  completed: 'Completed',
  rejected: 'Rejected',
};

export default function Orders() {
  const orders = useAllOrders();
  const session = useAuthStore((s) => s.session);
  const requests = useReturnsStore((s) => s.requests);
  const advanceStatuses = useReturnsStore((s) => s.advanceStatuses);

  useEffect(() => {
    advanceStatuses();
    const timer = setInterval(advanceStatuses, 15000);
    return () => clearInterval(timer);
  }, [advanceStatuses]);

  const myRequests = requests.filter((r) => r.userId === session?.id);

  return (
    <div className="pt-24 sm:pt-28 pb-20">
      <div className="container-custom max-w-5xl">
        {/* Breadcrumbs */}
        <div className="mb-4">
          <Breadcrumbs
            items={[
              { label: 'My Account', path: '/account' },
              { label: 'Order History' },
            ]}
          />
        </div>

        {/* Header */}
        <div className="flex items-end justify-between pb-6 mb-8 border-b border-gray-200/60 dark:border-gray-800">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal dark:text-cream">
              Order History
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Review parcel tracking, invoices, and reorder favourite silhouettes
            </p>
          </div>
          <span className="text-xs font-semibold text-gray-400">
            {orders.length} Orders Placed
          </span>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <EmptyState
            type="orders"
            title="No orders yet"
            description="Orders you place appear here with live tracking, invoices and 7-day returns."
            actionText="Start Shopping"
            actionHref="/shop"
          />
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="p-6 rounded-2xl bg-cream dark:bg-charcoal border border-gray-200/60 dark:border-gray-800 shadow-card flex flex-col justify-between"
              >
                {/* Top Row: Meta info */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-200/40 dark:border-gray-800">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-cream-dark dark:bg-gray-800 flex items-center justify-center text-charcoal dark:text-cream">
                      <Package size={20} />
                    </div>
                    <div>
                      <h3 className="font-mono font-bold text-sm text-charcoal dark:text-cream">
                        {order.id}
                      </h3>
                      <p className="text-[11px] text-gray-400">Placed on {order.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                        STATUS_BADGES[order.status] || 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {order.status}
                    </span>
                    <span className="font-serif font-bold text-base text-charcoal dark:text-cream">
                      {formatCurrency(order.total)}
                    </span>
                  </div>
                </div>

                {/* Items Thumbnails */}
                <div className="py-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3 overflow-x-auto pb-1">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-16 rounded-xl object-cover bg-gray-100 dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700"
                        />
                        <div className="hidden sm:block text-xs">
                          <p className="font-semibold text-charcoal dark:text-cream line-clamp-1">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-gray-400">
                            Qty: {item.quantity} • Size: {item.size}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Link */}
                  <Link
                    to={`/account/orders/${order.id}`}
                    className="px-5 py-2.5 bg-charcoal text-cream dark:bg-cream dark:text-charcoal rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center gap-2 shrink-0 shadow-soft"
                  >
                    <span>Track & Details</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Returns & Exchanges */}
        <section className="mt-14 pt-8 border-t border-gray-200/60 dark:border-gray-800">
          <div className="flex items-center gap-2 pb-5">
            <RefreshCw size={17} className="text-gold" />
            <h2 className="font-serif text-2xl font-bold text-charcoal dark:text-cream">
              Returns &amp; Exchanges
            </h2>
            <span className="text-xs font-semibold text-gray-400 ml-auto">
              {myRequests.length} Request{myRequests.length === 1 ? '' : 's'}
            </span>
          </div>

          {myRequests.length === 0 ? (
            <div className="p-8 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 text-center">
              <p className="font-serif font-bold text-base text-charcoal dark:text-cream mb-1">
                No return or exchange requests yet
              </p>
              <p className="text-xs text-gray-500">
                Delivered orders can be returned or exchanged within 7 days from the
                order detail page.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {myRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-5 rounded-2xl bg-cream dark:bg-charcoal border border-gray-200/60 dark:border-gray-800 shadow-card flex flex-wrap items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-xs text-charcoal dark:text-cream">
                        {req.orderId}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          REQUEST_BADGES[req.status] || REQUEST_BADGES.requested
                        }`}
                      >
                        {REQUEST_LABELS[req.status] || req.status}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cream-dark dark:bg-gray-800 text-gray-500">
                        {req.type === 'exchange' ? 'Exchange' : 'Return'}
                      </span>
                    </div>
                    <p className="text-xs text-charcoal dark:text-cream font-semibold mt-1.5 line-clamp-1">
                      {req.itemName}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      {req.reason}
                      {req.type === 'exchange' && req.newSize
                        ? ` · New size ${req.newSize}`
                        : ''}
                      {' · Pickup '}
                      {req.pickupSlot}
                      {req.coinsRefunded > 0 ? ` · +${req.coinsRefunded} coins refunded` : ''}
                      {req.coinsReversed > 0 ? ` · −${req.coinsReversed} coins reversed` : ''}
                    </p>
                  </div>

                  <Link
                    to={`/account/orders/${req.orderId}`}
                    className="px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold uppercase tracking-wider hover:border-gold hover:text-gold transition-colors shrink-0"
                  >
                    View Timeline
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
