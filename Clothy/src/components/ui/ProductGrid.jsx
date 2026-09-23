/**
 * ProductGrid — Responsive product grid
 */
import ProductCard from './ProductCard';

export default function ProductGrid({ products, columns = 4, className = '' }) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[columns] || gridCols[4]} gap-4 sm:gap-6 lg:gap-8 ${className}`}>
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
}
