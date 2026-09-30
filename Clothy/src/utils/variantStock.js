/**
 * variantStock.js — localStorage-based per-variant (product / colour / size)
 * stock overrides and safe stock locking.
 *
 * Each variant is uniquely identified by:
 *   Key: `${productId}||${colorName}||${size}`
 *   SKU: `CLZ-${productId.replace('prod_', '')}-${color.toUpperCase().slice(0, 3)}-${size}`
 *
 * Storage key: `clozari-stock-overrides`
 * Soft-reservations key: `clozari-stock-reservations`
 */

export const STOCK_OVERRIDES_KEY = 'clozari-stock-overrides';
export const STOCK_RESERVATIONS_KEY = 'clozari-stock-reservations';

export const variantKey = (productId, colorName, size) => {
  const pId = typeof productId === 'object' && productId !== null ? productId.id : productId;
  const cName = typeof colorName === 'object' && colorName !== null ? colorName.name : colorName;
  return `${pId || ''}||${cName || ''}||${size || ''}`;
};

/** Generate standardized PRD-compliant SKU format e.g. CLZ-001-CHA-M */
export const getVariantSku = (productId, colorName, size) => {
  const pId = typeof productId === 'object' && productId !== null ? productId.id : productId;
  const cName = typeof colorName === 'object' && colorName !== null ? colorName.name : colorName;
  const idPart = String(pId || '').replace(/^prod_/, '');
  const colorPart = String(cName || 'STD')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 3)
    .padEnd(3, 'X');
  const sizePart = String(size || 'OS').toUpperCase();
  return `CLZ-${idPart}-${colorPart}-${sizePart}`;
};

export const readOverrides = () => {
  try {
    const raw = window.localStorage.getItem(STOCK_OVERRIDES_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

export const writeOverrides = (overrides) => {
  try {
    window.localStorage.setItem(STOCK_OVERRIDES_KEY, JSON.stringify(overrides));
    window.dispatchEvent(new CustomEvent('clozari-stock-updated', { detail: overrides }));
  } catch {
    /* storage unavailable */
  }
};

/** Units available for one variant (0 = out of stock). */
export function getVariantStock(productOrId, colorName, size) {
  if (!productOrId) return 0;
  const productId = typeof productOrId === 'object' ? productOrId.id : productOrId;
  const productObj = typeof productOrId === 'object' ? productOrId : null;

  if (productObj && Array.isArray(productObj.sizes) && size && !productObj.sizes.includes(size)) {
    return 0;
  }

  const overrides = readOverrides();
  const key = variantKey(productId, colorName, size);
  if (Object.prototype.hasOwnProperty.call(overrides, key)) {
    return Math.max(0, Number(overrides[key]) || 0);
  }

  // Fallback to base product stock
  const baseStock = productObj?.stock != null ? Number(productObj.stock) : 10;
  return Math.max(0, baseStock);
}

/** Set stock directly (used by Admin Variant Matrix) */
export function setVariantStock(productId, colorName, size, count) {
  const overrides = readOverrides();
  const key = variantKey(productId, colorName, size);
  const next = Math.max(0, parseInt(count, 10) || 0);
  overrides[key] = next;
  writeOverrides(overrides);
  return next;
}

/** Get a map of all variant stocks for a specific product */
export function getProductVariantStocks(product) {
  if (!product) return {};
  const map = {};
  const colors = product.colors && product.colors.length > 0 ? product.colors : [{ name: 'Default', hex: '#1A1A1A' }];
  const sizes = product.sizes && product.sizes.length > 0 ? product.sizes : ['One Size'];

  colors.forEach((c) => {
    const cName = typeof c === 'string' ? c : c.name;
    sizes.forEach((s) => {
      const key = variantKey(product.id, cName, s);
      map[key] = getVariantStock(product, cName, s);
    });
  });

  return map;
}

/** Permanently decrement stock for an SKU (called on successful checkout or approved exchange) */
export function decrementVariantStock(productOrId, colorName, size, qty = 1) {
  const current = getVariantStock(productOrId, colorName, size);
  const next = Math.max(0, current - Math.max(1, qty));
  const productId = typeof productOrId === 'object' ? productOrId.id : productOrId;
  setVariantStock(productId, colorName, size, next);
  return next;
}

/** Hold `qty` units of a variant (used when an exchange or order is confirmed). */
export function reserveVariantStock(productOrId, colorName, size, qty = 1) {
  return decrementVariantStock(productOrId, colorName, size, qty);
}

/** Put units back when an exchanged/returned piece is restocked. */
export function restockVariantStock(productOrId, colorName, size, qty = 1) {
  const current = getVariantStock(productOrId, colorName, size);
  const next = current + Math.max(1, qty);
  const productId = typeof productOrId === 'object' ? productOrId.id : productOrId;
  setVariantStock(productId, colorName, size, next);
  return next;
}

/**
 * Safe Stock Soft-Reservation during Checkout (10-minute hold window)
 */
export function softReserveCheckout(items = []) {
  try {
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
    const reservation = {
      id: `res_${Date.now()}`,
      items: items.map((it) => ({
        productId: it.id || it.productId,
        colorName: typeof it.color === 'string' ? it.color : it.color?.name || '',
        size: it.size,
        qty: it.quantity || 1,
      })),
      expiresAt,
    };
    window.localStorage.setItem(STOCK_RESERVATIONS_KEY, JSON.stringify(reservation));
    return reservation;
  } catch {
    return null;
  }
}

export function clearCheckoutReservation() {
  try {
    window.localStorage.removeItem(STOCK_RESERVATIONS_KEY);
  } catch {
    /* ignore */
  }
}
