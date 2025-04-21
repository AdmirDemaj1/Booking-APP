import React, { useEffect, useState } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import axios from 'axios';

interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  currentLocation: {
    latitude: number;
    longitude: number;
  };
  driverStatus: string;
}

const mapContainerStyle = {
  width: '100%',
  height: '600px'
};

const center = {
  lat: 41.3275,
  lng: 19.8187
};

const libraries: ["places"] = ['places'];

const DriverMap: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: libraries
  });

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/drivers`);
        console.log('Drivers data:', response.data);
        setDrivers(response.data);
      } catch (error) {
        console.error('Error fetching drivers:', error);
      }
    };

    fetchDrivers();
    // Refresh driver locations every 30 seconds
    const interval = setInterval(fetchDrivers, 30000);
    return () => clearInterval(interval);
  }, []);

  const getDriverIcon = (status: string) => {
    switch (status) {
      case 'available':
        return {
          url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
          scaledSize: new window.google.maps.Size(32, 32)
        };
      case 'on_trip':
        return {
          url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
          scaledSize: new window.google.maps.Size(32, 32)
        };
      case 'break':
        return {
          url: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
          scaledSize: new window.google.maps.Size(32, 32)
        };
      default:
        return {
          url: 'http://maps.google.com/mapfiles/ms/icons/grey-dot.png',
          scaledSize: new window.google.maps.Size(32, 32)
        };
    }
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps...</div>;

  return (
    <div className="driver-map">
      <h2>Active Drivers in Tiranaaa</h2>
      {drivers.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={13}
        >
          {drivers.map((driver) => (
            <Marker
              key={driver.id}
              position={{
                lat: driver.currentLocation.latitude,
                lng: driver.currentLocation.longitude
              }}
              icon={getDriverIcon(driver.driverStatus)}
              onClick={() => setSelectedDriver(driver)}
            />
          ))}
          {selectedDriver && (
            <InfoWindow
              position={{
                lat: selectedDriver.currentLocation.latitude,
                lng: selectedDriver.currentLocation.longitude
              }}
              onCloseClick={() => setSelectedDriver(null)}
            >
              <div>
                <h3>{`${selectedDriver.firstName} ${selectedDriver.lastName}`}</h3>
                <p>Status: {selectedDriver.driverStatus}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      )}
    </div>
  );
};

export default DriverMap; 