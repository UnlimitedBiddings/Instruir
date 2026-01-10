/// <reference types="@types/google.maps" />
import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import { Instructor } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Navigation, 
  Locate, 
  ZoomIn, 
  ZoomOut,
  Filter,
  X,
  Star,
  Car,
  Shield,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface InstructorMapProps {
  instructors: Instructor[];
  onSelectInstructor?: (instructor: Instructor) => void;
  selectedInstructorId?: string;
}

const GOOGLE_MAPS_API_KEY = 'AIzaSyA1-NrREEo8bBiDNK_TwpLvTvE9QrDcioo';
const CENTER = { lat: -23.5629, lng: -46.6544 };
const RADIUS_KM = 10;

// Dark theme map styles
const mapStyles: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#0f172a' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0f172a' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#64748b' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1e293b' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#0f172a' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#334155' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#1e293b' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0c1929' }] },
  { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#134e4a' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#334155' }] },
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
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  
  const [isLocating, setIsLocating] = useState(false);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');
  const [showFilters, setShowFilters] = useState(false);
  const [priceFilter, setPriceFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  const { isLoaded, loadError } = useGoogleMaps(GOOGLE_MAPS_API_KEY);

  const filteredByPrice = instructors.filter(instructor => {
    if (priceFilter === 'all') return true;
    if (priceFilter === 'low') return instructor.pricePerHour <= 75;
    if (priceFilter === 'medium') return instructor.pricePerHour > 75 && instructor.pricePerHour <= 85;
    return instructor.pricePerHour > 85;
  });

  const handleZoomIn = useCallback(() => {
    if (mapInstanceRef.current) {
      const currentZoom = mapInstanceRef.current.getZoom() || 13;
      mapInstanceRef.current.setZoom(Math.min(currentZoom + 1, 20));
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (mapInstanceRef.current) {
      const currentZoom = mapInstanceRef.current.getZoom() || 13;
      mapInstanceRef.current.setZoom(Math.max(currentZoom - 1, 10));
    }
  }, []);

  const handleCenterMap = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo(userLocation || CENTER);
      mapInstanceRef.current.setZoom(14);
    }
  }, [userLocation]);

  const handleLocateUser = useCallback(() => {
    if (!navigator.geolocation || !mapInstanceRef.current) return;
    
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userPos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(userPos);
        mapInstanceRef.current?.panTo(userPos);
        mapInstanceRef.current?.setZoom(15);
        setIsLocating(false);
      },
      () => setIsLocating(false),
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }, []);

  const toggleMapType = useCallback(() => {
    if (mapInstanceRef.current) {
      const newType = mapType === 'roadmap' ? 'satellite' : 'roadmap';
      setMapType(newType);
      mapInstanceRef.current.setMapTypeId(newType);
    }
  }, [mapType]);

  const createInfoWindowContent = useCallback((instructor: Instructor): string => {
    const isVerified = instructor.verified?.cnh && instructor.verified?.criminalRecord;
    return `
      <div style="
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        border-radius: 16px;
        padding: 16px;
        min-width: 280px;
        max-width: 320px;
        color: white;
        font-family: 'Inter', sans-serif;
        border: 1px solid rgba(255,255,255,0.1);
      ">
        <div style="display: flex; gap: 12px; align-items: flex-start;">
          <img 
            src="${instructor.avatar}" 
            alt="${instructor.name}"
            style="
              width: 56px;
              height: 56px;
              border-radius: 12px;
              object-fit: cover;
              border: 2px solid #14b8a6;
            "
          />
          <div style="flex: 1; min-width: 0;">
            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
              <span style="font-weight: 700; font-size: 15px; color: white;">${instructor.name}</span>
              ${isVerified ? `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#14b8a6">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              ` : ''}
            </div>
            <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 8px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#fbbf24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span style="color: #fbbf24; font-weight: 600; font-size: 13px;">${instructor.rating}</span>
              <span style="color: #94a3b8; font-size: 12px;">(${instructor.reviewCount} avaliações)</span>
            </div>
            <div style="display: flex; align-items: center; gap: 6px; color: #94a3b8; font-size: 12px;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="1" y="3" width="15" height="13" rx="2"/>
                <path d="m16 8 5 3-5 3V8Z"/>
              </svg>
              <span>${instructor.vehicle?.model || 'Veículo'}</span>
              <span style="margin: 0 4px;">•</span>
              <span>${instructor.vehicle?.transmission === 'automatic' ? 'Automático' : 'Manual'}</span>
            </div>
          </div>
        </div>
        
        <div style="
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid rgba(255,255,255,0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
          <div>
            <span style="font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Preço/hora</span>
            <div style="font-size: 20px; font-weight: 800; color: #14b8a6;">R$ ${instructor.pricePerHour}</div>
          </div>
          <button 
            onclick="window.location.href='/instructor/${instructor.id}'"
            style="
              background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 10px;
              font-weight: 600;
              font-size: 13px;
              cursor: pointer;
              transition: all 0.2s;
            "
          >
            Ver Perfil
          </button>
        </div>
      </div>
    `;
  }, []);

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current || mapInstanceRef.current) return;

    const map = new google.maps.Map(mapRef.current, {
      center: CENTER,
      zoom: 13,
      mapId: 'instruir-map',
      disableDefaultUI: true,
      zoomControl: false,
      gestureHandling: 'greedy',
      styles: mapStyles,
      minZoom: 10,
      maxZoom: 18,
    });

    mapInstanceRef.current = map;

    // Create info window
    infoWindowRef.current = new google.maps.InfoWindow({
      pixelOffset: new google.maps.Size(0, -10),
    });

    // Add radius circle with pulsing effect
    const circle = new google.maps.Circle({
      map,
      center: CENTER,
      radius: RADIUS_KM * 1000,
      fillColor: '#14b8a6',
      fillOpacity: 0.05,
      strokeColor: '#14b8a6',
      strokeOpacity: 0.3,
      strokeWeight: 2,
    });

    circleRef.current = circle;

    // Get user location on load
    handleLocateUser();

    return () => {
      markersRef.current.forEach((marker) => (marker.map = null));
      markersRef.current = [];
      if (circleRef.current) circleRef.current.setMap(null);
      if (infoWindowRef.current) infoWindowRef.current.close();
      mapInstanceRef.current = null;
    };
  }, [isLoaded, handleLocateUser]);

  // Add user location marker
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current || !userLocation) return;

    const userMarkerContent = document.createElement('div');
    userMarkerContent.innerHTML = `
      <div class="relative">
        <div class="absolute -inset-4 bg-accent/20 rounded-full animate-ping"></div>
        <div class="relative w-4 h-4 bg-accent rounded-full border-2 border-white shadow-lg"></div>
      </div>
    `;

    new google.maps.marker.AdvancedMarkerElement({
      map: mapInstanceRef.current,
      position: userLocation,
      content: userMarkerContent,
      title: 'Sua localização',
    });
  }, [isLoaded, userLocation]);

  // Add markers for instructors
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => (marker.map = null));
    markersRef.current = [];

    filteredByPrice.forEach((instructor) => {
      const isSelected = instructor.id === selectedInstructorId;
      const isVerified = instructor.verified?.cnh && instructor.verified?.criminalRecord;

      const markerContent = document.createElement('div');
      markerContent.innerHTML = `
        <div class="relative group cursor-pointer transform transition-all duration-300 ${isSelected ? 'scale-110 z-50' : 'hover:scale-105'}">
          <!-- Glow effect -->
          <div class="absolute -inset-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isSelected ? 'opacity-100' : ''}"
               style="background: radial-gradient(circle, rgba(20, 184, 166, 0.4) 0%, transparent 70%);"></div>
          
          <!-- Main marker -->
          <div class="relative">
            <!-- Avatar container -->
            <div class="relative w-14 h-14 rounded-full overflow-hidden shadow-2xl transition-all duration-300"
                 style="
                   border: 3px solid ${isSelected ? '#14b8a6' : 'rgba(255,255,255,0.9)'};
                   box-shadow: ${isSelected 
                     ? '0 0 0 4px rgba(20, 184, 166, 0.3), 0 8px 32px rgba(0,0,0,0.5)' 
                     : '0 8px 32px rgba(0,0,0,0.4)'};
                 ">
              <img 
                src="${instructor.avatar}" 
                alt="${instructor.name}"
                class="w-full h-full object-cover"
              />
            </div>
            
            <!-- Price badge -->
            <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full text-white font-bold whitespace-nowrap shadow-lg"
                 style="
                   background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
                   font-size: 11px;
                   letter-spacing: 0.3px;
                 ">
              R$${instructor.pricePerHour}
            </div>
            
            <!-- Verified badge -->
            ${isVerified ? `
              <div class="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center shadow-lg"
                   style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); border: 2px solid white;">
                <svg class="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            ` : ''}
            
            <!-- Rating indicator -->
            <div class="absolute -top-1 -left-1 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full shadow-lg"
                 style="background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(255,255,255,0.2);">
              <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="#fbbf24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span class="text-white font-semibold" style="font-size: 9px;">${instructor.rating}</span>
            </div>
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
        if (infoWindowRef.current && mapInstanceRef.current) {
          infoWindowRef.current.setContent(createInfoWindowContent(instructor));
          infoWindowRef.current.open(mapInstanceRef.current, marker);
        }
        
        if (onSelectInstructor) {
          onSelectInstructor(instructor);
        }
      });

      markersRef.current.push(marker);
    });
  }, [isLoaded, filteredByPrice, selectedInstructorId, onSelectInstructor, createInfoWindowContent]);

  // Pan to selected instructor
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedInstructorId) return;

    const instructor = instructors.find((i) => i.id === selectedInstructorId);
    if (instructor) {
      mapInstanceRef.current.panTo({
        lat: instructor.location.lat,
        lng: instructor.location.lng,
      });
      mapInstanceRef.current.setZoom(15);
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
            Verifique sua conexão ou tente novamente.
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

  return (
    <div className="relative h-full overflow-hidden">
      {/* Map Container */}
      <div ref={mapRef} className="absolute inset-0" />
      
      {/* Top Gradient */}
      <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-background via-background/60 to-transparent pointer-events-none" />
      
      {/* Stats Header */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="bg-card/95 backdrop-blur-xl rounded-2xl p-4 shadow-elevated border border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-accent/10 rounded-xl flex items-center justify-center">
                <MapPin className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm font-semibold">{filteredByPrice.length} instrutores</p>
                <p className="text-xs text-muted-foreground">em até {RADIUS_KM}km de você</p>
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
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className={cn("h-4 w-4", showFilters && "text-accent")} />
              </Button>
            </div>
          </div>
          
          {/* Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-border/50 animate-fade-in">
              <p className="text-xs text-muted-foreground mb-2">Filtrar por preço</p>
              <div className="flex gap-2 flex-wrap">
                {[
                  { key: 'all', label: 'Todos' },
                  { key: 'low', label: 'Até R$75' },
                  { key: 'medium', label: 'R$76-85' },
                  { key: 'high', label: 'R$86+' },
                ].map((filter) => (
                  <Button
                    key={filter.key}
                    variant={priceFilter === filter.key ? 'default' : 'secondary'}
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => setPriceFilter(filter.key as typeof priceFilter)}
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Map Controls - Right Side */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10">
        <Button
          variant="secondary"
          size="icon"
          className="w-11 h-11 rounded-xl bg-card/95 backdrop-blur-xl shadow-elevated border border-border/50 hover:bg-card"
          onClick={handleZoomIn}
        >
          <ZoomIn className="h-5 w-5" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="w-11 h-11 rounded-xl bg-card/95 backdrop-blur-xl shadow-elevated border border-border/50 hover:bg-card"
          onClick={handleZoomOut}
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
          onClick={handleLocateUser}
          disabled={isLocating}
        >
          <Locate className={cn("h-5 w-5", isLocating && "animate-pulse")} />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="w-11 h-11 rounded-xl bg-card/95 backdrop-blur-xl shadow-elevated border border-border/50 hover:bg-card"
          onClick={handleCenterMap}
        >
          <Navigation className="h-5 w-5" />
        </Button>
      </div>

      {/* Legend - Bottom Left */}
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

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-background via-background/70 to-transparent pointer-events-none" />
    </div>
  );
}
