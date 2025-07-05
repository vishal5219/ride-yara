# Docker Troubleshooting Guide

## Issue: Docker Desktop Connection Error

If you see this error:
```
unable to get image 'postgres:14': error during connect: Get "http://%2F%2F.%2Fpipe%2FdockerDesktopLinuxEngine/v1.50/images/postgres:14/json": open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified.
```

## Solutions:

### Solution 1: Start Docker Desktop
1. **Open Docker Desktop** application
2. **Wait for full initialization** (whale icon in system tray)
3. **Verify it's running**:
   ```bash
   docker --version
   docker ps
   ```

### Solution 2: Restart Docker Desktop
1. **Right-click** Docker Desktop icon in system tray
2. **Select "Restart"**
3. **Wait for restart to complete**

### Solution 3: Reset Docker Desktop
1. **Open Docker Desktop**
2. **Go to Settings** (gear icon)
3. **Troubleshoot** → **Reset to factory defaults**
4. **Restart Docker Desktop**

### Solution 4: Use Simplified Docker Compose
```bash
docker-compose -f docker-compose-simple.yml up --build
```

### Solution 5: Start Services Individually
```bash
# Run the batch file
start-docker-services.bat

# Then run application services
start-local.bat
```

### Solution 6: Manual Docker Commands
```bash
# Start infrastructure services
docker run --name postgres -e POSTGRES_USER=uber -e POSTGRES_PASSWORD=uberpass -e POSTGRES_DB=uberdb -p 5432:5432 -d postgres:14
docker run --name redis -p 6379:6379 -d redis:7
docker run --name zookeeper -p 2181:2181 -d wurstmeister/zookeeper:3.4.6
docker run --name kafka -p 9092:9092 -e KAFKA_ADVERTISED_HOST_NAME=localhost -e KAFKA_ZOOKEEPER_CONNECT=localhost:2181 --link zookeeper:zookeeper -d wurstmeister/kafka:2.12-2.2.1

# Then run application services locally
start-local.bat
```

## Alternative: Run Without Docker

If Docker continues to have issues, use the local development setup:

1. **Install PostgreSQL** locally or use Docker for just the database:
   ```bash
   docker run --name postgres -e POSTGRES_USER=uber -e POSTGRES_PASSWORD=uberpass -e POSTGRES_DB=uberdb -p 5432:5432 -d postgres:14
   ```

2. **Install Redis** locally or use Docker for just Redis:
   ```bash
   docker run --name redis -p 6379:6379 -d redis:7
   ```

3. **Run the application**:
   ```bash
   start-local.bat
   ```

## Common Issues and Fixes

### Issue: Port Already in Use
```bash
# Check what's using the port
netstat -ano | findstr :5432

# Kill the process
taskkill /PID <PID> /F
```

### Issue: Docker Build Fails
```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

### Issue: Permission Denied
- Run PowerShell as Administrator
- Ensure Docker Desktop has proper permissions

### Issue: WSL2 Backend Issues
1. **Update WSL2**: `wsl --update`
2. **Restart WSL**: `wsl --shutdown`
3. **Restart Docker Desktop**

## Service URLs

After successful startup:
- **User Service**: http://localhost:4001
- **Driver Service**: http://localhost:4002
- **Booking Service**: http://localhost:4003
- **Payment Service**: http://localhost:4004
- **Notification Service**: http://localhost:4005
- **API Gateway**: http://localhost:8080
- **API Documentation**: http://localhost:4003/api-docs

## Health Checks

Test if services are running:
```bash
# Test API Gateway
curl http://localhost:8080/health

# Test Booking Service
curl http://localhost:4003/health

# Test Database
docker exec -it postgres psql -U uber -d uberdb -c "SELECT 1;"
``` 