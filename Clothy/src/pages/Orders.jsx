/**
 * Orders Page — Complete purchase history and delivery status
 */
import { Link } from 'react-router-dom';
import { Package, ArrowRight } from 'lucide-react';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import orders from '../data/orders';
import { formatCurrency } from '../utils/formatCurrency';

const STATUS_BADGES = {
  Delivered: 'bg-success/15 text-success border border-success/30',
  Shipped: 'bg-gold/15 text-gold border border-gold/30',
  Processing: 'bg-info/15 text-info border border-info/30',
};

export default function Orders() {
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
      </div>
    </div>
  );
}
