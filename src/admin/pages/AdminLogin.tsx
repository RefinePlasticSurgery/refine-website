import { useState, useEffect, useId } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/admin/hooks/useAuth';
import {
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Calendar,
  BarChart3,
  Users,
  ImageIcon,
  ShieldCheck,
} from 'lucide-react';
import logo from '@/assets/logo.png';

// ─── Static data ──────────────────────────────────────────────────────────────

const FEATURES = [
  { Icon: Calendar,  text: 'Manage appointments in real time' },
  { Icon: Users,     text: 'Update your team and gallery'     },
  { Icon: BarChart3, text: 'Track analytics and performance'  },
  { Icon: ImageIcon, text: 'Publish blog posts and pricing'   },
];

// ─── Field component ─────────────────────────────────────────────────────────

interface FieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  autoComplete: string;
  disabled: boolean;
  required?: boolean;
  suffix?: React.ReactNode;
}

const Field = ({
  id, label, type = 'text', value, onChange,
  placeholder, autoComplete, disabled, required, suffix,
}: FieldProps) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="relative">
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        required={required}
        disabled={disabled}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5
          text-sm text-gray-900 placeholder-gray-400 shadow-sm
          outline-none ring-0
          transition-[border-color,box-shadow]
          focus:border-[hsl(var(--primary))] focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.15)]
          disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500
        "
        style={{ paddingRight: suffix ? '2.75rem' : undefined }}
      />
      {suffix && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {suffix}
        </div>
      )}
    </div>
  </div>
);

// ─── Page component ───────────────────────────────────────────────────────────

export const AdminLogin = () => {
  const emailId    = useId();
  const passwordId = useId();

  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState<string | null>(null);
  const [ready, setReady]               = useState(false);

  const { signIn } = useAuth();
  const navigate   = useNavigate();

  // Trigger CSS entry animations after first paint
  useEffect(() => {
    const raf = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) return;

    setLoading(true);
    setError(null);

    try {
      const { error: authError } = await signIn(trimmedEmail, password);

      if (authError) {
        const code = authError.code ?? '';
        const msg  = authError.message ?? '';

        if (code === 'INVALID_CREDENTIALS' || msg.toLowerCase().includes('invalid')) {
          setError('The email address or password is incorrect. Please try again.');
        } else if (code === 'NETWORK_ERROR') {
          setError('Unable to connect. Please check your internet connection and try again.');
        } else if (code === 'SESSION_EXPIRED') {
          setError('Your session expired. Please sign in again.');
        } else {
          setError(msg || 'Sign in failed. Please try again.');
        }
        setLoading(false);
      } else {
        // Auth succeeded — navigate. Session is already set synchronously.
        navigate('/admin/dashboard', { replace: true });
        // Note: setLoading(false) intentionally omitted so the button stays
        // in loading state during the navigation transition.
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  const canSubmit = email.trim().length > 0 && password.length > 0 && !loading;

  return (
    <div className="flex min-h-screen w-full overflow-hidden">

      {/* ═══════════════════════════════════════════════════════════════
          LEFT PANEL — 50% — Brand pink, logo, feature list
      ═══════════════════════════════════════════════════════════════ */}
      <div
        className="hidden lg:flex lg:w-1/2 xl:w-1/2 shrink-0 flex-col justify-between p-12 xl:p-16"
        style={{ backgroundColor: 'hsl(var(--primary))' }}
      >
        {/* ── Logo ── */}
        <div className="flex items-center gap-3">
          {/*
            Logo container: white background ensures the logo is always visible
            regardless of whether it is a dark or multi-colour image.
          */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
            <img
              src={logo}
              alt="Refine Plastic Surgery"
              className="h-9 w-9 object-contain"
            />
          </div>
          <div>
            <p className="font-serif text-lg font-semibold leading-none text-white">
              Refine
            </p>
            <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-widest text-white/60">
              Admin Console
            </p>
          </div>
        </div>

        {/* ── Hero text ── */}
        <div
          className="space-y-6"
          style={{
            opacity:    ready ? 1 : 0,
            transform:  ready ? 'none' : 'translateY(20px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <div>
            <h1 className="font-serif text-4xl font-semibold leading-[1.2] text-white xl:text-[2.75rem]">
              Your clinic,
              <br />
              beautifully managed.
            </h1>
            <p className="mt-4 max-w-sm text-base leading-relaxed text-white/70">
              A complete command centre for Refine Plastic Surgery Centre — appointments, team, gallery, analytics and more.
            </p>
          </div>

          <ul className="space-y-3">
            {FEATURES.map(({ Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/20">
                  <Icon className="h-4 w-4 text-white" />
                </span>
                <span className="text-sm font-medium text-white/80">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Footer ── */}
        <p className="text-xs font-medium text-white/40">
          &copy; {new Date().getFullYear()} Refine Plastic Surgery Centre. All rights reserved.
        </p>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          RIGHT PANEL — 50% — White, sign-in form
      ═══════════════════════════════════════════════════════════════ */}
      <div className="flex w-full flex-col items-center justify-center bg-white px-6 py-12 lg:w-1/2 sm:px-12 lg:px-16 xl:px-20">

        {/* Mobile-only logo */}
        <div className="mb-10 flex flex-col items-center gap-3 lg:hidden">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{ backgroundColor: 'hsl(var(--primary))' }}
          >
            <img src={logo} alt="Refine" className="h-10 w-10 object-contain brightness-0 invert" />
          </div>
          <p className="text-sm font-medium text-gray-400">Refine Admin Console</p>
        </div>

        {/* Card — max width keeps it readable on ultra-wide screens */}
        <div
          className="w-full max-w-[420px]"
          style={{
            opacity:    ready ? 1 : 0,
            transform:  ready ? 'none' : 'translateY(12px)',
            transition: 'opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s',
          }}
        >
          {/* Heading */}
          <div className="mb-8">
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-gray-900">
              Sign in
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Enter your credentials to access the admin panel.
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div
              role="alert"
              className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              <p className="text-sm leading-snug text-red-700">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            <Field
              id={emailId}
              label="Email address"
              type="email"
              autoComplete="email"
              required
              disabled={loading}
              value={email}
              onChange={setEmail}
              placeholder="admin@refineplasticsurgerytz.com"
            />

            <Field
              id={passwordId}
              label="Password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              disabled={loading}
              value={password}
              onChange={setPassword}
              placeholder="Enter your password"
              suffix={
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(v => !v)}
                  disabled={loading}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="rounded p-0.5 text-gray-400 transition hover:text-gray-700"
                >
                  {showPassword
                    ? <EyeOff className="h-4 w-4" />
                    : <Eye className="h-4 w-4" />
                  }
                </button>
              }
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={!canSubmit}
              className="
                group relative mt-2 flex w-full items-center justify-center gap-2
                overflow-hidden rounded-lg px-5 py-3 text-sm font-semibold text-white
                shadow-sm transition-all duration-150
                focus:outline-none focus:ring-2 focus:ring-offset-2
                disabled:cursor-not-allowed disabled:opacity-50
              "
              style={{
                backgroundColor: 'hsl(var(--primary))',
                // Focus ring colour matches brand
                '--tw-ring-color': 'hsl(var(--primary) / 0.4)',
              } as React.CSSProperties}
            >
              {/* Hover shine */}
              <span
                className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
                style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)' }}
              />

              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          {/* Footer links */}
          <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6 text-xs text-gray-400">
            <Link to="/" className="flex items-center gap-1.5 transition hover:text-gray-700">
              <ArrowRight className="h-3 w-3 rotate-180" />
              Back to website
            </Link>
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" />
              Secure access
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};