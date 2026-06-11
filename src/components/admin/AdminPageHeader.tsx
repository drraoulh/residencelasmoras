import type { ReactNode } from 'react';

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export default function AdminPageHeader({ title, description, actions }: AdminPageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="admin-page-title">{title}</h1>
        {description && (
          <p className="mt-2 text-sm text-brand-muted">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
