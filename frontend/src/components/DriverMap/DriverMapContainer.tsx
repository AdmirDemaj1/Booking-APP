import React, { useCallback, useState } from 'react';
import { useGoogleMaps } from '../../hooks/useGoogleMaps';
import { useDrivers } from '../../hooks/useDrivers';
import { useJourneys } from '../../hooks/useJourneys';
import GoogleMapContainer from './components/GoogleMapContainer';
import MapControls from './components/MapControls';
import DriverFormModal from './components/DriverFormModal';
 // Import the type
 import { Link } from 'react-router-dom'; // Import Link for navigation
 import { Alert, AlertTitle, IconButton, Stack } from '@mui/material'; // Import MUI components
 import CloseIcon from '@mui/icons-material/Close'; // Import Close icon
import useWebSocket from '../../hooks/useWebSocket';
import { UnassignedJourney } from '../../types/types';



const DriverMapContainer: React.FC = () => {

  // Use the UnassignedJourney type for this state
  const [showNotification, setShowNotification] = useState(false); // State to control notification visibility

  const { isLoaded, loadError, onLoad, onUnmount } = useGoogleMaps();
  const { 
    drivers, 
    selectedDriver, 
    setSelectedDriver, 
    isAddingDriver, 
    setIsAddingDriver,
    createDriver,
    pendingDriverLocation,
    setPendingDriverLocation,
    error: driversError 
  } = useDrivers();
  const { 
    journeys, 
    selectedJourney, 
    setSelectedJourney, 
    isAddingJourney, 
    setIsAddingJourney, 
    createJourney, 
    error: journeysError 
  } = useJourneys();

  const toggleAddingJourney = useCallback(() => {
    if (isAddingDriver) return;
    setIsAddingJourney(!isAddingJourney);
  }, [isAddingJourney, setIsAddingJourney, isAddingDriver]);

  const toggleAddingDriver = useCallback(() => {
    if (isAddingJourney) return;
    setIsAddingDriver(!isAddingDriver);
    // Clear any pending driver location when toggling mode
    if (pendingDriverLocation) {
      setPendingDriverLocation(null);
    }
  }, [isAddingDriver, setIsAddingDriver, isAddingJourney, pendingDriverLocation, setPendingDriverLocation]);

  const handleMapClick = useCallback(
    async (event: google.maps.MapMouseEvent) => {
      if (!event.latLng) return;
      
      const latitude = event.latLng.lat();
      const longitude = event.latLng.lng();
      
      if (isAddingJourney) {
        await createJourney(latitude, longitude);
      } else if (isAddingDriver) {
        // Instead of creating immediately, store the location and show modal
        setPendingDriverLocation({ lat: latitude, lng: longitude });
      }
    },
    [isAddingJourney, isAddingDriver, createJourney, setPendingDriverLocation]
  );

  const handleDriverFormSubmit = useCallback(
    async (firstName: string, lastName: string) => {
      if (pendingDriverLocation) {
        await createDriver(
          pendingDriverLocation.lat, 
          pendingDriverLocation.lng,
          firstName,
          lastName
        );
      }
    },
    [pendingDriverLocation, createDriver]
  );

  const handleModalClose = useCallback(() => {
    setPendingDriverLocation(null);
  }, [setPendingDriverLocation]);



 
    useWebSocket((newJourney: UnassignedJourney) => {
      console.log("New unassigned journey received:", newJourney);
      
      setShowNotification(true); // Show notification when a new journey is received
    });
 
  
    const handleCloseNotification = () => {
      setShowNotification(false); // Close the notification
    };

  if (loadError) return <div>Error loading Google Maps: {loadError.message}</div>;
  if (!isLoaded) return <div>Loading maps...</div>;
  if (driversError) return <div>Error: {driversError}</div>;
  if (journeysError) return <div>Error: {journeysError}</div>;

  return (
    <Stack
       direction="column"
       spacing={2}
       sx={{
         width: '80vw',
         height: '80vh',
         margin: 0,
         padding: 0,
         position: 'relative',
         overflow: 'hidden',
       }}
     >
      {showNotification && (
         <Alert
           severity="info"
           style={{
             position: 'absolute',
             top: '20px',
             right: '20px',
             zIndex: 1000,
           }}
           action={
             <>
               <Link to="/unassigned-journeys" style={{ textDecoration: 'none', marginRight: '10px' }}>
                 <button
                   style={{
                     backgroundColor: '#1976d2',
                     color: 'white',
                     border: 'none',
                     borderRadius: '4px',
                     padding: '5px 10px',
                     cursor: 'pointer',
                   }}
                 >
                   View Details
                 </button>
               </Link>
               <IconButton
                 size="small"
                 aria-label="close"
                 color="inherit"
                 onClick={handleCloseNotification}
               >
                 <CloseIcon fontSize="small" />
               </IconButton>
             </>
           }
         >
           <AlertTitle>New Unassigned Journey</AlertTitle>
           A new unassigned journey is available!
         </Alert>
       )}
      <MapControls 
        isAddingJourney={isAddingJourney}
        toggleAddingJourney={toggleAddingJourney}
        isAddingDriver={isAddingDriver}
        toggleAddingDriver={toggleAddingDriver}
      />

      <GoogleMapContainer
        onLoad={onLoad}
        onUnmount={onUnmount}
        handleMapClick={handleMapClick}
        drivers={drivers}
        selectedDriver={selectedDriver}
        setSelectedDriver={setSelectedDriver}
        journeys={journeys}
        selectedJourney={selectedJourney}
        setSelectedJourney={setSelectedJourney}
      />

      {pendingDriverLocation && (
        <DriverFormModal 
          isOpen={!!pendingDriverLocation} 
          onClose={handleModalClose}
          onSubmit={handleDriverFormSubmit}
          position={pendingDriverLocation}
        />
      )}
    </Stack>
  );
};

export default DriverMapContainer; 