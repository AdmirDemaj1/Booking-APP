import React, { memo, useCallback } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import { mapContainerStyle, defaultCenter } from '../../../hooks/useGoogleMaps';
import DriverMarker from './DriverMarker';
import JourneyMarker from './JourneyMarker';
import { Driver } from '../../../hooks/useDrivers';
import { Journey } from '../../../hooks/useJourneys';

interface GoogleMapContainerProps {
  onLoad: (map: google.maps.Map) => void;
  onUnmount: () => void;
  handleMapClick: (event: google.maps.MapMouseEvent) => void;
  drivers: Driver[];
  selectedDriver: Driver | null;
  setSelectedDriver: (driver: Driver | null) => void;
  journeys: Journey[];
  selectedJourney: Journey | null;
  setSelectedJourney: (journey: Journey | null) => void;
}

const GoogleMapContainer: React.FC<GoogleMapContainerProps> = ({
  onLoad,
  onUnmount,
  handleMapClick,
  drivers,
  selectedDriver,
  setSelectedDriver,
  journeys,
  selectedJourney,
  setSelectedJourney
}) => {
  const handleDriverClick = useCallback((driver: Driver) => {
    setSelectedDriver(driver);
  }, [setSelectedDriver]);

  const handleJourneyClick = useCallback((journey: Journey) => {
    setSelectedJourney(journey);
  }, [setSelectedJourney]);

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={defaultCenter}
      zoom={13}
      onLoad={onLoad}
      onUnmount={onUnmount}
      onClick={handleMapClick}
    >
      {/* Display Drivers */}
      {drivers.map((driver) => (
        <DriverMarker
          key={driver.id}
          driver={driver}
          isSelected={selectedDriver?.id === driver.id}
          onClick={() => handleDriverClick(driver)}
          onCloseClick={() => setSelectedDriver(null)}
        />
      ))}

      {/* Display Journeys */}
      {journeys.map((journey) => (
        <JourneyMarker
          key={journey.id}
          journey={journey}
          isSelected={selectedJourney?.id === journey.id}
          drivers={drivers}
          onClick={() => handleJourneyClick(journey)}
          onCloseClick={() => setSelectedJourney(null)}
        />
      ))}
    </GoogleMap>
  );
};

export default memo(GoogleMapContainer); 