import { useState, useEffect } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

export function useGoogleMaps(apiKey: string | null) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);

  useEffect(() => {
    if (!apiKey) {
      setIsLoaded(false);
      return;
    }

    const loader = new Loader({
      apiKey,
      version: 'weekly',
      libraries: ['places', 'geometry', 'marker'],
    });

    loader
      .load()
      .then(() => {
        setIsLoaded(true);
        setLoadError(null);
      })
      .catch((error) => {
        setLoadError(error);
        setIsLoaded(false);
      });
  }, [apiKey]);

  return { isLoaded, loadError };
}