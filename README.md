# Uber-like Microservices Project

## Overview
This project is a scalable, production-ready microservices architecture for a ride-hailing app (like Uber/Ola/Rapido) with Node.js, React, PostgreSQL, Redis, Kafka, Socket.io, and Kubernetes.

---

## Features
- Microservices: Booking, Driver, User, Payment, Notification, API Gateway
- Real-time location tracking (Socket.io)
- Event-driven (Kafka)
- Distributed cache (Redis Cluster)
- Database sharding and replication
- Load balancing (Nginx/Kubernetes Ingress)
- Scalable to billions of users
- Production-ready Docker and Kubernetes setup

---

## Prerequisites
- Docker & Docker Compose
- Node.js (for local dev)
- Kubernetes (minikube, kind, or cloud provider)
- Helm (for Redis Cluster)
- Nginx (for non-K8s load balancing)

---

## Local Development

### 1. Clone the repo
```bash
git clone <your-repo-url>
cd <your-repo-folder>
```

### 2. Set up environment variables
- Copy `.env.example` to `.env` in each service and `frontend/`.
- Fill in DB, Redis, Kafka, JWT, and API gateway values as needed.

### 3. Start dependencies (Postgres, Redis, Kafka, Zookeeper) with Docker Compose
```bash
docker-compose up -d
```

### 4. Start backend services (in separate terminals or with a process manager)
```bash
cd booking-service && npm run dev
cd driver-service && npm run dev
cd user-service && npm run dev
cd payment-service && npm run dev
cd notification-service && npm run dev
cd api-gateway && npm run dev
```

### 5. Start frontend
```bash
cd frontend && npm install && npm start
```

### 6. Access the app
- Frontend: [http://localhost:3000](http://localhost:3000)
- API Gateway: [http://localhost:8080](http://localhost:8080)

---

## Production Deployment (Kubernetes)

### 1. Build and push Docker images
```bash
docker build -t your-docker-repo/booking-service:latest booking-service/
docker build -t your-docker-repo/driver-service:latest driver-service/
# ...repeat for all services and frontend
```

### 2. Deploy Redis Cluster (recommended: Bitnami Helm chart)
```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm install redis-cluster bitnami/redis-cluster --set cluster.enabled=true
```

### 3. Deploy PostgreSQL (with replication/sharding as needed)
- Use a managed cloud DB or Helm chart for production.

### 4. Deploy Kafka (with multiple brokers/partitions)
- Use a managed Kafka or Helm chart for production.

### 5. Apply Kubernetes manifests
```bash
kubectl apply -f infra/k8s/booking-service.yaml
kubectl apply -f infra/k8s/driver-service.yaml
kubectl apply -f infra/k8s/user-service.yaml
kubectl apply -f infra/k8s/payment-service.yaml
kubectl apply -f infra/k8s/notification-service.yaml
kubectl apply -f infra/k8s/api-gateway.yaml
kubectl apply -f infra/k8s/api-gateway-ingress.yaml
```

### 6. Set up secrets and configmaps
- Create Kubernetes secrets and configmaps for each service (see YAML examples in docs).

### 7. Access the app
- Use the Ingress or LoadBalancer URL provided by your Kubernetes cluster.

---

## Environment Variables
- All sensitive data (DB, Redis, Kafka, JWT, API keys) must be set in `.env` or as Kubernetes secrets.
- See `.env.example` in each service and frontend for required keys.

---

## Scaling & Observability
- Use Kubernetes Horizontal Pod Autoscaler (HPA) for auto-scaling.
- Use Prometheus/Grafana for monitoring.
- Use centralized logging (ELK, Loki, etc.) for logs.

---

## Security
- All traffic should go through HTTPS (use cert-manager or cloud SSL).
- Use JWT for authentication in all APIs and sockets.
- Never commit real secrets to the repo.

---

## Docs & API Reference
- Each service has Swagger/OpenAPI docs at `/api-docs` (when running).
- See `docs/` in each service for more details.

---

## Troubleshooting
- Check logs for each service (`kubectl logs <pod>` or `docker logs <container>`)
- Ensure all environment variables are set and secrets/configmaps are mounted.
- For scaling issues, check resource limits and HPA settings.

---

## Contributing
- Fork, branch, and submit PRs.
- Follow code style and commit guidelines.

---

## License
MIT 