/**
 * Login Page — Premium sign-in form
 * Inline validation, show/hide password, loading state, friendly errors and
 * ?redirect= support so visitors land back where they came from.
 */
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AlertCircle, Loader2, LogIn } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import AuthLayout, { TextField } from '../components/auth/AuthLayout';
import { finishAuth, withRedirect } from '../utils/authFlow';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const simulateNetwork = (ms = 650) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Login() {
  const login = useAuthStore((s) => s.login);
  const session = useAuthStore((s) => s.session);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  // Already signed in — continue the interrupted flow (or the redirect target).
  useEffect(() => {
    if (session) finishAuth(navigate, redirect);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
    setFormError('');
  };

  const validate = () => {
    const next = {};
    if (!form.email.trim()) next.email = 'Enter your email address.';
    else if (!EMAIL_RE.test(form.email.trim())) next.email = 'That doesn’t look like a valid email.';
    if (!form.password) next.password = 'Enter your password.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || loading) return;

    setLoading(true);
    setFormError('');
    await simulateNetwork();

    const result = login({ email: form.email, password: form.password });
    setLoading(false);

    if (!result.ok) {
      setFormError(result.error);
      return;
    }
    finishAuth(navigate, redirect);
  };

  const useDemo = () => {
    setForm({ email: 'demo@clozari.com', password: 'Demo@123' });
    setErrors({});
    setFormError('');
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle={
        redirect !== '/'
          ? 'Sign in to pick up exactly where you left off.'
          : 'Sign in to view your orders, saved addresses and a bag that follows you everywhere.'
      }
      footer={
        <>
          New to CLOZARI?{' '}
          <Link
            to={withRedirect('/signup', redirect)}
            className="font-semibold text-gold hover:underline"
          >
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {formError && (
          <div className="flex items-start gap-2.5 rounded-xl border border-error/30 bg-error/5 px-4 py-3 text-xs text-error">
            <AlertCircle size={15} className="shrink-0 mt-px" />
            <span>{formError}</span>
          </div>
        )}

        <TextField
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={update('email')}
          error={errors.email}
        />

        <TextField
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={form.password}
          onChange={update('password')}
          error={errors.password}
        />

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Signing you in…
            </>
          ) : (
            <>
              <LogIn size={16} /> Sign In
            </>
          )}
        </button>

        <button
          type="button"
          onClick={useDemo}
          className="w-full text-[11px] text-gray-500 hover:text-gold transition-colors"
        >
          Fill in the showcase account (demo@clozari.com / Demo@123)
        </button>
      </form>
    </AuthLayout>
  );
}
