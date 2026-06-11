interface AdminEmptyStateProps {
  message: string;
}

export default function AdminEmptyState({ message }: AdminEmptyStateProps) {
  return (
    <p className="px-6 py-10 text-center text-sm text-brand-muted">{message}</p>
  );
}
