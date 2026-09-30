/**
 * AdminLogin — Dedicated staff authentication page
 * Seeded credentials: admin@clozari.com / Admin@123
 */
import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, Store, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';
import useAdminAuthStore from '../../store/useAdminAuthStore';

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAdminAuthStore((s) => s.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/admin';

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const res = login({ email, password });
    setIsSubmitting(false);

    if (res.ok) {
      toast.success('Welcome back to Clozari Command Center', { icon: '🛡️' });
      navigate(from, { replace: true });
    } else {
      toast.error(res.error);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@clozari.com');
    setPassword('Admin@123');
    toast.success('Seeded credentials loaded!', { icon: '🔑' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream dark:bg-charcoal px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gold/15 text-gold border border-gold/30 mb-4 shadow-soft">
            <ShieldCheck size={28} />
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-wider text-charcoal dark:text-cream">
            CLOZARI
          </h1>
          <p className="text-xs uppercase tracking-widest text-gold font-bold mt-1">
            Store Management Portal
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Restricted access for store staff, inventory managers &amp; administrators
          </p>
        </div>

        {/* Card */}
        <div className="bg-cream dark:bg-charcoal-light p-8 rounded-3xl border border-gray-200/70 dark:border-gray-800 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                Staff Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@clozari.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-cream/50 dark:bg-charcoal text-charcoal dark:text-cream text-xs focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                Master Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-cream/50 dark:bg-charcoal text-charcoal dark:text-cream text-xs focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl bg-charcoal text-cream dark:bg-cream dark:text-charcoal font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-gold dark:hover:bg-gold dark:hover:text-charcoal transition-all shadow-soft mt-2"
            >
              Sign In to Dashboard <ArrowRight size={15} />
            </button>
          </form>

          {/* Quick autofill helper */}
          <div className="mt-6 pt-5 border-t border-gray-200/50 dark:border-gray-800 text-center">
            <button
              type="button"
              onClick={handleFillDemo}
              className="w-full py-2.5 px-3 rounded-xl border border-dashed border-gold/40 text-gold hover:bg-gold/5 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <KeyRound size={14} /> Auto-Fill Demo Admin (admin@clozari.com)
            </button>
          </div>
        </div>

        {/* Return to store link */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gold transition-colors font-medium"
          >
            <Store size={14} /> Return to Customer Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
