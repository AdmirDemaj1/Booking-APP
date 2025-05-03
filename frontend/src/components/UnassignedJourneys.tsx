import { Container, Typography, List, ListItem, ListItemText, Paper, CircularProgress, Link } from '@mui/material';
import useGetUnassignedJourneys from '../hooks/useGetUnassignedJourneys';
import { UnassignedJourney } from '../types/types'; // Import the type

const UnassignedJourneys = () => {
  const { unassignedJourneys: journeys, loading, error } = useGetUnassignedJourneys();

  console.log("Unassigned Journeys:", journeys);

  return (
    <Container maxWidth="md" style={{ marginTop: '20px' }}>
      <Paper elevation={3} style={{ padding: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Unassigned Journeys
        </Typography>

        {loading && <CircularProgress />}
        {error && <Typography color="error">Failed to load journeys: {error}</Typography>}

        {!loading && !error && journeys && (
          <List>
            {journeys.map((item: UnassignedJourney) => {
              const pickupLat = item.journey.pickupLocation.latitude;
              const pickupLng = item.journey.pickupLocation.longitude;
              const dropoffLat = item.journey.dropoffCoordinates.latitude;
              const dropoffLng = item.journey.dropoffCoordinates.longitude;

              const pickupTime = new Date(item.journey.pickupTime).toLocaleString();

              return (
                <ListItem key={item.id} divider>
                  <ListItemText
                    primary={`Passenger: ${item.journey.passengerName} | Pickup Time: ${pickupTime}`}
                    secondary={
                      <>
                        <Typography>Status: {item.journey.status}</Typography>
                        <Typography>
                          Pickup: 
                          <Link
                            href={`https://www.google.com/maps?q=${pickupLat},${pickupLng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View on Map
                          </Link>
                        </Typography>
                        <Typography>
                          Dropoff: 
                          <Link
                            href={`https://www.google.com/maps?q=${dropoffLat},${dropoffLng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View on Map
                          </Link>
                        </Typography>
                        <Typography>Fare: ${item.journey.fare} | Reason: {item.reason}</Typography>
                      </>
                    }
                  />
                </ListItem>
              );
            })}
          </List>
        )}

        {!loading && !error && journeys?.length === 0 && (
          <Typography>No unassigned journeys available.</Typography>
        )}
      </Paper>
    </Container>
  );
};

export default UnassignedJourneys;