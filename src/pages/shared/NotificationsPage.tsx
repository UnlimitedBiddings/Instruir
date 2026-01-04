import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Bell, Calendar, Star, MessageCircle, AlertCircle } from 'lucide-react';
import { Notification } from '@/types';
import { cn } from '@/lib/utils';

const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '1',
    title: 'Aula confirmada!',
    message: 'Sua aula com Carlos Oliveira foi confirmada para amanhã às 14:00.',
    type: 'lesson_confirmed',
    read: false,
    createdAt: new Date(),
  },
  {
    id: '2',
    userId: '1',
    title: 'Lembrete de aula',
    message: 'Você tem uma aula agendada para hoje às 10:00 com Ana Santos.',
    type: 'lesson_reminder',
    read: false,
    createdAt: new Date(Date.now() - 3600000),
  },
  {
    id: '3',
    userId: '1',
    title: 'Avalie sua aula',
    message: 'Como foi sua aula com Carlos Oliveira? Deixe sua avaliação.',
    type: 'review',
    read: true,
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    id: '4',
    userId: '1',
    title: 'Novo instrutor na região',
    message: 'Fernanda Lima começou a atender na sua região. Confira!',
    type: 'system',
    read: true,
    createdAt: new Date(Date.now() - 172800000),
  },
];

const notificationIcons: Record<string, React.ElementType> = {
  lesson_request: Calendar,
  lesson_confirmed: Calendar,
  lesson_reminder: Bell,
  review: Star,
  system: AlertCircle,
};

const notificationColors: Record<string, string> = {
  lesson_request: 'bg-warning/10 text-warning',
  lesson_confirmed: 'bg-success/10 text-success',
  lesson_reminder: 'bg-accent/10 text-accent',
  review: 'bg-warning/10 text-warning',
  system: 'bg-primary/10 text-primary',
};

export function NotificationsPage() {
  const unreadCount = mockNotifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 pt-4 pb-4 safe-area-top">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold">Notificações</h1>
          {unreadCount > 0 && (
            <span className="px-2.5 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
              {unreadCount} nova{unreadCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="p-4 space-y-3">
        {mockNotifications.map((notification, index) => {
          const Icon = notificationIcons[notification.type] || Bell;
          const colorClass = notificationColors[notification.type];

          return (
            <div
              key={notification.id}
              className={cn(
                "card-elevated p-4 flex gap-4 animate-slide-up transition-all",
                !notification.read && "border-l-4 border-l-primary"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", colorClass)}>
                <Icon className="h-5 w-5" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className={cn(
                    "font-medium",
                    !notification.read && "font-semibold"
                  )}>
                    {notification.title}
                  </h3>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {format(notification.createdAt, "HH:mm", { locale: ptBR })}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {notification.message}
                </p>
              </div>
            </div>
          );
        })}

        {mockNotifications.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-display font-semibold text-lg mb-2">
              Nenhuma notificação
            </h3>
            <p className="text-muted-foreground">
              Você está em dia! Novas notificações aparecerão aqui.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
