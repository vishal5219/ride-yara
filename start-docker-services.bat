@echo off
echo 🐳 Starting Docker Services Individually...

echo 📋 Starting PostgreSQL...
docker run --name postgres -e POSTGRES_USER=uber -e POSTGRES_PASSWORD=uberpass -e POSTGRES_DB=uberdb -p 5432:5432 -d postgres:14

echo 📋 Starting Redis...
docker run --name redis -p 6379:6379 -d redis:7

echo 📋 Starting Zookeeper...
docker run --name zookeeper -p 2181:2181 -e ZOOKEEPER_CLIENT_PORT=2181 -e ZOOKEEPER_TICK_TIME=2000 -d confluentinc/cp-zookeeper:7.4.0

echo 📋 Starting Kafka...
docker run --name kafka -p 9092:9092 -e KAFKA_BROKER_ID=1 -e KAFKA_ZOOKEEPER_CONNECT=localhost:2181 -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092 -e KAFKA_LISTENER_SECURITY_PROTOCOL_MAP=PLAINTEXT:PLAINTEXT -e KAFKA_INTER_BROKER_LISTENER_NAME=PLAINTEXT -e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 --link zookeeper:zookeeper -d confluentinc/cp-kafka:7.4.0

echo.
echo ✅ Infrastructure services started!
echo.
echo 📊 Service URLs:
echo    PostgreSQL: localhost:5432
echo    Redis: localhost:6379
echo    Kafka: localhost:9092
echo    Zookeeper: localhost:2181
echo.
echo 🚀 Now you can run the application services using:
echo    start-local.bat
echo.
pause 