#!/bin/bash
# Script to start all services locally without Docker
# Prerequisites: PostgreSQL, Redis, Kafka & Zookeeper must be running locally

echo "🚀 Starting Uber Clone Services Locally..."

# Check if required services are running
echo "📋 Checking prerequisites..."

# Check PostgreSQL
if ! pg_isready -h localhost -p 5432 > /dev/null 2>&1; then
    echo "❌ PostgreSQL is not running. Please start PostgreSQL first."
    echo "   You can install and start it with:"
    echo "   - Windows: Install PostgreSQL from https://www.postgresql.org/download/windows/"
    echo "   - Or use: docker run --name postgres -e POSTGRES_PASSWORD=uberpass -e POSTGRES_DB=uberdb -p 5432:5432 -d postgres:14"
    exit 1
fi

# Check Redis
if ! redis-cli ping > /dev/null 2>&1; then
    echo "❌ Redis is not running. Please start Redis first."
    echo "   You can install and start it with:"
    echo "   - Windows: Install Redis from https://redis.io/download"
    echo "   - Or use: docker run --name redis -p 6379:6379 -d redis:7"
    exit 1
fi

echo "✅ Prerequisites check passed!"

# Create .env files for local development
echo "📝 Setting up environment files..."

# Booking Service
cat > booking-service/.env << EOF
PORT=4003
DB_HOST=localhost
DB_USER=uber
DB_PASS=uberpass
DB_NAME=uberdb
DB_PORT=5432
DATABASE_URL=postgresql://uber:uberpass@localhost:5432/uberdb
REDIS_HOST=localhost
REDIS_PORT=6379
KAFKA_BROKER=localhost:9092
KAFKA_CLIENT_ID=booking-service
KAFKA_GROUP_ID=booking-group
ZOOKEEPER_HOST=localhost:2181
JWT_SECRET=your_jwt_secret_key_here
EOF

# User Service
cat > user-service/.env << EOF
PORT=4001
DB_HOST=localhost
DB_USER=uber
DB_PASS=uberpass
DB_NAME=uberdb
DB_PORT=5432
DATABASE_URL=postgresql://uber:uberpass@localhost:5432/uberdb
REDIS_HOST=localhost
REDIS_PORT=6379
KAFKA_BROKER=localhost:9092
KAFKA_CLIENT_ID=user-service
KAFKA_GROUP_ID=user-group
ZOOKEEPER_HOST=localhost:2181
JWT_SECRET=your_jwt_secret_key_here
EOF

# Driver Service
cat > driver-service/.env << EOF
PORT=4002
DB_HOST=localhost
DB_USER=uber
DB_PASS=uberpass
DB_NAME=uberdb
DB_PORT=5432
DATABASE_URL=postgresql://uber:uberpass@localhost:5432/uberdb
REDIS_HOST=localhost
REDIS_PORT=6379
KAFKA_BROKER=localhost:9092
KAFKA_CLIENT_ID=driver-service
KAFKA_GROUP_ID=driver-group
ZOOKEEPER_HOST=localhost:2181
JWT_SECRET=your_jwt_secret_key_here
EOF

# Payment Service
cat > payment-service/.env << EOF
PORT=4004
DB_HOST=localhost
DB_USER=uber
DB_PASS=uberpass
DB_NAME=uberdb
DB_PORT=5432
DATABASE_URL=postgresql://uber:uberpass@localhost:5432/uberdb
REDIS_HOST=localhost
REDIS_PORT=6379
KAFKA_BROKER=localhost:9092
KAFKA_CLIENT_ID=payment-service
KAFKA_GROUP_ID=payment-group
ZOOKEEPER_HOST=localhost:2181
JWT_SECRET=your_jwt_secret_key_here
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
EOF

# Notification Service
cat > notification-service/.env << EOF
PORT=4005
DB_HOST=localhost
DB_USER=uber
DB_PASS=uberpass
DB_NAME=uberdb
DB_PORT=5432
DATABASE_URL=postgresql://uber:uberpass@localhost:5432/uberdb
REDIS_HOST=localhost
REDIS_PORT=6379
KAFKA_BROKER=localhost:9092
KAFKA_CLIENT_ID=notification-service
KAFKA_GROUP_ID=notification-group
ZOOKEEPER_HOST=localhost:2181
JWT_SECRET=your_jwt_secret_key_here
EOF

# API Gateway
cat > api-gateway/.env << EOF
PORT=8080
USER_SERVICE_URL=http://localhost:4001
DRIVER_SERVICE_URL=http://localhost:4002
BOOKING_SERVICE_URL=http://localhost:4003
PAYMENT_SERVICE_URL=http://localhost:4004
NOTIFICATION_SERVICE_URL=http://localhost:4005
EOF

echo "✅ Environment files created!"

# Install dependencies and start services
SERVICES=(user-service driver-service booking-service payment-service notification-service api-gateway)

for SERVICE in "${SERVICES[@]}"
do
  echo "🔧 Setting up $SERVICE..."
  cd $SERVICE
  
  # Install dependencies
  npm install
  
  # Generate Prisma client if prisma directory exists
  if [ -d "prisma" ]; then
    echo "📊 Generating Prisma client for $SERVICE..."
    npx prisma generate
  fi
  
  echo "🚀 Starting $SERVICE..."
  # Start service in background
  npm run dev &
  
  cd ..
  sleep 2
done

echo "🎉 All services are starting!"
echo ""
echo "📊 Service URLs:"
echo "   User Service: http://localhost:4001"
echo "   Driver Service: http://localhost:4002"
echo "   Booking Service: http://localhost:4003"
echo "   Payment Service: http://localhost:4004"
echo "   Notification Service: http://localhost:4005"
echo "   API Gateway: http://localhost:8080"
echo ""
echo "📚 API Documentation:"
echo "   Booking Service: http://localhost:4003/api-docs"
echo ""
echo "🛑 To stop all services, press Ctrl+C"
echo "💡 To stop individual services, use: pkill -f 'node.*$SERVICE'"

# Wait for user to stop
wait 