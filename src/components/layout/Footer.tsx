import { Link } from 'react-router-dom';
import logoLasmoras from '../../assets/logo lasmoras.jpeg';

const quickLinks = [
  { to: '/', label: 'Accueil' },
  { to: '/catalogue', label: 'Nos logements' },
  { to: '/a-propos', label: 'A propos' },
  { to: '/contact', label: 'Contact' },
];

const socialLinks = [
  { href: 'https://share.google/GUJ0aaC0urzsl247t', label: 'Google' },
  { href: 'https://www.facebook.com/share/v/1ENz4iRMWg/', label: 'Facebook' },
  { href: 'https://www.instagram.com/contactlasmoras?igsh=emMxZW0wdm5xMWcz', label: 'Instagram' },
  { href: 'https://vt.tiktok.com/ZSQS8AC2T/', label: 'TikTok' },
];

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-gray-200">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.9fr_0.9fr]">
          <div>
            <img src={logoLasmoras} alt="LAS MORAS" className="h-20 w-auto rounded-lg bg-white object-contain p-1" />
            <h2 className="mt-5 text-2xl font-black tracking-wide text-white">LAS MORAS</h2>
            <p className="mt-2 text-sm font-bold uppercase tracking-[0.18em] text-brand-red">
              L'Art de Vivre Naturellement
            </p>
            <p className="mt-5 max-w-md leading-relaxed text-gray-400">
              Une residence d'appartements meubles a Yaounde, inspiree par les plus belles
              destinations du monde et pensee pour des sejours confortables.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-extrabold text-white">Navigation</h3>
            <nav className="mt-5 flex flex-col gap-3">
              {quickLinks.map((link) => (
                <Link key={link.to} to={link.to} className="text-gray-400 transition hover:text-white">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="text-lg font-extrabold text-white">Contact</h3>
            <div className="mt-5 space-y-3 text-gray-400">
              <p>+237 6 89 88 82 91</p>
              <p>contactlasmoras@gmail.com</p>
              <p>Nkolzie, Mendong, Yaounde</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-extrabold text-white">Suivez-nous</h3>
            <div className="mt-5 flex flex-wrap gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-white/10 px-3 py-2 text-sm font-bold text-gray-300 transition hover:border-brand-red hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <Link
              to="/catalogue"
              className="mt-6 inline-flex rounded-lg bg-brand-red px-5 py-3 text-sm font-black text-white transition hover:bg-red-700"
            >
              Voir nos logements
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-5 text-center text-sm text-gray-500">
        © 2026 LAS MORAS. Tous droits reserves.
      </div>
    </footer>
  );
}
