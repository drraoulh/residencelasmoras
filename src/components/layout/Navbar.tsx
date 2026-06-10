import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logoLasmoras from '../../assets/logo lasmoras.jpeg';

const navLinks = [
  { to: '/', label: 'Accueil' },
  { to: '/catalogue', label: 'Nos logements' },
  { to: '/a-propos', label: 'A propos' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
          <img src={logoLasmoras} alt="LAS MORAS" className="h-14 w-auto rounded-lg object-contain" />
          <div className="hidden sm:block">
            <p className="text-lg font-black tracking-wide text-brand-dark">LAS MORAS</p>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-red">
              Residence meublee
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-bold transition ${
                isActive(link.to) ? 'text-brand-red' : 'text-gray-700 hover:text-brand-red'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/contact"
            className="text-sm font-bold text-gray-600 transition hover:text-brand-red"
          >
            +237 6 89 88 82 91
          </Link>
          <a
            href="https://wa.me/237689888291"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg bg-brand-red px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-red-700"
          >
            WhatsApp
          </a>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-gray-200 text-brand-dark transition hover:border-brand-red hover:text-brand-red md:hidden"
          onClick={() => setIsOpen((current) => !current)}
          aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={`overflow-hidden border-t border-gray-100 bg-white transition-[max-height,opacity] duration-300 md:hidden ${
          isOpen ? 'max-h-[420px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col gap-1 px-4 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className={`rounded-lg px-4 py-3 font-bold transition ${
                isActive(link.to)
                  ? 'bg-red-50 text-brand-red'
                  : 'text-brand-dark hover:bg-red-50 hover:text-brand-red'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://wa.me/237689888291"
            target="_blank"
            rel="noreferrer"
            onClick={() => setIsOpen(false)}
            className="mt-2 rounded-lg bg-brand-red px-4 py-3 text-center font-black text-white"
          >
            Contacter sur WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
}
