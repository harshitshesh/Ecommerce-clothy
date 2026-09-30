/**
 * AuthLayout — shared premium shell for the /login and /signup pages
 * Brand panel + on-brand form card. Exports `TextField` for consistent,
 * inline-validated inputs with a show/hide password toggle.
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, Lock, Sparkles } from 'lucide-react';
import { cn } from '../../utils/cn';

export function TextField({
  label,
  type = 'text',
  value,
  onChange,
  error,
  hint,
  ...rest
}) {
  const [revealed, setRevealed] = useState(false);
  const isPassword = type === 'password';
  const inputId = `field-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;

  return (
    <div>
      <label
        htmlFor={inputId}
        className="flex items-baseline justify-between gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2"
      >
        <span>{label}</span>
        {hint && (
          <span className="normal-case tracking-normal text-[11px] font-medium text-gold">
            {hint}
          </span>
        )}
      </label>

      <div className="relative">
        <input
          id={inputId}
          type={isPassword && revealed ? 'text' : type}
          value={value}
          onChange={onChange}
          className={cn(
            'w-full px-4 py-3 rounded-xl border bg-white dark:bg-charcoal-light/40 text-sm text-charcoal dark:text-cream placeholder:text-gray-400 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/40 transition-colors',
            isPassword && 'pr-11',
            error ? 'border-error' : 'border-gray-200 dark:border-gray-700'
          )}
          {...rest}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setRevealed((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gold transition-colors"
            aria-label={revealed ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {revealed ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>

      {error && (
        <p className="mt-1.5 flex items-center gap-1.5 text-[11px] font-medium text-error">
          <AlertCircle size={12} className="shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="pt-28 sm:pt-32 pb-20 container-custom">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-5xl grid lg:grid-cols-2 rounded-3xl overflow-hidden border border-gray-200/60 dark:border-gray-800 shadow-elevated bg-cream dark:bg-charcoal"
      >
        {/* Brand panel */}
        <div className="hidden lg:flex flex-col justify-between p-10 xl:p-12 bg-charcoal text-cream relative overflow-hidden grain-overlay">
          <div>
            <Link to="/" className="inline-block">
              <span className="font-serif text-2xl font-bold tracking-widest">CLOZARI</span>
            </Link>

            <h2 className="mt-10 font-serif text-3xl xl:text-4xl font-bold leading-tight">
              The atelier,
              <br />
              <span className="text-gradient-gold">reserved for you.</span>
            </h2>
            <p className="mt-4 text-sm text-cream/70 leading-relaxed max-w-sm">
              Sign in to sync your bag, wishlist and saved addresses across devices — and let us
              finish anything you started before you were interrupted.
            </p>
          </div>

          <ul className="mt-10 space-y-3 text-sm text-cream/80">
            <li className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-gold/15 text-gold flex items-center justify-center shrink-0">
                <Lock size={14} />
              </span>
              Your bag and checkout stay exactly where you left them
            </li>
            <li className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-gold/15 text-gold flex items-center justify-center shrink-0">
                <Sparkles size={14} />
              </span>
              Early access to seasonal drops and private previews
            </li>
          </ul>

          <div className="mt-10 pt-6 border-t border-cream/10 text-xs text-cream/50">
            Showcase account — <span className="text-gold">demo@clozari.com</span> /{' '}
            <span className="text-gold">Demo@123</span>
          </div>
        </div>

        {/* Form panel */}
        <div className="p-7 sm:p-10 xl:p-12">
          <div className="lg:hidden mb-6">
            <Link to="/" className="font-serif text-xl font-bold tracking-widest text-charcoal dark:text-cream">
              CLOZARI
            </Link>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal dark:text-cream">
            {title}
          </h1>
          <p className="mt-2 mb-7 text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            {subtitle}
          </p>

          {children}

          {footer && (
            <div className="mt-7 pt-5 border-t border-gray-200/70 dark:border-gray-800 text-center text-xs text-gray-500">
              {footer}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
