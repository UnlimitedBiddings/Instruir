/// <reference types="@types/google.maps" />
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import { Instructor } from '@/types';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Locate, Layers } from 'lucide-react';

interface InstructorMapProps {
  instructors: Instructor[];
  onSelectInstructor?: (instructor: Instructor) => void;
  selectedInstructorId?: string;
}

// API Key do Google Maps
const GOOGLE_MAPS_API_KEY = 'AIzaSyA1-NrREEo8bBiDNK_TwpLvTvE9QrDcioo';

// Center of Av. Paulista
const CENTER = { lat: -23.5629, lng: -46.6544 };
const RADIUS_KM = 10;

// Custom map styles for a modern dark look
const mapStyles = [
  { elementType: 'geometry', stylers: [{ color: '#1a1a2e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1a2e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8b8b8b' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2d2d44' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#1a1a2e' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#3d3d5c' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e0e1a' }] },
  { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#1e3a2f' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
];

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
  const [isLocating, setIsLocating] = useState(false);

  const { isLoaded, loadError } = useGoogleMaps(GOOGLE_MAPS_API_KEY);

  const handleCenterMap = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo(CENTER);
      mapInstanceRef.current.setZoom(13);
    }
  };

  const handleLocateUser = () => {
    if (!navigator.geolocation || !mapInstanceRef.current) return;
    
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userPos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        mapInstanceRef.current?.panTo(userPos);
        mapInstanceRef.current?.setZoom(15);
        setIsLocating(false);
      },
      () => setIsLocating(false),
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current || mapInstanceRef.current) return;

    const map = new google.maps.Map(mapRef.current, {
      center: CENTER,
      zoom: 13,
      mapId: 'drivmatch-map',
      disableDefaultUI: true,
      zoomControl: false,
      gestureHandling: 'greedy',
      styles: mapStyles,
    });

    mapInstanceRef.current = map;

    // Add radius circle with gradient effect
    const circle = new google.maps.Circle({
      map,
      center: CENTER,
      radius: RADIUS_KM * 1000,
      fillColor: '#6366f1',
      fillOpacity: 0.06,
      strokeColor: '#6366f1',
      strokeOpacity: 0.25,
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

      // Create custom marker content with modern design
      const markerContent = document.createElement('div');
      markerContent.className = 'instructor-marker-container';
      
      markerContent.innerHTML = `
        <div class="relative group cursor-pointer transition-all duration-300 ${isSelected ? 'scale-110' : 'hover:scale-105'}">
          <div class="absolute -inset-2 bg-gradient-to-r from-primary/40 to-primary/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity ${isSelected ? 'opacity-100' : ''}" style="animation: pulse 2s infinite;"></div>
          <div class="relative">
            <div class="w-14 h-14 rounded-full overflow-hidden border-3 shadow-xl ${isSelected ? 'border-primary ring-4 ring-primary/30' : 'border-white/90'}" style="box-shadow: 0 8px 32px rgba(0,0,0,0.4);">
              <img 
                src="${instructor.avatar}" 
                alt="${instructor.name}"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-primary/80 text-white text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap shadow-lg" style="font-size: 11px;">
              R$${instructor.pricePerHour}/h
            </div>
            ${instructor.verified ? `
              <div class="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            ` : ''}
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

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-muted/80 to-muted p-6">
        <div className="bg-card rounded-3xl p-8 text-center max-w-sm shadow-2xl border border-border/50">
          <div className="w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <MapPin className="h-8 w-8 text-destructive" />
          </div>
          <h3 className="font-display font-bold text-xl mb-2">Erro ao carregar mapa</h3>
          <p className="text-sm text-muted-foreground mb-5">
            Verifique sua conexão ou tente novamente mais tarde.
          </p>
          <Button onClick={() => window.location.reload()} className="w-full">
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-b from-muted/50 to-muted">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/30 rounded-full" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <div className="text-center">
            <p className="font-medium text-foreground">Carregando mapa</p>
            <p className="text-sm text-muted-foreground">Preparando visualização...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full overflow-hidden">
      {/* Map Container */}
      <div ref={mapRef} className="absolute inset-0" />
      
      {/* Top Gradient Overlay */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-background/80 via-background/40 to-transparent pointer-events-none" />
      
      {/* Stats Card */}
      <div className="absolute top-4 left-4 right-4">
        <div className="bg-card/90 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">{instructors.length} instrutores</p>
                <p className="text-xs text-muted-foreground">em até {RADIUS_KM}km de você</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-muted-foreground">Ao vivo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
        <Button
          variant="secondary"
          size="icon"
          className="w-11 h-11 rounded-xl bg-card/90 backdrop-blur-xl shadow-xl border border-white/10 hover:bg-card"
          onClick={handleLocateUser}
          disabled={isLocating}
        >
          <Locate className={`h-5 w-5 ${isLocating ? 'animate-pulse text-primary' : ''}`} />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="w-11 h-11 rounded-xl bg-card/90 backdrop-blur-xl shadow-xl border border-white/10 hover:bg-card"
          onClick={handleCenterMap}
        >
          <Navigation className="h-5 w-5" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="w-11 h-11 rounded-xl bg-card/90 backdrop-blur-xl shadow-xl border border-white/10 hover:bg-card"
        >
          <Layers className="h-5 w-5" />
        </Button>
      </div>

      {/* Bottom Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/60 to-transparent pointer-events-none" />
    </div>
  );
}