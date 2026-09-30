/**
 * AdminProducts (/admin/products) — Complete catalogue management
 * Search, filter, add/edit products, manage colors/images/size-runs, archive/delete
 */
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Grid3X3,
  Edit,
  Trash2,
  Archive,
  X,
  Image as ImageIcon,
  ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';
import useProductStore from '../../store/useProductStore';
import { getProductVariantStocks } from '../../utils/variantStock';
import { formatCurrency } from '../../utils/formatCurrency';
import Modal from '../../components/ui/Modal';

const CATEGORIES = ['Shirts', 'T-Shirts', 'Jeans', 'Dresses', 'Jackets', 'Footwear', 'Accessories'];
const GENDERS = ['Men', 'Women', 'Unisex'];
const SIZE_RUNS = {
  standard: ['XS', 'S', 'M', 'L', 'XL'],
  extended: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  footwear: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
  oneSize: ['One Size'],
};

export default function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct, archiveProduct } = useProductStore();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [stockFilter, setStockFilter] = useState('All'); // All, in-stock, low-stock, out-of-stock, archived
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Shirts',
    gender: 'Men',
    price: 1999,
    discountPrice: '',
    description: '',
    material: '100% Cotton',
    care: 'Machine wash cold, Tumble dry low',
    tags: 'new',
    sizeRunType: 'standard',
    sizes: SIZE_RUNS.standard,
    colors: [{ name: 'Black', hex: '#1A1A1A' }],
    images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80'],
    stock: 20,
  });

  // Calculate live variant stock per product
  const enrichedProducts = useMemo(() => {
    return products.map((p) => {
      const variantStocks = getProductVariantStocks(p);
      const totalStock = Object.values(variantStocks).reduce((a, b) => a + b, 0);
      const hasZeroStock = Object.values(variantStocks).some((v) => v === 0);
      const isLowStock = totalStock > 0 && totalStock <= 10;
      return {
        ...p,
        totalStock,
        hasZeroStock,
        isLowStock,
      };
    });
  }, [products]);

  // Filtered List
  const filteredProducts = useMemo(() => {
    return enrichedProducts.filter((p) => {
      const matchSearch =
        search === '' ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase());

      const matchCategory =
        selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();

      let matchStock = true;
      if (stockFilter === 'archived') matchStock = Boolean(p.isArchived);
      else if (p.isArchived) matchStock = false; // Hide archived by default
      else if (stockFilter === 'out-of-stock') matchStock = p.hasZeroStock || p.totalStock === 0;
      else if (stockFilter === 'low-stock') matchStock = p.isLowStock;
      else if (stockFilter === 'in-stock') matchStock = p.totalStock > 10;

      return matchSearch && matchCategory && matchStock;
    });
  }, [enrichedProducts, search, selectedCategory, stockFilter]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'Shirts',
      gender: 'Men',
      price: 2499,
      discountPrice: '',
      description: '',
      material: '100% Premium Cotton',
      care: 'Machine wash cold, Hang dry, Warm iron',
      tags: 'new',
      sizeRunType: 'standard',
      sizes: SIZE_RUNS.standard,
      colors: [
        { name: 'Charcoal', hex: '#1A1A1A' },
        { name: 'Cream', hex: '#F8F6F2' },
      ],
      images: [
        'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80',
        'https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=800&q=80',
      ],
      stock: 25,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      category: prod.category,
      gender: prod.gender || 'Unisex',
      price: prod.price,
      discountPrice: prod.discountPrice || '',
      description: prod.description || '',
      material: prod.material || '',
      care: Array.isArray(prod.care) ? prod.care.join(', ') : prod.care || '',
      tags: Array.isArray(prod.tags) ? prod.tags.join(', ') : prod.tags || '',
      sizeRunType: 'custom',
      sizes: prod.sizes || SIZE_RUNS.standard,
      colors: prod.colors || [{ name: 'Default', hex: '#1A1A1A' }],
      images: prod.images || [],
      stock: prod.stock || 10,
    });
    setIsModalOpen(true);
  };

  const handleSizeRunChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      sizeRunType: type,
      sizes: SIZE_RUNS[type] || prev.sizes,
    }));
  };

  const handleAddColor = () => {
    setFormData((prev) => ({
      ...prev,
      colors: [...prev.colors, { name: 'Navy', hex: '#000080' }],
    }));
  };

  const handleRemoveColor = (idx) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== idx),
    }));
  };

  const handleColorChange = (idx, field, val) => {
    setFormData((prev) => {
      const next = [...prev.colors];
      next[idx] = { ...next[idx], [field]: val };
      return { ...prev, colors: next };
    });
  };

  const handleAddImage = () => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80'],
    }));
  };

  const handleRemoveImage = (idx) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
  };

  const handleImageChange = (idx, val) => {
    setFormData((prev) => {
      const next = [...prev.images];
      next[idx] = val;
      return { ...prev, images: next };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Product title is required');
      return;
    }

    const payload = {
      name: formData.name.trim(),
      category: formData.category,
      gender: formData.gender,
      price: Number(formData.price) || 999,
      discountPrice: formData.discountPrice ? Number(formData.discountPrice) : null,
      description: formData.description,
      material: formData.material,
      care: formData.care.split(',').map((s) => s.trim()).filter(Boolean),
      tags: formData.tags.split(',').map((s) => s.trim()).filter(Boolean),
      sizes: formData.sizes,
      colors: formData.colors,
      images: formData.images.filter(Boolean),
      stock: Number(formData.stock) || 15,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
      toast.success(`Updated "${payload.name}" successfully!`);
    } else {
      addProduct(payload);
      toast.success(`Added new piece "${payload.name}"!`);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id, name) => {
    deleteProduct(id);
    setConfirmDeleteId(null);
    toast.success(`Deleted product "${name}"`);
  };

  const handleToggleArchive = (prod) => {
    archiveProduct(prod.id);
    toast.success(prod.isArchived ? `Unarchived "${prod.name}"` : `Archived "${prod.name}"`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200/60 dark:border-gray-800">
        <div>
          <h1 className="font-serif text-3xl font-bold text-charcoal dark:text-cream">
            Product Catalogue
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Manage apparel specifications, colour variations, and variant stock matrices
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-charcoal text-cream dark:bg-cream dark:text-charcoal text-xs font-bold uppercase tracking-wider hover:bg-gold dark:hover:bg-gold dark:hover:text-charcoal transition-all shadow-soft flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus size={16} /> New Product
        </button>
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
            placeholder="Search by name, SKU ID, or category..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-cream/50 dark:bg-charcoal text-xs focus:outline-none focus:border-gold"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-cream/50 dark:bg-charcoal text-xs font-medium focus:outline-none focus:border-gold"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Stock status filter */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-cream/50 dark:bg-charcoal text-xs font-medium focus:outline-none focus:border-gold"
          >
            <option value="All">All Stock Status</option>
            <option value="in-stock">Healthy Stock (&gt; 10)</option>
            <option value="low-stock">Low Stock (≤ 10)</option>
            <option value="out-of-stock">Zero Stock Variants</option>
            <option value="archived">Archived Products</option>
          </select>

          <span className="text-xs text-gray-400 font-mono">
            {filteredProducts.length} Piece{filteredProducts.length === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-cream dark:bg-charcoal-light rounded-2xl border border-gray-200/60 dark:border-gray-800 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream-dark/40 dark:bg-charcoal border-b border-gray-200/60 dark:border-gray-800 uppercase tracking-wider text-[10px] text-gray-500 font-bold">
              <tr>
                <th className="py-3.5 px-4">Garment</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Colors</th>
                <th className="py-3.5 px-4">Sizes</th>
                <th className="py-3.5 px-4">Variant Stock</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/40 dark:divide-gray-800">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    No products match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-gold/5 transition-colors">
                    {/* Thumbnail + Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images?.[0] || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=100&q=80'}
                          alt={p.name}
                          className="w-12 h-14 object-cover rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-charcoal dark:text-cream line-clamp-1">
                            {p.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-mono text-[10px] text-gray-400">{p.id}</span>
                            {p.isArchived && (
                              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                Archived
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-gray-600 dark:text-gray-300">
                        {p.category}
                      </span>
                      <span className="block text-[10px] text-gray-400">{p.gender || 'Unisex'}</span>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4 font-semibold text-charcoal dark:text-cream">
                      {formatCurrency(p.discountPrice || p.price)}
                      {p.discountPrice && (
                        <span className="block text-[10px] text-gray-400 line-through">
                          {formatCurrency(p.price)}
                        </span>
                      )}
                    </td>

                    {/* Colors Swatches */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 flex-wrap max-w-[120px]">
                        {(p.colors || []).map((c, i) => (
                          <span
                            key={i}
                            className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600 inline-block shadow-2xs"
                            style={{ backgroundColor: c.hex }}
                            title={c.name}
                          />
                        ))}
                      </div>
                    </td>

                    {/* Sizes */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 flex-wrap max-w-[140px]">
                        {(p.sizes || []).map((s) => (
                          <span
                            key={s}
                            className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cream-dark/60 dark:bg-gray-800 text-charcoal dark:text-cream"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Stock Status & Matrix Link */}
                    <td className="py-3.5 px-4">
                      <Link
                        to={`/admin/products/${p.id}/stock`}
                        className={`inline-flex items-center gap-1.5 font-bold px-2.5 py-1 rounded-lg border transition-all ${
                          p.hasZeroStock
                            ? 'bg-error/10 text-error border-error/30 hover:bg-error/20'
                            : p.isLowStock
                              ? 'bg-warning/10 text-warning border-warning/30 hover:bg-warning/20'
                              : 'bg-success/10 text-success border-success/30 hover:bg-success/20'
                        }`}
                        title="Click to edit stock matrix"
                      >
                        <Grid3X3 size={13} />
                        <span>{p.totalStock} units</span>
                      </Link>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <Link
                          to={`/admin/products/${p.id}/stock`}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-gold hover:bg-gold/10"
                          title="Variant Matrix (Stock)"
                        >
                          <Grid3X3 size={15} />
                        </Link>
                        <Link
                          to={`/product/${p.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg text-gray-500 hover:text-gold hover:bg-gold/10"
                          title="View live PDP"
                        >
                          <ExternalLink size={15} />
                        </Link>
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-charcoal dark:hover:text-cream hover:bg-gray-200/60 dark:hover:bg-gray-800"
                          title="Edit Product"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          onClick={() => handleToggleArchive(p)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-warning hover:bg-warning/10"
                          title={p.isArchived ? 'Unarchive' : 'Archive'}
                        >
                          <Archive size={15} />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(p.id)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-error hover:bg-error/10"
                          title="Delete Product"
                        >
                          <Trash2 size={15} />
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

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? `Edit "${editingProduct.name}"` : 'Add New Garment to Atelier'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Product Title *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="e.g. Linen Blend Resort Shirt"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-cream/50 dark:bg-charcoal text-xs focus:outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-cream/50 dark:bg-charcoal text-xs focus:outline-none focus:border-gold"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pricing & Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Base Price (₹) *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                min={0}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-cream/50 dark:bg-charcoal text-xs focus:outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Discount Price (₹)
              </label>
              <input
                type="number"
                value={formData.discountPrice}
                onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                placeholder="Leave blank if none"
                min={0}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-cream/50 dark:bg-charcoal text-xs focus:outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-cream/50 dark:bg-charcoal text-xs focus:outline-none focus:border-gold"
              >
                {GENDERS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Editorial description detailing silhouette and fabric texture..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-cream/50 dark:bg-charcoal text-xs focus:outline-none focus:border-gold"
            />
          </div>

          {/* Fabric & Care */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Material Composition
              </label>
              <input
                type="text"
                value={formData.material}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                placeholder="e.g. 100% Organic Silk"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-cream/50 dark:bg-charcoal text-xs focus:outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Care Instructions (comma-separated)
              </label>
              <input
                type="text"
                value={formData.care}
                onChange={(e) => setFormData({ ...formData, care: e.target.value })}
                placeholder="Dry clean only, Cool iron"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-cream/50 dark:bg-charcoal text-xs focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          {/* Size Run Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
              Size Run Template
            </label>
            <div className="flex gap-2 mb-2 flex-wrap">
              {Object.keys(SIZE_RUNS).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleSizeRunChange(type)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold uppercase tracking-wider transition-all ${
                    formData.sizeRunType === type
                      ? 'bg-charcoal text-cream dark:bg-cream dark:text-charcoal border-transparent'
                      : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gold'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {formData.sizes.map((s) => (
                <span
                  key={s}
                  className="px-2 py-1 rounded bg-cream-dark/50 dark:bg-gray-800 text-[11px] font-bold"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Colour Swatches */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Colours
              </label>
              <button
                type="button"
                onClick={handleAddColor}
                className="text-[11px] font-bold text-gold hover:underline"
              >
                + Add Colour
              </button>
            </div>
            <div className="space-y-2">
              {formData.colors.map((c, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="color"
                    value={c.hex}
                    onChange={(e) => handleColorChange(idx, 'hex', e.target.value)}
                    className="w-8 h-8 rounded border border-gray-300 dark:border-gray-700 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={c.name}
                    onChange={(e) => handleColorChange(idx, 'name', e.target.value)}
                    placeholder="Colour name (e.g. Charcoal)"
                    className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-cream/50 dark:bg-charcoal text-xs"
                  />
                  {formData.colors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveColor(idx)}
                      className="p-1.5 text-gray-400 hover:text-error"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Product Photography URLs
              </label>
              <button
                type="button"
                onClick={handleAddImage}
                className="text-[11px] font-bold text-gold hover:underline"
              >
                + Add Image URL
              </button>
            </div>
            <div className="space-y-2">
              {formData.images.map((imgUrl, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <ImageIcon size={15} className="text-gray-400 shrink-0" />
                  <input
                    type="url"
                    value={imgUrl}
                    onChange={(e) => handleImageChange(idx, e.target.value)}
                    placeholder="https://..."
                    className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-cream/50 dark:bg-charcoal text-xs"
                  />
                  {formData.images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="p-1.5 text-gray-400 hover:text-error"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200/50 dark:border-gray-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-semibold hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-charcoal text-cream dark:bg-cream dark:text-charcoal font-bold text-xs uppercase tracking-wider hover:bg-gold dark:hover:bg-gold dark:hover:text-charcoal transition-colors"
            >
              {editingProduct ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Dialog */}
      <Modal
        isOpen={Boolean(confirmDeleteId)}
        onClose={() => setConfirmDeleteId(null)}
        title="Confirm Deletion"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs text-gray-600 dark:text-gray-300">
            Are you sure you want to permanently remove this garment from the catalogue? This will
            also remove it from customer search and category listings.
          </p>
          <div className="flex justify-end gap-3 pt-3">
            <button
              onClick={() => setConfirmDeleteId(null)}
              className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                const target = products.find((p) => p.id === confirmDeleteId);
                if (target) handleDelete(target.id, target.name);
              }}
              className="px-4 py-2 rounded-xl bg-error text-white font-bold text-xs uppercase tracking-wider hover:bg-error/90"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
