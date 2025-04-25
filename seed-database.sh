#!/bin/bash

echo "===== Seeding the database ====="
echo "This script will seed the database with initial data"

# Run seed script inside the Docker container
docker exec -it bookingapi-backend-1 npm run seed:docker

echo "===== Seeding complete =====" 