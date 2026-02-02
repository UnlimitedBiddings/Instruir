import { Button } from '@/components/ui/button';
import { MapPin, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

type PriceFilter = 'all' | 'low' | 'medium' | 'high';

interface MapHeaderProps {
  instructorCount: number;
  radiusKm: number;
  showFilters: boolean;
  onToggleFilters: () => void;
  priceFilter: PriceFilter;
  onPriceFilterChange: (filter: PriceFilter) => void;
}

const PRICE_FILTERS: { key: PriceFilter; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'low', label: 'Até R$75' },
  { key: 'medium', label: 'R$76-85' },
  { key: 'high', label: 'R$86+' },
];

export function MapHeader({
  instructorCount,
  radiusKm,
  showFilters,
  onToggleFilters,
  priceFilter,
  onPriceFilterChange,
}: MapHeaderProps) {
  return (
    <div className="absolute top-4 left-4 right-4 z-10">
      <div className="bg-card/95 backdrop-blur-xl rounded-2xl p-4 shadow-elevated border border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-accent/10 rounded-xl flex items-center justify-center">
              <MapPin className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm font-semibold">{instructorCount} instrutores</p>
              <p className="text-xs text-muted-foreground">em até {radiusKm}km de você</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-success/10 rounded-full">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span className="text-xs font-medium text-success">Ao vivo</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-xl"
              onClick={onToggleFilters}
            >
              <Filter className={cn("h-4 w-4", showFilters && "text-accent")} />
            </Button>
          </div>
        </div>
        
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-border/50 animate-fade-in">
            <p className="text-xs text-muted-foreground mb-2">Filtrar por preço</p>
            <div className="flex gap-2 flex-wrap">
              {PRICE_FILTERS.map((filter) => (
                <Button
                  key={filter.key}
                  variant={priceFilter === filter.key ? 'default' : 'secondary'}
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => onPriceFilterChange(filter.key)}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
