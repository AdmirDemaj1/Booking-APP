import React, { useCallback } from 'react';
import { useGoogleMaps } from '../../hooks/useGoogleMaps';
import { useDrivers } from '../../hooks/useDrivers';
import { useJourneys } from '../../hooks/useJourneys';
import GoogleMapContainer from './components/GoogleMapContainer';
import MapControls from './components/MapControls';
import DriverFormModal from './components/DriverFormModal';

const DriverMapContainer: React.FC = () => {
  const { isLoaded, loadError, onLoad, onUnmount } = useGoogleMaps();
  const { 
    drivers, 
    selectedDriver, 
    setSelectedDriver, 
    isAddingDriver, 
    setIsAddingDriver,
    createDriver,
    pendingDriverLocation,
    setPendingDriverLocation,
    error: driversError 
  } = useDrivers();
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
    if (isAddingDriver) return;
    setIsAddingJourney(!isAddingJourney);
  }, [isAddingJourney, setIsAddingJourney, isAddingDriver]);

  const toggleAddingDriver = useCallback(() => {
    if (isAddingJourney) return;
    setIsAddingDriver(!isAddingDriver);
    // Clear any pending driver location when toggling mode
    if (pendingDriverLocation) {
      setPendingDriverLocation(null);
    }
  }, [isAddingDriver, setIsAddingDriver, isAddingJourney, pendingDriverLocation, setPendingDriverLocation]);

  const handleMapClick = useCallback(
    async (event: google.maps.MapMouseEvent) => {
      if (!event.latLng) return;
      
      const latitude = event.latLng.lat();
      const longitude = event.latLng.lng();
      
      if (isAddingJourney) {
        await createJourney(latitude, longitude);
      } else if (isAddingDriver) {
        // Instead of creating immediately, store the location and show modal
        setPendingDriverLocation({ lat: latitude, lng: longitude });
      }
    },
    [isAddingJourney, isAddingDriver, createJourney, setPendingDriverLocation]
  );

  const handleDriverFormSubmit = useCallback(
    async (firstName: string, lastName: string) => {
      if (pendingDriverLocation) {
        await createDriver(
          pendingDriverLocation.lat, 
          pendingDriverLocation.lng,
          firstName,
          lastName
        );
      }
    },
    [pendingDriverLocation, createDriver]
  );

  const handleModalClose = useCallback(() => {
    setPendingDriverLocation(null);
  }, [setPendingDriverLocation]);

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
        isAddingDriver={isAddingDriver}
        toggleAddingDriver={toggleAddingDriver}
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

      {pendingDriverLocation && (
        <DriverFormModal 
          isOpen={!!pendingDriverLocation} 
          onClose={handleModalClose}
          onSubmit={handleDriverFormSubmit}
          position={pendingDriverLocation}
        />
      )}
    </div>
  );
};

export default DriverMapContainer; 