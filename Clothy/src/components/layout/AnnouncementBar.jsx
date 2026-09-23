/**
 * AnnouncementBar — Thin promotional marquee bar above navbar
 * Continuously scrolls right → left; scrolls away with the page (not fixed)
 */
import { useState } from 'react';
import { X } from 'lucide-react';

const announcements = [
  'Free shipping on orders above ₹1,999 ✨',
  'New Season Collection — Shop Now →',
  'Use code WELCOME500 for ₹500 off your first order',
];

// Repeat enough times per half so one half is always wider than the viewport
const itemsPerHalf = [...announcements, ...announcements, ...announcements];

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="announcement-ticker bg-charcoal text-cream text-xs sm:text-sm py-2.5 sm:py-3 relative z-50 select-none">
      <div className="announcement-track" aria-label="Announcements">
        {/* Two identical halves → seamless -50% loop with no visible reset */}
        {[0, 1].map((half) => (
          <div
            key={half}
            className="flex items-center shrink-0"
            aria-hidden={half === 1 ? 'true' : undefined}
          >
            {itemsPerHalf.map((text, i) => (
              <span
                key={`${half}-${i}`}
                className="flex items-center gap-3 px-5 sm:px-7 font-medium tracking-wide whitespace-nowrap"
              >
                {text}
                <span className="text-gold" aria-hidden="true">
                  •
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>

      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-charcoal/90 text-cream hover:bg-gold hover:text-white transition-colors"
        aria-label="Close announcement"
      >
        <X size={14} />
      </button>
    </div>
  );
}
