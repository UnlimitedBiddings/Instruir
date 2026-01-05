import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Check, CheckCheck } from 'lucide-react';

interface ChatBubbleProps {
  content: string;
  timestamp: Date;
  isSent: boolean;
  isRead?: boolean;
}

export function ChatBubble({ content, timestamp, isSent, isRead }: ChatBubbleProps) {
  return (
    <div
      className={cn(
        'flex mb-3',
        isSent ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-2.5 shadow-sm',
          isSent
            ? 'bg-primary text-primary-foreground rounded-br-md'
            : 'bg-muted rounded-bl-md'
        )}
      >
        <p className="text-sm leading-relaxed">{content}</p>
        <div
          className={cn(
            'flex items-center gap-1 justify-end mt-1',
            isSent ? 'text-primary-foreground/70' : 'text-muted-foreground'
          )}
        >
          <span className="text-[10px]">
            {format(timestamp, 'HH:mm', { locale: ptBR })}
          </span>
          {isSent && (
            isRead ? (
              <CheckCheck className="h-3.5 w-3.5" />
            ) : (
              <Check className="h-3.5 w-3.5" />
            )
          )}
        </div>
      </div>
    </div>
  );
}