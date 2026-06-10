interface BrandNameProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: { name: 'text-sm', tagline: 'text-[9px]' },
  md: { name: 'text-base', tagline: 'text-[10px]' },
  lg: { name: 'text-lg sm:text-xl', tagline: 'text-[11px]' },
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
      <p className={`font-semibold tracking-wide ${nameColor} ${s.name}`}>LAS MORAS</p>
      <p className={`font-medium uppercase tracking-[0.18em] text-brand-red ${s.tagline}`}>
        L'Art de Vivre Naturellement
      </p>
    </div>
  );
}
