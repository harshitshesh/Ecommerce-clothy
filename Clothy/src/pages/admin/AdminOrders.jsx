/**
 * AdminOrders (/admin/orders) — Order management, picking verification, and packing slip
 * Shows size + colour clearly per line item for accurate warehouse picking (PRD 6.2)
 */
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Printer,
  Eye,
} from 'lucide-react';
import toast from 'react-hot-toast';
import useOrdersStore from '../../store/useOrdersStore';
import { formatCurrency } from '../../utils/formatCurrency';
import Modal from '../../components/ui/Modal';
import OrderTracker from '../../components/features/OrderTracker';

const STATUS_OPTIONS = ['All', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

const STATUS_BADGES = {
  Delivered: 'bg-success/15 text-success border-success/30',
  Shipped: 'bg-gold/15 text-gold border-gold/30',
  'Out for Delivery': 'bg-warning/15 text-warning border-warning/30',
  Processing: 'bg-info/15 text-info border-info/30',
  Cancelled: 'bg-error/15 text-error border-error/30',
};

export default function AdminOrders() {
  const [searchParams] = useSearchParams();
  const highlightedId = searchParams.get('highlight');

  const { getAllAdmin, updateOrderStatus } = useOrdersStore();
  const allOrders = getAllAdmin();

  const [search, setSearch] = useState(highlightedId || '');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isPackingSlipOpen, setIsPackingSlipOpen] = useState(false);
  const [newStatusNote, setNewStatusNote] = useState('');

  // If highlighted from dashboard
  useEffect(() => {
    if (highlightedId) {
      const match = allOrders.find((o) => o.id === highlightedId);
      if (match) setSelectedOrder(match);
    }
  }, [highlightedId, allOrders]);

  const filteredOrders = useMemo(() => {
    return allOrders.filter((ord) => {
      const matchSearch =
        search === '' ||
        ord.id.toLowerCase().includes(search.toLowerCase()) ||
        ord.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
        ord.customer?.email?.toLowerCase().includes(search.toLowerCase());

      const matchStatus =
        selectedStatus === 'All' || ord.status.toLowerCase() === selectedStatus.toLowerCase();

      return matchSearch && matchStatus;
    });
  }, [allOrders, search, selectedStatus]);

  const handleUpdateStatus = (orderId, targetStatus) => {
    const success = updateOrderStatus(orderId, targetStatus, newStatusNote);
    if (success) {
      toast.success(`Order ${orderId} updated to ${targetStatus}`);
      setNewStatusNote('');
      // Refresh current open view
      const updated = getAllAdmin().find((o) => o.id === orderId);
      if (updated) setSelectedOrder(updated);
    } else {
      toast.error('Failed to update order status');
    }
  };

  const handlePrintSlip = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200/60 dark:border-gray-800">
        <div>
          <h1 className="font-serif text-3xl font-bold text-charcoal dark:text-cream">
            Order Fulfillment
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Pick and pack orders with exact colour and size SKU confirmation (PRD 6.2)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-gray-400">
            {filteredOrders.length} Order{filteredOrders.length === 1 ? '' : 's'} Total
          </span>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-cream dark:bg-charcoal-light p-4 rounded-2xl border border-gray-200/60 dark:border-gray-800 shadow-card flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
            <Search size={15} />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order ID, customer name, email..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-cream/50 dark:bg-charcoal text-xs focus:outline-none focus:border-gold"
          />
        </div>

        {/* Status filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {STATUS_OPTIONS.map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shrink-0 ${
                  selectedStatus === st
                    ? 'bg-charcoal text-cream dark:bg-cream dark:text-charcoal shadow-soft font-bold'
                    : 'border border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gold'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-cream dark:bg-charcoal-light rounded-2xl border border-gray-200/60 dark:border-gray-800 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream-dark/40 dark:bg-charcoal border-b border-gray-200/60 dark:border-gray-800 uppercase tracking-wider text-[10px] text-gray-500 font-bold">
              <tr>
                <th className="py-3.5 px-4">Order ID &amp; Date</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Line Items (SKUs)</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/40 dark:divide-gray-800">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    No orders found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-gold/5 transition-colors">
                    {/* ID & Date */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-charcoal dark:text-cream block">
                        {ord.id}
                      </span>
                      <span className="text-[11px] text-gray-400">{ord.date}</span>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-charcoal dark:text-cream truncate max-w-[150px]">
                        {ord.customer?.name || 'Customer'}
                      </p>
                      <p className="text-[10px] text-gray-400 truncate max-w-[150px]">
                        {ord.customer?.email || ord.customer?.phone || '—'}
                      </p>
                    </td>

                    {/* Line Items */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        {(ord.items || []).map((it, idx) => {
                          const cName = typeof it.color === 'string' ? it.color : it.color?.name;
                          return (
                            <div key={idx} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                              <span className="text-gray-700 dark:text-gray-200 font-medium truncate max-w-[200px]">
                                {it.name}
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-cream-dark dark:bg-gray-800 text-[10px] font-bold text-gold">
                                {cName} / {it.size}
                              </span>
                              <span className="text-gray-400 text-[11px]">×{it.quantity}</span>
                            </div>
                          );
                        })}
                      </div>
                    </td>

                    {/* Total Amount */}
                    <td className="py-3.5 px-4 font-bold text-charcoal dark:text-cream">
                      {formatCurrency(ord.total)}
                    </td>

                    {/* Payment Method */}
                    <td className="py-3.5 px-4">
                      <span className="text-xs text-gray-600 dark:text-gray-300">
                        {ord.paymentMethod || 'Prepaid'}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          STATUS_BADGES[ord.status] || STATUS_BADGES.Processing
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedOrder(ord);
                            setIsPackingSlipOpen(false);
                          }}
                          className="px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-semibold hover:border-gold hover:text-gold transition-colors inline-flex items-center gap-1"
                        >
                          <Eye size={13} /> View
                        </button>
                        <button
                          onClick={() => {
                            setSelectedOrder(ord);
                            setIsPackingSlipOpen(true);
                          }}
                          className="px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-semibold hover:bg-gold/10 hover:text-gold transition-colors inline-flex items-center gap-1"
                          title="Print Packing Slip"
                        >
                          <Printer size={13} /> Slip
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && !isPackingSlipOpen && (
        <Modal
          isOpen={Boolean(selectedOrder)}
          onClose={() => setSelectedOrder(null)}
          title={`Order ${selectedOrder.id}`}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-1 text-xs">
            {/* Top row: Status updater */}
            <div className="p-4 rounded-2xl bg-cream-dark/30 dark:bg-charcoal border border-gray-200/60 dark:border-gray-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                    Current Fulfillment Status
                  </span>
                  <span
                    className={`inline-block text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border mt-1 ${
                      STATUS_BADGES[selectedOrder.status] || STATUS_BADGES.Processing
                    }`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
                <button
                  onClick={() => setIsPackingSlipOpen(true)}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-semibold flex items-center gap-1.5 hover:border-gold hover:text-gold"
                >
                  <Printer size={13} /> Print Packing Slip
                </button>
              </div>

              {/* Status progression triggers */}
              <div className="pt-2 border-t border-gray-200/40 dark:border-gray-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-2">
                  Advance Delivery Milestone:
                </span>
                <div className="flex gap-2 flex-wrap">
                  {['Processing', 'Shipped', 'Out for Delivery', 'Delivered'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      disabled={selectedOrder.status === st}
                      onClick={() => handleUpdateStatus(selectedOrder.id, st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all ${
                        selectedOrder.status === st
                          ? 'bg-charcoal text-cream dark:bg-cream dark:text-charcoal border-transparent opacity-50'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gold hover:text-gold'
                      }`}
                    >
                      → Mark {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Warehouse Picking List (Line items with SKU, Size, Colour) */}
            <div className="space-y-3">
              <h3 className="font-serif font-bold text-sm text-charcoal dark:text-cream">
                Warehouse Picking Breakdown (SKU / Colour / Size)
              </h3>
              <div className="divide-y divide-gray-200/40 dark:divide-gray-800 border border-gray-200/60 dark:border-gray-800 rounded-xl overflow-hidden bg-cream/40 dark:bg-charcoal/40">
                {(selectedOrder.items || []).map((it, idx) => {
                  const cName = typeof it.color === 'string' ? it.color : it.color?.name || 'Standard';
                  return (
                    <div key={idx} className="p-3.5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={it.image || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=100&q=80'}
                          alt={it.name}
                          className="w-12 h-14 object-cover rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-charcoal dark:text-cream">{it.name}</p>
                          <p className="font-mono text-[10px] text-gray-400 mt-0.5">
                            SKU: {it.sku || `CLZ-${it.id || 'ITEM'}-${cName.toUpperCase().slice(0,3)}-${it.size}`}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-bold text-gold px-1.5 py-0.5 rounded bg-gold/10 text-[10px]">
                              Colour: {cName}
                            </span>
                            <span className="font-bold text-charcoal dark:text-cream px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-[10px]">
                              Size: {it.size}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-bold text-charcoal dark:text-cream block">
                          Qty: {it.quantity}
                        </span>
                        <span className="text-[11px] text-gray-400">
                          {formatCurrency(it.price * it.quantity)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Customer Shipping Address & Payment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-gray-200/60 dark:border-gray-800 bg-cream/40 dark:bg-charcoal/40 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                  Shipping Destination
                </span>
                <p className="font-bold text-charcoal dark:text-cream">
                  {selectedOrder.customer?.name || selectedOrder.address?.name}
                </p>
                <p className="text-gray-500">
                  {selectedOrder.address?.line1}, {selectedOrder.address?.line2 && `${selectedOrder.address?.line2}, `}
                  {selectedOrder.address?.city}, {selectedOrder.address?.state} — {selectedOrder.address?.pin}
                </p>
                <p className="text-gray-400">Phone: {selectedOrder.address?.phone || selectedOrder.customer?.phone}</p>
              </div>

              <div className="p-4 rounded-xl border border-gray-200/60 dark:border-gray-800 bg-cream/40 dark:bg-charcoal/40 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                  Billing Breakdown
                </span>
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal:</span>
                  <span className="font-semibold">{formatCurrency(selectedOrder.subtotal || selectedOrder.total)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Discount:</span>
                    <span>−{formatCurrency(selectedOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-gray-200/40 dark:border-gray-800 font-bold text-charcoal dark:text-cream">
                  <span>Grand Total:</span>
                  <span>{formatCurrency(selectedOrder.total)}</span>
                </div>
              </div>
            </div>

            {/* Live Customer Timeline Preview */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
                Customer View Timeline Tracking
              </span>
              <div className="p-4 rounded-xl bg-cream-dark/30 dark:bg-charcoal border border-gray-200/60 dark:border-gray-800">
                <OrderTracker tracking={selectedOrder.tracking} />
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Printable Packing Slip Modal */}
      {selectedOrder && isPackingSlipOpen && (
        <Modal
          isOpen={isPackingSlipOpen}
          onClose={() => setIsPackingSlipOpen(false)}
          title={`Dispatch Packing Slip — ${selectedOrder.id}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6 text-xs text-charcoal bg-white p-6 rounded-xl border border-gray-300 print:m-0 print:border-none">
            {/* Header */}
            <div className="flex items-start justify-between border-b pb-4">
              <div>
                <h2 className="font-serif text-2xl font-bold tracking-widest">CLOZARI</h2>
                <p className="text-[10px] uppercase tracking-wider text-gray-500">
                  Atelier Dispatch &amp; Warehouse Packing Slip
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm font-bold">{selectedOrder.id}</p>
                <p className="text-[10px] text-gray-500">Date: {selectedOrder.date}</p>
              </div>
            </div>

            {/* Recipient */}
            <div className="grid grid-cols-2 gap-4 pb-4 border-b">
              <div>
                <span className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                  Deliver To:
                </span>
                <p className="font-bold">{selectedOrder.customer?.name || selectedOrder.address?.name}</p>
                <p className="text-gray-600">
                  {selectedOrder.address?.line1}, {selectedOrder.address?.line2 && `${selectedOrder.address?.line2}, `}
                  {selectedOrder.address?.city}, {selectedOrder.address?.state} — {selectedOrder.address?.pin}
                </p>
                <p className="text-gray-500">Phone: {selectedOrder.address?.phone || selectedOrder.customer?.phone}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                  Shipment Info:
                </span>
                <p className="text-gray-600">Method: Express Dispatch</p>
                <p className="text-gray-600">Payment: {selectedOrder.paymentMethod || 'Prepaid'}</p>
                <p className="text-gray-600">Status: {selectedOrder.status}</p>
              </div>
            </div>

            {/* Picking Table */}
            <div>
              <span className="text-[10px] font-bold uppercase text-gray-500 block mb-2">
                Garment Pick List (Verify Exact SKU, Colour, and Size):
              </span>
              <table className="w-full text-left border">
                <thead className="bg-gray-100 uppercase text-[10px] border-b">
                  <tr>
                    <th className="p-2">Item Description</th>
                    <th className="p-2">SKU</th>
                    <th className="p-2">Colour</th>
                    <th className="p-2">Size</th>
                    <th className="p-2 text-right">Qty</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {(selectedOrder.items || []).map((it, idx) => {
                    const cName = typeof it.color === 'string' ? it.color : it.color?.name || 'Standard';
                    return (
                      <tr key={idx}>
                        <td className="p-2 font-semibold">{it.name}</td>
                        <td className="p-2 font-mono text-[10px]">{it.sku || 'CLZ-SKU'}</td>
                        <td className="p-2 font-bold">{cName}</td>
                        <td className="p-2 font-bold">{it.size}</td>
                        <td className="p-2 text-right font-bold text-sm">[{it.quantity}]</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Signature row */}
            <div className="pt-8 border-t flex justify-between text-[10px] text-gray-500">
              <div>
                <p>Packed by: _______________________</p>
              </div>
              <div>
                <p>Quality check: _______________________</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t print:hidden">
              <button
                type="button"
                onClick={() => setIsPackingSlipOpen(false)}
                className="px-4 py-2 rounded-lg border text-xs font-semibold"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handlePrintSlip}
                className="px-4 py-2 rounded-lg bg-charcoal text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
              >
                <Printer size={14} /> Print Slip
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
