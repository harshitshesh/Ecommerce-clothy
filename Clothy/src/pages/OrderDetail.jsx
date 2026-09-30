/**
 * OrderDetail Page — Detailed receipt, parcel timeline, shipment breakdown,
 * and per-item return / exchange requests.
 */
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, RefreshCw, Undo2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import OrderTracker from '../components/features/OrderTracker';
import EmptyState from '../components/ui/EmptyState';
import PriceBreakdown from '../components/features/PriceBreakdown';
import ReturnRequestModal from '../components/features/ReturnRequestModal';
import { useOrder } from '../store/useOrdersStore';
import useAuthStore from '../store/useAuthStore';
import useReturnsStore from '../store/useReturnsStore';
import { getReturnWindow } from '../utils/returns';
import { pricingFromOrder } from '../utils/pricing';
import { downloadInvoice } from '../utils/invoice';
import { formatCurrency } from '../utils/formatCurrency';

const REQUEST_BADGE = {
  requested: 'bg-info/15 text-info border border-info/30',
  approved: 'bg-gold/15 text-gold border border-gold/30',
  'picked-up': 'bg-warning/15 text-warning border border-warning/30',
  completed: 'bg-success/15 text-success border border-success/30',
  rejected: 'bg-error/15 text-error border border-error/30',
};

const REQUEST_LABEL = {
  requested: 'Requested',
  approved: 'Approved',
  'picked-up': 'Picked Up',
  completed: 'Completed',
  rejected: 'Rejected',
};

function RequestTimeline({ request }) {
  if (!request) return null;
  return (
    <div className="mt-3 pt-3 border-t border-gray-200/40 dark:border-gray-800">
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
            REQUEST_BADGE[request.status] || REQUEST_BADGE.requested
          }`}
        >
          {request.type === 'exchange' ? 'Exchange' : 'Return'} ·{' '}
          {REQUEST_LABEL[request.status] || request.status}
        </span>
        <span className="text-[11px] text-gray-500">{request.reason}</span>
        {request.type === 'exchange' && request.newSize && (
          <span className="text-[11px] text-gold font-semibold">
            → Size {request.newSize}
          </span>
        )}
        <span className="text-[11px] text-gray-400">Pickup: {request.pickupSlot}</span>
      </div>

      <ol className="mt-2 space-y-1.5">
        {(request.timeline || []).map((step, idx) => (
          <li key={`${step.status}-${idx}`} className="flex items-start gap-2 text-[11px]">
            <span
              className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                idx === (request.timeline || []).length - 1 ? 'bg-gold' : 'bg-success'
              }`}
            />
            <span className="text-gray-600 dark:text-gray-300">
              <strong className="text-charcoal dark:text-cream">
                {REQUEST_LABEL[step.status] || step.status}
              </strong>{' '}
              — {step.note}
              <span className="text-gray-400"> · {new Date(step.date).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function OrderDetail() {
  const { id } = useParams();
  const order = useOrder(id);
  const session = useAuthStore((s) => s.session);
  const requests = useReturnsStore((state) => state.requests);
  const advanceStatuses = useReturnsStore((state) => state.advanceStatuses);
  const [isDownloading, setIsDownloading] = useState(false);
  const [returnTarget, setReturnTarget] = useState(null); // { itemIndex, type }

  // Keep the request timeline moving while the order is on screen
  useEffect(() => {
    advanceStatuses();
    const timer = setInterval(advanceStatuses, 15000);
    return () => clearInterval(timer);
  }, [advanceStatuses]);

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

  const pricing = pricingFromOrder(order);
  const returnWindow = getReturnWindow(order);
  const shippedTo = order.customer?.address || order.address;
  const billedTo = order.customer || {};
  const orderRequests = requests.filter(
    (r) => r.orderId === order.id && r.userId === session?.id
  );

  const handleDownloadInvoice = async () => {
    setIsDownloading(true);
    try {
      await downloadInvoice(order);
      toast.success(`Invoice for ${order.id} downloaded!`, { icon: '📄' });
    } catch {
      toast.error('Could not generate the invoice. Please try again.');
    } finally {
      setIsDownloading(false);
    }
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
            disabled={isDownloading}
            className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-semibold hover:bg-cream-dark dark:hover:bg-gray-800 transition-colors flex items-center gap-2 self-start sm:self-auto disabled:opacity-50"
          >
            <Download size={14} /> {isDownloading ? 'Generating…' : 'Download Invoice'}
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
              {order.items.map((item, idx) => {
                const existing = orderRequests.find((r) => r.itemIndex === idx);
                return (
                  <div key={idx} className="pt-3 first:pt-0">
                    <div className="flex gap-4 items-center">
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
                          Size: {item.size} • Color: {typeof item.color === 'string' ? item.color : item.color?.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Qty: {item.quantity} × {formatCurrency(item.price)}
                        </p>
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-charcoal dark:text-cream">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>

                    {existing ? (
                      <RequestTimeline request={existing} />
                    ) : (
                      <div className="mt-3 pt-3 border-t border-gray-200/40 dark:border-gray-800">
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            disabled={!returnWindow.ok}
                            onClick={() => setReturnTarget({ itemIndex: idx, type: 'return' })}
                            title={returnWindow.ok ? 'Return this item' : returnWindow.reason}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-[11px] font-bold uppercase tracking-wider text-charcoal dark:text-cream hover:border-error hover:text-error transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-charcoal dark:disabled:hover:border-gray-700 dark:disabled:hover:text-cream"
                          >
                            <Undo2 size={13} /> Return
                          </button>
                          <button
                            type="button"
                            disabled={!returnWindow.ok}
                            onClick={() => setReturnTarget({ itemIndex: idx, type: 'exchange' })}
                            title={returnWindow.ok ? 'Exchange for another size' : returnWindow.reason}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-[11px] font-bold uppercase tracking-wider text-charcoal dark:text-cream hover:border-gold hover:text-gold transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-charcoal dark:disabled:hover:border-gray-700 dark:disabled:hover:text-cream"
                          >
                            <RefreshCw size={13} /> Exchange
                          </button>
                          <span
                            className={`text-[11px] ${
                              returnWindow.ok ? 'text-success font-semibold' : 'text-gray-400'
                            }`}
                          >
                            {returnWindow.ok
                              ? `${returnWindow.reason} · 7-day window from delivery`
                              : returnWindow.reason}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery & Payment Info (Col 5) */}
          <div className="md:col-span-5 space-y-6">
            {/* Address — frozen customer snapshot from the order */}
            <div className="bg-cream dark:bg-charcoal p-6 rounded-2xl border border-gray-200/60 dark:border-gray-800 shadow-card text-xs space-y-2">
              <h4 className="font-serif font-bold text-sm text-charcoal dark:text-cream pb-2 border-b border-gray-200/40 dark:border-gray-800">
                Delivery Destination
              </h4>
              <p className="font-bold text-charcoal dark:text-cream">{shippedTo?.name}</p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {shippedTo?.line1}, {shippedTo?.line2 && `${shippedTo.line2}, `}
                {shippedTo?.city}, {shippedTo?.state} — {shippedTo?.pin}
              </p>
              <p className="text-gray-400">Phone: {shippedTo?.phone}</p>
              <p className="pt-2 mt-2 border-t border-gray-200/40 dark:border-gray-800 text-gray-400">
                Billed to:{' '}
                <span className="font-semibold text-charcoal dark:text-cream">
                  {billedTo?.name || shippedTo?.name}
                </span>
                {billedTo?.email ? ` · ${billedTo.email}` : ''}
              </p>
            </div>

            {/* Financial Summary */}
            <div className="bg-cream dark:bg-charcoal p-6 rounded-2xl border border-gray-200/60 dark:border-gray-800 shadow-card">
              <h4 className="font-serif font-bold text-sm text-charcoal dark:text-cream pb-2 mb-4 border-b border-gray-200/40 dark:border-gray-800">
                Billing Summary
              </h4>

              {/* Same pricing component as cart, checkout and the PDF invoice */}
              <PriceBreakdown pricing={pricing} title="" />

              {(order.coinsUsed > 0 || order.coinsEarned > 0 || order.amountPaid != null) && (
                <div className="mt-4 p-3 rounded-xl bg-gold/5 border border-gold/25 space-y-1.5 text-[11px]">
                  {order.coinsUsed > 0 && (
                    <div className="flex justify-between text-gray-600 dark:text-gray-300">
                      <span>Wallet coins used</span>
                      <span className="font-bold text-error">−{order.coinsUsed} coins</span>
                    </div>
                  )}
                  {order.amountPaid != null && (
                    <div className="flex justify-between text-gray-600 dark:text-gray-300">
                      <span>Charged to payment method</span>
                      <span className="font-bold text-charcoal dark:text-cream">
                        {formatCurrency(order.amountPaid)}
                      </span>
                    </div>
                  )}
                  {order.coinsEarned > 0 && (
                    <div className="flex justify-between text-gray-600 dark:text-gray-300">
                      <span>Coins earned</span>
                      <span className="font-bold text-gold">+{order.coinsEarned} coins</span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between text-xs text-gray-500 pt-3 mt-3 border-t border-gray-200/40 dark:border-gray-700">
                <span>Payment Mode</span>
                <span className="font-semibold text-charcoal dark:text-cream">
                  {order.paymentMethod || order.payment?.method}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Return / Exchange request */}
        <ReturnRequestModal
          isOpen={Boolean(returnTarget)}
          onClose={() => setReturnTarget(null)}
          order={order}
          itemIndex={returnTarget?.itemIndex ?? 0}
          initialType={returnTarget?.type || 'return'}
        />
      </div>
    </div>
  );
}
