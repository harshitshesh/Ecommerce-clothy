/**
 * AdminExchanges (/admin/exchanges) — Staff processing of post-delivery exchanges & returns
 * Approves/rejects requests, confirms item pickup, releases replacement stock or triggers refunds (PRD 6.2)
 */
import { useState, useMemo } from 'react';
import {
  RefreshCw,
  Undo2,
  CheckCircle2,
  XCircle,
  Truck,
  Eye,
} from 'lucide-react';
import toast from 'react-hot-toast';
import useReturnsStore from '../../store/useReturnsStore';
import { formatCurrency } from '../../utils/formatCurrency';
import Modal from '../../components/ui/Modal';

const STATUS_FILTERS = ['All', 'requested', 'approved', 'picked-up', 'completed', 'rejected'];
const TYPE_FILTERS = ['All', 'exchange', 'return'];

const BADGE_STYLES = {
  requested: 'bg-info/15 text-info border-info/30',
  approved: 'bg-gold/15 text-gold border-gold/30',
  'picked-up': 'bg-warning/15 text-warning border-warning/30',
  completed: 'bg-success/15 text-success border-success/30',
  rejected: 'bg-error/15 text-error border-error/30',
};

export default function AdminExchanges() {
  const { getAllAdmin, updateRequestStatus } = useReturnsStore();

  const requests = getAllAdmin();

  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionNote, setActionNote] = useState('');

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const matchStatus =
        selectedStatus === 'All' || req.status.toLowerCase() === selectedStatus.toLowerCase();
      const matchType =
        selectedType === 'All' || req.type.toLowerCase() === selectedType.toLowerCase();
      return matchStatus && matchType;
    });
  }, [requests, selectedStatus, selectedType]);

  const handleStatusAction = (requestId, nextStatus, customNote = '') => {
    const res = updateRequestStatus(requestId, nextStatus, customNote || actionNote);
    if (res.ok) {
      toast.success(`Request marked as "${nextStatus}"`);
      setActionNote('');
      const updated = getAllAdmin().find((r) => r.id === requestId);
      if (updated) setSelectedRequest(updated);
    } else {
      toast.error(res.error || 'Failed to update request');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200/60 dark:border-gray-800">
        <div>
          <h1 className="font-serif text-3xl font-bold text-charcoal dark:text-cream">
            Exchanges &amp; Returns
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Authorize size exchanges, manage replacement stock reservations, and issue refunds (PRD 6.2)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-gray-400">
            {filteredRequests.length} Request{filteredRequests.length === 1 ? '' : 's'} Total
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-cream dark:bg-charcoal-light p-4 rounded-2xl border border-gray-200/60 dark:border-gray-800 shadow-card flex flex-wrap items-center justify-between gap-4">
        {/* Status Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mr-1">Status:</span>
          {STATUS_FILTERS.map((st) => (
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

        {/* Type Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Type:</span>
          <div className="inline-flex rounded-xl border border-gray-200 dark:border-gray-700 p-0.5 bg-cream/50 dark:bg-charcoal">
            {TYPE_FILTERS.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                  selectedType === t
                    ? 'bg-gold text-white font-bold'
                    : 'text-gray-500 hover:text-charcoal dark:hover:text-cream'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-cream dark:bg-charcoal-light rounded-2xl border border-gray-200/60 dark:border-gray-800 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream-dark/40 dark:bg-charcoal border-b border-gray-200/60 dark:border-gray-800 uppercase tracking-wider text-[10px] text-gray-500 font-bold">
              <tr>
                <th className="py-3.5 px-4">Request &amp; Order</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Original Garment</th>
                <th className="py-3.5 px-4">Exchange / Refund Goal</th>
                <th className="py-3.5 px-4">Reason &amp; Slot</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/40 dark:divide-gray-800">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    No return or exchange requests matching the criteria.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-gold/5 transition-colors">
                    {/* ID & Order */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-charcoal dark:text-cream block">
                        {req.id}
                      </span>
                      <span className="text-[11px] text-gold font-semibold font-mono">
                        {req.orderId}
                      </span>
                    </td>

                    {/* Type */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          req.type === 'exchange'
                            ? 'bg-gold/15 text-gold border border-gold/30'
                            : 'bg-charcoal/10 text-charcoal dark:bg-cream/10 dark:text-cream border border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        {req.type === 'exchange' ? <RefreshCw size={11} /> : <Undo2 size={11} />}
                        {req.type}
                      </span>
                    </td>

                    {/* Garment */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        {req.itemImage && (
                          <img
                            src={req.itemImage}
                            alt=""
                            className="w-10 h-12 object-cover rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700 shrink-0"
                          />
                        )}
                        <div>
                          <p className="font-bold text-charcoal dark:text-cream truncate max-w-[150px]">
                            {req.itemName || 'Garment'}
                          </p>
                          <p className="text-[10px] font-mono text-gray-400">
                            {req.itemSku || 'SKU'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Exchange Goal / Refund */}
                    <td className="py-3.5 px-4">
                      {req.type === 'exchange' ? (
                        <div>
                          <span className="text-gold font-bold">
                            Swap for Size {req.newSize || 'New Size'}
                          </span>
                          <span className="block text-[10px] text-gray-400">
                            (Stock reserved upon approval)
                          </span>
                        </div>
                      ) : (
                        <div>
                          <span className="font-semibold text-charcoal dark:text-cream">
                            Refund to {req.refundTo === 'wallet' ? 'Clozari Wallet' : 'Original Method'}
                          </span>
                          {req.refundAmount && (
                            <span className="block text-[10px] text-gray-400">
                              {formatCurrency(req.refundAmount)}
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Reason & Pickup */}
                    <td className="py-3.5 px-4">
                      <p className="text-gray-700 dark:text-gray-200 font-medium">{req.reason}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        Pickup: {req.pickupSlot || 'Standard'}
                      </p>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          BADGE_STYLES[req.status] || BADGE_STYLES.requested
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedRequest(req)}
                        className="px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-semibold hover:border-gold hover:text-gold transition-colors inline-flex items-center gap-1"
                      >
                        <Eye size={13} /> Review
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Request Modal */}
      {selectedRequest && (
        <Modal
          isOpen={Boolean(selectedRequest)}
          onClose={() => setSelectedRequest(null)}
          title={`Review ${selectedRequest.type === 'exchange' ? 'Size Exchange' : 'Return'} Request`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-5 text-xs">
            {/* Top Overview */}
            <div className="p-4 rounded-xl bg-cream-dark/30 dark:bg-charcoal border border-gray-200/60 dark:border-gray-800 flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-charcoal dark:text-cream block">
                  Request #{selectedRequest.id}
                </span>
                <span className="text-[11px] text-gray-400">
                  Associated Order: <strong className="text-gold font-mono">{selectedRequest.orderId}</strong>
                </span>
              </div>
              <span
                className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                  BADGE_STYLES[selectedRequest.status] || BADGE_STYLES.requested
                }`}
              >
                {selectedRequest.status}
              </span>
            </div>

            {/* Request Specifics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl border border-gray-200/60 dark:border-gray-800 bg-cream/40 dark:bg-charcoal/40 space-y-1">
                <span className="text-[10px] font-bold uppercase text-gray-400 block">Garment Returned:</span>
                <p className="font-bold text-charcoal dark:text-cream">{selectedRequest.itemName}</p>
                <p className="font-mono text-[10px] text-gray-400">SKU: {selectedRequest.itemSku || '—'}</p>
                <p className="text-gray-500">Reason: {selectedRequest.reason}</p>
                {selectedRequest.note && <p className="italic text-gray-400">Note: &ldquo;{selectedRequest.note}&rdquo;</p>}
              </div>

              <div className="p-3.5 rounded-xl border border-gray-200/60 dark:border-gray-800 bg-cream/40 dark:bg-charcoal/40 space-y-1">
                <span className="text-[10px] font-bold uppercase text-gray-400 block">
                  {selectedRequest.type === 'exchange' ? 'Desired Replacement:' : 'Refund Details:'}
                </span>
                {selectedRequest.type === 'exchange' ? (
                  <>
                    <p className="font-bold text-gold text-sm">New Size: {selectedRequest.newSize}</p>
                    <p className="text-[11px] text-gray-500">
                      Replacement stock will be reserved and locked for the customer.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-bold text-charcoal dark:text-cream">
                      Destination: {selectedRequest.refundTo === 'wallet' ? 'Clozari Wallet' : 'Original Payment Method'}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      Amount: {selectedRequest.refundAmount ? formatCurrency(selectedRequest.refundAmount) : 'Full Item Value'}
                    </p>
                  </>
                )}
                <p className="text-gray-400 pt-1">Scheduled Pickup: {selectedRequest.pickupSlot}</p>
              </div>
            </div>

            {/* Actions for Staff */}
            <div className="p-4 rounded-xl border border-gold/30 bg-gold/5 dark:bg-charcoal/80 space-y-3">
              <span className="font-bold text-charcoal dark:text-cream block text-xs">
                Staff Action Controls:
              </span>

              {/* Note input */}
              <input
                type="text"
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                placeholder="Optional internal note or milestone comment..."
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-charcoal text-xs"
              />

              {/* Action Buttons */}
              <div className="flex gap-2 flex-wrap pt-1">
                {selectedRequest.status === 'requested' && (
                  <>
                    <button
                      onClick={() => handleStatusAction(selectedRequest.id, 'approved', 'Request approved by staff')}
                      className="px-3.5 py-2 rounded-lg bg-gold text-white font-bold text-xs uppercase tracking-wider hover:bg-gold-dark flex items-center gap-1.5"
                    >
                      <CheckCircle2 size={14} /> Approve Request
                    </button>
                    <button
                      onClick={() => handleStatusAction(selectedRequest.id, 'rejected', 'Request rejected by store team')}
                      className="px-3.5 py-2 rounded-lg border border-error/40 text-error hover:bg-error/10 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"
                    >
                      <XCircle size={14} /> Reject
                    </button>
                  </>
                )}

                {selectedRequest.status === 'approved' && (
                  <button
                    onClick={() => handleStatusAction(selectedRequest.id, 'picked-up', 'Courier collected parcel from customer')}
                    className="px-3.5 py-2 rounded-lg bg-charcoal text-cream dark:bg-cream dark:text-charcoal font-bold text-xs uppercase tracking-wider hover:bg-gold hover:text-white flex items-center gap-1.5"
                  >
                    <Truck size={14} /> Confirm Parcel Pickup
                  </button>
                )}

                {selectedRequest.status === 'picked-up' && (
                  <button
                    onClick={() => handleStatusAction(selectedRequest.id, 'completed', 'Completed — fulfilled replacement / refund released')}
                    className="px-3.5 py-2 rounded-lg bg-success text-white font-bold text-xs uppercase tracking-wider hover:bg-success/90 flex items-center gap-1.5"
                  >
                    <CheckCircle2 size={14} /> Complete &amp; Release {selectedRequest.type === 'exchange' ? 'Replacement' : 'Refund'}
                  </button>
                )}

                {selectedRequest.status === 'completed' && (
                  <span className="text-xs text-success font-bold flex items-center gap-1.5 py-1">
                    <CheckCircle2 size={15} /> This request has been fully completed and settled.
                  </span>
                )}

                {selectedRequest.status === 'rejected' && (
                  <span className="text-xs text-error font-bold flex items-center gap-1.5 py-1">
                    <XCircle size={15} /> This request was rejected.
                  </span>
                )}
              </div>
            </div>

            {/* Audit Timeline */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
                Request Audit Timeline
              </span>
              <div className="space-y-2 border-l-2 border-gold/40 pl-3">
                {(selectedRequest.timeline || []).map((step, idx) => (
                  <div key={idx} className="text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="font-bold uppercase tracking-wider text-charcoal dark:text-cream">
                        {step.status}
                      </span>
                      <span className="text-gray-400">
                        {new Date(step.date).toLocaleString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-gray-500 mt-0.5">{step.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
