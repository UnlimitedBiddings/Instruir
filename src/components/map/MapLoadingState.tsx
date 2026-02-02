import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

export function MapLoadingState() {
  return (
    <div className="flex items-center justify-center h-full bg-gradient-to-b from-muted/50 to-muted">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-accent/30 rounded-full" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
        <div className="text-center">
          <p className="font-medium text-foreground">Carregando mapa</p>
          <p className="text-sm text-muted-foreground">Preparando visualização...</p>
        </div>
      </div>
    </div>
  );
}

export function MapErrorState() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-muted/80 to-muted p-6">
      <div className="bg-card rounded-3xl p-8 text-center max-w-sm shadow-2xl border border-border/50">
        <div className="w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <MapPin className="h-8 w-8 text-destructive" />
        </div>
        <h3 className="font-display font-bold text-xl mb-2">Erro ao carregar mapa</h3>
        <p className="text-sm text-muted-foreground mb-5">
          Verifique sua conexão ou tente novamente.
        </p>
        <Button onClick={() => window.location.reload()} className="w-full">
          Tentar novamente
        </Button>
      </div>
    </div>
  );
}
