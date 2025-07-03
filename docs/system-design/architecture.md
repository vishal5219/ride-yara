# System Architecture

```mermaid
flowchart TD
  subgraph "Frontend"
    FE["React App"]
  end
  subgraph "API Gateway"
    APIGW["api-gateway"]
  end
  subgraph "Microservices"
    US["user-service"]
    BS["booking-service"]
    DS["driver-service"]
    PS["payment-service"]
    NS["notification-service"]
  end
  subgraph "Infrastructure"
    NGINX["nginx"]
    KAFKA["Kafka"]
    REDIS["Redis"]
    DB1["User DB"]
    DB2["Booking DB"]
    DB3["Driver DB"]
    DB4["Payment DB"]
    DB5["Notification DB"]
  end
  FE-->|"HTTP/WS"|APIGW
  APIGW-->|"REST/GraphQL"|US
  APIGW-->|"REST"|BS
  APIGW-->|"REST"|DS
  APIGW-->|"REST"|PS
  APIGW-->|"REST"|NS
  US-->|"DB"|DB1
  BS-->|"DB"|DB2
  DS-->|"DB"|DB3
  PS-->|"DB"|DB4
  NS-->|"DB"|DB5
  US-->|"Kafka"|KAFKA
  BS-->|"Kafka"|KAFKA
  DS-->|"Kafka"|KAFKA
  PS-->|"Kafka"|KAFKA
  NS-->|"Kafka"|KAFKA
  US-->|"Redis"|REDIS
  BS-->|"Redis"|REDIS
  DS-->|"Redis"|REDIS
  PS-->|"Redis"|REDIS
  NS-->|"Redis"|REDIS
  NGINX-->|"Proxy"|APIGW
  FE-->|"Static Files"|NGINX
```

## Overview

This system is designed as a microservices-based architecture for a ride-hailing platform. It consists of:
- **Frontend**: React app for users and drivers.
- **API Gateway**: Central entry point, routing requests to backend services.
- **Microservices**: User, Booking, Driver, Payment, and Notification services, each with its own database and cache.
- **Infrastructure**: NGINX for static file serving and reverse proxy, Kafka for async messaging, Redis for caching, and individual databases for each service.

All services are containerized with Docker and orchestrated via Docker Compose (dev) or Kubernetes (prod). 