# Deployment Guide - GF'd

## Overview

Comprehensive deployment guide for GF'd across different environments, from local development to production.

## Quick Start (Docker)

### Local Development
```bash
git clone <repository-url>
cd gfd-dating-app
cp .env.local .env
docker-compose up -d
```

**Access Points:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:4000
- Database: localhost:5432
- Redis: localhost:6379
- MinIO Console: http://localhost:9001
- MongoDB: localhost:27017

## Environment Setup

### Development Environment
- **Hot reloading** enabled
- **Test data** pre-populated
- **Debug logging** active
- **Mock services** for external APIs

### Staging Environment
- **Production-like** configuration
- **Real external services** (limited scope)
- **End-to-end testing** environment
- **Performance testing** setup

### Production Environment
- **High availability** configuration
- **Auto-scaling** enabled
- **Monitoring** and alerting
- **Backup** and disaster recovery

## Docker Configuration

### Development Stack
```yaml
services:
  frontend:     # React + Vite dev server
  backend:      # Fastify + GraphQL API
  postgres:     # Primary database
  redis:        # Caching and sessions
  mongodb:      # Analytics and logs
  minio:        # S3-compatible storage
  supabase:     # Authentication service
  nginx:        # Reverse proxy
```

### Production Stack
```yaml
services:
  frontend:     # Nginx + static files
  backend:      # Node.js production build
  postgres:     # Managed database (RDS)
  redis:        # Managed cache (ElastiCache)
  mongodb:      # Managed database (Atlas)
  storage:      # Managed storage (S3)
  cdn:          # Content delivery (CloudFlare)
  monitoring:   # Observability stack
```

## Database Setup

### PostgreSQL Configuration
```sql
-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Schemas
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS storage;
CREATE SCHEMA IF NOT EXISTS analytics;
```

### Redis Configuration
```redis
# Memory optimization
maxmemory 2gb
maxmemory-policy allkeys-lru

# Persistence
save 900 1
save 300 10
save 60 10000
```

### MongoDB Configuration
```javascript
// Analytics collections
db.createCollection("user_events");
db.createCollection("system_logs");
db.createCollection("performance_metrics");
```

## Security Configuration

### SSL/TLS Setup
```nginx
# SSL Configuration
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
ssl_prefer_server_ciphers off;
ssl_session_cache shared:SSL:10m;
```

### Environment Variables
```bash
# Critical security variables
JWT_SECRET=your_super_secure_jwt_secret_256_bits_minimum
ENCRYPTION_KEY=your_32_character_encryption_key
DATABASE_URL=postgresql://secure_connection_string
```

### Rate Limiting
```nginx
# Rate limiting zones
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=auth:10m rate=5r/m;
```

## Monitoring Setup

### Health Checks
```typescript
// Application health endpoints
GET /health          // Basic health check
GET /health/detailed // Comprehensive system check
GET /health/ready    // Readiness probe
GET /health/live     // Liveness probe
```

### Metrics Collection
```yaml
# Prometheus configuration
global:
  scrape_interval: 15s
scrape_configs:
  - job_name: 'gfd-backend'
    static_configs:
      - targets: ['backend:4000']
```

### Log Aggregation
```yaml
# ELK Stack configuration
elasticsearch:
  cluster.name: gfd-logs
logstash:
  pipeline.workers: 4
kibana:
  server.host: "0.0.0.0"
```

## Backup Strategy

### Database Backups
```bash
# Automated PostgreSQL backup
#!/bin/bash
BACKUP_DIR="/backups/postgres"
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > "$BACKUP_DIR/gfd_$DATE.sql"
```

### File Storage Backups
```bash
# S3 cross-region replication
aws s3api put-bucket-replication \
  --bucket gfd-uploads \
  --replication-configuration file://replication.json
```

### Redis Persistence
```redis
# Redis backup configuration
save 900 1
save 300 10
save 60 10000
dir /data/redis-backups
```

## Scaling Configuration

### Horizontal Scaling
```yaml
# Kubernetes HPA
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: gfd-backend-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: gfd-backend
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

### Load Balancing
```nginx
# Nginx upstream configuration
upstream backend {
    least_conn;
    server backend-1:4000 max_fails=3 fail_timeout=30s;
    server backend-2:4000 max_fails=3 fail_timeout=30s;
    server backend-3:4000 max_fails=3 fail_timeout=30s;
}
```

## CI/CD Pipeline

### GitHub Actions
```yaml
name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Tests
        run: |
          npm ci
          npm run test:coverage
          npm run test:e2e
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Production
        run: |
          docker-compose -f docker-compose.prod.yml up -d
```

### Deployment Verification
```bash
# Post-deployment checks
curl -f http://localhost/health || exit 1
npm run test:smoke || exit 1
```

## Rollback Procedures

### Automated Rollback
```bash
#!/bin/bash
# Rollback to previous version
PREVIOUS_VERSION=$1
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --scale backend=3
```

### Database Rollback
```sql
-- Migration rollback procedures
-- Maintain rollback scripts for each migration
BEGIN;
-- Rollback operations here
COMMIT;
```

## Performance Optimization

### Caching Strategy
```typescript
// Multi-layer caching
interface CacheConfig {
  cdn: 'CloudFlare';        // Static assets
  application: 'Redis';     // API responses
  database: 'Read replicas'; // Query optimization
}
```

### Database Optimization
```sql
-- Performance indexes
CREATE INDEX CONCURRENTLY idx_users_active 
ON users(created_at) WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY idx_messages_conversation 
ON messages(conversation_id, created_at DESC);
```

## Disaster Recovery

### Recovery Time Objectives
- **RTO**: 4 hours maximum downtime
- **RPO**: 1 hour maximum data loss
- **Backup verification**: Weekly automated testing
- **Cross-region replication**: Enabled for critical data

### Recovery Procedures
1. **Assess damage** and scope of outage
2. **Activate disaster recovery** team
3. **Restore from backups** if necessary
4. **Verify data integrity** and system functionality
5. **Communicate status** to stakeholders
6. **Conduct post-incident** review

## Security Hardening

### Network Security
```yaml
# Network policies
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: gfd-network-policy
spec:
  podSelector:
    matchLabels:
      app: gfd-backend
  policyTypes:
  - Ingress
  - Egress
```

### Container Security
```dockerfile
# Security best practices
FROM node:20-alpine
RUN addgroup -g 1001 -S nodejs
RUN adduser -S gfd -u 1001
USER gfd
```

## Troubleshooting

### Common Issues
- **Database connection failures**: Check connection strings and network
- **Memory issues**: Monitor resource usage and adjust limits
- **SSL certificate expiration**: Automated renewal with Let's Encrypt
- **Rate limiting**: Adjust limits based on usage patterns

### Debug Commands
```bash
# Container logs
docker-compose logs -f backend

# Database connectivity
docker-compose exec postgres psql -U gfd_user -d gfd_db

# Redis connectivity
docker-compose exec redis redis-cli ping
```

This deployment guide provides a comprehensive foundation for running GF'd in any environment with proper security, monitoring, and recovery procedures.