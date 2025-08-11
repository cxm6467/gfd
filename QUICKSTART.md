# 🚀 Quick Start Guide - GF'd Skeleton

## Prerequisites

- **Node.js 20+** - [Download here](https://nodejs.org/)
- **Docker & Docker Compose** - [Download here](https://www.docker.com/products/docker-desktop/)
- **Git** - [Download here](https://git-scm.com/)

## 🏃‍♂️ 30-Second Setup

```bash
# 1. Clone and setup
git clone <your-repo-url>
cd gfd-dating-app
npm run setup
```

**🎉 That's it!** 

- **Frontend**: http://localhost:5173
- **Services Dashboard**: http://localhost:8080

## 🐳 What You Get

### Infrastructure Services (Docker)
- **PostgreSQL** (localhost:5432) - Main database with sample schema
- **Redis** (localhost:6379) - Caching & sessions  
- **MongoDB** (localhost:27017) - Analytics & logs
- **MinIO** (localhost:9000/9001) - S3-compatible file storage
- **MailHog** (localhost:8025) - Email testing
- **Nginx** (localhost:8080) - Service dashboard

### Frontend Application
- **React + TypeScript** - Modern UI framework
- **Tailwind CSS** - Utility-first styling
- **Mock data** - Works without backend
- **Test mode** - Easy development features

## 🔧 Development Commands

```bash
# Start all infrastructure services
npm run services:up

# Start frontend development
npm run dev

# Run quality checks
npm run lint
npm run typecheck
npm test

# View service logs
npm run services:logs

# Reset all data
npm run services:reset

# Stop all services
npm run services:down
```

## 🧪 Test Mode Features

The app includes **Test Mode** for easy development:

- **Red banner** at top with toggle switch
- **Mock authentication** - No real auth required
- **Sample data** - Pre-populated profiles, matches, messages
- **Quick sign-in** - Bypass real authentication flows

## 📱 What You'll See

1. **Homepage** - Landing page with features overview
2. **Profile Setup** - User registration and profile creation
3. **Dashboard** - Swipe through potential matches
4. **Matches** - View mutual matches
5. **Messages** - Chat interface with mock conversations
6. **Restaurants** - Gluten-free restaurant discovery
7. **Verification** - Account verification system

## 🗄️ Database Access

```bash
# PostgreSQL (main database)
docker exec -it gfd-postgres psql -U gfd_user -d gfd_db

# Redis (cache)
docker exec -it gfd-redis redis-cli -a gfd_redis_password

# MongoDB (analytics)
docker exec -it gfd-mongodb mongosh -u gfd_mongo_user -p gfd_mongo_password
```

## 📊 Service Dashboards

- **MinIO Console**: http://localhost:9001
  - Username: `gfd_minio_user`
  - Password: `gfd_minio_password`
- **MailHog**: http://localhost:8025 (email testing)
- **Services Overview**: http://localhost:8080

## 🛠️ Implementation Ready

### What's Stubbed (Ready for Implementation)
- ✅ **Authentication services** - Auth0, Supabase, custom auth
- ✅ **Media upload** - Encrypted file storage
- ✅ **Restaurant API** - Google Places integration
- ✅ **Payment processing** - Stripe integration
- ✅ **Verification services** - Photo, ID, location verification
- ✅ **Real-time messaging** - Socket.io integration
- ✅ **Analytics** - User behavior tracking

### Implementation Guides
- **`ROADMAP.md`** - FAANG-level project roadmap
- **`IMPLEMENTATION_GUIDE.md`** - Step-by-step technical guide
- **`docs/`** - Complete technical documentation

## 🧪 Testing

```bash
# Run all tests
npm test

# Watch mode for development
npm run test:watch

# Coverage report
npm run test:coverage
```

## 🛠️ Troubleshooting

### Port Conflicts
```bash
# Check what's using ports
lsof -i :5173  # Frontend
lsof -i :5432  # PostgreSQL
lsof -i :6379  # Redis
```

### Reset Everything
```bash
# Nuclear option - reset all data and containers
npm run services:down
docker system prune -f
npm run setup
```

### Database Issues
```bash
# Check database status
docker exec gfd-postgres pg_isready -U gfd_user -d gfd_db

# View database logs
docker logs gfd-postgres
```

## 🎯 Next Steps

1. **Explore the frontend** - Everything works with mock data
2. **Review the roadmap** - `ROADMAP.md` has your implementation plan
3. **Choose your first milestone** - Start with authentication or matching
4. **Follow the implementation guide** - Step-by-step instructions
5. **Build incrementally** - Each service is independent

## 🏗️ Architecture Highlights

- **Monorepo structure** - Everything in one place
- **Docker-first** - Consistent development environment
- **TypeScript everywhere** - Type safety and great DX
- **Test-driven** - All components have test stubs
- **Security-focused** - Encryption and safety built-in
- **Scalable design** - Microservices-ready architecture

**Ready to build the future of gluten-free dating! 🌾💙**