- Phase 1: Project Setup and Basic Structure
Database Design
Create database schema for:
Users (Admin, Drivers, Clients)
Vehicles
Bookings
Locations
Driver Assignments
GPS Tracking Data

Backend Setup (NestJS)
Set up authentication system
Create basic CRUD APIs for:
User management
Vehicle management
Booking management
Implement role-based access control

Frontend Setup (React + Vite)
Create basic UI structure
Implement authentication pages
Set up routing
Create basic dashboard layout


Phase 2: Core Booking System
Booking Management
Create booking form
Implement booking status tracking
Add booking history
Create booking notifications
User Management
Admin dashboard
Driver management
Client management
Profile management
Vehicle Management
Vehicle registration
Vehicle status tracking
Maintenance scheduling
Phase 3: GPS Integration and Real-time Tracking
Wialon Integration
Set up Wialon API integration
Create vehicle tracking system
Implement real-time location updates
Create map visualization
Real-time Features
Implement WebSocket for real-time updates
Create live tracking dashboard
Add vehicle status indicators

Phase 3: GPS Integration and Real-time Tracking
Wialon Integration
Set up Wialon API integration
Create vehicle tracking system
Implement real-time location updates
Create map visualization
Real-time Features
Implement WebSocket for real-time updates
Create live tracking dashboard
Add vehicle status indicators
Phase 4: Automated Driver Assignment
Distance Calculation System
Implement geolocation services
Create distance calculation algorithms
Add route optimization
Assignment Logic
Create driver assignment algorithm
Implement priority system
Add manual override capability
Phase 5: Advanced Features
Reporting and Analytics
Create booking reports
Add driver performance metrics
Implement revenue tracking
Notifications System
SMS notifications
Email notifications
Push notifications
Payment Integration
Payment processing
Invoice generation
Payment history


- Created a VehicleController with CRUD endpoints:
POST /api/vehicles - Create a new vehicle
GET /api/vehicles - Get all vehicles
GET /api/vehicles/:id - Get a vehicle by ID
PUT /api/vehicles/:id - Update a vehicle
PUT /api/vehicles/:id/status - Update just the status of a vehicle
DELETE /api/vehicles/:id - Delete a vehicle


- Updated the UserService by adding:
findAll(): Get all users
findOne(): Get a user by ID
create(): Create a new user
update(): Update a user
updateDriverStatus(): Update a driver's status
delete(): Delete a user

- Enhanced the UserController with:
GET /api/users: Get all users
GET /api/users/:id: Get a user by ID
POST /api/users: Create a new user
PUT /api/users/:id: Update a user
PUT /api/drivers/:id/status: Update a driver's status
DELETE /api/users/:id: Delete a user
Maintained GET /api/drivers: Get all active drivers

- Journey

Added the missing delete method to the JourneyService.
Created a new JourneyController with the following endpoints:
POST /api/journeys - Create a new journey
GET /api/journeys - Get all journeys
GET /api/journeys/:id - Get a journey by ID
GET /api/journeys/driver/:driverId - Get journeys by driver ID
PUT /api/journeys/:id - Update a journey
PUT /api/journeys/:id/status - Update just the status of a journey
DELETE /api/journeys/:id - Delete a journey

- npm run build write
- To apply seeds : docker exec -it bookingapi-backend-1 node dist/scripts/seed.js

curl -X POST http://localhost:3000/api/journeys \
  -H "Content-Type: application/json" \
  -d '{
    "pickupCoordinates": {
      "latitude": 41.3275,
      "longitude": 19.8187
    },
    "dropoffCoordinates": {
      "latitude": 41.3375,
      "longitude": 19.8287
    },
    "dropoffLocation": "Test Destination",
    "pickupTime": "2023-09-15T10:00:00.000Z",
    "passengerName": "Test User",
    "passengerPhone": "+1234567890",
    "notes": "Test journey",
    "fare": 15.50,
    "paymentMethod": "cash"
  }'