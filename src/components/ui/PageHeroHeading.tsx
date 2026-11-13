import type { ReactNode } from 'react';

interface PageHeroHeadingProps {
  label?: string;
  title?: ReactNode;
  subtitle?: string;
  variant?: 'light' | 'dark';
  align?: 'left' | 'center';
  brand?: boolean;
  className?: string;
}

export default function PageHeroHeading({
  label,
  title,
  subtitle,
  variant = 'dark',
  align = 'left',
  brand = false,
  className = '',
}: PageHeroHeadingProps) {
  const isLight = variant === 'light';
  const alignClass = align === 'center' ? 'text-center' : 'text-left';

  return (
    <header className={`${alignClass} ${className}`}>
      {label && (
        <p
          className={`section-label ${isLight ? '!text-white/55' : ''} ${
            align === 'center' ? 'mx-auto' : ''
          }`}
        >
          {label}
        </p>
      )}

      {brand ? (
        <h1
          className={`page-hero-title page-hero-title--brand mt-3 sm:mt-4 ${isLight ? 'page-hero-title--light' : ''} ${
            align === 'center' ? 'mx-auto' : ''
          }`}
        >
          <span className="block">{SITE_NAME}</span>
          <span className={`page-hero-tagline ${isLight ? 'page-hero-tagline--light' : ''}`}>
            {SITE_TAGLINE}
          </span>
        </h1>
      ) : (
        title && (
          <h1
            className={`page-hero-title mt-3 sm:mt-4 ${isLight ? 'page-hero-title--light' : ''} ${
              align === 'center' ? 'mx-auto max-w-3xl' : 'max-w-2xl'
            }`}
          >
            {title}
          </h1>
        )
      )}

      {subtitle && (
        <p
          className={`mt-4 max-w-lg text-sm leading-relaxed sm:text-base ${
            isLight ? 'text-white/75' : 'text-brand-muted'
          } ${align === 'center' ? 'mx-auto' : ''}`}
        >
          {subtitle}
        </p>
      )}
    </header>
  );
}

const SITE_NAME = 'LAS MORAS';
const SITE_TAGLINE = "L'Art de Vivre Naturellement";
