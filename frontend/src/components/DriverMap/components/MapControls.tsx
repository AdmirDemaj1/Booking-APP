import React, { memo } from 'react';

interface MapControlsProps {
  isAddingJourney: boolean;
  toggleAddingJourney: () => void;
}

const MapControls: React.FC<MapControlsProps> = ({
  isAddingJourney,
  toggleAddingJourney
}) => {
  return (
    <div className="map-controls" style={{ 
      marginBottom: '10px', 
      position: 'absolute', 
      top: '10px', 
      left: '10px', 
      zIndex: 10,
      backgroundColor: 'rgba(255,255,255,0.8)',
      padding: '10px',
      borderRadius: '4px'
    }}>
      <button 
        onClick={toggleAddingJourney}
        style={{
          padding: '8px 16px',
          backgroundColor: isAddingJourney ? '#ff4444' : '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        {isAddingJourney ? 'Cancel Journey' : 'Add New Journey'}
      </button>
      {isAddingJourney && (
        <p style={{ margin: '10px 0', color: '#666' }}>
          Click on the map to set pickup location
        </p>
      )}
    </div>
  );
};

export default memo(MapControls); 