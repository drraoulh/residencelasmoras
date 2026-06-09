import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';

const quickLinks = [
  { to: '/', label: 'Accueil' },
  { to: '/catalogue', label: 'Nos Logements' },
  { to: '/a-propos', label: 'À Propos' },
  { to: '/contact', label: 'Contact' },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-2xl font-extrabold tracking-wide text-white">LAS MORAS</h2>
          <p className="mt-2 text-sm font-semibold text-brand-red">L'Art de Vivre Naturellement</p>
          <p className="mt-5 max-w-sm leading-relaxed text-gray-400">
            Une résidence pensée pour conjuguer confort moderne, évasion et sérénité au cœur de Yaoundé.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-bold text-white">Liens rapides</h3>
          <nav className="mt-5 flex flex-col gap-3">
            {quickLinks.map((link) => (
              <Link key={link.to} to={link.to} className="text-gray-400 transition hover:text-white">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h3 className="text-lg font-bold text-white">Contact</h3>
          <div className="mt-5 flex flex-col gap-4 text-gray-400">
            <p className="flex items-start gap-3">
              <Phone className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-red" />
              <span>+237 6 89 88 82 91</span>
            </p>
            <p className="flex items-start gap-3">
              <Mail className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-red" />
              <span>contactlasmoras@gmail.com</span>
            </p>
            <p className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-red" />
              <span>Yaoundé, Cameroun</span>
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-5 text-center text-sm text-gray-500">
        © 2026 LAS MORAS - Tous droits réservés
      </div>
    </footer>
  );
}
