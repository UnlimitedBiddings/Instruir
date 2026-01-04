import { useState } from 'react';
import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TrendingUp, TrendingDown, DollarSign, Calendar, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const mockEarnings = {
  today: 240,
  week: 1680,
  month: 6420,
  lastMonth: 5890,
  history: [
    { date: new Date(), amount: 240, lessons: 3 },
    { date: subDays(new Date(), 1), amount: 160, lessons: 2 },
    { date: subDays(new Date(), 2), amount: 320, lessons: 4 },
    { date: subDays(new Date(), 3), amount: 80, lessons: 1 },
    { date: subDays(new Date(), 4), amount: 240, lessons: 3 },
    { date: subDays(new Date(), 5), amount: 160, lessons: 2 },
    { date: subDays(new Date(), 6), amount: 320, lessons: 4 },
  ],
};

export function EarningsPage() {
  const [period, setPeriod] = useState<'week' | 'month'>('week');
  
  const growthPercent = ((mockEarnings.month - mockEarnings.lastMonth) / mockEarnings.lastMonth * 100).toFixed(1);
  const isPositiveGrowth = mockEarnings.month >= mockEarnings.lastMonth;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary text-primary-foreground px-4 pt-4 pb-8 safe-area-top">
        <h1 className="font-display text-2xl font-bold mb-6">Financeiro</h1>
        
        {/* Main Balance */}
        <div className="text-center mb-6">
          <p className="text-primary-foreground/70 text-sm mb-1">
            Ganhos este mês
          </p>
          <p className="font-display text-4xl font-bold">
            R$ {mockEarnings.month.toLocaleString('pt-BR')}
          </p>
          <div className={cn(
            "inline-flex items-center gap-1 mt-2 px-2 py-1 rounded-full text-xs font-medium",
            isPositiveGrowth 
              ? "bg-success/20 text-success-foreground" 
              : "bg-destructive/20 text-destructive-foreground"
          )}>
            {isPositiveGrowth ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {isPositiveGrowth ? '+' : ''}{growthPercent}% vs mês anterior
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <p className="text-primary-foreground/70 text-xs">Hoje</p>
            <p className="font-display text-xl font-bold">
              R$ {mockEarnings.today}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <p className="text-primary-foreground/70 text-xs">Esta semana</p>
            <p className="font-display text-xl font-bold">
              R$ {mockEarnings.week.toLocaleString('pt-BR')}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 -mt-4">
        {/* Period Toggle */}
        <div className="card-elevated p-1 flex gap-1 mb-6">
          <Button
            variant={period === 'week' ? 'default' : 'ghost'}
            size="sm"
            className="flex-1"
            onClick={() => setPeriod('week')}
          >
            Semana
          </Button>
          <Button
            variant={period === 'month' ? 'default' : 'ghost'}
            size="sm"
            className="flex-1"
            onClick={() => setPeriod('month')}
          >
            Mês
          </Button>
        </div>

        {/* Chart placeholder */}
        <div className="card-elevated p-4 mb-6">
          <h2 className="font-display font-semibold mb-4">Ganhos da semana</h2>
          <div className="flex items-end justify-between h-32 gap-2">
            {mockEarnings.history.map((day, index) => {
              const maxAmount = Math.max(...mockEarnings.history.map(d => d.amount));
              const height = (day.amount / maxAmount) * 100;
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-1">
                  <div 
                    className="w-full bg-primary/20 rounded-t-md relative overflow-hidden"
                    style={{ height: `${height}%`, minHeight: '8px' }}
                  >
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-md animate-slide-up"
                      style={{ height: '100%', animationDelay: `${index * 100}ms` }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {format(day.date, 'EEE', { locale: ptBR })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Transaction History */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-semibold">Histórico</h2>
            <Button variant="ghost" size="sm">
              Ver tudo
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          <div className="space-y-2">
            {mockEarnings.history.map((day, index) => (
              <div 
                key={index}
                className="card-elevated p-4 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-success" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">
                    {day.lessons} aula{day.lessons !== 1 ? 's' : ''}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(day.date, "d 'de' MMMM", { locale: ptBR })}
                  </p>
                </div>
                <p className="font-display font-bold text-success">
                  +R$ {day.amount}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
