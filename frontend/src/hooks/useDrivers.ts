import { useState, useEffect } from 'react';
import axios from 'axios';

export interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  currentLocation: {
    latitude: number;
    longitude: number;
  };
  driverStatus: string;
}

export const useDrivers = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAddingDriver, setIsAddingDriver] = useState<boolean>(false);
  const [pendingDriverLocation, setPendingDriverLocation] = useState<{lat: number, lng: number} | null>(null);

 

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/drivers`);
        console.log("response.data", response.data)
        setDrivers(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching drivers:', err);
        setError('Failed to fetch drivers data');
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
    const interval = setInterval(fetchDrivers, 30000);
    return () => clearInterval(interval);
  }, []);

  const createDriver = async (latitude: number, longitude: number, firstName: string = "New", lastName: string = "Driver") => {
    try {
      const newDriver = {
        // id: Date.now().toString(),
        firstName,
        lastName,
        email: `driver${Date.now()}@example.com`,
        password: "password123", // Would be replaced with proper password handling
        phoneNumber: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        role: "driver",
        driverStatus: "available",
        currentLocation: {
          latitude,
          longitude,
          lastUpdated: new Date().toISOString()
        }
      };

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/users`, newDriver);
      setDrivers(prev => [...prev, response.data]);
      setIsAddingDriver(false);
      setPendingDriverLocation(null);
      return true;
    } catch (err) {
      console.error('Error creating driver:', err);
      setError('Failed to create driver');
      return false;
    }
  };

  return {
    drivers,
    selectedDriver,
    setSelectedDriver,
    error,
    loading,
    isAddingDriver,
    setIsAddingDriver,
    createDriver,
    pendingDriverLocation,
    setPendingDriverLocation
  };
}; 