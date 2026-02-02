// Main component
export { InstructorMap } from './InstructorMap';

// Sub-components
export { MapControls } from './MapControls';
export { MapHeader } from './MapHeader';
export { MapLegend } from './MapLegend';
export { MapLoadingState, MapErrorState } from './MapLoadingState';

// Hooks
export { useMapInstance } from './hooks/useMapInstance';
export { useMapMarkers } from './hooks/useMapMarkers';

// Utils
export { createInstructorMarkerContent, createSchoolMarkerContent, createUserLocationMarker } from './markerContent';
export { createInstructorInfoWindowContent, createSchoolInfoWindowContent } from './infoWindowContent';

// Constants
export { GOOGLE_MAPS_API_KEY, CENTER, RADIUS_KM, mapStyles } from './constants';
