import { memo } from 'react';
import  Button  from '@mui/material/Button';
import  Stack  from '@mui/material/Stack';

interface MapControlsProps {
  isAddingJourney: boolean;
  toggleAddingJourney: () => void;
  isAddingDriver: boolean;
  toggleAddingDriver: () => void;
}

const MapControls: React.FC<MapControlsProps> = ({
  isAddingJourney,
  toggleAddingJourney,
  isAddingDriver,
  toggleAddingDriver
}) => {
  return (
    <Stack
         spacing={1}
         sx={{
           position: 'absolute',
           top: '25px',
           left: '10px',
           zIndex: 10,
           backgroundColor: 'rgba(255,255,255,0.8)',
           padding: '5px',
           borderRadius: '4px',
         }}
       >
      <Button 
        onClick={toggleAddingJourney}
        disabled={isAddingDriver}
        style={{
          padding: '8px 16px',
          backgroundColor: isAddingJourney ? '#ff4444' : '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isAddingDriver ? 'not-allowed' : 'pointer',
          opacity: isAddingDriver ? 0.6 : 1
        }}
      >
        {isAddingJourney ? 'Cancel Journey' : 'Add New Journey'}
      </Button>
      
      <Button 
        onClick={toggleAddingDriver}
        disabled={isAddingJourney}
        style={{
          padding: '8px 16px',
          backgroundColor: isAddingDriver ? '#ff4444' : '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isAddingJourney ? 'not-allowed' : 'pointer',
          opacity: isAddingJourney ? 0.6 : 1
        }}
      >
        {isAddingDriver ? 'Cancel Driver' : 'Add New Driver'}
      </Button>
      
      {isAddingJourney && (
        <p style={{ margin: '5px 0', color: '#666' }}>
          Click on the map to set pickup location
        </p>
      )}
      
      {isAddingDriver && (
        <p style={{ margin: '5px 0', color: '#666' }}>
          Click on the map to place a new driver
        </p>
      )}
    </Stack>
  );
};

export default memo(MapControls); 