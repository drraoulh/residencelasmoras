import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building, Home, Info, Mail, Menu, X } from 'lucide-react';
import logoLasmoras from '../../assets/logo lasmoras.jpeg';

const navLinks = [
  { to: '/', label: 'Accueil', icon: Home },
  { to: '/catalogue', label: 'Nos Logements', icon: Building },
  { to: '/a-propos', label: 'À Propos', icon: Info },
  { to: '/contact', label: 'Contact', icon: Mail },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }

    return location.pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-[0_2px_15px_rgb(0,0,0,0.05)]">
      <div className="mx-auto flex max-w-7xl items-center px-4 py-2 sm:px-6">
        <Link to="/" className="flex flex-shrink-0 items-center" onClick={() => setIsOpen(false)}>
          <img
            src={logoLasmoras}
            alt="LAS MORAS"
            className="h-11 w-auto object-contain sm:h-12 md:h-14"
          />
        </Link>

        <div className="hidden flex-1 items-center justify-center gap-8 text-sm font-bold text-gray-700 md:flex">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const active = isActive(to);

            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 border-b-2 transition-colors ${
                  active
                    ? 'border-[#D50000] pb-1 text-[#D50000]'
                    : 'border-transparent pb-1 hover:text-[#D50000]'
                }`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            );
          })}
        </div>

        <div className="hidden w-[132px] justify-end md:flex" />

        <button
          type="button"
          className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-brand-dark transition hover:border-brand-red hover:text-brand-red md:hidden"
          onClick={() => setIsOpen((current) => !current)}
          aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={`overflow-hidden border-t border-gray-100 bg-white transition-[max-height,opacity] duration-300 md:hidden ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col gap-1 px-4 py-3">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const active = isActive(to);

            return (
              <Link
                key={to}
                to={to}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 rounded-lg border-l-4 px-3 py-3 font-bold transition ${
                  active
                    ? 'border-[#D50000] bg-red-50 text-[#D50000]'
                    : 'border-transparent text-brand-dark hover:bg-red-50 hover:text-[#D50000]'
                }`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
