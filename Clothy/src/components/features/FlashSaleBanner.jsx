/**
 * FlashSaleBanner — High-urgency promotional banner with countdown timer
 * Includes copy-to-clipboard coupon code, stock progress, and shop CTA
 */
import { Link } from 'react-router-dom';
import { Sparkles, Copy, Check, ArrowRight, Flame } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import CountdownTimer from '../ui/CountdownTimer';
import offers from '../../data/offers';

export default function FlashSaleBanner() {
  const [copied, setCopied] = useState(false);
  const flashSale = offers.find((o) => o.isFlashSale) || offers[0];

  const handleCopyCode = () => {
    if (!flashSale.code) return;
    navigator.clipboard.writeText(flashSale.code);
    setCopied(true);
    toast.success(`Coupon code "${flashSale.code}" copied!`, { icon: '✨' });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="home-section">
      <div className="container-custom">
        <div className="relative rounded-3xl overflow-hidden bg-charcoal text-cream border border-gold/30 shadow-elevated">
          {/* Subtle Background Pattern & Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold/20 via-charcoal to-charcoal pointer-events-none" />

          {/* Background editorial photo with low opacity */}
          <div className="absolute inset-y-0 right-0 w-full lg:w-1/2 opacity-25 lg:opacity-40 mix-blend-luminosity pointer-events-none">
            <img
              src={flashSale.image}
              alt="Sale Banner"
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Content */}
          <div className="relative z-10 p-8 sm:p-12 lg:p-16 xl:p-20 max-w-2xl">
            {/* Urgent Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-error/20 border border-error/40 text-error text-xs font-bold uppercase tracking-wider mb-6">
              <Flame size={14} className="animate-pulse text-error" />
              Limited Flash Window
            </div>

            {/* Title */}
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-3">
              {flashSale.title}
            </h2>
            <p className="text-sm sm:text-base text-gray-300 mb-8 font-sans">
              {flashSale.subtitle}. Handcrafted garments at unprecedented seasonal prices.
            </p>

            {/* Countdown Component */}
            {flashSale.endsAt && (
              <div className="mb-8">
                <span className="text-xs uppercase tracking-widest text-gold font-bold block mb-3">
                  Offer Ends In:
                </span>
                <CountdownTimer targetDate={flashSale.endsAt} size="md" />
              </div>
            )}

            {/* Coupon Code & CTA row */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                onClick={handleCopyCode}
                className="inline-flex items-center gap-2.5 min-h-[48px] px-5 py-3 rounded-xl bg-charcoal-light/90 border border-gold/40 text-cream text-xs font-bold uppercase tracking-wider hover:border-gold hover:bg-charcoal-light transition-colors shadow-sm"
              >
                <Sparkles size={14} className="text-gold" />
                <span>CODE: <strong className="text-gold font-mono tracking-widest">{flashSale.code}</strong></span>
                {copied ? <Check size={14} className="text-success" /> : <Copy size={14} className="text-gray-400" />}
              </button>

              <Link to="/offers" className="btn !bg-gold !text-white hover:!bg-gold-dark !border-transparent">
                <span>Shop All Deals</span>
                <ArrowRight size={15} />
              </Link>
            </div>

            {/* Reservation indicator */}
            <div className="mt-10 pt-7 border-t border-gray-800/80 max-w-lg">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                <span className="font-medium">Sale allocation claimed</span>
                <span className="text-gold font-bold">84% Claimed</span>
              </div>
              <div
                className="w-full h-3 bg-gray-800 rounded-full overflow-hidden border border-gold/20"
                role="progressbar"
                aria-valuenow={84}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Sale allocation claimed"
              >
                <div className="h-full w-[84%] bg-gradient-to-r from-gold to-error rounded-full shadow-[0_0_8px_rgba(212,175,55,0.5)]" />
              </div>
              <div className="flex justify-between text-[10px] text-gray-500 mt-2">
                <span>0</span>
                <span>Limited stock remaining</span>
                <span>100</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
