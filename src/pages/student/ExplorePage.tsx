import { useState } from 'react';
import { Search, MapPin, SlidersHorizontal, List, Map } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { InstructorCard } from '@/components/instructor/InstructorCard';
import { mockInstructors } from '@/data/mockData';
import { cn } from '@/lib/utils';

export function ExplorePage() {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredInstructors = mockInstructors.filter(instructor =>
    instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    instructor.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    instructor.serviceZones.some(zone => zone.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 pt-4 pb-4 safe-area-top">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-5 w-5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Sua localização</p>
            <p className="text-sm font-medium">Av. Paulista, São Paulo</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar instrutor ou região..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 h-12 bg-muted/50"
            />
          </div>
          <Button variant="outline" size="icon" className="h-12 w-12">
            <SlidersHorizontal className="h-5 w-5" />
          </Button>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2 mt-4">
          <Button
            variant={viewMode === 'list' ? 'default' : 'secondary'}
            size="sm"
            className="flex-1"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4 mr-2" />
            Lista
          </Button>
          <Button
            variant={viewMode === 'map' ? 'default' : 'secondary'}
            size="sm"
            className="flex-1"
            onClick={() => setViewMode('map')}
          >
            <Map className="h-4 w-4 mr-2" />
            Mapa
          </Button>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'list' ? (
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-lg">
              Instrutores próximos
            </h2>
            <span className="text-sm text-muted-foreground">
              {filteredInstructors.length} encontrados
            </span>
          </div>

          <div className="space-y-3">
            {filteredInstructors.map((instructor, index) => (
              <div
                key={instructor.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <InstructorCard instructor={instructor} />
              </div>
            ))}
          </div>

          {filteredInstructors.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">
                Nenhum instrutor encontrado
              </h3>
              <p className="text-muted-foreground">
                Tente buscar por outra região ou nome.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="relative h-[calc(100vh-220px)]">
          {/* Map placeholder */}
          <div className="absolute inset-0 bg-muted flex items-center justify-center">
            <div className="text-center">
              <Map className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Mapa será integrado com Google Maps
              </p>
            </div>
          </div>

          {/* Floating Cards */}
          <div className="absolute bottom-4 left-0 right-0 px-4">
            <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
              {filteredInstructors.slice(0, 3).map((instructor) => (
                <div key={instructor.id} className="flex-shrink-0 w-72">
                  <InstructorCard instructor={instructor} compact />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
