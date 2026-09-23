/**
 * CategoryPage — Dedicated category landing with banner & filtered grid
 */
import { useParams } from 'react-router-dom';
import { useState, useMemo } from 'react';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import ProductCard from '../components/ui/ProductCard';
import SortDropdown from '../components/features/SortDropdown';
import EmptyState from '../components/ui/EmptyState';
import categories, { getCategoryBySlug } from '../data/categories';
import products from '../data/products';

export default function CategoryPage() {
  const { slug } = useParams();
  const category = getCategoryBySlug(slug) || categories.find((c) => c.slug === slug);
  const [sortBy, setSortBy] = useState('featured');

  const categoryProducts = useMemo(() => {
    if (!slug) return [];
    const list = products.filter(
      (p) => p.category.toLowerCase() === slug.toLowerCase()
    );

    switch (sortBy) {
      case 'newest':
        return list.filter((p) => p.tags.includes('new')).concat(list.filter((p) => !p.tags.includes('new')));
      case 'price-low':
        return list.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
      case 'price-high':
        return list.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
      case 'rating':
        return list.sort((a, b) => b.rating - a.rating);
      case 'discount':
        return list.sort((a, b) => {
          const discA = a.discountPrice ? (a.price - a.discountPrice) / a.price : 0;
          const discB = b.discountPrice ? (b.price - b.discountPrice) / b.price : 0;
          return discB - discA;
        });
      case 'featured':
      default:
        return list;
    }
  }, [slug, sortBy]);

  if (!category) {
    return (
      <div className="pt-32 pb-16 container-custom">
        <EmptyState
          type="search"
          title="Category Not Found"
          description="We couldn't locate the collection you're searching for."
          actionText="Explore All Collections"
          actionHref="/shop"
        />
      </div>
    );
  }

  return (
    <div className="pt-24 sm:pt-28 pb-16">
      <div className="container-custom">
        {/* Breadcrumbs */}
        <div className="mb-4">
          <Breadcrumbs
            items={[
              { label: 'Shop', path: '/shop' },
              { label: category.name },
            ]}
          />
        </div>

        {/* Editorial Category Header Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-charcoal text-cream mb-12 shadow-elevated border border-gray-800">
          <div className="absolute inset-0 opacity-40">
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/80 to-transparent" />

          <div className="relative z-10 p-8 sm:p-14 max-w-xl">
            <span className="text-xs uppercase tracking-widest text-gold font-bold block mb-2">
              Curated Silhouette
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold mb-3">
              {category.name}
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 mb-6 font-sans leading-relaxed">
              {category.description}. Cut from sustainable natural textiles with timeless tailoring.
            </p>
            <span className="text-xs bg-cream/10 border border-cream/20 text-cream px-3 py-1 rounded-full font-medium">
              {categoryProducts.length} Pieces Available
            </span>
          </div>
        </div>

        {/* Subheader & Sort */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-gray-200/60 dark:border-gray-800">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
            Showing all {category.name} ({categoryProducts.length} items)
          </p>
          <SortDropdown value={sortBy} onChange={setSortBy} />
        </div>

        {/* Product Grid */}
        {categoryProducts.length === 0 ? (
          <EmptyState
            type="search"
            title={`No ${category.name} Currently in Stock`}
            description="Our artisans are currently crafting new drops for this category."
            actionText="View Other Categories"
            actionHref="/shop"
          />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {categoryProducts.map((prod, idx) => (
              <ProductCard key={prod.id} product={prod} index={idx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
