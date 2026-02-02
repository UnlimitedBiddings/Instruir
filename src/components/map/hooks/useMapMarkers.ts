import { useRef, useEffect } from 'react';
import { Instructor, Company } from '@/types';
import { createInstructorMarkerContent, createSchoolMarkerContent, createUserLocationMarker } from '../markerContent';
import { createInstructorInfoWindowContent, createSchoolInfoWindowContent } from '../infoWindowContent';

interface UseMapMarkersProps {
  mapInstance: google.maps.Map | null;
  infoWindow: google.maps.InfoWindow | null;
  isLoaded: boolean;
  instructors: Instructor[];
  schools: Company[];
  selectedInstructorId?: string;
  userLocation: google.maps.LatLngLiteral | null;
  onSelectInstructor?: (instructor: Instructor) => void;
}

export function useMapMarkers({
  mapInstance,
  infoWindow,
  isLoaded,
  instructors,
  schools,
  selectedInstructorId,
  userLocation,
  onSelectInstructor,
}: UseMapMarkersProps) {
  const instructorMarkersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const schoolMarkersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const userMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);

  // Add user location marker
  useEffect(() => {
    if (!isLoaded || !mapInstance || !userLocation) return;

    // Remove existing user marker
    if (userMarkerRef.current) {
      userMarkerRef.current.map = null;
    }

    userMarkerRef.current = new google.maps.marker.AdvancedMarkerElement({
      map: mapInstance,
      position: userLocation,
      content: createUserLocationMarker(),
      title: 'Sua localização',
    });
  }, [isLoaded, mapInstance, userLocation]);

  // Add markers for instructors
  useEffect(() => {
    if (!isLoaded || !mapInstance) return;

    // Clear existing markers
    instructorMarkersRef.current.forEach((marker) => (marker.map = null));
    instructorMarkersRef.current = [];

    instructors.forEach((instructor) => {
      const isSelected = instructor.id === selectedInstructorId;
      const markerContent = createInstructorMarkerContent(instructor, isSelected);

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map: mapInstance,
        position: { lat: instructor.location.lat, lng: instructor.location.lng },
        content: markerContent,
        title: instructor.name,
      });

      marker.addListener('click', () => {
        if (infoWindow && mapInstance) {
          infoWindow.setContent(createInstructorInfoWindowContent(instructor));
          infoWindow.open(mapInstance, marker);
        }
        
        if (onSelectInstructor) {
          onSelectInstructor(instructor);
        }
      });

      instructorMarkersRef.current.push(marker);
    });
  }, [isLoaded, mapInstance, instructors, selectedInstructorId, infoWindow, onSelectInstructor]);

  // Add markers for schools
  useEffect(() => {
    if (!isLoaded || !mapInstance) return;

    // Clear existing school markers
    schoolMarkersRef.current.forEach((marker) => (marker.map = null));
    schoolMarkersRef.current = [];

    schools.forEach((school) => {
      if (!school.location) return;

      const markerContent = createSchoolMarkerContent(school);

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map: mapInstance,
        position: { lat: school.location.lat, lng: school.location.lng },
        content: markerContent,
        title: school.name,
      });

      marker.addListener('click', () => {
        if (infoWindow && mapInstance) {
          infoWindow.setContent(createSchoolInfoWindowContent(school));
          infoWindow.open(mapInstance, marker);
        }
      });

      schoolMarkersRef.current.push(marker);
    });
  }, [isLoaded, mapInstance, schools, infoWindow]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      instructorMarkersRef.current.forEach((marker) => (marker.map = null));
      schoolMarkersRef.current.forEach((marker) => (marker.map = null));
      if (userMarkerRef.current) userMarkerRef.current.map = null;
    };
  }, []);
}
