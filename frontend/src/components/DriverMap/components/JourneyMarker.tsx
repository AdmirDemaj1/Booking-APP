import React, { memo } from 'react';
import { Marker, InfoWindow } from '@react-google-maps/api';
import { Journey } from '../../../hooks/useJourneys';
import { Driver } from '../../../hooks/useDrivers';

interface JourneyMarkerProps {
  journey: Journey;
  isSelected: boolean;
  drivers: Driver[];
  onClick: () => void;
  onCloseClick: () => void;
}

const JourneyMarker: React.FC<JourneyMarkerProps> = ({
  journey,
  isSelected,
  drivers,
  onClick,
  onCloseClick
}) => {
  // Get coordinates from either pickupLocation or pickupCoordinates
  const lat = journey.pickupLocation?.latitude || journey.pickupCoordinates?.latitude;
  const lng = journey.pickupLocation?.longitude || journey.pickupCoordinates?.longitude;
  
  // Only render marker if coordinates exist
  if (!lat || !lng) return null;

  const assignedDriver = drivers.find(d => d.id === (journey.assignedDriverId || journey.driverId));

  return (
    <>
      <Marker
        position={{ lat, lng }}
        onClick={onClick}
        icon={{
          url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        }}
      />

      {isSelected && (
        <InfoWindow
          position={{ lat, lng }}
          onCloseClick={onCloseClick}
        >
          <div>
            <h3>Journey Details</h3>
            <p>Status: {journey.status}</p>
            {(journey.assignedDriverId || journey.driverId) && (
              <p>Driver: {assignedDriver?.firstName || 'Loading...'}</p>
            )}
          </div>
        </InfoWindow>
      )}
    </>
  );
};

export default memo(JourneyMarker); 