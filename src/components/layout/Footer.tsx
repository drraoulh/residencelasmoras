import { Link } from 'react-router-dom';
import BrandName from '../ui/BrandName';
import logoLasmoras from '../../assets/logo lasmoras.jpeg';

const links = [
  { to: '/', label: 'Accueil' },
  { to: '/catalogue', label: 'Logements' },
  { to: '/galerie', label: 'Galerie' },
  { to: '/a-propos', label: 'À propos' },
  { to: '/contact', label: 'Contact' },
];

const socials = [
  { href: 'https://www.instagram.com/contactlasmoras?igsh=emMxZW0wdm5xMWcz', label: 'Instagram' },
  { href: 'https://www.facebook.com/share/v/1ENz4iRMWg/', label: 'Facebook' },
  { href: 'https://vt.tiktok.com/ZSQS8AC2T/', label: 'TikTok' },
];

export default function Footer() {
  return (
    <footer className="border-t border-stone-200/80 bg-brand-gray">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <img
                src={logoLasmoras}
                alt="LAS MORAS — L'Art de Vivre Naturellement"
                className="h-12 w-auto rounded-lg object-contain"
              />
              <BrandName size="sm" />
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-brand-muted">
              Résidence d'appartements meublés de standing à Yaoundé. Chaque logement est une
              destination.
            </p>
            <Link to="/catalogue" className="btn-accent mt-6 text-xs">
              Réserver un logement
            </Link>
          </div>

          <div>
            <p className="section-label !text-brand-red">Pages</p>
            <nav className="mt-4 flex flex-col gap-2.5">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm text-brand-muted transition hover:text-brand-red"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="section-label !text-brand-red">Contact</p>
            <div className="mt-4 space-y-2.5 text-sm text-brand-muted">
              <a href="tel:+237689888291" className="block transition hover:text-brand-red">
                +237 6 89 88 82 91
              </a>
              <a
                href="mailto:contactlasmoras@gmail.com"
                className="block transition hover:text-brand-red"
              >
                contactlasmoras@gmail.com
              </a>
              <p>Nkolzie, Mendong, Yaoundé</p>
            </div>

            <div className="mt-6 flex gap-4">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-brand-muted transition hover:text-brand-red"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-stone-200/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-brand-muted sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} LAS MORAS — L'Art de Vivre Naturellement</p>
          <p>Yaoundé, Cameroun</p>
        </div>
      </div>
    </footer>
  );
}
