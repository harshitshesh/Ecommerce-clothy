/**
 * NewsletterForm — High-fashion email subscription component
 * Includes email validation, coupon reward reveal, and toast notification
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Check, ArrowRight, Sparkles, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success('Welcome to the Clothiers Club! Check your perks below.', { icon: '✨' });
    }, 600);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText('CLOZARI10');
    setCopied(true);
    toast.success('Code "CLOZARI10" copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="home-section relative overflow-hidden bg-cream dark:bg-charcoal">
      <div className="container-custom max-w-4xl">
        <div className="relative rounded-3xl p-8 sm:p-16 lg:p-20 border border-gray-200/80 dark:border-gray-800 bg-cream-dark/40 dark:bg-charcoal-light/30 shadow-soft text-center">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/15 text-gold text-xs font-bold uppercase tracking-widest mb-7">
            <Sparkles size={13} />
            Privilege Club
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal dark:text-cream mb-5">
            Join The Clothiers Gazette
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-lg mx-auto mb-10 leading-relaxed">
            Subscribe for private capsule previews, seasonal lookbooks, and receive
            <strong className="text-gold font-semibold"> 10% off </strong> your inaugural order.
          </p>

          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <div className="relative flex-1">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="w-full pl-11 pr-4 py-3.5 text-sm bg-white dark:bg-charcoal border border-gray-200 dark:border-gray-700 rounded-xl text-charcoal dark:text-cream placeholder:text-gray-400 focus:outline-none focus:border-gold shadow-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary shrink-0 disabled:opacity-50 !text-sm !tracking-normal !normal-case"
                >
                  {loading ? 'Subscribing...' : 'Subscribe'}
                  <ArrowRight size={16} />
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-2xl bg-cream dark:bg-charcoal border border-gold/40 max-w-md mx-auto text-center"
              >
                <div className="w-12 h-12 rounded-full bg-success/15 text-success mx-auto flex items-center justify-center mb-3">
                  <Check size={24} />
                </div>
                <h3 className="font-serif text-lg font-bold mb-1 text-charcoal dark:text-cream">
                  You&apos;re on the list.
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  Use this invitation coupon code at checkout for 10% off your first purchase:
                </p>
                <button
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold/15 text-gold border border-gold/30 text-xs font-mono font-bold tracking-widest hover:bg-gold/25 transition-colors"
                >
                  CLOZARI10 {copied ? <Check size={13} /> : <Copy size={13} />}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-[11px] text-gray-400 mt-7">
            We value your privacy. Unsubscribe at any time with a single click.
          </p>
        </div>
      </div>
    </section>
  );
}
