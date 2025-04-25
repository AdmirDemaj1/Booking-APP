import { useState, useEffect } from 'react';
import axios from 'axios';

export interface Journey {
  id: string;
  pickupLocation?: {
    latitude: number;
    longitude: number;
  };
  pickupCoordinates?: {
    latitude: number;
    longitude: number;
  };
  dropoffLocation: string;
  dropoffCoordinates: {
    latitude: number;
    longitude: number;
  };
  status: 'pending' | 'assigned' | 'completed';
  assignedDriverId?: string;
  driverId?: string;
  pickupTime: string;
  passengerName: string;
  passengerPhone: string;
  fare: string;
  paymentStatus: string;
  paymentMethod: string;
  distance: string;
  estimatedDuration: number;
}

export const useJourneys = () => {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [selectedJourney, setSelectedJourney] = useState<Journey | null>(null);
  const [isAddingJourney, setIsAddingJourney] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJourneys = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/journeys`);
        setJourneys(response.data);
      } catch (err) {
        console.error('Error fetching journeys:', err);
        setError('Failed to fetch journeys data');
      }
    };

    fetchJourneys();
    const interval = setInterval(fetchJourneys, 5000);
    return () => clearInterval(interval);
  }, []);

  const createJourney = async (latitude: number, longitude: number) => {
    try {
      // Calculate a default dropoff location a bit north-east of the pickup point
      const dropoffLat = latitude + 0.01; // ~1km north
      const dropoffLng = longitude + 0.01; // ~1km east
      
      // Get current time for timestamp fields
      const currentTime = new Date().toISOString();
      
      const newJourney = {
        // Required location fields
        pickupLocation: {
          latitude,
          longitude
        },
        pickupCoordinates: {
          latitude,
          longitude
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
      return true;
    } catch (err) {
      console.error('Error creating journey:', err);
      setError('Failed to create journey');
      return false;
    }
  };

  return {
    journeys,
    selectedJourney,
    setSelectedJourney,
    isAddingJourney,
    setIsAddingJourney,
    createJourney,
    error
  };
}; 