import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabaseClient';
import logoLasmoras from '../../assets/logo lasmoras.jpeg';

export default function Login() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError('Email ou mot de passe incorrect. (Ou config .env manquante)');
      setIsLoading(false);
    } else {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-gray p-4">
      <Link to="/" className="mb-10 transition-opacity hover:opacity-90">
        <img
          src={logoLasmoras}
          alt="Résidence Las Moras"
          className="h-24 w-auto rounded-xl shadow-md"
        />
      </Link>

      <div className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] sm:p-10">
        <div className="mb-10 text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-brand-red">
            <Lock className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-brand-dark">Espace Admin</h1>
          <p className="mt-2 font-medium text-gray-500">
            Connexion requise pour gérer la plateforme.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 ring-1 ring-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700">
              Adresse Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@lasmoras.com"
              className="form-input"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="form-input"
              required
            />
          </div>

          <button type="submit" className="btn-primary mt-2 w-full py-4 text-lg">
            Se connecter
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-400">
          Identifiants par défaut : admin@lasmoras.com / lasmoras
        </p>
      </div>
    </div>
  );
}
