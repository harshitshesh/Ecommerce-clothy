/**
 * RatingStars — Star rating display component
 */
import { Star } from 'lucide-react';

export default function RatingStars({ rating, size = 14, showValue = false }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} size={size} className="fill-gold text-gold" />
      ))}
      {hasHalf && (
        <div className="relative" style={{ width: size, height: size }}>
          <Star size={size} className="text-gray-300 dark:text-gray-600 absolute" />
          <div className="overflow-hidden absolute" style={{ width: size / 2 }}>
            <Star size={size} className="fill-gold text-gold" />
          </div>
        </div>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} size={size} className="text-gray-300 dark:text-gray-600" />
      ))}
      {showValue && (
        <span className="ml-1 text-sm font-medium text-charcoal dark:text-cream">
          {rating}
        </span>
      )}
    </div>
  );
}
