// Define the Location type
export interface Location {
  latitude: number;
  longitude: number;
}

// Define the Journey type
export interface Journey {
  id: string;
  pickupLocation: Location;
  dropoffLocation: string;
  pickupCoordinates: Location;
  dropoffCoordinates: Location;
  pickupTime: string;
  passengerName: string;
  status: string;
  fare: string;
}

// Define the UnassignedJourney type
export interface UnassignedJourney {
  id: string;
  journey: Journey;
  reason: string;
}
