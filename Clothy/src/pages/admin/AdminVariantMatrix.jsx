/**
 * AdminVariantMatrix (/admin/products/:id/stock) — Grid stock management
 * Rows = Colors, Columns = Sizes, Cells = Editable stock counts
 * Setting a cell to 0 auto-disables that size button on the live PDP (PRD 6.1)
 */
import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import useProductStore from '../../store/useProductStore';
import {
  getVariantStock,
  setVariantStock,
  variantKey,
  getVariantSku,
} from '../../utils/variantStock';
import { formatCurrency } from '../../utils/formatCurrency';

export default function AdminVariantMatrix() {
  const { id } = useParams();
  const getProductById = useProductStore((s) => s.getProductById);
  const product = useMemo(() => getProductById(id), [getProductById, id]);

  const colors = useMemo(() => {
    if (!product?.colors || product.colors.length === 0) {
      return [{ name: 'Standard', hex: '#1A1A1A' }];
    }
    return product.colors;
  }, [product]);

  const sizes = useMemo(() => {
    if (!product?.sizes || product.sizes.length === 0) {
      return ['One Size'];
    }
    return product.sizes;
  }, [product]);

  // Local grid matrix state: { [key]: number }
  const [matrixState, setMatrixState] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Initialize matrix from localStorage variantStock
  useEffect(() => {
    if (!product) return;
    const initial = {};
    colors.forEach((c) => {
      const cName = typeof c === 'string' ? c : c.name;
      sizes.forEach((s) => {
        const key = variantKey(product.id, cName, s);
        initial[key] = getVariantStock(product, cName, s);
      });
    });
    setMatrixState(initial);
    setHasUnsavedChanges(false);
  }, [product, colors, sizes]);

  if (!product) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold">Garment Not Found</h2>
        <p className="text-xs text-gray-500">The product identifier &ldquo;{id}&rdquo; does not exist.</p>
        <Link
          to="/admin/products"
          className="inline-flex items-center gap-2 text-xs font-bold text-gold hover:underline"
        >
          <ArrowLeft size={14} /> Back to Products
        </Link>
      </div>
    );
  }

  const handleCellChange = (colorName, size, value) => {
    const key = variantKey(product.id, colorName, size);
    const count = Math.max(0, parseInt(value, 10) || 0);

    setMatrixState((prev) => ({ ...prev, [key]: count }));
    setHasUnsavedChanges(true);

    // Save immediately so live PDP updates in real time
    setVariantStock(product.id, colorName, size, count);
  };

  const handleQuickAdjust = (colorName, size, delta) => {
    const key = variantKey(product.id, colorName, size);
    const current = matrixState[key] != null ? matrixState[key] : getVariantStock(product, colorName, size);
    const next = Math.max(0, current + delta);
    handleCellChange(colorName, size, next);
  };

  const handleSetRow = (colorName, count) => {
    sizes.forEach((s) => {
      handleCellChange(colorName, s, count);
    });
    toast.success(`Set all sizes in ${colorName} to ${count} units`);
  };

  const handleSetAll = (count) => {
    colors.forEach((c) => {
      const cName = typeof c === 'string' ? c : c.name;
      sizes.forEach((s) => {
        handleCellChange(cName, s, count);
      });
    });
    toast.success(`Set all ${colors.length * sizes.length} variants to ${count} units`);
  };

  const handleSaveAll = () => {
    colors.forEach((c) => {
      const cName = typeof c === 'string' ? c : c.name;
      sizes.forEach((s) => {
        const key = variantKey(product.id, cName, s);
        const count = matrixState[key] != null ? matrixState[key] : getVariantStock(product, cName, s);
        setVariantStock(product.id, cName, s, count);
      });
    });
    setHasUnsavedChanges(false);
    toast.success('All variant stock levels saved & live on storefront!', { icon: '✅' });
  };

  // Compute totals
  const totalUnits = Object.values(matrixState).reduce((sum, v) => sum + (Number(v) || 0), 0);
  const outOfStockCount = Object.values(matrixState).filter((v) => Number(v) === 0).length;

  return (
    <div className="space-y-6">
      {/* Header with back button & live preview link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200/60 dark:border-gray-800">
        <div>
          <div className="flex items-center gap-3">
            <Link
              to="/admin/products"
              className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-cream-dark dark:hover:bg-gray-800 text-charcoal dark:text-cream"
              title="Back to products list"
            >
              <ArrowLeft size={16} />
            </Link>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gold font-mono">
                {product.id} · {product.category}
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal dark:text-cream">
                Variant Stock Matrix
              </h1>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 pl-9">
            Manage granular inventory per SKU ({product.name}). Changes reflect instantly on live PDP.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Link
            to={`/product/${product.slug}`}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl border border-gold/40 text-gold hover:bg-gold/10 text-xs font-semibold flex items-center gap-2 transition-colors"
            title="Check live customer PDP"
          >
            <span>Live PDP Verification</span>
            <ExternalLink size={13} />
          </Link>
          <button
            onClick={handleSaveAll}
            className="px-4 py-2 rounded-xl bg-charcoal text-cream dark:bg-cream dark:text-charcoal text-xs font-bold uppercase tracking-wider hover:bg-gold dark:hover:bg-gold dark:hover:text-charcoal transition-all shadow-soft flex items-center gap-2"
          >
            <Save size={15} /> Save Matrix {hasUnsavedChanges && <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />}
          </button>
        </div>
      </div>

      {/* Product Summary Banner */}
      <div className="bg-cream dark:bg-charcoal-light p-5 rounded-2xl border border-gray-200/60 dark:border-gray-800 shadow-card flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=120&q=80'}
            alt={product.name}
            className="w-14 h-16 object-cover rounded-xl border border-gray-200/60 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 shrink-0"
          />
          <div>
            <h2 className="font-serif font-bold text-base text-charcoal dark:text-cream">
              {product.name}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Base Price: <strong className="text-charcoal dark:text-cream">{formatCurrency(product.price)}</strong>
              {product.discountPrice && ` (Discount: ${formatCurrency(product.discountPrice)})`}
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {colors.length} Colour{colors.length === 1 ? '' : 's'} × {sizes.length} Size{sizes.length === 1 ? '' : 's'} ={' '}
              <span className="font-bold text-gold">{colors.length * sizes.length} Active SKUs</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
              Aggregate Stock
            </span>
            <span className="font-serif text-2xl font-bold text-charcoal dark:text-cream">
              {totalUnits} units
            </span>
          </div>
          {outOfStockCount > 0 ? (
            <div className="px-3 py-1.5 rounded-xl bg-error/10 text-error border border-error/30 text-xs font-bold flex items-center gap-1.5">
              <AlertTriangle size={14} />
              <span>{outOfStockCount} Out-of-Stock Variants</span>
            </div>
          ) : (
            <div className="px-3 py-1.5 rounded-xl bg-success/10 text-success border border-success/30 text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 size={14} />
              <span>All Variants In Stock</span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Bulk Preset Bar */}
      <div className="flex items-center justify-between bg-gold/5 dark:bg-charcoal-light/50 p-3 rounded-xl border border-gold/20 flex-wrap gap-2 text-xs">
        <span className="font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
          <Sparkles size={14} className="text-gold" /> Bulk Stock Actions:
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleSetAll(15)}
            className="px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-cream dark:bg-charcoal text-[11px] font-semibold hover:border-gold"
          >
            Set All to 15
          </button>
          <button
            onClick={() => handleSetAll(5)}
            className="px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-cream dark:bg-charcoal text-[11px] font-semibold hover:border-gold"
          >
            Set All to 5 (Low Stock)
          </button>
          <button
            onClick={() => handleSetAll(0)}
            className="px-2.5 py-1 rounded-lg border border-error/30 text-error bg-cream dark:bg-charcoal text-[11px] font-semibold hover:bg-error/10"
          >
            Clear All (0 Stock)
          </button>
        </div>
      </div>

      {/* The 2D Grid: Rows = Colours, Columns = Sizes */}
      <div className="bg-cream dark:bg-charcoal-light rounded-2xl border border-gray-200/60 dark:border-gray-800 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs">
            <thead className="bg-cream-dark/40 dark:bg-charcoal border-b border-gray-200/60 dark:border-gray-800 uppercase tracking-wider text-[10px] text-gray-500 font-bold">
              <tr>
                <th className="py-4 px-4 text-left min-w-[180px]">Colour Shade</th>
                {sizes.map((sz) => (
                  <th key={sz} className="py-4 px-3 min-w-[130px]">
                    Size {sz}
                  </th>
                ))}
                <th className="py-4 px-4 text-right">Row Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/40 dark:divide-gray-800">
              {colors.map((c) => {
                const cName = typeof c === 'string' ? c : c.name;
                const cHex = typeof c === 'object' && c.hex ? c.hex : '#1A1A1A';

                const rowTotal = sizes.reduce((sum, sz) => {
                  const key = variantKey(product.id, cName, sz);
                  return sum + (matrixState[key] != null ? Number(matrixState[key]) : 0);
                }, 0);

                return (
                  <tr key={cName} className="hover:bg-gold/5 transition-colors">
                    {/* Row Header: Colour */}
                    <td className="py-4 px-4 text-left">
                      <div className="flex items-center gap-3">
                        <span
                          className="w-5 h-5 rounded-full border border-gray-300 dark:border-gray-600 shadow-sm shrink-0"
                          style={{ backgroundColor: cHex }}
                        />
                        <div>
                          <p className="font-bold text-charcoal dark:text-cream">{cName}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <button
                              onClick={() => handleSetRow(cName, 10)}
                              className="text-[10px] text-gold hover:underline"
                            >
                              Fill 10
                            </button>
                            <span className="text-gray-300 dark:text-gray-700">·</span>
                            <button
                              onClick={() => handleSetRow(cName, 0)}
                              className="text-[10px] text-error hover:underline"
                            >
                              Zero
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Columns: Sizes (Editable Cells) */}
                    {sizes.map((sz) => {
                      const key = variantKey(product.id, cName, sz);
                      const currentCount =
                        matrixState[key] != null
                          ? matrixState[key]
                          : getVariantStock(product, cName, sz);

                      const sku = getVariantSku(product.id, cName, sz);
                      const isZero = currentCount === 0;
                      const isLow = currentCount > 0 && currentCount <= 5;

                      return (
                        <td key={sz} className="py-4 px-3">
                          <div
                            className={`p-2.5 rounded-xl border transition-all ${
                              isZero
                                ? 'bg-error/5 border-error/40'
                                : isLow
                                  ? 'bg-warning/5 border-warning/40'
                                  : 'bg-cream/40 dark:bg-charcoal/40 border-gray-200/80 dark:border-gray-700'
                            }`}
                          >
                            {/* SKU tag */}
                            <span className="block text-[9px] font-mono text-gray-400 mb-1.5 truncate" title={sku}>
                              {sku}
                            </span>

                            {/* Stepper + Input */}
                            <div className="flex items-center justify-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleQuickAdjust(cName, sz, -1)}
                                disabled={currentCount <= 0}
                                className="w-6 h-6 rounded-md bg-gray-200 dark:bg-gray-700 text-charcoal dark:text-cream flex items-center justify-center text-xs font-bold hover:bg-gold hover:text-white disabled:opacity-30"
                              >
                                −
                              </button>

                              <input
                                type="number"
                                min={0}
                                value={currentCount}
                                onChange={(e) => handleCellChange(cName, sz, e.target.value)}
                                className={`w-12 text-center font-bold text-xs py-1 rounded-md border focus:outline-none focus:ring-1 focus:ring-gold ${
                                  isZero
                                    ? 'text-error font-extrabold border-error/50 bg-error/10'
                                    : isLow
                                      ? 'text-warning font-bold border-warning/50 bg-warning/10'
                                      : 'text-charcoal dark:text-cream border-gray-200 dark:border-gray-700 bg-white dark:bg-charcoal'
                                }`}
                              />

                              <button
                                type="button"
                                onClick={() => handleQuickAdjust(cName, sz, 1)}
                                className="w-6 h-6 rounded-md bg-gray-200 dark:bg-gray-700 text-charcoal dark:text-cream flex items-center justify-center text-xs font-bold hover:bg-gold hover:text-white"
                              >
                                +
                              </button>
                            </div>

                            {/* Indicator status */}
                            <span
                              className={`block text-[9px] font-bold uppercase tracking-wider mt-1.5 ${
                                isZero
                                  ? 'text-error'
                                  : isLow
                                    ? 'text-warning'
                                    : 'text-success'
                              }`}
                            >
                              {isZero ? 'Disabled on PDP' : isLow ? 'Low Stock' : 'Active'}
                            </span>
                          </div>
                        </td>
                      );
                    })}

                    {/* Row Total */}
                    <td className="py-4 px-4 text-right">
                      <span className="font-bold text-charcoal dark:text-cream text-xs">
                        {rowTotal}
                      </span>
                      <span className="block text-[10px] text-gray-400">units</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
