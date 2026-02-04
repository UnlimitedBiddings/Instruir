import { useState } from 'react';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Clock, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TimeSlot {
  time: string;
  available: boolean;
}

interface InstructorScheduleViewProps {
  instructorId: string;
  instructorName: string;
  pricePerHour: number;
  onSelectSlot?: (date: Date, time: string) => void;
}

export function InstructorScheduleView({ 
  instructorId, 
  instructorName,
  pricePerHour,
  onSelectSlot 
}: InstructorScheduleViewProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Mock available slots
  const mockSlots: TimeSlot[] = [
    { time: '08:00', available: true },
    { time: '09:00', available: false },
    { time: '10:00', available: true },
    { time: '11:00', available: true },
    { time: '14:00', available: true },
    { time: '15:00', available: false },
    { time: '16:00', available: true },
    { time: '17:00', available: true },
  ];

  const handleSlotSelect = (time: string) => {
    setSelectedSlot(time);
    onSelectSlot?.(selectedDate, time);
  };

  const availableCount = mockSlots.filter(s => s.available).length;

  return (
    <div className="card-elevated overflow-hidden">
      {/* Header */}
      <div className="bg-primary/5 px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-semibold">Agenda de {instructorName.split(' ')[0]}</h3>
            <p className="text-sm text-muted-foreground">{availableCount} horários disponíveis</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Por aula</p>
            <p className="font-display font-bold text-primary">R$ {pricePerHour}</p>
          </div>
        </div>
      </div>

      {/* Week Navigation */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setWeekStart(addDays(weekStart, -7))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            {format(weekStart, "MMM 'de' yyyy", { locale: ptBR })}
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setWeekStart(addDays(weekStart, 7))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Week Days */}
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day) => {
            const isSelected = isSameDay(day, selectedDate);
            const isToday = isSameDay(day, new Date());
            const isPast = day < new Date() && !isToday;

            return (
              <button
                key={day.toISOString()}
                onClick={() => !isPast && setSelectedDate(day)}
                disabled={isPast}
                className={cn(
                  "flex flex-col items-center py-2 rounded-lg transition-all text-center",
                  isSelected 
                    ? "bg-primary text-primary-foreground" 
                    : isToday 
                      ? "bg-accent/10 text-accent"
                      : isPast
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:bg-muted"
                )}
              >
                <span className="text-[10px] font-medium uppercase">
                  {format(day, 'EEE', { locale: ptBR })}
                </span>
                <span className={cn(
                  "text-sm font-bold mt-0.5",
                  isSelected && "text-primary-foreground"
                )}>
                  {format(day, 'd')}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slots */}
      <div className="p-4">
        <p className="text-sm text-muted-foreground mb-3">
          {format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
        </p>
        <div className="grid grid-cols-4 gap-2">
          {mockSlots.map((slot) => (
            <button
              key={slot.time}
              onClick={() => slot.available && handleSlotSelect(slot.time)}
              disabled={!slot.available}
              className={cn(
                "py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1",
                slot.available
                  ? selectedSlot === slot.time
                    ? "bg-primary text-primary-foreground"
                    : "bg-success/10 text-success hover:bg-success/20 border border-success/30"
                  : "bg-muted text-muted-foreground line-through cursor-not-allowed"
              )}
            >
              <Clock className="h-3 w-3" />
              {slot.time}
              {selectedSlot === slot.time && <Check className="h-3 w-3 ml-1" />}
            </button>
          ))}
        </div>
      </div>

      {/* Book Button */}
      {selectedSlot && (
        <div className="p-4 pt-0">
          <Button className="w-full" variant="hero">
            Confirmar agendamento às {selectedSlot}
          </Button>
        </div>
      )}
    </div>
  );
}
