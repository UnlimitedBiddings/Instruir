import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, isToday, isTomorrow, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Session } from '@/types';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  MessageCircle,
  ChevronRight,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { cn } from '@/lib/utils';

interface UpcomingSession {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: string;
  price: number;
  otherPartyName: string;
  otherPartyAvatar?: string;
  address?: string;
}

export function UpcomingSessionsList() {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<UpcomingSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchSessions = async () => {
      setIsLoading(true);
      
      try {
        const today = new Date().toISOString().split('T')[0];
        const nextWeek = addDays(new Date(), 7).toISOString().split('T')[0];
        
        const query = supabase
          .from('sessions')
          .select(`
            id,
            session_date,
            start_time,
            end_time,
            status,
            price,
            address,
            student_id,
            professional_id
          `)
          .in('status', ['pending', 'confirmed'])
          .gte('session_date', today)
          .lte('session_date', nextWeek)
          .order('session_date', { ascending: true })
          .order('start_time', { ascending: true })
          .limit(5);

        // Filter by user role
        if (userRole === 'professional') {
          query.eq('professional_id', user.id);
        } else {
          query.eq('student_id', user.id);
        }

        const { data, error } = await query;

        if (error) throw error;

        // Fetch names of other party
        const formattedSessions: UpcomingSession[] = await Promise.all(
          (data || []).map(async (session) => {
            const otherPartyId = userRole === 'professional' 
              ? session.student_id 
              : session.professional_id;

            const { data: profileData } = await supabase
              .from('profiles')
              .select('name, avatar_url')
              .eq('user_id', otherPartyId)
              .single();

            return {
              id: session.id,
              date: new Date(session.session_date),
              startTime: session.start_time,
              endTime: session.end_time,
              status: session.status,
              price: session.price,
              otherPartyName: profileData?.name || 'Usuário',
              otherPartyAvatar: profileData?.avatar_url,
              address: session.address,
            };
          })
        );

        setSessions(formattedSessions);
      } catch (error) {
        console.error('Error fetching sessions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, [user, userRole]);

  const formatSessionDate = (date: Date) => {
    if (isToday(date)) return 'Hoje';
    if (isTomorrow(date)) return 'Amanhã';
    return format(date, "EEE, d 'de' MMM", { locale: ptBR });
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="card-elevated p-4 animate-pulse">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-muted" />
              <div className="flex-1">
                <div className="h-5 w-32 bg-muted rounded mb-2" />
                <div className="h-4 w-24 bg-muted rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="card-elevated p-6 text-center">
        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
          <Calendar className="h-6 w-6 text-muted-foreground" />
        </div>
        <h4 className="font-semibold mb-1">Nenhuma aula agendada</h4>
        <p className="text-sm text-muted-foreground mb-4">
          {userRole === 'professional' 
            ? 'Você não tem aulas marcadas esta semana.'
            : 'Agende sua próxima aula com um profissional!'
          }
        </p>
        {userRole === 'student' && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/explore')}
          >
            Explorar profissionais
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sessions.map((session) => (
        <div 
          key={session.id}
          className="card-elevated p-4 hover:bg-muted/30 transition-colors cursor-pointer"
          onClick={() => navigate(`/chat/${session.id}`)}
        >
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-1 h-14 rounded-full",
              session.status === 'confirmed' ? "bg-success" : "bg-warning"
            )} />
            
            {session.otherPartyAvatar ? (
              <img
                src={session.otherPartyAvatar}
                alt={session.otherPartyName}
                className="w-12 h-12 rounded-xl object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                <User className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h4 className="font-semibold truncate">{session.otherPartyName}</h4>
                <StatusBadge status={session.status as any} />
              </div>
              
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatSessionDate(session.date)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {session.startTime}
                </span>
              </div>
            </div>

            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      ))}
    </div>
  );
}
