/**
 * SkeletonLoader — Shimmer loading skeleton for product cards and content
 */
export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] rounded-xl skeleton mb-3" />
      <div className="space-y-2 px-1">
        <div className="h-3 w-16 skeleton" />
        <div className="h-4 w-3/4 skeleton" />
        <div className="h-3 w-24 skeleton" />
        <div className="h-4 w-20 skeleton" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
      {[...Array(count)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function TextSkeleton({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {[...Array(lines)].map((_, i) => (
        <div
          key={i}
          className="skeleton h-4"
          style={{ width: i === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  );
}

export function OrderSkeleton() {
  return (
    <div className="animate-pulse border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-4">
      <div className="flex justify-between">
        <div className="h-5 w-32 skeleton" />
        <div className="h-5 w-24 skeleton" />
      </div>
      <div className="flex gap-4">
        <div className="w-20 h-20 skeleton rounded-lg" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 skeleton" />
          <div className="h-3 w-1/2 skeleton" />
        </div>
      </div>
    </div>
  );
}
