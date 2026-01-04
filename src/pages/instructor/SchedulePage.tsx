import { useState } from 'react';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const mockSchedule = [
  { date: new Date(), time: '09:00', student: 'Maria Silva', status: 'confirmed' },
  { date: new Date(), time: '14:00', student: 'João Santos', status: 'confirmed' },
  { date: addDays(new Date(), 1), time: '10:00', student: 'Ana Costa', status: 'pending' },
  { date: addDays(new Date(), 2), time: '15:00', student: 'Pedro Lima', status: 'confirmed' },
];

export function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const dayLessons = mockSchedule.filter(s => isSameDay(s.date, selectedDate));

  const hasLessons = (date: Date) => 
    mockSchedule.some(s => isSameDay(s.date, date));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 pt-4 pb-4 safe-area-top">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-display text-2xl font-bold">Minha Agenda</h1>
          <Button size="sm" variant="accent">
            <Plus className="h-4 w-4 mr-1" />
            Bloquear
          </Button>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setWeekStart(addDays(weekStart, -7))}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <span className="font-medium">
            {format(weekStart, "MMMM 'de' yyyy", { locale: ptBR })}
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setWeekStart(addDays(weekStart, 7))}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Week Days */}
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day) => {
            const isSelected = isSameDay(day, selectedDate);
            const isToday = isSameDay(day, new Date());
            const hasAppointments = hasLessons(day);

            return (
              <button
                key={day.toISOString()}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  "flex flex-col items-center py-2 rounded-xl transition-all",
                  isSelected 
                    ? "bg-primary text-primary-foreground" 
                    : isToday 
                      ? "bg-accent/10 text-accent"
                      : "hover:bg-muted"
                )}
              >
                <span className="text-xs font-medium uppercase">
                  {format(day, 'EEE', { locale: ptBR })}
                </span>
                <span className={cn(
                  "text-lg font-bold mt-1",
                  isSelected && "text-primary-foreground"
                )}>
                  {format(day, 'd')}
                </span>
                {hasAppointments && (
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full mt-1",
                    isSelected ? "bg-primary-foreground" : "bg-accent"
                  )} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Day Schedule */}
      <div className="p-4">
        <h2 className="font-display font-semibold mb-4">
          {format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
        </h2>

        {dayLessons.length > 0 ? (
          <div className="space-y-3">
            {dayLessons.map((lesson, index) => (
              <div 
                key={index}
                className="card-elevated p-4 flex items-center gap-4 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={cn(
                  "w-1 h-14 rounded-full",
                  lesson.status === 'confirmed' ? "bg-success" : "bg-warning"
                )} />
                <div className="flex-1">
                  <p className="font-semibold">{lesson.student}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{lesson.time}</span>
                    <span className="mx-1">•</span>
                    <span className={cn(
                      lesson.status === 'confirmed' ? "text-success" : "text-warning"
                    )}>
                      {lesson.status === 'confirmed' ? 'Confirmada' : 'Pendente'}
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Detalhes
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-display font-semibold text-lg mb-2">
              Nenhuma aula agendada
            </h3>
            <p className="text-muted-foreground">
              Você está livre neste dia.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
