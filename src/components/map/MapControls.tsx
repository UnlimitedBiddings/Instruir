import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Locate, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onLocate: () => void;
  onCenter: () => void;
  isLocating: boolean;
}

export function MapControls({
  onZoomIn,
  onZoomOut,
  onLocate,
  onCenter,
  isLocating,
}: MapControlsProps) {
  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10">
      <Button
        variant="secondary"
        size="icon"
        className="w-11 h-11 rounded-xl bg-card/95 backdrop-blur-xl shadow-elevated border border-border/50 hover:bg-card"
        onClick={onZoomIn}
      >
        <ZoomIn className="h-5 w-5" />
      </Button>
      <Button
        variant="secondary"
        size="icon"
        className="w-11 h-11 rounded-xl bg-card/95 backdrop-blur-xl shadow-elevated border border-border/50 hover:bg-card"
        onClick={onZoomOut}
      >
        <ZoomOut className="h-5 w-5" />
      </Button>
      <div className="h-px bg-border/50 my-1" />
      <Button
        variant="secondary"
        size="icon"
        className={cn(
          "w-11 h-11 rounded-xl bg-card/95 backdrop-blur-xl shadow-elevated border border-border/50 hover:bg-card",
          isLocating && "text-accent"
        )}
        onClick={onLocate}
        disabled={isLocating}
      >
        <Locate className={cn("h-5 w-5", isLocating && "animate-pulse")} />
      </Button>
      <Button
        variant="secondary"
        size="icon"
        className="w-11 h-11 rounded-xl bg-card/95 backdrop-blur-xl shadow-elevated border border-border/50 hover:bg-card"
        onClick={onCenter}
      >
        <Navigation className="h-5 w-5" />
      </Button>
    </div>
  );
}
