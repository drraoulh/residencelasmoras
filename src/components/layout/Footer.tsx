import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock, Mail, MapPin, Phone } from 'lucide-react';
import BrandName from '../ui/BrandName';
import logoLasmoras from '../../assets/logo lasmoras.jpeg';

const navLinks = [
  { to: '/', label: 'Accueil' },
  { to: '/catalogue', label: 'Nos logements' },
  { to: '/galerie', label: 'Galerie' },
  { to: '/a-propos', label: 'À propos' },
  { to: '/contact', label: 'Contact' },
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
    value: 'Nkolzie, Mendong — Yaoundé',
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
    label: 'Google Maps',
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
  const cls = 'h-[17px] w-[17px]';
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

function FooterHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className="font-heading text-[11px] font-semibold uppercase tracking-[0.26em] text-white/40">
      {children}
    </h3>
  );
}

function FooterLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="group inline-flex items-center gap-2.5 text-sm text-white/65 transition hover:text-white"
    >
      <span
        className="h-px w-3 bg-brand-red/60 transition-all duration-300 group-hover:w-5 group-hover:bg-brand-red"
        aria-hidden
      />
      {children}
    </Link>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/10 bg-brand-dark text-white">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-red/70 to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10 sm:py-14 lg:grid-cols-12 lg:gap-x-10 lg:py-16">
          {/* Marque */}
          <div className="space-y-5 sm:col-span-2 lg:col-span-4">
            <div className="flex items-center gap-3.5">
              <img
                src={logoLasmoras}
                alt="LAS MORAS"
                className="h-14 w-14 shrink-0 rounded-xl object-cover ring-1 ring-white/15"
              />
              <BrandName variant="light" size="md" />
            </div>

            <p className="max-w-xs text-sm leading-relaxed text-white/50">
              Résidence d&apos;appartements meublés de standing à Yaoundé. Chaque logement, une
              destination.
            </p>

            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-[11px] text-white/60">
              <Clock className="h-3.5 w-3.5 shrink-0 text-brand-red" strokeWidth={1.5} />
              Assistance 7j/7
            </div>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-2 lg:col-start-5">
            <FooterHeading>Explorer</FooterHeading>
            <nav className="mt-5 flex flex-col gap-3">
              {navLinks.map(({ to, label }) => (
                <FooterLink key={to} to={to}>
                  {label}
                </FooterLink>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <FooterHeading>Contact</FooterHeading>
            <ul className="mt-5 space-y-3.5">
              {contactItems.map(({ icon: Icon, label, value, href, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noreferrer' : undefined}
                    className="group flex items-start gap-3"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-brand-red">
                      <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
                    </span>
                    <span className="min-w-0 pt-0.5">
                      <span className="block text-[10px] uppercase tracking-[0.18em] text-white/35">
                        {label}
                      </span>
                      <span className="mt-0.5 block text-sm leading-snug text-white/80 transition group-hover:text-white">
                        {value}
                      </span>
                    </span>
                    {external && (
                      <ArrowUpRight className="mt-1.5 h-3 w-3 shrink-0 text-white/20 group-hover:text-brand-red" />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Réseaux */}
          <div className="sm:col-span-2 lg:col-span-3">
            <FooterHeading>Suivez-nous</FooterHeading>
            <p className="mt-5 text-sm leading-relaxed text-white/45">
              Retrouvez la résidence sur nos réseaux.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  title={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-white/55 transition hover:border-brand-red/40 hover:bg-brand-red/10 hover:text-white"
                >
                  <SocialIcon type={social.type} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Barre basse */}
      <div className="border-t border-white/[0.08] bg-black/20">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-5 text-center sm:flex-row sm:px-6 sm:text-left lg:px-8">
          <p className="text-[11px] leading-relaxed text-white/35">
            © {year} LAS MORAS — L&apos;Art de Vivre Naturellement
          </p>
          <p className="inline-flex items-center gap-1.5 text-[11px] text-white/35">
            <MapPin className="h-3 w-3 text-brand-red/70" strokeWidth={1.5} />
            Yaoundé, Cameroun
          </p>
        </div>
      </div>
    </footer>
  );
}
