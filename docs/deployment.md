# Deployment Guide - GlutenConnect

## Overview

This guide covers the deployment process for GlutenConnect across different environments, from development to production.

## Environment Overview

### Development Environment
- **Local development** with hot reloading
- **Docker Compose** for local services
- **Test data** and mock services
- **Debug logging** enabled

### Staging Environment  
- **Production-like** configuration
- **Real external services** (limited scope)
- **End-to-end testing** environment
- **Performance testing**

### Production Environment
- **High availability** setup
- **Auto-scaling** capabilities  
- **Monitoring** and alerting
- **Backup** and disaster recovery

## Technology Stack

### Infrastructure
- **Cloud Provider**: AWS/Google Cloud Platform
- **Container Orchestration**: Docker + Kubernetes
- **Load Balancer**: AWS ALB/GCP Load Balancer
- **CDN**: CloudFlare
- **DNS**: CloudFlare DNS

### Database
- **Primary Database**: PostgreSQL (RDS/Cloud SQL)
- **Cache**: Redis (ElastiCache/Cloud Memorystore)
- **Search**: Elasticsearch (AWS OpenSearch)
- **File Storage**: S3/Cloud Storage

### Monitoring & Logging
- **APM**: DataDog/New Relic
- **Logging**: ELK Stack
- **Error Tracking**: Sentry
- **Uptime Monitoring**: PingDom

## Deployment Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CloudFlare    │    │   Load Balancer │    │   Kubernetes    │
│      CDN        │────│      (ALB)      │────│    Cluster      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                       ┌────────────────────────────────┼────────────────────────────────┐
                       │                               │                               │
               ┌───────▼────────┐              ┌───────▼────────┐              ┌───────▼────────┐
               │   Frontend     │              │   Backend      │              │   Background   │
               │   (React)      │              │   (Fastify)    │              │    Workers     │
               └────────────────┘              └────────────────┘              └────────────────┘
                                                       │
                               ┌────────────────────────┼────────────────────────┐
                               │                       │                       │
                       ┌───────▼────────┐      ┌───────▼────────┐      ┌───────▼────────┐
                       │   PostgreSQL   │      │     Redis      │      │   File Storage │
                       │   (Primary)    │      │    (Cache)     │      │      (S3)      │
                       └────────────────┘      └────────────────┘      └────────────────┘
```

## Docker Configuration

### Frontend Dockerfile
```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Backend Dockerfile
```dockerfile
FROM node:20-alpine
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .
RUN npm run build

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S backend -u 1001
USER backend

EXPOSE 4000
CMD ["npm", "start"]
```

### Docker Compose (Development)
```yaml
# TODO: Create comprehensive docker-compose.yml
version: '3.8'
services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "5173:5173"
    environment:
      - VITE_TEST_MODE=true
    volumes:
      - .:/app
      - /app/node_modules

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:password@db:5432/glutenconnect
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    volumes:
      - ./backend:/app
      - /app/node_modules

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=glutenconnect
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

## Kubernetes Deployment

### Namespace Configuration
```yaml
# TODO: Create Kubernetes deployment manifests
apiVersion: v1
kind: Namespace
metadata:
  name: glutenconnect-prod
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: glutenconnect-prod
data:
  NODE_ENV: "production"
  PORT: "4000"
  # Add other non-sensitive config
```

### Backend Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  namespace: glutenconnect-prod
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: glutenconnect/backend:latest
        ports:
        - containerPort: 4000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 4000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 4000
          initialDelaySeconds: 5
          periodSeconds: 5
```

### Service Configuration
```yaml
apiVersion: v1
kind: Service
metadata:
  name: backend-service
  namespace: glutenconnect-prod
spec:
  selector:
    app: backend
  ports:
  - protocol: TCP
    port: 80
    targetPort: 4000
  type: ClusterIP
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: backend-ingress
  namespace: glutenconnect-prod
  annotations:
    kubernetes.io/ingress.class: "nginx"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  tls:
  - hosts:
    - api.glutenconnect.com
    secretName: backend-tls
  rules:
  - host: api.glutenconnect.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: backend-service
            port:
              number: 80
```

## CI/CD Pipeline

### GitHub Actions Workflow
```yaml
# TODO: Create comprehensive GitHub Actions workflow
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run type check
      run: npm run typecheck
    
    - name: Run linting
      run: npm run lint
    
    - name: Run tests
      run: npm run test:coverage
    
    - name: Run E2E tests
      run: npm run test:e2e

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - uses: actions/checkout@v4
    
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v4
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: us-west-2
    
    - name: Login to Amazon ECR
      uses: aws-actions/amazon-ecr-login@v2
    
    - name: Build and push Docker images
      run: |
        # Build and push backend image
        docker build -t $ECR_REGISTRY/glutenconnect-backend:$GITHUB_SHA ./backend
        docker push $ECR_REGISTRY/glutenconnect-backend:$GITHUB_SHA
        
        # Build and push frontend image
        docker build -t $ECR_REGISTRY/glutenconnect-frontend:$GITHUB_SHA .
        docker push $ECR_REGISTRY/glutenconnect-frontend:$GITHUB_SHA
    
    - name: Deploy to Kubernetes
      run: |
        aws eks get-token --cluster-name glutenconnect-prod | kubectl apply -f k8s/
        kubectl set image deployment/backend backend=$ECR_REGISTRY/glutenconnect-backend:$GITHUB_SHA
        kubectl set image deployment/frontend frontend=$ECR_REGISTRY/glutenconnect-frontend:$GITHUB_SHA
```

## Database Migrations

### Migration Strategy
```typescript
// TODO: Implement database migration system
// Automated migration deployment with rollback capability

interface MigrationConfig {
  environment: 'development' | 'staging' | 'production';
  autoMigrate: boolean;
  backupBeforeMigration: boolean;
  rollbackOnFailure: boolean;
}

const migrationConfig: Record<string, MigrationConfig> = {
  production: {
    environment: 'production',
    autoMigrate: false, // Manual approval required
    backupBeforeMigration: true,
    rollbackOnFailure: true,
  },
  staging: {
    environment: 'staging', 
    autoMigrate: true,
    backupBeforeMigration: true,
    rollbackOnFailure: true,
  },
};
```

### Migration Deployment
```bash
#!/bin/bash
# TODO: Create migration deployment script

# Pre-deployment checks
echo "Running pre-deployment checks..."
npm run db:check-connection
npm run db:backup

# Run migrations
echo "Applying database migrations..."
npm run db:migrate

# Verify migration success
if [ $? -eq 0 ]; then
  echo "Migrations applied successfully"
else
  echo "Migration failed, rolling back..."
  npm run db:rollback
  exit 1
fi

# Post-migration verification
npm run db:verify-schema
```

## Environment Configuration

### Production Environment Variables
```bash
# TODO: Set up production environment configuration

# Application
NODE_ENV=production
PORT=4000
FRONTEND_URL=https://glutenconnect.com

# Database (use managed services)
DATABASE_URL="postgresql://username:password@prod-db.region.rds.amazonaws.com:5432/glutenconnect"
REDIS_URL="redis://prod-redis.cluster.region.cache.amazonaws.com:6379"

# Authentication
AUTH0_DOMAIN=glutenconnect.auth0.com
# ... other production configs

# Monitoring
SENTRY_DSN=https://your-production-sentry-dsn
DATADOG_API_KEY=your-production-datadog-key

# Security
CORS_ORIGINS=https://glutenconnect.com,https://www.glutenconnect.com
RATE_LIMIT_STRICT=true
```

### Secret Management
```yaml
# TODO: Configure secret management
# Using AWS Secrets Manager or Kubernetes Secrets

apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
  namespace: glutenconnect-prod
type: Opaque
data:
  database-url: <base64-encoded-db-url>
  jwt-secret: <base64-encoded-jwt-secret>
  stripe-secret: <base64-encoded-stripe-secret>
```

## Monitoring Setup

### Health Checks
```typescript
// TODO: Implement comprehensive health checks
export const healthCheck = {
  '/health': () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  }),
  
  '/health/detailed': async () => ({
    status: 'ok',
    database: await checkDatabaseConnection(),
    redis: await checkRedisConnection(),
    externalAPIs: await checkExternalAPIs(),
    diskSpace: await checkDiskSpace(),
    memory: process.memoryUsage(),
  }),
};
```

### Metrics Collection
```typescript
// TODO: Set up metrics collection
interface ApplicationMetrics {
  activeUsers: number;
  messagesPerMinute: number;
  matchesPerMinute: number;
  errorRate: number;
  responseTime: number;
  databaseQueryTime: number;
}
```

## Backup & Recovery

### Database Backup Strategy
```bash
# TODO: Implement automated backup system

# Daily full backup
0 2 * * * pg_dump $DATABASE_URL | gzip > /backups/daily/$(date +\%Y\%m\%d).sql.gz

# Hourly incremental backup
0 * * * * pg_receivewal -D /backups/wal -h $DB_HOST -U $DB_USER

# Weekly backup verification
0 3 * * 0 /scripts/verify-backup.sh
```

### Disaster Recovery Plan
1. **RTO (Recovery Time Objective)**: 4 hours
2. **RPO (Recovery Point Objective)**: 1 hour
3. **Backup verification**: Weekly automated testing
4. **Cross-region replication**: Enabled for critical data
5. **Incident response team**: On-call rotation

## Performance Optimization

### Caching Strategy
```typescript
// TODO: Implement multi-layer caching
interface CacheStrategy {
  cdn: 'CloudFlare'; // Static assets
  application: 'Redis'; // API responses, sessions
  database: 'Read replicas'; // Query optimization
}
```

### Auto-scaling Configuration
```yaml
# TODO: Configure horizontal pod autoscaling
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: backend-hpa
  namespace: glutenconnect-prod
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: backend
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

## Security Configuration

### Network Security
```yaml
# TODO: Configure network policies
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: backend-network-policy
  namespace: glutenconnect-prod
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: ingress-nginx
    ports:
    - protocol: TCP
      port: 4000
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          name: database
    ports:
    - protocol: TCP
      port: 5432
```

## Rollback Procedures

### Automated Rollback
```bash
# TODO: Create rollback automation
#!/bin/bash

PREVIOUS_VERSION=$1

if [ -z "$PREVIOUS_VERSION" ]; then
  echo "Usage: $0 <previous-version>"
  exit 1
fi

echo "Rolling back to version: $PREVIOUS_VERSION"

# Rollback Kubernetes deployments
kubectl set image deployment/backend backend=glutenconnect/backend:$PREVIOUS_VERSION
kubectl set image deployment/frontend frontend=glutenconnect/frontend:$PREVIOUS_VERSION

# Wait for rollback to complete
kubectl rollout status deployment/backend
kubectl rollout status deployment/frontend

echo "Rollback completed successfully"
```

### Database Rollback
```sql
-- TODO: Implement database rollback procedures
-- Maintain migration rollback scripts for each version
-- Test rollback procedures in staging environment
```

## Post-Deployment Verification

### Smoke Tests
```typescript
// TODO: Create post-deployment smoke tests
describe('Post-Deployment Smoke Tests', () => {
  it('should verify API health endpoint', async () => {
    const response = await fetch('https://api.glutenconnect.com/health');
    expect(response.status).toBe(200);
  });

  it('should verify database connectivity', async () => {
    // Test database queries
  });

  it('should verify authentication flow', async () => {
    // Test user authentication
  });

  it('should verify core functionality', async () => {
    // Test key user workflows
  });
});
```

This deployment guide provides a comprehensive foundation for deploying GlutenConnect across all environments with proper monitoring, security, and recovery procedures.