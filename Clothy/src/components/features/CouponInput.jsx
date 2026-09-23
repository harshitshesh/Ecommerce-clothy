/**
 * CouponInput — Promo code input with instant validation & discount feedback
 */
import { useState } from 'react';
import { Tag, X } from 'lucide-react';
import toast from 'react-hot-toast';
import useCartStore from '../../store/useCartStore';

export default function CouponInput() {
  const [code, setCode] = useState('');
  const { coupon, applyCoupon, removeCoupon } = useCartStore();

  const handleApply = (e) => {
    e.preventDefault();
    if (!code.trim()) return;

    const res = applyCoupon(code.trim());
    if (res.success) {
      toast.success(res.message, { icon: '🎉' });
      setCode('');
    } else {
      toast.error(res.message);
    }
  };

  const handleRemove = () => {
    removeCoupon();
    toast.success('Coupon removed');
  };

  if (coupon) {
    return (
      <div className="flex items-center justify-between p-3 rounded-xl bg-gold/10 border border-gold/30 text-xs">
        <div className="flex items-center gap-2">
          <Tag size={15} className="text-gold shrink-0" />
          <div>
            <span className="font-mono font-bold text-gold tracking-widest">{coupon.code}</span>
            <p className="text-[11px] text-gray-500">{coupon.description}</p>
          </div>
        </div>
        <button
          onClick={handleRemove}
          className="p-1 rounded-full text-gray-400 hover:text-error transition-colors"
          aria-label="Remove coupon"
        >
          <X size={15} />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleApply} className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="PROMO CODE (e.g. FLASH20)"
            className="w-full pl-9 pr-3 py-2.5 text-xs font-mono tracking-wider bg-cream dark:bg-charcoal border border-gray-200 dark:border-gray-700 rounded-lg uppercase focus:outline-none focus:border-gold"
          />
        </div>
        <button
          type="submit"
          disabled={!code.trim()}
          className="px-4 py-2.5 bg-charcoal text-cream dark:bg-cream dark:text-charcoal text-xs font-bold uppercase rounded-lg hover:opacity-90 disabled:opacity-40 transition-opacity"
        >
          Apply
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5 text-[10px] text-gray-400">
        <span>Try:</span>
        <button
          type="button"
          onClick={() => setCode('FLASH20')}
          className="underline hover:text-gold"
        >
          FLASH20
        </button>
        <span>•</span>
        <button
          type="button"
          onClick={() => setCode('WELCOME500')}
          className="underline hover:text-gold"
        >
          WELCOME500
        </button>
        <span>•</span>
        <button
          type="button"
          onClick={() => setCode('SEASON40')}
          className="underline hover:text-gold"
        >
          SEASON40
        </button>
      </div>
    </form>
  );
}
