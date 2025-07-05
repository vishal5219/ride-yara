@echo off
echo 🚀 Starting Uber Clone Services Locally...

echo 📋 Checking prerequisites...

REM Check if PostgreSQL is running (simplified check)
echo Checking PostgreSQL...
netstat -an | findstr :5432 >nul
if errorlevel 1 (
    echo ❌ PostgreSQL is not running on port 5432
    echo Please start PostgreSQL first or run:
    echo docker run --name postgres -e POSTGRES_PASSWORD=uberpass -e POSTGRES_DB=uberdb -p 5432:5432 -d postgres:14
    pause
    exit /b 1
)

REM Check if Redis is running (simplified check)
echo Checking Redis...
netstat -an | findstr :6379 >nul
if errorlevel 1 (
    echo ❌ Redis is not running on port 6379
    echo Please start Redis first or run:
    echo docker run --name redis -p 6379:6379 -d redis:7
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed!

echo 📝 Setting up environment files...

REM Create .env files for local development
(
echo PORT=4003
echo DB_HOST=localhost
echo DB_USER=uber
echo DB_PASS=uberpass
echo DB_NAME=uberdb
echo DB_PORT=5432
echo DATABASE_URL=postgresql://uber:uberpass@localhost:5432/uberdb
echo REDIS_HOST=localhost
echo REDIS_PORT=6379
echo KAFKA_BROKER=localhost:9092
echo KAFKA_CLIENT_ID=booking-service
echo KAFKA_GROUP_ID=booking-group
echo ZOOKEEPER_HOST=localhost:2181
echo JWT_SECRET=your_jwt_secret_key_here
) > booking-service\.env

(
echo PORT=4001
echo DB_HOST=localhost
echo DB_USER=uber
echo DB_PASS=uberpass
echo DB_NAME=uberdb
echo DB_PORT=5432
echo DATABASE_URL=postgresql://uber:uberpass@localhost:5432/uberdb
echo REDIS_HOST=localhost
echo REDIS_PORT=6379
echo KAFKA_BROKER=localhost:9092
echo KAFKA_CLIENT_ID=user-service
echo KAFKA_GROUP_ID=user-group
echo ZOOKEEPER_HOST=localhost:2181
echo JWT_SECRET=your_jwt_secret_key_here
) > user-service\.env

(
echo PORT=4002
echo DB_HOST=localhost
echo DB_USER=uber
echo DB_PASS=uberpass
echo DB_NAME=uberdb
echo DB_PORT=5432
echo DATABASE_URL=postgresql://uber:uberpass@localhost:5432/uberdb
echo REDIS_HOST=localhost
echo REDIS_PORT=6379
echo KAFKA_BROKER=localhost:9092
echo KAFKA_CLIENT_ID=driver-service
echo KAFKA_GROUP_ID=driver-group
echo ZOOKEEPER_HOST=localhost:2181
echo JWT_SECRET=your_jwt_secret_key_here
) > driver-service\.env

(
echo PORT=4004
echo DB_HOST=localhost
echo DB_USER=uber
echo DB_PASS=uberpass
echo DB_NAME=uberdb
echo DB_PORT=5432
echo DATABASE_URL=postgresql://uber:uberpass@localhost:5432/uberdb
echo REDIS_HOST=localhost
echo REDIS_PORT=6379
echo KAFKA_BROKER=localhost:9092
echo KAFKA_CLIENT_ID=payment-service
echo KAFKA_GROUP_ID=payment-group
echo ZOOKEEPER_HOST=localhost:2181
echo JWT_SECRET=your_jwt_secret_key_here
echo RAZORPAY_KEY_ID=your_razorpay_key_id
echo RAZORPAY_KEY_SECRET=your_razorpay_key_secret
) > payment-service\.env

(
echo PORT=4005
echo DB_HOST=localhost
echo DB_USER=uber
echo DB_PASS=uberpass
echo DB_NAME=uberdb
echo DB_PORT=5432
echo DATABASE_URL=postgresql://uber:uberpass@localhost:5432/uberdb
echo REDIS_HOST=localhost
echo REDIS_PORT=6379
echo KAFKA_BROKER=localhost:9092
echo KAFKA_CLIENT_ID=notification-service
echo KAFKA_GROUP_ID=notification-group
echo ZOOKEEPER_HOST=localhost:2181
echo JWT_SECRET=your_jwt_secret_key_here
) > notification-service\.env

(
echo PORT=8080
echo USER_SERVICE_URL=http://localhost:4001
echo DRIVER_SERVICE_URL=http://localhost:4002
echo BOOKING_SERVICE_URL=http://localhost:4003
echo PAYMENT_SERVICE_URL=http://localhost:4004
echo NOTIFICATION_SERVICE_URL=http://localhost:4005
) > api-gateway\.env

echo ✅ Environment files created!

REM Install dependencies and start services
echo 🔧 Setting up services...

cd user-service
call npm install
if exist prisma (
    echo 📊 Generating Prisma client for user-service...
    call npx prisma generate
)
echo 🚀 Starting user-service...
start "User Service" cmd /k "npm run dev"
cd ..

cd driver-service
call npm install
if exist prisma (
    echo 📊 Generating Prisma client for driver-service...
    call npx prisma generate
)
echo 🚀 Starting driver-service...
start "Driver Service" cmd /k "npm run dev"
cd ..

cd booking-service
call npm install
if exist prisma (
    echo 📊 Generating Prisma client for booking-service...
    call npx prisma generate
)
echo 🚀 Starting booking-service...
start "Booking Service" cmd /k "npm run dev"
cd ..

cd payment-service
call npm install
if exist prisma (
    echo 📊 Generating Prisma client for payment-service...
    call npx prisma generate
)
echo 🚀 Starting payment-service...
start "Payment Service" cmd /k "npm run dev"
cd ..

cd notification-service
call npm install
if exist prisma (
    echo 📊 Generating Prisma client for notification-service...
    call npx prisma generate
)
echo 🚀 Starting notification-service...
start "Notification Service" cmd /k "npm run dev"
cd ..

cd api-gateway
call npm install
echo 🚀 Starting api-gateway...
start "API Gateway" cmd /k "npm run dev"
cd ..

echo.
echo 🎉 All services are starting!
echo.
echo 📊 Service URLs:
echo    User Service: http://localhost:4001
echo    Driver Service: http://localhost:4002
echo    Booking Service: http://localhost:4003
echo    Payment Service: http://localhost:4004
echo    Notification Service: http://localhost:4005
echo    API Gateway: http://localhost:8080
echo.
echo 📚 API Documentation:
echo    Booking Service: http://localhost:4003/api-docs
echo.
echo 🛑 To stop all services, close the command windows
pause 