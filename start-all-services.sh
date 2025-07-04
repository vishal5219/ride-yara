#!/bin/bash
# Script to start all backend services in development mode (each in a new terminal)
# Usage: bash start-all-services.sh

SERVICES=(user-service driver-service booking-service payment-service notification-service api-gateway)

for SERVICE in "${SERVICES[@]}"
do
  echo "Setting up $SERVICE..."
  cd $SERVICE
  npm install
  # Generate Prisma client if prisma directory exists
  if [ -d "prisma" ]; then
    echo "Generating Prisma client for $SERVICE..."
    npx prisma generate
  fi
  echo "Starting $SERVICE..."
  npx nodemon src/index.js &
  cd ..
done

echo "All services are starting in the background." 