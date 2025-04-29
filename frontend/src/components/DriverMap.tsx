import React, { useEffect, useState, useCallback } from 'react';
import { GoogleMap, useLoadScript, InfoWindow, Marker } from '@react-google-maps/api';
import axios from 'axios';
import useGetUnassignedJourneys from '../hooks/useGetUnassignedJourneys';

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
  pickupLocation?: {
    latitude: number;
    longitude: number;
  };
  pickupCoordinates?: {
    latitude: number;
    longitude: number;
  };
  status: 'pending' | 'assigned' | 'completed';
  assignedDriverId?: string;
  driverId?: string;
}

const mapContainerStyle = {
  width: '100vw',
  height: '90vh',
  position: 'absolute' as const,
  left: 0,
  right: 0
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


  const {unassignedJourneys, loading, error: unassignedError} = useGetUnassignedJourneys();

  console.log("unassignedJourneys", unassignedJourneys);
  console.log("loading", loading);
  console.log("unassignedError", unassignedError);
  

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
      // Calculate a default dropoff location a bit north-east of the pickup point
      const dropoffLat = event.latLng.lat() + 0.01; // ~1km north
      const dropoffLng = event.latLng.lng() + 0.01; // ~1km east
      
      // Get current time for timestamp fields
      const currentTime = new Date().toISOString();
      
      const newJourney = {
        // Required location fields
        pickupLocation: {
          latitude: event.latLng.lat(),
          longitude: event.latLng.lng()
        },
        pickupCoordinates: {
          latitude: event.latLng.lat(),
          longitude: event.latLng.lng()
        },
        dropoffLocation: "Default Destination",
        dropoffCoordinates: {
          latitude: dropoffLat,
          longitude: dropoffLng
        },
        
        // Required time field
        pickupTime: currentTime,
        
        // Required passenger info
        passengerName: "Anonymous Passenger",
        passengerPhone: "+1234567890",
        
        // Required payment info
        fare: "10.00", // TypeORM will convert to decimal
        paymentStatus: "pending",
        paymentMethod: "cash",
        
        // Other fields with default values
        status: "pending",
        distance: "5.00", // in km
        estimatedDuration: 15 // in minutes
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
  console.log("journeyss", journeys);

  if (loadError) return <div>Error loading Google Maps: {loadError.message}</div>;
  if (!isLoaded) return <div>Loading maps...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="driver-map" style={{ 
      width: '100vw', 
      height: '100vh', 
      margin: 0,
      padding: 0,
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div className="map-controls" style={{ 
        marginBottom: '10px', 
        position: 'absolute', 
        top: '10px', 
        left: '10px', 
        zIndex: 10,
        backgroundColor: 'rgba(255,255,255,0.8)',
        padding: '10px',
        borderRadius: '4px'
      }}>
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
        {journeys.map((journey) => {
          // Get coordinates from either pickupLocation or pickupCoordinates
          const lat = journey.pickupLocation?.latitude || journey.pickupCoordinates?.latitude;
          const lng = journey.pickupLocation?.longitude || journey.pickupCoordinates?.longitude;
          
          // Only render marker if coordinates exist
          return lat && lng ? (
            <Marker
              key={journey.id}
              position={{
                lat: lat,
                lng: lng
              }}
              onClick={() => setSelectedJourney(journey)}
              icon={{
                url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
              }}
            />
          ) : null;
        })}

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
              lat: selectedJourney.pickupLocation?.latitude || selectedJourney.pickupCoordinates?.latitude || 0,
              lng: selectedJourney.pickupLocation?.longitude || selectedJourney.pickupCoordinates?.longitude || 0
            }}
            onCloseClick={() => setSelectedJourney(null)}
          >
            <div>
              <h3>Journey Details</h3>
              <p>Status: {selectedJourney.status}</p>
              {(selectedJourney.assignedDriverId || selectedJourney.driverId) && (
                <p>Driver: {
                  drivers.find(d => d.id === (selectedJourney.assignedDriverId || selectedJourney.driverId))?.firstName || 'Loading...'
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