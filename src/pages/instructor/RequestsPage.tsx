import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Clock, MapPin, Check, X, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockPendingRequests } from '@/data/mockData';
import { Lesson } from '@/types';
import { cn } from '@/lib/utils';

export function RequestsPage() {
  const [requests, setRequests] = useState(mockPendingRequests);

  const handleAccept = (id: string) => {
    setRequests(prev => prev.filter(r => r.id !== id));
    // Show success toast
  };

  const handleReject = (id: string) => {
    setRequests(prev => prev.filter(r => r.id !== id));
    // Show rejection toast
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 pt-4 pb-4 safe-area-top">
        <h1 className="font-display text-2xl font-bold">Solicitações</h1>
        <p className="text-muted-foreground mt-1">
          {requests.length} solicitação{requests.length !== 1 ? 'ões' : ''} pendente{requests.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Requests List */}
      <div className="p-4 space-y-4">
        {requests.map((request, index) => (
          <RequestCard
            key={request.id}
            request={request}
            onAccept={() => handleAccept(request.id)}
            onReject={() => handleReject(request.id)}
            style={{ animationDelay: `${index * 100}ms` }}
          />
        ))}

        {requests.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-success" />
            </div>
            <h3 className="font-display font-semibold text-lg mb-2">
              Tudo em dia!
            </h3>
            <p className="text-muted-foreground">
              Você não tem solicitações pendentes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

interface RequestCardProps {
  request: Lesson;
  onAccept: () => void;
  onReject: () => void;
  style?: React.CSSProperties;
}

function RequestCard({ request, onAccept, onReject, style }: RequestCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className={cn(
        "card-elevated overflow-hidden animate-slide-up transition-all",
        isExpanded && "ring-2 ring-primary/20"
      )}
      style={style}
    >
      <div 
        className="p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start gap-4">
          <img
            src={request.student?.avatar}
            alt={request.student?.name}
            className="h-14 w-14 rounded-xl object-cover"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-display font-semibold truncate">
                {request.student?.name}
              </h3>
              <span className="text-sm font-bold text-primary">
                R$ {request.price}
              </span>
            </div>

            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  {format(request.date, "EEE, d 'de' MMM", { locale: ptBR })}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>{request.startTime} - {request.endTime}</span>
              </div>
            </div>

            {request.student && (
              <p className="text-xs text-muted-foreground mt-2">
                {request.student.lessonsCompleted} aulas concluídas
              </p>
            )}
          </div>
        </div>

        {/* Notes */}
        {request.notes && (
          <div className="mt-3 p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground italic">
              "{request.notes}"
            </p>
          </div>
        )}
      </div>

      {/* Expanded Actions */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-border pt-4 animate-fade-in">
          <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{request.location.address}</span>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                // Open chat
              }}
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              Chat
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onReject();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              variant="success"
              size="sm"
              className="flex-1 bg-success hover:bg-success/90 text-success-foreground"
              onClick={(e) => {
                e.stopPropagation();
                onAccept();
              }}
            >
              <Check className="h-4 w-4 mr-1" />
              Aceitar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
