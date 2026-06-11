import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock } from 'lucide-react';
import BrandName from '../../components/ui/BrandName';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabaseClient';
import logoLasmoras from '../../assets/logo lasmoras.jpeg';

export default function Login() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (authError) {
      setError('Email ou mot de passe incorrect.');
    } else {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-brand-gray">
      <div className="px-4 py-5 sm:px-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-brand-muted transition hover:text-brand-red"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au site
        </Link>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-4 pb-16">
        <div className="mb-8 flex flex-col items-center text-center">
          <img
            src={logoLasmoras}
            alt="LAS MORAS"
            className="h-20 w-auto rounded-xl object-contain ring-1 ring-stone-200/80 sm:h-24"
          />
          <div className="mt-4">
            <BrandName size="md" />
          </div>
          <p className="mt-2 text-sm text-brand-muted">Espace administration</p>
        </div>

        <div className="admin-card w-full max-w-md p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-brand-red">
              <Lock className="h-5 w-5" strokeWidth={1.5} />
            </span>
            <div>
              <h1 className="text-xl font-semibold text-brand-dark">Connexion</h1>
              <p className="text-sm text-brand-muted">Accès réservé à l'équipe LAS MORAS</p>
            </div>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-brand-red">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-widest text-brand-muted">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@lasmoras.com"
                className="form-input"
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-widest text-brand-muted">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-accent mt-2 w-full disabled:opacity-60"
            >
              {loading ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
