#!/bin/bash
# Script to start all backend services in development mode (each in a new terminal)
# Usage: bash start-all-services.sh

SERVICES=(user-service driver-service booking-service payment-service notification-service api-gateway)

for SERVICE in "${SERVICES[@]}"
do
  echo "Starting $SERVICE..."
  (cd $SERVICE && npm install && npx nodemon src/index.js) &
done

echo "All services are starting in the background." 