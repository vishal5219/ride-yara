@echo off
echo 🧹 Cleaning up existing containers and images...

echo 📋 Stopping and removing existing containers...
docker stop $(docker ps -aq) 2>nul
docker rm $(docker ps -aq) 2>nul

echo 📋 Removing old images...
docker rmi wurstmeister/zookeeper:3.4.6 2>nul
docker rmi wurstmeister/kafka:2.12-2.2.1 2>nul

echo 📋 Cleaning up Docker system...
docker system prune -f

echo.
echo 🚀 Starting with modern images...
echo.
echo Choose an option:
echo 1. Use docker-compose-modern.yml (Recommended - Bitnami images)
echo 2. Use docker-compose-simple.yml (Confluent images)
echo 3. Use original docker-compose.yml (Updated with Confluent images)
echo.
set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" (
    echo 🚀 Starting with modern Bitnami images...
    docker-compose -f docker-compose-modern.yml up --build
) else if "%choice%"=="2" (
    echo 🚀 Starting with Confluent images...
    docker-compose -f docker-compose-simple.yml up --build
) else if "%choice%"=="3" (
    echo 🚀 Starting with updated original compose...
    docker-compose up --build
) else (
    echo ❌ Invalid choice. Using modern images...
    docker-compose -f docker-compose-modern.yml up --build
)

pause 