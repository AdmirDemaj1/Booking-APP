import { useState, useCallback } from 'react';
import { useLoadScript } from '@react-google-maps/api';

export const libraries: ["places"] = ["places"];

export const mapContainerStyle = {
  width: '100vw',
  height: '90vh',
  position: 'absolute' as const,
  left: 0,
  right: 0
};

export const defaultCenter = {
  lat: 41.3275,
  lng: 19.8187
};

export const useGoogleMaps = () => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    console.log("Map loaded");
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  return {
    map,
    isLoaded,
    loadError,
    onLoad,
    onUnmount
  };
}; 