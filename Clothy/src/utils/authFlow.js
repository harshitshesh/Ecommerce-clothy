/**
 * authFlow — helpers shared by the login / signup pages
 *
 * `finishAuth` completes the flow that the auth gate interrupted: it replays the
 * stored add-to-cart action (item + toast) and sends the visitor back to exactly
 * where they were before the prompt appeared.
 */
import toast from 'react-hot-toast';
import useAuthStore from '../store/useAuthStore';
import useCartStore from '../store/useCartStore';
import products from '../data/products';

const findProduct = (id) => products.find((p) => p.id === id);

/**
 * @param {(path: string) => void} navigate react-router navigate
 * @param {string} fallbackPath where to go when nothing is pending (usually ?redirect=)
 */
export function finishAuth(navigate, fallbackPath = '/') {
  const { pendingCartAction, clearPendingCartAction } = useAuthStore.getState();

  if (!pendingCartAction) {
    navigate(fallbackPath);
    return;
  }

  const { returnTo, items } = pendingCartAction;
  clearPendingCartAction();

  // Single interrupted attempt, or a bulk "move all to bag" attempt.
  const entries = Array.isArray(items) && items.length > 0 ? items : [pendingCartAction];
  const addItem = useCartStore.getState().addItem;
  let message = '';

  entries.forEach((entry, index) => {
    const product = findProduct(entry.productId);
    if (!product) return;
    addItem(product, entry.size, entry.colour, entry.qty || 1);
    if (index === 0) {
      message = `Added to cart — ${product.name}, ${
        entry.colour?.name || 'Standard'
      }, size ${entry.size}`;
      if (entries.length > 1) message += ` + ${entries.length - 1} more`;
    }
  });

  if (message) toast.success(message, { icon: '🛍️' });
  navigate(returnTo || fallbackPath);
}

/** Build the ?redirect= query string used by the auth pages. */
export function withRedirect(path, redirect) {
  if (!redirect || redirect === '/') return path;
  return `${path}?redirect=${encodeURIComponent(redirect)}`;
}
