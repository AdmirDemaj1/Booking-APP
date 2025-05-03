import React, { useState } from 'react';

interface DriverFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (firstName: string, lastName: string) => void;
  position: { lat: number; lng: number };
}

const DriverFormModal: React.FC<DriverFormModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  position 
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(firstName, lastName);
    setFirstName('');
    setLastName('');
  };

  return (
    <div className="modal-backdrop" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div className="modal-content" style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        width: '350px',
        maxWidth: '90%'
      }}>
        <h3 style={{ marginTop: 0 }}>Add New Driver</h3>
        <p style={{ fontSize: '14px', color: '#666' }}>
          Position: {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
        </p>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              First Name:
            </label>
            <input 
              type="text" 
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              Last Name:
            </label>
            <input 
              type="text" 
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}
            />
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'flex-end',
            gap: '10px', 
            marginTop: '20px'
          }}>
            <button 
              type="button" 
              onClick={onClose}
              style={{
                padding: '8px 16px',
                backgroundColor: '#ccc',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button 
              type="submit"
              style={{
                padding: '8px 16px',
                backgroundColor: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Add Driver
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DriverFormModal; 