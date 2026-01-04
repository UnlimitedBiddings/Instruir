import { cn } from '@/lib/utils';
import { LessonStatus } from '@/types';

interface StatusBadgeProps {
  status: LessonStatus;
  className?: string;
}

const statusConfig: Record<LessonStatus, { label: string; className: string }> = {
  pending: {
    label: 'Pendente',
    className: 'badge-pending',
  },
  confirmed: {
    label: 'Confirmada',
    className: 'badge-confirmed',
  },
  in_progress: {
    label: 'Em andamento',
    className: 'bg-primary/10 text-primary border border-primary/20',
  },
  completed: {
    label: 'Concluída',
    className: 'bg-muted text-muted-foreground border border-border',
  },
  cancelled: {
    label: 'Cancelada',
    className: 'bg-destructive/10 text-destructive border border-destructive/20',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
