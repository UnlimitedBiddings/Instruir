import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Clock, MapPin, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { mockLessons } from '@/data/mockData';
import { Lesson } from '@/types';
import { cn } from '@/lib/utils';

export function LessonsPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');

  const upcomingLessons = mockLessons.filter(
    l => l.status === 'pending' || l.status === 'confirmed'
  );
  const historyLessons = mockLessons.filter(
    l => l.status === 'completed' || l.status === 'cancelled'
  );

  const lessons = activeTab === 'upcoming' ? upcomingLessons : historyLessons;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 pt-4 pb-4 safe-area-top">
        <h1 className="font-display text-2xl font-bold mb-4">Minhas Aulas</h1>
        
        {/* Tabs */}
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'upcoming' ? 'default' : 'secondary'}
            size="sm"
            className="flex-1"
            onClick={() => setActiveTab('upcoming')}
          >
            Próximas ({upcomingLessons.length})
          </Button>
          <Button
            variant={activeTab === 'history' ? 'default' : 'secondary'}
            size="sm"
            className="flex-1"
            onClick={() => setActiveTab('history')}
          >
            Histórico ({historyLessons.length})
          </Button>
        </div>
      </div>

      {/* Lessons List */}
      <div className="p-4 space-y-4">
        {lessons.map((lesson, index) => (
          <LessonCard 
            key={lesson.id} 
            lesson={lesson} 
            style={{ animationDelay: `${index * 100}ms` }}
          />
        ))}

        {lessons.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-display font-semibold text-lg mb-2">
              {activeTab === 'upcoming' 
                ? 'Nenhuma aula agendada'
                : 'Nenhuma aula no histórico'
              }
            </h3>
            <p className="text-muted-foreground mb-4">
              {activeTab === 'upcoming' 
                ? 'Explore instrutores e agende sua primeira aula!'
                : 'Suas aulas concluídas aparecerão aqui.'
              }
            </p>
            {activeTab === 'upcoming' && (
              <Button variant="accent">
                Explorar instrutores
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface LessonCardProps {
  lesson: Lesson;
  style?: React.CSSProperties;
}

function LessonCard({ lesson, style }: LessonCardProps) {
  return (
    <div 
      className="card-elevated p-4 animate-slide-up"
      style={style}
    >
      <div className="flex items-start gap-4">
        <img
          src={lesson.instructor?.avatar}
          alt={lesson.instructor?.name}
          className="h-14 w-14 rounded-xl object-cover"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="font-display font-semibold truncate">
                {lesson.instructor?.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {lesson.instructor?.vehicle.model}
              </p>
            </div>
            <StatusBadge status={lesson.status} />
          </div>

          <div className="space-y-1.5 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {format(lesson.date, "EEEE, d 'de' MMMM", { locale: ptBR })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{lesson.startTime} - {lesson.endTime}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="truncate">{lesson.location.address}</span>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            {(lesson.status === 'pending' || lesson.status === 'confirmed') && (
              <>
                <Button variant="outline" size="sm" className="flex-1">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Chat
                </Button>
                <Button variant="destructive" size="sm">
                  Cancelar
                </Button>
              </>
            )}
            {lesson.status === 'completed' && !lesson.rating && (
              <Button variant="accent" size="sm" className="w-full">
                Avaliar aula
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
