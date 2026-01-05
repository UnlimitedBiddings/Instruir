/// <reference types="@types/google.maps" />
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import { Instructor } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Key, MapPin, AlertCircle } from 'lucide-react';

interface InstructorMapProps {
  instructors: Instructor[];
  onSelectInstructor?: (instructor: Instructor) => void;
  selectedInstructorId?: string;
}

// Center of Av. Paulista
const CENTER = { lat: -23.5629, lng: -46.6544 };
const RADIUS_KM = 10;

export function InstructorMap({ 
  instructors, 
  onSelectInstructor,
  selectedInstructorId 
}: InstructorMapProps) {
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const circleRef = useRef<google.maps.Circle | null>(null);

  const [apiKey, setApiKey] = useState(() => 
    localStorage.getItem('GOOGLE_MAPS_API_KEY') || ''
  );
  const [inputKey, setInputKey] = useState(apiKey);
  const [showKeyInput, setShowKeyInput] = useState(!apiKey);

  const { isLoaded, loadError } = useGoogleMaps(apiKey || null);

  const handleSaveApiKey = () => {
    localStorage.setItem('GOOGLE_MAPS_API_KEY', inputKey);
    setApiKey(inputKey);
    setShowKeyInput(false);
  };

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current || mapInstanceRef.current) return;

    const map = new google.maps.Map(mapRef.current, {
      center: CENTER,
      zoom: 13,
      mapId: 'drivmatch-map',
      disableDefaultUI: true,
      zoomControl: true,
      gestureHandling: 'greedy',
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }],
        },
      ],
    });

    mapInstanceRef.current = map;

    // Add 10km radius circle
    const circle = new google.maps.Circle({
      map,
      center: CENTER,
      radius: RADIUS_KM * 1000,
      fillColor: 'hsl(var(--primary))',
      fillOpacity: 0.08,
      strokeColor: 'hsl(var(--primary))',
      strokeOpacity: 0.3,
      strokeWeight: 2,
    });

    circleRef.current = circle;

    return () => {
      markersRef.current.forEach((marker) => (marker.map = null));
      markersRef.current = [];
      if (circleRef.current) circleRef.current.setMap(null);
      mapInstanceRef.current = null;
    };
  }, [isLoaded]);

  // Add markers for instructors
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => (marker.map = null));
    markersRef.current = [];

    instructors.forEach((instructor) => {
      const isSelected = instructor.id === selectedInstructorId;

      // Create custom marker content
      const markerContent = document.createElement('div');
      markerContent.className = `
        flex flex-col items-center cursor-pointer transition-transform
        ${isSelected ? 'scale-110 z-10' : 'hover:scale-105'}
      `;
      
      markerContent.innerHTML = `
        <div class="relative">
          <img 
            src="${instructor.avatar}" 
            alt="${instructor.name}"
            class="w-12 h-12 rounded-full border-3 object-cover shadow-lg
              ${isSelected ? 'border-primary ring-2 ring-primary/30' : 'border-white'}"
          />
          <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 
            bg-primary text-primary-foreground text-xs font-bold 
            px-1.5 py-0.5 rounded-full whitespace-nowrap shadow">
            R$${instructor.pricePerHour}
          </div>
        </div>
      `;

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map: mapInstanceRef.current!,
        position: { lat: instructor.location.lat, lng: instructor.location.lng },
        content: markerContent,
        title: instructor.name,
      });

      marker.addListener('click', () => {
        if (onSelectInstructor) {
          onSelectInstructor(instructor);
        } else {
          navigate(`/instructor/${instructor.id}`);
        }
      });

      markersRef.current.push(marker);
    });
  }, [isLoaded, instructors, selectedInstructorId, onSelectInstructor, navigate]);

  // Pan to selected instructor
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedInstructorId) return;

    const instructor = instructors.find((i) => i.id === selectedInstructorId);
    if (instructor) {
      mapInstanceRef.current.panTo({
        lat: instructor.location.lat,
        lng: instructor.location.lng,
      });
    }
  }, [selectedInstructorId, instructors]);

  if (showKeyInput || !apiKey) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-muted/50 p-6">
        <div className="bg-card rounded-2xl p-6 shadow-lg max-w-md w-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Key className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-display font-semibold">Chave do Google Maps</h3>
              <p className="text-sm text-muted-foreground">
                Insira sua API key para visualizar o mapa
              </p>
            </div>
          </div>
          
          <Input
            type="password"
            placeholder="AIzaSy..."
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            className="mb-3"
          />
          
          <Button 
            onClick={handleSaveApiKey} 
            className="w-full"
            disabled={!inputKey.trim()}
          >
            Salvar e carregar mapa
          </Button>

          <p className="text-xs text-muted-foreground mt-4 text-center">
            Obtenha sua chave em{' '}
            <a 
              href="https://console.cloud.google.com/google/maps-apis" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google Cloud Console
            </a>
          </p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-muted/50 p-6">
        <div className="bg-destructive/10 rounded-2xl p-6 text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="font-display font-semibold mb-2">Erro ao carregar mapa</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Verifique se a chave API está correta e se a API Maps JavaScript está ativada.
          </p>
          <Button 
            variant="outline" 
            onClick={() => {
              setShowKeyInput(true);
              setInputKey('');
            }}
          >
            Inserir nova chave
          </Button>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full bg-muted/50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Carregando mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      <div ref={mapRef} className="absolute inset-0" />
      
      {/* Legend */}
      <div className="absolute top-4 left-4 bg-card/95 backdrop-blur rounded-xl p-3 shadow-lg">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="text-muted-foreground">
            {instructors.length} instrutores em {RADIUS_KM}km
          </span>
        </div>
      </div>

      {/* Change API Key button */}
      <Button
        variant="outline"
        size="sm"
        className="absolute top-4 right-4 bg-card/95 backdrop-blur"
        onClick={() => setShowKeyInput(true)}
      >
        <Key className="h-4 w-4 mr-1" />
        Alterar chave
      </Button>
    </div>
  );
}