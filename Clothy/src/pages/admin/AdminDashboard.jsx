/**
 * AdminDashboard (/admin) — Main KPI metrics, recent orders, and low-stock variant alerts
 */
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  Package,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import useOrdersStore from '../../store/useOrdersStore';
import useProductStore from '../../store/useProductStore';
import useReturnsStore from '../../store/useReturnsStore';
import { getVariantStock } from '../../utils/variantStock';
import { formatCurrency } from '../../utils/formatCurrency';

export default function AdminDashboard() {
  const getAllOrders = useOrdersStore((s) => s.getAllAdmin);
  const products = useProductStore((s) => s.products);
  const requests = useReturnsStore((s) => s.requests);

  const orders = useMemo(() => getAllOrders(), [getAllOrders]);

  // Compute KPIs
  const kpis = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const todayStr = new Date().toISOString().slice(0, 10);
    const ordersToday = orders.filter((o) => {
      const oDate = o.date ? new Date(o.date).toISOString().slice(0, 10) : '';
      return oDate === todayStr;
    }).length;

    // Scan variants for low/out-of-stock
    let lowOrZeroStockCount = 0;
    const lowStockAlerts = [];

    products.forEach((p) => {
      const colors = p.colors?.length > 0 ? p.colors : [{ name: 'Default' }];
      const sizes = p.sizes?.length > 0 ? p.sizes : ['M'];

      colors.forEach((c) => {
        const cName = typeof c === 'string' ? c : c.name;
        sizes.forEach((s) => {
          const stock = getVariantStock(p, cName, s);
          if (stock <= 3) {
            lowOrZeroStockCount += 1;
            if (lowStockAlerts.length < 8) {
              lowStockAlerts.push({
                product: p,
                productId: p.id,
                productName: p.name,
                image: p.images?.[0] || '',
                colorName: cName,
                size: s,
                stock,
              });
            }
          }
        });
      });
    });

    const pendingRequests = requests.filter(
      (r) => r.status === 'requested' || r.status === 'approved'
    ).length;

    return {
      totalRevenue,
      totalOrders: orders.length,
      ordersToday,
      lowOrZeroStockCount,
      pendingRequests,
      lowStockAlerts,
    };
  }, [orders, products, requests]);

  const recentOrders = useMemo(() => orders.slice(0, 5), [orders]);

  const STATUS_STYLES = {
    Delivered: 'bg-success/15 text-success border-success/30',
    Shipped: 'bg-gold/15 text-gold border-gold/30',
    Processing: 'bg-info/15 text-info border-info/30',
    Cancelled: 'bg-error/15 text-error border-error/30',
  };

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200/60 dark:border-gray-800">
        <div>
          <h1 className="font-serif text-3xl font-bold text-charcoal dark:text-cream">
            Executive Overview
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Real-time atelier analytics, order volume and variant stock warnings
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="px-4 py-2.5 rounded-xl bg-charcoal text-cream dark:bg-cream dark:text-charcoal text-xs font-bold uppercase tracking-wider hover:bg-gold dark:hover:bg-gold dark:hover:text-charcoal transition-all shadow-soft flex items-center gap-2"
          >
            <Package size={15} /> Manage Products
          </Link>
          <Link
            to="/admin/orders"
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-bold uppercase tracking-wider hover:border-gold hover:text-gold transition-colors flex items-center gap-2"
          >
            <ShoppingBag size={15} /> All Orders
          </Link>
        </div>
      </div>

      {/* 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="p-6 rounded-2xl bg-cream dark:bg-charcoal-light border border-gray-200/60 dark:border-gray-800 shadow-card">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Gross Sales</span>
            <div className="p-2 rounded-xl bg-gold/10 text-gold">
              <TrendingUp size={18} />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-charcoal dark:text-cream">
            {formatCurrency(kpis.totalRevenue)}
          </p>
          <p className="text-[11px] text-gray-400 mt-1">Across {kpis.totalOrders} total orders</p>
        </div>

        {/* Orders Today */}
        <div className="p-6 rounded-2xl bg-cream dark:bg-charcoal-light border border-gray-200/60 dark:border-gray-800 shadow-card">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Orders Today</span>
            <div className="p-2 rounded-xl bg-info/10 text-info">
              <ShoppingBag size={18} />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-charcoal dark:text-cream">
            {kpis.ordersToday}
          </p>
          <p className="text-[11px] text-gray-400 mt-1">
            {kpis.totalOrders} lifetime transactions
          </p>
        </div>

        {/* Low/Out-of-Stock Variants */}
        <div className="p-6 rounded-2xl bg-cream dark:bg-charcoal-light border border-gray-200/60 dark:border-gray-800 shadow-card">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Low / 0 Stock</span>
            <div className="p-2 rounded-xl bg-warning/10 text-warning">
              <AlertTriangle size={18} />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-warning">
            {kpis.lowOrZeroStockCount}
          </p>
          <p className="text-[11px] text-gray-400 mt-1">
            Variants requiring urgent restocking
          </p>
        </div>

        {/* Pending Exchanges & Returns */}
        <div className="p-6 rounded-2xl bg-cream dark:bg-charcoal-light border border-gray-200/60 dark:border-gray-800 shadow-card">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Exchanges</span>
            <div className="p-2 rounded-xl bg-gold/10 text-gold">
              <RefreshCw size={18} />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-charcoal dark:text-cream">
            {kpis.pendingRequests}
          </p>
          <p className="text-[11px] text-gray-400 mt-1">Awaiting approval or parcel pickup</p>
        </div>
      </div>

      {/* 2-Column Section: Recent Orders + Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Orders (Col 7) */}
        <div className="lg:col-span-7 bg-cream dark:bg-charcoal-light p-6 rounded-3xl border border-gray-200/60 dark:border-gray-800 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200/40 dark:border-gray-800">
            <h2 className="font-serif font-bold text-lg text-charcoal dark:text-cream">
              Recent Customer Orders
            </h2>
            <Link
              to="/admin/orders"
              className="text-xs font-semibold text-gold hover:underline flex items-center gap-1"
            >
              View All <ArrowRight size={13} />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-xs text-gray-400 py-6 text-center">No orders registered yet.</p>
          ) : (
            <div className="divide-y divide-gray-200/40 dark:divide-gray-800">
              {recentOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="py-3.5 first:pt-0 last:pb-0 flex flex-wrap items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-charcoal dark:text-cream">
                        {ord.id}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          STATUS_STYLES[ord.status] || STATUS_STYLES.Processing
                        }`}
                      >
                        {ord.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {ord.customer?.name || 'Customer'} • {ord.items?.length || 0} garment(s) •{' '}
                      {ord.date}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-bold text-charcoal dark:text-cream">
                      {formatCurrency(ord.total)}
                    </p>
                    <Link
                      to={`/admin/orders?highlight=${ord.id}`}
                      className="text-[11px] text-gold hover:underline inline-flex items-center gap-1 font-medium mt-0.5"
                    >
                      Process <ArrowRight size={11} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low-Stock Variant Alert List (Col 5) */}
        <div className="lg:col-span-5 bg-cream dark:bg-charcoal-light p-6 rounded-3xl border border-gray-200/60 dark:border-gray-800 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200/40 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <AlertTriangle size={17} className="text-warning" />
              <h2 className="font-serif font-bold text-lg text-charcoal dark:text-cream">
                Variant Stock Alerts
              </h2>
            </div>
            <span className="text-xs text-gray-400 font-mono">threshold ≤ 3</span>
          </div>

          {kpis.lowStockAlerts.length === 0 ? (
            <div className="py-8 text-center text-gray-400">
              <CheckCircle2 size={24} className="mx-auto text-success mb-2 opacity-60" />
              <p className="text-xs">All size and color variants maintain healthy stock levels.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200/40 dark:divide-gray-800">
              {kpis.lowStockAlerts.map((alert, idx) => (
                <div
                  key={`${alert.productId}-${alert.colorName}-${alert.size}-${idx}`}
                  className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={alert.image}
                      alt={alert.productName}
                      className="w-10 h-12 object-cover rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-charcoal dark:text-cream truncate">
                        {alert.productName}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        {alert.colorName} · Size <strong className="text-charcoal dark:text-cream">{alert.size}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-md ${
                        alert.stock === 0
                          ? 'bg-error/15 text-error border border-error/30'
                          : 'bg-warning/15 text-warning border border-warning/30'
                      }`}
                    >
                      {alert.stock === 0 ? 'Out of Stock' : `${alert.stock} left`}
                    </span>
                    <div>
                      <Link
                        to={`/admin/products/${alert.productId}/stock`}
                        className="text-[10px] uppercase font-bold tracking-wider text-gold hover:underline inline-flex items-center gap-1 mt-1"
                      >
                        Adjust <ExternalLink size={10} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
