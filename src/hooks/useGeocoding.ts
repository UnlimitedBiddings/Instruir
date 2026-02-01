import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface GeocodingResult {
  latitude: number;
  longitude: number;
  label: string;
  name: string;
  street: string | null;
  number: string | null;
  neighbourhood: string | null;
  locality: string | null;
  region: string | null;
  country: string | null;
}

export function useGeocoding() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const geocodeAddress = useCallback(async (address: string): Promise<GeocodingResult[] | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('geocode', {
        body: { address },
      });

      if (fnError) throw fnError;

      if (data?.data && Array.isArray(data.data)) {
        return data.data.map((item: any) => ({
          latitude: item.latitude,
          longitude: item.longitude,
          label: item.label,
          name: item.name,
          street: item.street,
          number: item.number,
          neighbourhood: item.neighbourhood,
          locality: item.locality,
          region: item.region,
          country: item.country,
        }));
      }

      return null;
    } catch (err: any) {
      setError(err.message || 'Erro ao geocodificar endereço');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reverseGeocode = useCallback(async (lat: number, lon: number): Promise<GeocodingResult | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('geocode', {
        body: { lat, lon },
      });

      if (fnError) throw fnError;

      if (data?.data && data.data.length > 0) {
        const item = data.data[0];
        return {
          latitude: item.latitude,
          longitude: item.longitude,
          label: item.label,
          name: item.name,
          street: item.street,
          number: item.number,
          neighbourhood: item.neighbourhood,
          locality: item.locality,
          region: item.region,
          country: item.country,
        };
      }

      return null;
    } catch (err: any) {
      setError(err.message || 'Erro ao reverter geocodificação');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    geocodeAddress,
    reverseGeocode,
    isLoading,
    error,
  };
}
