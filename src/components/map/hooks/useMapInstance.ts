import { useRef, useEffect, useCallback, useState } from 'react';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import { GOOGLE_MAPS_API_KEY, CENTER, RADIUS_KM } from '../constants';

export function useMapInstance() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const circleRef = useRef<google.maps.Circle | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  
  const [isLocating, setIsLocating] = useState(false);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');

  const { isLoaded, loadError } = useGoogleMaps(GOOGLE_MAPS_API_KEY);

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
      if (circleRef.current) circleRef.current.setMap(null);
      if (infoWindowRef.current) infoWindowRef.current.close();
      mapInstanceRef.current = null;
    };
  }, [isLoaded, handleLocateUser]);

  return {
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
    toggleMapType,
  };
}
