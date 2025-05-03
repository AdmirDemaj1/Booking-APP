import { useState, useEffect } from "react";
import axios from "axios";
import { UnassignedJourney } from "../types/types"; // Import the type

const useGetUnassignedJourneys = () => {
  const [unassignedJourneys, setUnassignedJourneys] = useState<
    UnassignedJourney[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUnassignedJourneys = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/unassigned-journeys`
        );
        setUnassignedJourneys(response.data);
      } catch (err) {
        console.log("Error fetching unassigned journeys:", err);
        setError("Failed to fetch unassigned journeys");
      } finally {
        setLoading(false);
      }
    };

    fetchUnassignedJourneys();
  }, []);

  return { unassignedJourneys, loading, error };
};

export default useGetUnassignedJourneys;
