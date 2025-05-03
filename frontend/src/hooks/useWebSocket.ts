import { useEffect } from "react";
import { io } from "socket.io-client";
import { UnassignedJourney } from "../types/types"; // Import the type

const useWebSocket = (onNewJourney: (journey: UnassignedJourney) => void) => {
  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL);

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socket.on("newUnassignedJourney", (journey: UnassignedJourney) => {
      console.log("New unassigned journey received:", journey);
      onNewJourney(journey);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    return () => {
      socket.disconnect();
    };
  }, [onNewJourney]);
};

export default useWebSocket;
