#!/bin/bash
# Script to set up Prisma for all services
# Usage: bash setup-prisma.sh

SERVICES=(user-service driver-service booking-service payment-service notification-service)

echo "Setting up Prisma for all services..."

for SERVICE in "${SERVICES[@]}"
do
  if [ -d "$SERVICE/prisma" ]; then
    echo "Setting up Prisma for $SERVICE..."
    cd $SERVICE
    
    # Install dependencies if not already done
    npm install
    
    # Generate Prisma client
    echo "Generating Prisma client for $SERVICE..."
    npx prisma generate
    
    # Run migrations (optional - uncomment if you want to run migrations)
    # echo "Running Prisma migrations for $SERVICE..."
    # npx prisma migrate dev
    
    cd ..
    echo "✅ $SERVICE Prisma setup complete"
  else
    echo "⚠️  No Prisma directory found in $SERVICE"
  fi
done

echo "🎉 Prisma setup complete for all services!" 