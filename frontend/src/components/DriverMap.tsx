import React, { useEffect, useState, useCallback } from 'react';
import { GoogleMap, useLoadScript, InfoWindow, Marker } from '@react-google-maps/api';
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

const libraries: ["places"] = ["places"];

const DriverMap: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/drivers`);
        console.log('Fetched drivers:', response.data);
        setDrivers(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching drivers:', error);
        setError('Failed to fetch drivers data');
      }
    };

    fetchDrivers();
    const interval = setInterval(fetchDrivers, 30000);
    return () => clearInterval(interval);
  }, []);

  console.log("drivers", drivers);

  if (loadError) return <div>Error loading Google Maps: {loadError.message}</div>;
  if (!isLoaded) return <div>Loading maps...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="driver-map">
      <h2>Active Drivers in Tirana</h2>
      {drivers.length === 0 ? (
        <p>Loading drivers...</p>
      ) : (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={13}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          {drivers.map((driver) => (
            <Marker
              key={driver.id}
              position={{
                lat: driver.currentLocation.latitude,
                lng: driver.currentLocation.longitude
              }}
              onClick={() => setSelectedDriver(driver)}
              icon={{
                url: driver.driverStatus === 'available' 
                  ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                  : driver.driverStatus === 'on_trip'
                  ? 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                  : driver.driverStatus === 'break'
                  ? 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
                  : 'http://maps.google.com/mapfiles/ms/icons/grey-dot.png'
              }}
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