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

interface Journey {
  id: string;
  pickupLocation: {
    latitude: number;
    longitude: number;
  };
  status: 'pending' | 'assigned' | 'completed';
  assignedDriverId?: string;
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
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [selectedJourney, setSelectedJourney] = useState<Journey | null>(null);
  const [isAddingJourney, setIsAddingJourney] = useState(false);
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

  useEffect(() => {
    const fetchJourneys = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/journeys`);
        setJourneys(response.data);
      } catch (error) {
        console.error('Error fetching journeys:', error);
      }
    };

    fetchJourneys();
    const interval = setInterval(fetchJourneys, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleMapClick = async (event: google.maps.MapMouseEvent) => {
    if (!isAddingJourney || !event.latLng) return;

    try {
      const newJourney = {
        pickupLocation: {
          latitude: event.latLng.lat(),
          longitude: event.latLng.lng()
        }
      };

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/journeys`, newJourney);
      setJourneys(prev => [...prev, response.data]);
      setIsAddingJourney(false);
    } catch (error) {
      console.error('Error creating journey:', error);
      setError('Failed to create journey');
    }
  };

  console.log("drivers", drivers);

  if (loadError) return <div>Error loading Google Maps: {loadError.message}</div>;
  if (!isLoaded) return <div>Loading maps...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="driver-map">
      <div className="map-controls" style={{ marginBottom: '10px' }}>
        <button 
          onClick={() => setIsAddingJourney(!isAddingJourney)}
          style={{
            padding: '8px 16px',
            backgroundColor: isAddingJourney ? '#ff4444' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {isAddingJourney ? 'Cancel Journey' : 'Add New Journey'}
        </button>
        {isAddingJourney && (
          <p style={{ margin: '10px 0', color: '#666' }}>
            Click on the map to set pickup location
          </p>
        )}
      </div>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={13}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={handleMapClick}
      >
        {/* Display Drivers */}
        {drivers.map((driver) => (
          <Marker
            key={driver.id}
            position={{
              lat: driver.currentLocation.latitude,
              lng: driver.currentLocation.longitude
            }}
            onClick={() => setSelectedDriver(driver)}
            icon={{
              url: driver.driverStatus === 'on_trip'
                ? 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                : driver.driverStatus === 'available'
                ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                : driver.driverStatus === 'break'
                ? 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
                : 'http://maps.google.com/mapfiles/ms/icons/grey-dot.png'
            }}
          />
        ))}

        {/* Display Journeys */}
        {journeys.map((journey) => (
          <Marker
            key={journey.id}
            position={{
              lat: journey.pickupLocation.latitude,
              lng: journey.pickupLocation.longitude
            }}
            onClick={() => setSelectedJourney(journey)}
            icon={{
              url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
            }}
          />
        ))}

        {/* Driver Info Window */}
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

        {/* Journey Info Window */}
        {selectedJourney && (
          <InfoWindow
            position={{
              lat: selectedJourney.pickupLocation.latitude,
              lng: selectedJourney.pickupLocation.longitude
            }}
            onCloseClick={() => setSelectedJourney(null)}
          >
            <div>
              <h3>Journey Details</h3>
              <p>Status: {selectedJourney.status}</p>
              {selectedJourney.assignedDriverId && (
                <p>Driver: {
                  drivers.find(d => d.id === selectedJourney.assignedDriverId)?.firstName || 'Loading...'
                }</p>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default DriverMap; 