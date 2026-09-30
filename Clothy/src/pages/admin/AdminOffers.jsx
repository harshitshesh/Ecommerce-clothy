/**
 * AdminOffers (/admin/offers) — Promotional coupon & discount code CRUD
 * Backed by useOffersStore (clozari-offers in localStorage)
 */
import { useState, useMemo } from 'react';
import {
  Plus,
  Edit,
  Trash2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import useOffersStore from '../../store/useOffersStore';
import { getOfferStatus, OFFER_STATUS } from '../../data/offers';
import { formatCurrency } from '../../utils/formatCurrency';
import Modal from '../../components/ui/Modal';

const OFFER_TYPES = [
  { value: 'percent', label: 'Percentage Off (% off subtotal)' },
  { value: 'flat', label: 'Flat Discount (₹ off subtotal)' },
  { value: 'free-shipping', label: 'Free Shipping' },
];

const CATEGORIES = ['Shirts', 'T-Shirts', 'Jeans', 'Dresses', 'Jackets', 'Footwear', 'Accessories'];

const DEFAULT_VALID_TILL = '2026-10-30';

export default function AdminOffers() {
  const { offers, addOffer, updateOffer, deleteOffer } = useOffersStore();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [editingOffer, setEditingOffer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDeleteCode, setConfirmDeleteCode] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    description: '',
    type: 'percent',
    value: 15,
    maxDiscount: '',
    minOrder: 1499,
    categories: [],
    validTill: DEFAULT_VALID_TILL,
    isFlashSale: false,
  });

  const enrichedOffers = useMemo(() => {
    return offers.map((o) => ({
      ...o,
      status: getOfferStatus(o),
    }));
  }, [offers]);

  const filteredOffers = useMemo(() => {
    return enrichedOffers.filter((o) => {
      const matchSearch =
        search === '' ||
        o.code.toLowerCase().includes(search.toLowerCase()) ||
        o.title.toLowerCase().includes(search.toLowerCase());

      const matchType = typeFilter === 'All' || o.type === typeFilter;
      const matchStatus = statusFilter === 'All' || o.status === statusFilter;

      return matchSearch && matchType && matchStatus;
    });
  }, [enrichedOffers, search, typeFilter, statusFilter]);

  const handleOpenAdd = () => {
    setEditingOffer(null);
    setFormData({
      code: '',
      title: '',
      description: '',
      type: 'percent',
      value: 20,
      maxDiscount: 1500,
      minOrder: 1999,
      categories: [],
      validTill: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      isFlashSale: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (off) => {
    setEditingOffer(off);
    setFormData({
      code: off.code,
      title: off.title,
      description: off.description,
      type: off.type,
      value: off.value,
      maxDiscount: off.maxDiscount != null ? off.maxDiscount : '',
      minOrder: off.minOrder != null ? off.minOrder : 0,
      categories: off.categories || [],
      validTill: off.validTill ? off.validTill.slice(0, 10) : '',
      isFlashSale: Boolean(off.isFlashSale),
    });
    setIsModalOpen(true);
  };

  const handleToggleCategory = (cat) => {
    setFormData((prev) => {
      const exists = prev.categories.includes(cat);
      const next = exists ? prev.categories.filter((c) => c !== cat) : [...prev.categories, cat];
      return { ...prev, categories: next };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const code = formData.code.trim().toUpperCase();
    if (!code) {
      toast.error('Promo code is required');
      return;
    }

    const payload = {
      code,
      title: formData.title.trim() || code,
      description: formData.description.trim(),
      type: formData.type,
      value: Number(formData.value) || 0,
      maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : null,
      minOrder: Number(formData.minOrder) || 0,
      categories: formData.categories,
      validTill: new Date(formData.validTill).toISOString(),
      isFlashSale: formData.isFlashSale,
    };

    if (editingOffer) {
      updateOffer(editingOffer.code, payload);
      toast.success(`Promo code "${code}" updated successfully!`);
    } else {
      const res = addOffer(payload);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success(`Promo code "${code}" created and active!`);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (code) => {
    deleteOffer(code);
    setConfirmDeleteCode(null);
    toast.success(`Deleted promo code "${code}"`);
  };

  const STATUS_STYLES = {
    [OFFER_STATUS.ACTIVE]: 'bg-success/15 text-success border-success/30',
    [OFFER_STATUS.EXPIRING]: 'bg-warning/15 text-warning border-warning/30',
    [OFFER_STATUS.EXPIRED]: 'bg-gray-200 dark:bg-gray-800 text-gray-400 border-gray-300 dark:border-gray-700',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200/60 dark:border-gray-800">
        <div>
          <h1 className="font-serif text-3xl font-bold text-charcoal dark:text-cream">
            Promotions &amp; Coupons
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Create discount rules and promotional coupons live across the storefront
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-charcoal text-cream dark:bg-cream dark:text-charcoal text-xs font-bold uppercase tracking-wider hover:bg-gold dark:hover:bg-gold dark:hover:text-charcoal transition-all shadow-soft flex items-center gap-2"
          >
            <Plus size={16} /> New Promo Code
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-cream dark:bg-charcoal-light p-4 rounded-2xl border border-gray-200/60 dark:border-gray-800 shadow-card flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search code or title..."
            className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-cream/50 dark:bg-charcoal text-xs focus:outline-none focus:border-gold"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-cream/50 dark:bg-charcoal text-xs"
          >
            <option value="All">All Types</option>
            <option value="percent">% Discount</option>
            <option value="flat">Flat ₹ Off</option>
            <option value="free-shipping">Free Shipping</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-cream/50 dark:bg-charcoal text-xs"
          >
            <option value="All">All Statuses</option>
            <option value={OFFER_STATUS.ACTIVE}>Active</option>
            <option value={OFFER_STATUS.EXPIRING}>Expiring Soon</option>
            <option value={OFFER_STATUS.EXPIRED}>Expired</option>
          </select>

          <span className="text-xs text-gray-400 font-mono">
            {filteredOffers.length} Promo{filteredOffers.length === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      {/* Offers Table */}
      <div className="bg-cream dark:bg-charcoal-light rounded-2xl border border-gray-200/60 dark:border-gray-800 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream-dark/40 dark:bg-charcoal border-b border-gray-200/60 dark:border-gray-800 uppercase tracking-wider text-[10px] text-gray-500 font-bold">
              <tr>
                <th className="py-3.5 px-4">Promo Code</th>
                <th className="py-3.5 px-4">Offer Title</th>
                <th className="py-3.5 px-4">Discount Value</th>
                <th className="py-3.5 px-4">Min. Subtotal</th>
                <th className="py-3.5 px-4">Applicability</th>
                <th className="py-3.5 px-4">Valid Until</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/40 dark:divide-gray-800">
              {filteredOffers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    No promo codes match the filters.
                  </td>
                </tr>
              ) : (
                filteredOffers.map((off) => (
                  <tr key={off.code} className="hover:bg-gold/5 transition-colors">
                    {/* Code */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-xs bg-gold/15 text-gold border border-gold/30 px-2 py-0.5 rounded-md inline-block">
                        {off.code}
                      </span>
                      {off.isFlashSale && (
                        <span className="block text-[9px] font-bold text-warning uppercase mt-0.5">
                          ⚡ Flash Sale
                        </span>
                      )}
                    </td>

                    {/* Title */}
                    <td className="py-3.5 px-4 font-semibold text-charcoal dark:text-cream">
                      {off.title}
                      <span className="block text-[10px] text-gray-400 font-normal">
                        {off.description}
                      </span>
                    </td>

                    {/* Value */}
                    <td className="py-3.5 px-4 font-bold text-charcoal dark:text-cream">
                      {off.type === 'percent' && `${off.value}% OFF`}
                      {off.type === 'flat' && `${formatCurrency(off.value)} OFF`}
                      {off.type === 'free-shipping' && 'FREE SHIPPING'}
                      {off.maxDiscount && (
                        <span className="block text-[10px] text-gray-400 font-normal">
                          Cap: {formatCurrency(off.maxDiscount)}
                        </span>
                      )}
                    </td>

                    {/* Min Order */}
                    <td className="py-3.5 px-4">
                      {off.minOrder > 0 ? formatCurrency(off.minOrder) : 'No Minimum'}
                    </td>

                    {/* Applicability */}
                    <td className="py-3.5 px-4">
                      {off.categories && off.categories.length > 0 ? (
                        <span className="text-[11px] text-gray-500">
                          {off.categories.join(', ')}
                        </span>
                      ) : (
                        <span className="text-[11px] text-gold font-semibold">Sitewide</span>
                      )}
                    </td>

                    {/* Expiry */}
                    <td className="py-3.5 px-4 text-gray-500 font-mono text-[11px]">
                      {off.validTill ? off.validTill.slice(0, 10) : 'Open-ended'}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          STATUS_STYLES[off.status] || STATUS_STYLES[OFFER_STATUS.ACTIVE]
                        }`}
                      >
                        {off.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(off)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-charcoal dark:hover:text-cream hover:bg-gray-200/60 dark:hover:bg-gray-800"
                          title="Edit"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteCode(off.code)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-error hover:bg-error/10"
                          title="Delete"
                        >
                          <Trash2 size={14} />
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

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingOffer ? `Edit Promo Code "${editingOffer.code}"` : 'Create New Promotional Code'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold uppercase text-gray-500 mb-1">
                Coupon Code * (e.g. FESTIVE25)
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                disabled={Boolean(editingOffer)}
                required
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-cream/50 dark:bg-charcoal font-mono uppercase font-bold text-charcoal dark:text-cream disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block font-bold uppercase text-gray-500 mb-1">Discount Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-cream/50 dark:bg-charcoal text-xs"
              >
                {OFFER_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block font-bold uppercase text-gray-500 mb-1">
                {formData.type === 'percent' ? 'Discount %' : 'Discount ₹ Value'} *
              </label>
              <input
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                min={1}
                required
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-cream/50 dark:bg-charcoal text-xs"
              />
            </div>
            <div>
              <label className="block font-bold uppercase text-gray-500 mb-1">Max Cap (₹)</label>
              <input
                type="number"
                value={formData.maxDiscount}
                onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                placeholder="Optional"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-cream/50 dark:bg-charcoal text-xs"
              />
            </div>
            <div>
              <label className="block font-bold uppercase text-gray-500 mb-1">Min. Order (₹)</label>
              <input
                type="number"
                value={formData.minOrder}
                onChange={(e) => setFormData({ ...formData, minOrder: e.target.value })}
                min={0}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-cream/50 dark:bg-charcoal text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold uppercase text-gray-500 mb-1">Title &amp; Heading</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Festive Exclusive Markdown"
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-cream/50 dark:bg-charcoal text-xs"
            />
          </div>

          <div>
            <label className="block font-bold uppercase text-gray-500 mb-1">Description</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Short explanation displayed on voucher cards..."
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-cream/50 dark:bg-charcoal text-xs"
            />
          </div>

          {/* Expiry & Flash Sale */}
          <div className="grid grid-cols-2 gap-4 items-center">
            <div>
              <label className="block font-bold uppercase text-gray-500 mb-1">Valid Till Date</label>
              <input
                type="date"
                value={formData.validTill}
                onChange={(e) => setFormData({ ...formData, validTill: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-cream/50 dark:bg-charcoal text-xs"
              />
            </div>
            <div className="pt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFlashSale}
                  onChange={(e) => setFormData({ ...formData, isFlashSale: e.target.checked })}
                  className="rounded text-gold focus:ring-gold"
                />
                <span className="font-semibold text-charcoal dark:text-cream">
                  Flag as Flash Sale (Urgency Banner)
                </span>
              </label>
            </div>
          </div>

          {/* Category Scoping */}
          <div>
            <label className="block font-bold uppercase text-gray-500 mb-1.5">
              Category Scope (Empty = Sitewide across all items)
            </label>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((cat) => {
                const isSelected = formData.categories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleToggleCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-gold text-white border-transparent'
                        : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gold'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200/50 dark:border-gray-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl border text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-charcoal text-cream dark:bg-cream dark:text-charcoal font-bold text-xs uppercase tracking-wider hover:bg-gold dark:hover:bg-gold dark:hover:text-charcoal transition-colors"
            >
              {editingOffer ? 'Save Changes' : 'Create Offer'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(confirmDeleteCode)}
        onClose={() => setConfirmDeleteCode(null)}
        title="Confirm Offer Deletion"
        maxWidth="max-w-md"
      >
        <div className="space-y-4 text-xs">
          <p className="text-gray-600 dark:text-gray-300">
            Are you sure you want to delete promo code &ldquo;
            <strong className="text-charcoal dark:text-cream">{confirmDeleteCode}</strong>&rdquo;?
            Customers will no longer be able to apply it at checkout.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setConfirmDeleteCode(null)}
              className="px-4 py-2 rounded-xl border text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDelete(confirmDeleteCode)}
              className="px-4 py-2 rounded-xl bg-error text-white font-bold text-xs uppercase tracking-wider"
            >
              Delete Offer
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
