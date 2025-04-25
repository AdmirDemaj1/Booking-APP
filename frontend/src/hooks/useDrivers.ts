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

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/drivers`);
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

  return {
    drivers,
    selectedDriver,
    setSelectedDriver,
    error,
    loading
  };
}; 