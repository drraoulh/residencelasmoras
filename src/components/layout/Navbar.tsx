import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, MessageCircle, X } from 'lucide-react';
import BrandName from '../ui/BrandName';
import { STATIC_IMAGES } from '../../config/staticAssets';
import { WHATSAPP_LINK } from '../../utils/whatsapp';

const navLinks = [
  { to: '/', label: 'Accueil' },
  { to: '/catalogue', label: 'Nos logements' },
  { to: '/galerie', label: 'Galerie' },
  { to: '/a-propos', label: 'À propos' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(72);
  const headerRef = useRef<HTMLElement>(null);
  const location = useLocation();

  const isHome = location.pathname === '/';
  const onHero = isHome && !scrolled;

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  /* Scroll listener */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Measure real header height on mount and on resize/scroll state change */
  useEffect(() => {
    const measure = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (headerRef.current) ro.observe(headerRef.current);
    return () => ro.disconnect();
  }, [scrolled]);

  /* Close menu on route change */
  useEffect(() => setIsOpen(false), [location.pathname]);

  /* Lock body scroll when menu open */
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const linkClass = (active: boolean) => {
    if (active) {
      return onHero && !isOpen
        ? 'bg-white/15 font-medium text-white'
        : 'bg-red-50 font-medium text-brand-red';
    }
    return onHero && !isOpen
      ? 'text-white/70 hover:bg-white/10 hover:text-white'
      : 'text-brand-muted hover:text-brand-dark';
  };

  const headerSurfaceClass =
    isOpen
      ? 'border border-stone-200/80 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.12)]'
      : onHero
        ? 'glass-dark'
        : scrolled
          ? 'glass shadow-[0_4px_24px_rgba(0,0,0,0.06)]'
          : 'border border-stone-200/50 bg-white/80 backdrop-blur-xl';

  const burgerButtonClass =
    isOpen || !onHero
      ? 'text-brand-dark hover:bg-stone-100'
      : 'text-white hover:bg-white/10';

  return (
    <>
      {/* ── Fixed header ── */}
      <header
        ref={headerRef}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? 'py-2 sm:py-3' : 'py-3 sm:py-5'
        }`}
      >
        <div className="mx-auto max-w-6xl px-3 sm:px-6">
          <div
            className={`flex items-center justify-between rounded-2xl px-3 py-2 transition-all duration-500 sm:px-5 sm:py-2.5 ${headerSurfaceClass}`}
          >
            {/* Logo */}
            <Link to="/" className="flex shrink-0 items-center gap-2 sm:gap-2.5">
              <img
                src={STATIC_IMAGES.logoUi}
                alt="LAS MORAS"
                width={40}
                height={40}
                decoding="async"
                className="h-8 w-8 rounded-lg object-cover sm:h-10 sm:w-10"
              />
              <BrandName
                variant={onHero && !isOpen ? 'light' : 'dark'}
                size="sm"
                className="hidden sm:block"
              />
            </Link>

            {/* Desktop nav */}
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

            {/* Desktop CTA */}
            <div className="hidden items-center gap-2 md:flex">
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noreferrer"
                className={`rounded-full px-4 py-2 text-sm transition ${
                  onHero ? 'text-white/70 hover:text-white' : 'text-brand-muted hover:text-brand-red'
                }`}
              >
                WhatsApp
              </a>
              <Link to="/catalogue" className="btn-accent !px-5 !py-2 text-xs">
                Voir les logements
              </Link>
            </div>

            {/* Mobile burger */}
            <button
              type="button"
              onClick={() => setIsOpen((v) => !v)}
              className={`flex h-9 w-9 items-center justify-center rounded-full transition lg:hidden ${burgerButtonClass}`}
              aria-label={isOpen ? 'Fermer' : 'Menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Spacer dynamique — uniquement sur les pages non-hero ── */}
      {!isHome && (
        <div style={{ height: headerHeight }} aria-hidden="true" />
      )}

      {/* ── Menu mobile ── */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          {/* Overlay backdrop */}
          <button
            type="button"
            className="absolute inset-0 bg-stone-950/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            aria-label="Fermer le menu"
          />
          {/* Panel — positionné juste sous le header réel */}
          <div
            className="absolute left-3 right-3 max-h-[calc(100dvh-5rem)] overflow-y-auto rounded-2xl border border-stone-200/80 bg-white p-2 shadow-[0_16px_48px_rgba(0,0,0,0.18)] sm:left-auto sm:right-4 sm:max-h-none sm:w-80"
            style={{ top: headerHeight + 8 }}
          >
            <nav className="flex flex-col">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive(link.to)
                      ? 'bg-red-50 text-brand-red'
                      : 'text-brand-dark hover:bg-stone-100'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="space-y-1 border-t border-stone-200/80 p-2 pt-3">
              <a
                href="tel:+237689888291"
                className="block rounded-xl px-4 py-3 text-sm font-medium text-brand-dark hover:bg-stone-100"
              >
                +237 6 89 88 82 91
              </a>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-brand-dark hover:bg-stone-100"
              >
                <MessageCircle className="h-4 w-4 text-brand-red" />
                WhatsApp
              </a>
              <Link to="/catalogue" className="btn-accent block w-full py-3 text-center text-sm">
                Voir les logements
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
