import type { LucideIcon } from 'lucide-react';

interface AdminStatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

const tones = {
  default: 'bg-stone-100 text-brand-dark',
  success: 'bg-green-50 text-green-700',
  warning: 'bg-amber-50 text-amber-800',
  danger: 'bg-red-50 text-brand-red',
  info: 'bg-blue-50 text-blue-700',
};

export default function AdminStatCard({
  label,
  value,
  icon: Icon,
  tone = 'default',
}: AdminStatCardProps) {
  return (
    <div className="admin-card p-5 sm:p-6">
      <div className="flex items-center gap-4">
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>
          <Icon className="h-5 w-5" strokeWidth={1.5} />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-widest text-brand-muted">{label}</p>
          <p className="mt-1 truncate text-2xl font-semibold text-brand-dark sm:text-3xl">{value}</p>
        </div>
      </div>
    </div>
  );
}
