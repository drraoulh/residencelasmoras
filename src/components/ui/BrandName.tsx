interface BrandNameProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizes = {
  sm: { name: 'text-sm', tagline: 'text-[9px]' },
  md: { name: 'text-base', tagline: 'text-[10px]' },
  lg: { name: 'text-lg sm:text-xl', tagline: 'text-[10px] sm:text-[11px]' },
  xl: { name: 'text-2xl sm:text-3xl md:text-4xl', tagline: 'text-[10px] sm:text-[11px]' },
};

export default function BrandName({
  variant = 'dark',
  size = 'md',
  className = '',
}: BrandNameProps) {
  const s = sizes[size];
  const nameColor = variant === 'light' ? 'text-white' : 'text-brand-dark';

  return (
    <div className={className}>
      <p className={`font-heading font-semibold uppercase tracking-[0.14em] ${nameColor} ${s.name}`}>
        LAS MORAS
      </p>
      <p className={`font-sans font-semibold uppercase tracking-[0.22em] text-brand-red ${s.tagline}`}>
        L&apos;Art de Vivre Naturellement
      </p>
    </div>
  );
}
