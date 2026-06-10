import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center bg-brand-gray px-4 py-16 text-center">
      <p className="text-8xl font-bold text-brand-red/20">404</p>
      <h1 className="mt-4 text-3xl font-bold text-brand-dark md:text-4xl">Page introuvable</h1>
      <p className="mt-4 max-w-md text-gray-600">
        La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link to="/" className="btn-primary">
          <Home className="h-5 w-5" />
          Retour à l'accueil
        </Link>
        <Link to="/catalogue" className="btn-secondary">
          <Search className="h-5 w-5" />
          Voir le catalogue
        </Link>
      </div>
    </main>
  );
}
