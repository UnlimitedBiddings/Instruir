/// <reference types="@types/google.maps" />
import { useState, useMemo, useEffect } from 'react';
import { Instructor, Company } from '@/types';
import { useMapInstance } from './hooks/useMapInstance';
import { useMapMarkers } from './hooks/useMapMarkers';
import { MapControls } from './MapControls';
import { MapHeader } from './MapHeader';
import { MapLegend } from './MapLegend';
import { MapLoadingState, MapErrorState } from './MapLoadingState';
import { RADIUS_KM } from './constants';

interface InstructorMapProps {
  instructors: Instructor[];
  schools?: Company[];
  onSelectInstructor?: (instructor: Instructor) => void;
  selectedInstructorId?: string;
}

type PriceFilter = 'all' | 'low' | 'medium' | 'high';

export function InstructorMap({ 
  instructors, 
  schools = [],
  onSelectInstructor,
  selectedInstructorId 
}: InstructorMapProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [priceFilter, setPriceFilter] = useState<PriceFilter>('all');

  const {
    mapRef,
    mapInstanceRef,
    infoWindowRef,
    isLoaded,
    loadError,
    isLocating,
    userLocation,
    handleZoomIn,
    handleZoomOut,
    handleCenterMap,
    handleLocateUser,
  } = useMapInstance();

  const filteredByPrice = useMemo(() => {
    return instructors.filter(instructor => {
      if (priceFilter === 'all') return true;
      if (priceFilter === 'low') return instructor.pricePerHour <= 75;
      if (priceFilter === 'medium') return instructor.pricePerHour > 75 && instructor.pricePerHour <= 85;
      return instructor.pricePerHour > 85;
    });
  }, [instructors, priceFilter]);

  // Use map markers hook
  useMapMarkers({
    mapInstance: mapInstanceRef.current,
    infoWindow: infoWindowRef.current,
    isLoaded,
    instructors: filteredByPrice,
    schools,
    selectedInstructorId,
    userLocation,
    onSelectInstructor,
  });

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
    return <MapErrorState />;
  }

  if (!isLoaded) {
    return <MapLoadingState />;
  }

  return (
    <div className="relative h-full overflow-hidden">
      {/* Map Container */}
      <div ref={mapRef} className="absolute inset-0" />
      
      {/* Top Gradient */}
      <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-background via-background/60 to-transparent pointer-events-none" />
      
      {/* Stats Header */}
      <MapHeader
        instructorCount={filteredByPrice.length}
        radiusKm={RADIUS_KM}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        priceFilter={priceFilter}
        onPriceFilterChange={setPriceFilter}
      />

      {/* Map Controls - Right Side */}
      <MapControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onLocate={handleLocateUser}
        onCenter={handleCenterMap}
        isLocating={isLocating}
      />

      {/* Legend - Bottom Left */}
      <MapLegend />

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-background via-background/70 to-transparent pointer-events-none" />
    </div>
  );
}
