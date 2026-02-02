import { Star } from 'lucide-react';

export function MapLegend() {
  return (
    <div className="absolute bottom-4 left-4 z-10">
      <div className="bg-card/95 backdrop-blur-xl rounded-xl p-3 shadow-elevated border border-border/50">
        <div className="flex flex-col gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success" />
            <span className="text-muted-foreground">Verificado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent" />
            <span className="text-muted-foreground">Sua localização</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-3 h-3 text-warning" />
            <span className="text-muted-foreground">Avaliação</span>
          </div>
        </div>
      </div>
    </div>
  );
}
