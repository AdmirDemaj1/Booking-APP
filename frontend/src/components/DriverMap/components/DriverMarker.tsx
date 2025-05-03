import React, { memo } from 'react';
import { Marker, InfoWindow } from '@react-google-maps/api';
import { Driver } from '../../../hooks/useDrivers';

interface DriverMarkerProps {
  driver: Driver;
  isSelected: boolean;
  onClick: () => void;
  onCloseClick: () => void;
}

const getMarkerIcon = (status: string) => {
  switch (status) {
    case 'on_trip':
      return 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
    case 'available':
      return 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
    case 'break':
      return 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
    default:
      return 'http://maps.google.com/mapfiles/ms/icons/grey-dot.png';
  }
};

const DriverMarker: React.FC<DriverMarkerProps> = ({ 
  driver, 
  isSelected, 
  onClick, 
  onCloseClick 
}) => {
  return (
    <>
      <Marker
        position={{
          lat: driver.currentLocation.latitude,
          lng: driver.currentLocation.longitude
        }}
        onClick={onClick}
        icon={{
          url: getMarkerIcon(driver.driverStatus)
        }}
      />

      {isSelected && (
        <InfoWindow
          position={{
            lat: driver.currentLocation.latitude,
            lng: driver.currentLocation.longitude
          }}
          onCloseClick={onCloseClick}
        >
          <div>
            <h3>{`${driver.firstName} ${driver.lastName}`}</h3>
            <p>Status: {driver.driverStatus}</p>
          </div>
        </InfoWindow>
      )}
    </>
  );
};

export default memo(DriverMarker); 