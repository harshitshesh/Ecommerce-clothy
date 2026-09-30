/**
 * Signup Page — Premium registration form
 * Inline validation, show/hide password, loading state, friendly errors and
 * ?redirect= support so visitors land back where they came from.
 */
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AlertCircle, Loader2, UserPlus } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import AuthLayout, { TextField } from '../components/auth/AuthLayout';
import { finishAuth, withRedirect } from '../utils/authFlow';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9]{10}$/;
const simulateNetwork = (ms = 750) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Signup() {
  const signup = useAuthStore((s) => s.signup);
  const session = useAuthStore((s) => s.session);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

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
    if (!form.name.trim()) next.name = 'Tell us what to call you.';
    else if (form.name.trim().length < 2) next.name = 'That name looks a little short.';

    if (!form.email.trim()) next.email = 'Enter your email address.';
    else if (!EMAIL_RE.test(form.email.trim())) next.email = 'That doesn’t look like a valid email.';

    if (!form.phone.trim()) next.phone = 'Enter your phone number.';
    else if (!PHONE_RE.test(form.phone.replace(/[\s-]/g, ''))) next.phone = 'Enter a valid 10-digit number.';

    if (!form.password) next.password = 'Create a password.';
    else if (form.password.length < 8) next.password = 'Use at least 8 characters.';

    if (!form.confirm) next.confirm = 'Confirm your password.';
    else if (form.confirm !== form.password) next.confirm = 'Passwords don’t match.';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || loading) return;

    setLoading(true);
    setFormError('');
    await simulateNetwork();

    const result = signup({
      name: form.name,
      email: form.email,
      phone: form.phone.replace(/[\s-]/g, ''),
      password: form.password,
    });
    setLoading(false);

    if (!result.ok) {
      setFormError(result.error);
      return;
    }
    finishAuth(navigate, redirect);
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle={
        redirect !== '/'
          ? 'One quick step — then we’ll add your item and take you straight back.'
          : 'Join the atelier for a faster checkout, saved addresses and early access to drops.'
      }
      footer={
        <>
          Already have an account?{' '}
          <Link
            to={withRedirect('/login', redirect)}
            className="font-semibold text-gold hover:underline"
          >
            Sign in
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
          label="Full name"
          autoComplete="name"
          placeholder="Aarav Sharma"
          value={form.name}
          onChange={update('name')}
          error={errors.name}
        />

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
          label="Phone"
          type="tel"
          autoComplete="tel"
          placeholder="10-digit mobile number"
          value={form.phone}
          onChange={update('phone')}
          error={errors.phone}
        />

        <TextField
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          hint="8+ characters"
          value={form.password}
          onChange={update('password')}
          error={errors.password}
        />

        <TextField
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          placeholder="Repeat your password"
          value={form.confirm}
          onChange={update('confirm')}
          error={errors.confirm}
        />

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Creating your account…
            </>
          ) : (
            <>
              <UserPlus size={16} /> Create Account
            </>
          )}
        </button>
      </form>
    </AuthLayout>
  );
}
