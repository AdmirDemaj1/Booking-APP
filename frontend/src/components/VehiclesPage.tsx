import React from 'react';
import { Grid, CardContent, Typography, CircularProgress, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import useGetVehicles from '../hooks/useGetVehicles';


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

const VehiclesPage: React.FC = () => {
  const { vehicles, loading, error } = useGetVehicles();

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }


  

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Vehicles
      </Typography>
      <Grid container spacing={3}>
        {vehicles.map((vehicle) => (
          <Grid xs={12} sm={6} md={4} key={vehicle.id}>
            <Item>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {vehicle.make} {vehicle.model} ({vehicle.year})
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  License Plate: {vehicle.licensePlate}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Color: {vehicle.color}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Status: {vehicle.status}
                </Typography>
                {vehicle.driver ? (
                  <>
                    <Typography variant="body2" color="textSecondary">
                      Driver: {vehicle.driver.firstName} {vehicle.driver.lastName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Phone: {vehicle.driver.phoneNumber}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Driver Status: {vehicle.driver.driverStatus}
                    </Typography>
                  </>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    Driver: Unassigned
                  </Typography>
                )}
              </CardContent>
            </Item>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default VehiclesPage;