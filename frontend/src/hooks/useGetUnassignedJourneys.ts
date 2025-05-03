import { useState, useEffect } from 'react';
import axios from 'axios';

interface UnassignedJourney {
    id: number;
    origin: string;
    destination: string;
    date: string;
    status: string;
}

const useGetUnassignedJourneys = () => {
    const [unassignedJourneys, setUnassignedJourneys] = useState<UnassignedJourney[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUnassignedJourneys = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/unassigned-journeys`);
                setUnassignedJourneys(response.data);
            } catch (err) {
                console.log('Error fetching unassigned journeys:', err);
                setError('Failed to fetch unassigned journeys');
            } finally {
                setLoading(false);
            }
        };

        fetchUnassignedJourneys();

        const intervalId = setInterval(fetchUnassignedJourneys, 10000); // Poll every 10 seconds

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, []);

    return { unassignedJourneys, loading, error };
};

export default useGetUnassignedJourneys;