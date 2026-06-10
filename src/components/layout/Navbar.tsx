import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import BrandName from '../ui/BrandName';
import logoLasmoras from '../../assets/logo lasmoras.jpeg';

const navLinks = [
  { to: '/', label: 'Accueil' },
  { to: '/catalogue', label: 'Logements' },
  { to: '/galerie', label: 'Galerie' },
  { to: '/a-propos', label: 'À propos' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === '/';
  const onHero = isHome && !scrolled;

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setIsOpen(false), [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const linkClass = (active: boolean) => {
    if (active) {
      return onHero
        ? 'bg-white/15 font-medium text-white'
        : 'bg-red-50 font-medium text-brand-red';
    }
    return onHero
      ? 'text-white/70 hover:bg-white/10 hover:text-white'
      : 'text-brand-muted hover:text-brand-dark';
  };

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? 'py-3' : 'py-5'}`}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div
            className={`flex items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-500 sm:px-5 ${
              onHero
                ? 'glass-dark'
                : scrolled
                  ? 'glass shadow-[0_4px_24px_rgba(0,0,0,0.06)]'
                  : 'border border-stone-200/50 bg-white/80 backdrop-blur-xl'
            }`}
          >
            <Link to="/" className="flex items-center gap-2.5">
              <img
                src={logoLasmoras}
                alt="LAS MORAS — L'Art de Vivre Naturellement"
                className="h-9 w-auto rounded-lg object-contain sm:h-10"
              />
              <BrandName variant={onHero ? 'light' : 'dark'} size="sm" className="hidden sm:block" />
            </Link>

            <nav className="hidden items-center gap-1 lg:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`rounded-full px-3.5 py-2 text-sm transition ${linkClass(isActive(link.to))}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="hidden items-center gap-2 md:flex">
              <a
                href="https://wa.me/237689888291"
                target="_blank"
                rel="noreferrer"
                className={`rounded-full px-4 py-2 text-sm transition ${
                  onHero ? 'text-white/70 hover:text-white' : 'text-brand-muted hover:text-brand-red'
                }`}
              >
                WhatsApp
              </a>
              <Link to="/catalogue" className="btn-accent !px-5 !py-2 text-xs">
                Réserver
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen((v) => !v)}
              className={`flex h-9 w-9 items-center justify-center rounded-full transition lg:hidden ${
                onHero ? 'text-white hover:bg-white/10' : 'text-brand-dark hover:bg-stone-100'
              }`}
              aria-label={isOpen ? 'Fermer' : 'Menu'}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      <div className={isHome ? 'h-0' : 'h-[72px]'} />

      {isOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            aria-label="Fermer"
          />
          <div className="absolute right-4 top-[76px] w-[calc(100%-2rem)] max-w-sm rounded-2xl glass-card p-2 shadow-2xl">
            <nav className="flex flex-col">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`rounded-xl px-4 py-3 text-sm transition ${
                    isActive(link.to)
                      ? 'bg-red-50 font-medium text-brand-red'
                      : 'text-brand-muted hover:bg-stone-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="space-y-1 border-t border-stone-200/60 p-2">
              <a href="tel:+237689888291" className="block rounded-xl px-4 py-3 text-sm text-brand-muted">
                +237 6 89 88 82 91
              </a>
              <Link to="/catalogue" className="btn-accent block w-full py-3 text-center text-sm">
                Réserver
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
