/**
 * ReviewCard — Customer testimonial / review card with upvote helpful counter
 */
import { useState } from 'react';
import { ThumbsUp, CheckCircle } from 'lucide-react';
import RatingStars from '../ui/RatingStars';

export default function ReviewCard({ review }) {
  const [helpfulCount, setHelpfulCount] = useState(review.helpful || 0);
  const [hasVoted, setHasVoted] = useState(false);

  const handleHelpful = () => {
    if (hasVoted) {
      setHelpfulCount((c) => c - 1);
      setHasVoted(false);
    } else {
      setHelpfulCount((c) => c + 1);
      setHasVoted(true);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-cream dark:bg-charcoal border border-gray-200/60 dark:border-gray-800 space-y-3">
      {/* Top Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-sm text-charcoal dark:text-cream">
              {review.userName}
            </h4>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-success bg-success/10 px-2 py-0.5 rounded-full">
              <CheckCircle size={10} /> Verified Buyer
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-0.5">{review.date}</p>
        </div>

        <RatingStars rating={review.rating} size={13} />
      </div>

      {/* Review Title & Body */}
      {review.title && (
        <h5 className="font-serif font-bold text-sm text-charcoal dark:text-cream">
          {review.title}
        </h5>
      )}
      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-sans">
        {review.text}
      </p>

      {/* Footer Helpful Button */}
      <div className="pt-2 flex items-center justify-between text-xs text-gray-400 border-t border-gray-200/40 dark:border-gray-800/60">
        <span>Was this review helpful?</span>
        <button
          onClick={handleHelpful}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border transition-colors ${
            hasVoted
              ? 'bg-gold/15 text-gold border-gold/30'
              : 'border-gray-200 dark:border-gray-700 hover:text-charcoal dark:hover:text-cream'
          }`}
        >
          <ThumbsUp size={12} />
          <span>Yes ({helpfulCount})</span>
        </button>
      </div>
    </div>
  );
}
