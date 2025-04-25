import React, { useCallback } from 'react';
import { useGoogleMaps } from '../../hooks/useGoogleMaps';
import { useDrivers } from '../../hooks/useDrivers';
import { useJourneys } from '../../hooks/useJourneys';
import GoogleMapContainer from './components/GoogleMapContainer';
import MapControls from './components/MapControls';

const DriverMapContainer: React.FC = () => {
  const { isLoaded, loadError, onLoad, onUnmount } = useGoogleMaps();
  const { drivers, selectedDriver, setSelectedDriver, error: driversError } = useDrivers();
  const { 
    journeys, 
    selectedJourney, 
    setSelectedJourney, 
    isAddingJourney, 
    setIsAddingJourney, 
    createJourney, 
    error: journeysError 
  } = useJourneys();

  const toggleAddingJourney = useCallback(() => {
    setIsAddingJourney(!isAddingJourney);
  }, [isAddingJourney, setIsAddingJourney]);

  const handleMapClick = useCallback(
    async (event: google.maps.MapMouseEvent) => {
      if (!isAddingJourney || !event.latLng) return;
      
      const latitude = event.latLng.lat();
      const longitude = event.latLng.lng();
      
      await createJourney(latitude, longitude);
    },
    [isAddingJourney, createJourney]
  );

  if (loadError) return <div>Error loading Google Maps: {loadError.message}</div>;
  if (!isLoaded) return <div>Loading maps...</div>;
  if (driversError) return <div>Error: {driversError}</div>;
  if (journeysError) return <div>Error: {journeysError}</div>;

  return (
    <div className="driver-map" style={{ 
      width: '100vw', 
      height: '100vh', 
      margin: 0,
      padding: 0,
      position: 'relative',
      overflow: 'hidden'
    }}>
      <MapControls 
        isAddingJourney={isAddingJourney}
        toggleAddingJourney={toggleAddingJourney}
      />

      <GoogleMapContainer
        onLoad={onLoad}
        onUnmount={onUnmount}
        handleMapClick={handleMapClick}
        drivers={drivers}
        selectedDriver={selectedDriver}
        setSelectedDriver={setSelectedDriver}
        journeys={journeys}
        selectedJourney={selectedJourney}
        setSelectedJourney={setSelectedJourney}
      />
    </div>
  );
};

export default DriverMapContainer; 