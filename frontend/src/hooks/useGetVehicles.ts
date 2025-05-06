import { useState, useEffect } from "react";
import axios from "axios";

interface Driver {
  id: string;
  firstName: string;
  lastName: string;
}

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  color: string;
  status: string;
  driver?: Driver; // Optional driver object
}

const useGetVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Vehicle[]>(
          `${import.meta.env.VITE_API_URL}/api/vehicles`
        );
        setVehicles(response.data);
      } catch (err) {
        console.error("Error fetching vehicles:", err);
        setError("Failed to fetch vehicles");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  return { vehicles, loading, error };
};

export default useGetVehicles;
