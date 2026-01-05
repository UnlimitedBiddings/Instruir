import { useNavigate } from 'react-router-dom';
import { format, isToday, isYesterday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MessageCircle } from 'lucide-react';
import { mockConversations, Conversation } from '@/data/mockChats';
import { cn } from '@/lib/utils';

export function ConversationsPage() {
  const navigate = useNavigate();

  const formatTime = (date: Date) => {
    if (isToday(date)) {
      return format(date, 'HH:mm', { locale: ptBR });
    }
    if (isYesterday(date)) {
      return 'Ontem';
    }
    return format(date, 'dd/MM', { locale: ptBR });
  };

  const totalUnread = mockConversations.reduce((sum, c) => sum + c.unreadCount, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 pt-4 pb-4 safe-area-top">
        <h1 className="font-display text-2xl font-bold">Mensagens</h1>
        {totalUnread > 0 && (
          <p className="text-muted-foreground mt-1">
            {totalUnread} mensagem{totalUnread !== 1 ? 'ns' : ''} não lida{totalUnread !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Conversations List */}
      <div className="divide-y divide-border">
        {mockConversations.map((conversation, index) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            formatTime={formatTime}
            onClick={() => navigate(`/chat/${conversation.participantId}`)}
            style={{ animationDelay: `${index * 50}ms` }}
          />
        ))}
      </div>

      {mockConversations.length === 0 && (
        <div className="text-center py-12 px-4">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-display font-semibold text-lg mb-2">
            Nenhuma conversa ainda
          </h3>
          <p className="text-muted-foreground">
            Encontre um instrutor e inicie uma conversa!
          </p>
        </div>
      )}
    </div>
  );
}

interface ConversationItemProps {
  conversation: Conversation;
  formatTime: (date: Date) => string;
  onClick: () => void;
  style?: React.CSSProperties;
}

function ConversationItem({ conversation, formatTime, onClick, style }: ConversationItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors text-left animate-slide-up"
      style={style}
    >
      <div className="relative">
        <img
          src={conversation.participantAvatar}
          alt={conversation.participantName}
          className="h-14 w-14 rounded-full object-cover"
        />
        {conversation.unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 h-5 w-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
            {conversation.unreadCount}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <h3 className={cn(
            "font-display truncate",
            conversation.unreadCount > 0 ? 'font-semibold' : 'font-medium'
          )}>
            {conversation.participantName}
          </h3>
          <span className={cn(
            "text-xs flex-shrink-0 ml-2",
            conversation.unreadCount > 0 ? 'text-primary font-medium' : 'text-muted-foreground'
          )}>
            {formatTime(conversation.lastMessageTime)}
          </span>
        </div>
        <p className={cn(
          "text-sm truncate",
          conversation.unreadCount > 0 ? 'text-foreground' : 'text-muted-foreground'
        )}>
          {conversation.lastMessage}
        </p>
      </div>
    </button>
  );
}