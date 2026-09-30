/**
 * ReturnRequestModal — one flow for both returns and size exchanges.
 * choose qty → reason → action (exchange size / refund method) → pickup slot.
 * Exchange reserves the new size in localStorage stock overrides; a return
 * reverses the item's share of earned coins and refunds the coins it was
 * paid with.
 */
import { useEffect, useMemo, useState } from 'react';
import { Coins, Package, RefreshCw, Undo2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../ui/Modal';
import products from '../../data/products';
import useReturnsStore from '../../store/useReturnsStore';
import useWalletStore from '../../store/useWalletStore';
import useAuthStore from '../../store/useAuthStore';
import {
  PICKUP_SLOTS,
  REFUND_METHODS,
  RETURN_REASONS,
  colorNameOf,
  getItemShares,
  itemSkuOf,
} from '../../utils/returns';
import { getVariantStock, reserveVariantStock, restockVariantStock } from '../../utils/variantStock';
import { formatCurrency } from '../../utils/formatCurrency';

const TYPE_OPTIONS = [
  { value: 'return', label: 'Return', icon: Undo2, hint: 'Send it back for a refund' },
  { value: 'exchange', label: 'Exchange', icon: RefreshCw, hint: 'Same piece, new size' },
];

const fieldLabel = 'block uppercase tracking-wider font-semibold text-gray-500 mb-1.5';
const inputClass =
  'w-full px-3.5 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-cream dark:bg-charcoal text-charcoal dark:text-cream text-xs focus:outline-none focus:border-gold';

export default function ReturnRequestModal({
  isOpen,
  onClose,
  order,
  itemIndex,
  initialType = 'return',
}) {
  const session = useAuthStore((s) => s.session);
  const createRequest = useReturnsStore((s) => s.createRequest);
  const advanceStatuses = useReturnsStore((s) => s.advanceStatuses);

  const [type, setType] = useState(initialType);
  const [qty, setQty] = useState(1);
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');
  const [newSize, setNewSize] = useState('');
  const [refundTo, setRefundTo] = useState('original');
  const [pickupSlot, setPickupSlot] = useState(PICKUP_SLOTS[0]);
  const [notice, setNotice] = useState('');

  const item = order?.items?.[itemIndex];
  const product = useMemo(
    () => products.find((p) => p.id === item?.id || p.id === item?.productId) || null,
    [item]
  );
  const colorName = colorNameOf(item || {});
  const shares = useMemo(() => getItemShares(order, itemIndex), [order, itemIndex]);

  useEffect(() => {
    if (!isOpen) return;
    setType(initialType);
    setQty(1);
    setReason('');
    setNote('');
    setNewSize('');
    setRefundTo('original');
    setPickupSlot(PICKUP_SLOTS[0]);
    setNotice('');
  }, [isOpen, initialType, itemIndex]);

  if (!isOpen || !order || !item) return null;

  const maxQty = Math.max(1, Number(item.quantity) || 1);
  const sizes = product?.sizes || [];
  const ownedSize = item.size;
  const sizeStock = (size) =>
    product ? getVariantStock(product, colorName, size) : 0;
  const sizeAvailable = (size) =>
    size !== ownedSize && sizes.includes(size) && sizeStock(size) > 0;

  const handleSelectSize = (size) => {
    if (size === ownedSize) {
      setNotice('That is the size you already own — pick another size.');
      return;
    }
    if (sizeStock(size) <= 0) {
      setNotice(
        `${size} is out of stock right now. You can return this item for a refund instead.`
      );
      return;
    }
    setNewSize(size);
    setNotice('');
  };

  const handleSubmit = () => {
    if (!reason) {
      toast.error('Please choose a reason.');
      return;
    }
    if (type === 'exchange') {
      if (!newSize) {
        toast.error('Please choose the size you want instead.');
        return;
      }
      if (!product || sizeStock(newSize) <= 0) {
        setNotice(
          `${newSize || 'That size'} is out of stock. Request a refund instead.`
        );
        toast.error('That size is out of stock.');
        return;
      }
    } else if (!refundTo) {
      toast.error('Please choose a refund method.');
      return;
    }

    // Persist first — nothing may change (stock, coins) unless the request
    // is actually accepted, e.g. a duplicate on this order line is rejected.
    const result = createRequest({
      orderId: order.id,
      userId: session?.id,
      itemSku: itemSkuOf(item, itemIndex),
      itemIndex,
      itemName: item.name,
      itemSize: item.size,
      itemColor: colorName,
      type,
      reason,
      note: note.trim(),
      qty,
      newSize: type === 'exchange' ? newSize : null,
      refundTo: type === 'return' ? refundTo : null,
      refundAmount: type === 'return' ? shares.itemCharge : 0,
      coinsReversed: type === 'return' ? shares.earnedShare : 0,
      coinsRefunded:
        type === 'return' ? (refundTo === 'wallet' ? shares.itemCharge : shares.walletShare) : 0,
      pickupSlot,
    });

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    if (type === 'exchange') {
      // Hold the new size, hand the old one back to the catalogue
      reserveVariantStock(product, colorName, newSize, qty);
      restockVariantStock(product, colorName, ownedSize, qty);
    } else {
      const walletState = useWalletStore.getState();
      if (shares.earnedShare > 0) {
        walletState.debit(session?.id, shares.earnedShare, {
          type: 'reversed',
          orderId: order.id,
          note: `Earned coins reversed — return of ${item.name} (size ${item.size})`,
        });
      }
      if (refundTo === 'wallet') {
        walletState.credit(session?.id, shares.itemCharge, {
          type: 'refunded',
          orderId: order.id,
          note: `Return refund for ${item.name} (size ${item.size})`,
        });
      } else if (shares.walletShare > 0) {
        walletState.credit(session?.id, shares.walletShare, {
          type: 'refunded',
          orderId: order.id,
          note: `Wallet coins used on ${item.name} returned to your balance`,
        });
      }
    }

    advanceStatuses();
    toast.success(
      type === 'exchange'
        ? `Exchange requested — size ${newSize} reserved for you!`
        : `Return requested — ${formatCurrency(shares.itemCharge)} ${
            refundTo === 'wallet' ? 'in wallet coins' : 'back to your payment method'
          }.`,
      { icon: '📦' }
    );
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={type === 'exchange' ? 'Exchange this item' : 'Return this item'}
      maxWidth="max-w-lg"
    >
      <div className="space-y-5 text-xs">
        {/* Item */}
        <div className="flex gap-3 p-3 rounded-xl bg-cream-dark/40 dark:bg-charcoal-light/30 border border-gray-200/60 dark:border-gray-800">
          <img
            src={item.image}
            alt={item.name}
            className="w-14 h-16 rounded-lg object-cover bg-gray-100 dark:bg-gray-800 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="font-serif font-bold text-sm text-charcoal dark:text-cream line-clamp-1">
              {item.name}
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5">
              {colorName} • Size {ownedSize} • Qty {maxQty} • {formatCurrency(item.price)} each
            </p>
          </div>
        </div>

        {/* Action toggle */}
        <div className="grid grid-cols-2 gap-3">
          {TYPE_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const active = type === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setType(opt.value);
                  setNotice('');
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  active
                    ? 'border-gold bg-gold/10'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-400'
                }`}
              >
                <span
                  className={`flex items-center gap-2 font-bold text-charcoal dark:text-cream ${
                    active ? 'text-gold' : ''
                  }`}
                >
                  <Icon size={15} /> {opt.label}
                </span>
                <span className="text-[10px] text-gray-500 block mt-0.5">{opt.hint}</span>
              </button>
            );
          })}
        </div>

        {/* Quantity */}
        <div>
          <label className={fieldLabel} htmlFor="rq-qty">
            Quantity
          </label>
          <select
            id="rq-qty"
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            className={inputClass}
          >
            {Array.from({ length: maxQty }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} item{n > 1 ? 's' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Reason */}
        <div>
          <label className={fieldLabel} htmlFor="rq-reason">
            Reason
          </label>
          <select
            id="rq-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className={inputClass}
          >
            <option value="">Select a reason…</option>
            {RETURN_REASONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={fieldLabel} htmlFor="rq-note">
            Add a note (optional)
          </label>
          <textarea
            id="rq-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="Anything our care team should know"
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Exchange: pick new size */}
        {type === 'exchange' && (
          <div>
            <span className={fieldLabel}>New size — {colorName}</span>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => {
                const available = sizeAvailable(size);
                const selected = newSize === size;
                const owned = size === ownedSize;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSelectSize(size)}
                    disabled={!available}
                    title={
                      owned
                        ? 'Current size'
                        : available
                          ? `${sizeStock(size)} in stock`
                          : 'Out of stock'
                    }
                    className={`min-w-[52px] px-3 h-10 text-xs font-bold rounded-xl uppercase tracking-wider border transition-all ${
                      selected
                        ? 'bg-charcoal text-cream dark:bg-cream dark:text-charcoal border-transparent'
                        : available
                          ? 'border-gray-200 dark:border-gray-700 text-charcoal dark:text-cream hover:border-gold'
                          : 'border-gray-200/70 dark:border-gray-800 text-gray-400 cursor-not-allowed line-through'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
            {sizes.length === 0 && (
              <p className="text-[11px] text-gray-500 mt-2">
                Size chart unavailable for this piece — request a refund instead.
              </p>
            )}
            {!sizeAvailable(newSize) && newSize && (
              <p className="text-[11px] text-error mt-2">Select an available size.</p>
            )}
            <button
              type="button"
              onClick={() => {
                setType('return');
                setNotice(
                  'No suitable size? Request a refund instead — you can reorder whenever stock returns.'
                );
              }}
              className="mt-3 text-[11px] font-semibold text-gold hover:underline"
            >
              Out of stock? Request a refund instead →
            </button>
          </div>
        )}

        {/* Return: refund method */}
        {type === 'return' && (
          <div>
            <span className={fieldLabel}>Refund method</span>
            <div className="space-y-2">
              {REFUND_METHODS.map((method) => (
                <label
                  key={method.value}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    refundTo === method.value
                      ? 'border-gold bg-gold/5'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="refund-method"
                    checked={refundTo === method.value}
                    onChange={() => setRefundTo(method.value)}
                    className="mt-0.5 w-4 h-4 accent-gold"
                  />
                  <span>
                    <span className="font-bold text-charcoal dark:text-cream block">
                      {method.label}
                    </span>
                    <span className="text-[11px] text-gray-500">{method.note}</span>
                  </span>
                </label>
              ))}
            </div>

            <div className="mt-3 p-3 rounded-xl bg-cream-dark/40 dark:bg-charcoal-light/30 space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-gray-500">Refund value</span>
                <span className="font-bold text-charcoal dark:text-cream">
                  {formatCurrency(shares.itemCharge)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Earned coins reversed</span>
                <span className="font-bold text-error">−{shares.earnedShare} coins</span>
              </div>
              {shares.walletShare > 0 && refundTo !== 'wallet' && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Wallet coins refunded</span>
                  <span className="font-bold text-success">+{shares.walletShare} coins</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pickup slot */}
        <div>
          <label className={fieldLabel} htmlFor="rq-slot">
            Pickup slot
          </label>
          <select
            id="rq-slot"
            value={pickupSlot}
            onChange={(e) => setPickupSlot(e.target.value)}
            className={inputClass}
          >
            {PICKUP_SLOTS.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>

        {notice && (
          <p className="p-3 rounded-xl border border-warning/40 bg-warning/10 text-[11px] font-semibold text-warning flex items-start gap-2">
            <Package size={14} className="shrink-0 mt-0.5" />
            <span>{notice}</span>
          </p>
        )}

        <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-200/60 dark:border-gray-800">
          <span className="inline-flex items-center gap-1.5 text-[11px] text-gray-400">
            <Coins size={13} className="text-gold" /> 1 coin = Rs. 1
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-cream-dark dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2.5 bg-gold text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-gold-dark transition-colors"
            >
              Confirm {type === 'exchange' ? 'Exchange' : 'Return'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
