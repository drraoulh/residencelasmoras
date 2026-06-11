import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import {
  Clock,
  Home,
  Images,
  Info,
  Mail,
  MapPin,
  Phone,
  Building2,
} from 'lucide-react';
import BrandName from '../ui/BrandName';
import logoLasmoras from '../../assets/logo lasmoras.jpeg';

const navLinks = [
  { to: '/', label: 'Accueil', icon: Home },
  { to: '/catalogue', label: 'Logements', icon: Building2 },
  { to: '/galerie', label: 'Galerie', icon: Images },
  { to: '/a-propos', label: 'À propos de nous', icon: Info },
  { to: '/contact', label: 'Contact', icon: Mail },
];

const contactItems = [
  {
    icon: Phone,
    label: 'Téléphone',
    value: '+237 6 89 88 82 91',
    href: 'tel:+237689888291',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'contactlasmoras@gmail.com',
    href: 'mailto:contactlasmoras@gmail.com',
  },
  {
    icon: MapPin,
    label: 'Adresse',
    value: 'Nkolzie, Mendong, Yaoundé',
    href: 'https://share.google/GUJ0aaC0urzsl247t',
    external: true,
  },
];

const socials = [
  {
    href: 'https://www.instagram.com/contactlasmoras?igsh=emMxZW0wdm5xMWcz',
    label: 'Instagram',
    type: 'instagram' as const,
  },
  {
    href: 'https://www.facebook.com/share/v/1ENz4iRMWg/',
    label: 'Facebook',
    type: 'facebook' as const,
  },
  {
    href: 'https://vt.tiktok.com/ZSQS8AC2T/',
    label: 'TikTok',
    type: 'tiktok' as const,
  },
  {
    href: 'https://share.google/GUJ0aaC0urzsl247t',
    label: 'Google',
    type: 'google' as const,
  },
];

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.2-1.5 1.5-1.5H17V5.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V11H8v3h2.3v8h3.2z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
    </svg>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function SocialIcon({ type }: { type: (typeof socials)[number]['type'] }) {
  const cls = 'h-4 w-4';
  switch (type) {
    case 'instagram':
      return <InstagramIcon className={cls} />;
    case 'facebook':
      return <FacebookIcon className={cls} />;
    case 'tiktok':
      return <TikTokIcon className={cls} />;
    case 'google':
      return <GoogleIcon className={cls} />;
  }
}

export default function Footer() {
  return (
    <footer className="border-t border-stone-200/80 bg-brand-gray">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Marque */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <img
                src={logoLasmoras}
                alt="LAS MORAS — L'Art de Vivre Naturellement"
                className="h-14 w-auto rounded-xl object-contain ring-1 ring-stone-200/80"
              />
              <BrandName size="sm" />
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-brand-muted">
              Résidence d'appartements meublés de standing à Yaoundé. Chaque logement est une
              destination.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-stone-200/80 bg-white/70 px-3 py-2 text-xs text-brand-muted">
              <Clock className="h-3.5 w-3.5 text-brand-red" strokeWidth={1.5} />
              Assistance 7j/7
            </div>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-3">
            <p className="section-label !text-brand-red">Navigation</p>
            <nav className="mt-4 flex flex-col gap-1">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="group flex items-center gap-3 rounded-xl px-2 py-2.5 text-sm text-brand-muted transition hover:bg-white/60 hover:text-brand-red"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/80 text-brand-red ring-1 ring-stone-200/60 transition group-hover:bg-red-50">
                    <Icon className="h-4 w-4" strokeWidth={1.5} />
                  </span>
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="lg:col-span-5">
            <p className="section-label !text-brand-red">Contact</p>
            <div className="mt-4 space-y-2">
              {contactItems.map(({ icon: Icon, label, value, href, external }) => (
                <a
                  key={label}
                  href={href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noreferrer' : undefined}
                  className="group flex items-center gap-3 rounded-xl px-2 py-2.5 transition hover:bg-white/60"
                >
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white/80 text-brand-red ring-1 ring-stone-200/60 transition group-hover:bg-red-50">
                    <Icon className="h-4 w-4" strokeWidth={1.5} />
                  </span>
                  <span>
                    <span className="block text-[10px] uppercase tracking-widest text-brand-muted">
                      {label}
                    </span>
                    <span className="text-sm font-medium text-brand-dark transition group-hover:text-brand-red">
                      {value}
                    </span>
                  </span>
                </a>
              ))}
            </div>

            {/* Réseaux sociaux */}
            <p className="section-label mt-8 !text-brand-red">Suivez-nous</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="group flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200/80 bg-white/80 text-brand-muted transition hover:border-brand-red/30 hover:bg-red-50 hover:text-brand-red"
                  title={social.label}
                >
                  <SocialIcon type={social.type} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-stone-200/60 bg-white/40">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-5 text-center sm:flex-row sm:px-6 sm:text-left">
          <p className="flex max-w-full flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-brand-muted sm:justify-start">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-brand-red" strokeWidth={1.5} />
            <span>© {new Date().getFullYear()} LAS MORAS — L'Art de Vivre Naturellement</span>
          </p>
          <div className="flex shrink-0 flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-brand-muted sm:justify-end">
            <span>Yaoundé, Cameroun</span>
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1 transition hover:text-brand-red"
            >
              <Lock className="h-3 w-3" strokeWidth={1.5} />
              Administration
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
