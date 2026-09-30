/**
 * AuthPromptModal — Conversion-safe interruption for logged-out "Add to cart"
 *
 * Appears only when the auth gate intercepted an add attempt. Shows the exact
 * product (thumbnail, name, colour, size, qty) the visitor was about to add, so
 * signing in feels like a step towards the item rather than a roadblock.
 */
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Lock, ShoppingBag } from 'lucide-react';
import Modal from '../ui/Modal';
import useAuthStore from '../../store/useAuthStore';
import products from '../../data/products';
import { withRedirect } from '../../utils/authFlow';

export default function AuthPromptModal() {
  const pending = useAuthStore((s) => s.pendingCartAction);
  const clearPending = useAuthStore((s) => s.clearPendingCartAction);
  const navigate = useNavigate();
  const location = useLocation();

  // Keep the last prompt around so the modal can animate out with its content.
  const [lastPrompt, setLastPrompt] = useState(null);
  useEffect(() => {
    if (pending) setLastPrompt(pending);
  }, [pending]);

  // The auth pages carry the pending action themselves — never stack the modal on top.
  const onAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const isOpen = Boolean(pending) && !onAuthPage;

  const data = pending || lastPrompt;
  const product = data ? products.find((p) => p.id === data.productId) : null;
  const extraCount = data && Array.isArray(data.items) ? data.items.length - 1 : 0;
  const returnTo = data?.returnTo || `${location.pathname}${location.search}`;

  const proceed = (path) => navigate(withRedirect(path, returnTo));

  return (
    <Modal
      isOpen={isOpen}
      onClose={clearPending}
      title="Log in to add this to your cart"
      maxWidth="max-w-md"
    >
      {data && (
        <>
          <p className="text-xs sm:text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed">
            Sign in (or create an account) and we’ll drop this straight into your bag — your colour
            and size are already picked out.
          </p>

          {/* The item they will get */}
          <div className="mt-5 flex items-center gap-4 rounded-2xl border border-gray-200/70 dark:border-gray-800 bg-cream-dark/40 dark:bg-charcoal-light/30 p-3">
            {product ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-16 h-20 rounded-lg object-cover bg-gray-100 dark:bg-gray-800 shrink-0"
              />
            ) : (
              <span className="w-16 h-20 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 shrink-0">
                <ShoppingBag size={20} />
              </span>
            )}

            <div className="min-w-0">
              <p className="font-serif font-bold text-sm text-charcoal dark:text-cream truncate">
                {product?.name || 'Your selected piece'}
              </p>
              <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                {data.colour?.name ? `${data.colour.name} · ` : ''}
                Size {data.size} · Qty {data.qty || 1}
              </p>
              {extraCount > 0 && (
                <span className="inline-block mt-1.5 text-[10px] font-bold uppercase tracking-widest text-gold bg-gold/10 px-2 py-0.5 rounded">
                  + {extraCount} more item{extraCount > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>

          <div className="mt-6 space-y-2.5">
            <button onClick={() => proceed('/login')} className="btn btn-primary w-full">
              <Lock size={15} /> Log in
            </button>
            <button onClick={() => proceed('/signup')} className="btn btn-secondary w-full">
              Create account
            </button>
            <button
              onClick={clearPending}
              className="w-full py-2 text-[11px] font-semibold uppercase tracking-widest text-gray-400 hover:text-charcoal dark:hover:text-cream transition-colors"
            >
              Keep browsing
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}
