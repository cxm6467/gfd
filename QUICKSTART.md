# 🚀 Quick Start Guide - GF'd

## Prerequisites

- **Node.js 20+** - [Download here](https://nodejs.org/)
- **Docker & Docker Compose** - [Download here](https://www.docker.com/products/docker-desktop/)
- **Git** - [Download here](https://git-scm.com/)

## 🏃‍♂️ 30-Second Setup

```bash
# 1. Clone and setup
git clone <your-repo-url>
cd gfd-dating-app
cp .env.local .env

# 2. Start everything with Docker
docker-compose up -d

# 3. Install frontend dependencies
npm install

# 4. Start frontend development server
npm run dev:frontend
```

**🎉 That's it!** Open http://localhost:5173

## 🐳 What Docker Gives You

When you run `docker-compose up -d`, you get:

- **PostgreSQL** (localhost:5432) - Main database
- **Redis** (localhost:6379) - Caching & sessions  
- **MongoDB** (localhost:27017) - Analytics & logs
- **MinIO** (localhost:9000/9001) - File storage (S3-compatible)
- **Supabase** (localhost:54321) - Auth & real-time features
- **Nginx** (localhost:80) - Reverse proxy

## 🔧 Development Commands

```bash
# Frontend only (most common during development)
npm run dev:frontend

# Backend only (if you're working on API)
npm run dev:backend

# Both frontend and backend
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## 🧪 Test Mode Features

The app includes a **Test Mode** for easy development:

- **Red banner** at top with toggle switch
- **Quick sign-in** button (bypasses real auth)
- **Mock data** for all features
- **No external API calls** required

Toggle test mode ON/OFF using the switch in the red banner.

## 📱 What You'll See

1. **Homepage** - Landing page with features
2. **Profile Setup** - Create/edit your profile
3. **Dashboard** - Swipe through potential matches
4. **Matches** - See your mutual matches
5. **Messages** - Chat with matches
6. **Restaurants** - Find gluten-free dining options
7. **Verification** - Verify your account for trust

## 🔐 Auth0 Setup (Optional)

For JWT experimentation:

1. **Create Auth0 account** at [auth0.com](https://auth0.com)
2. **Create SPA application**
3. **Configure URLs**:
   - Callback: `http://localhost:5173/login/callback`
   - Logout: `http://localhost:5173`
4. **Update .env**:
   ```bash
   VITE_AUTH0_DOMAIN=your-domain.auth0.com
   VITE_AUTH0_CLIENT_ID=your_client_id
   ```

## 🗄️ Database Access

```bash
# PostgreSQL
docker-compose exec postgres psql -U gfd_user -d gfd_db

# Redis
docker-compose exec redis redis-cli

# MongoDB
docker-compose exec mongodb mongosh -u gfd_mongo_user -p gfd_mongo_password
```

## 📊 Monitoring

- **MinIO Console**: http://localhost:9001 (gfd_minio_user / gfd_minio_password)
- **Supabase Studio**: http://localhost:54321
- **Backend API**: http://localhost:4000/health
- **API Docs**: http://localhost:4000/docs

## 🛠️ Troubleshooting

### Common Issues:

**Port conflicts:**
```bash
# Check what's using ports
lsof -i :5173
lsof -i :4000
lsof -i :5432
```

**Docker issues:**
```bash
# Reset everything
docker-compose down -v
docker-compose up -d
```

**Dependencies:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

**Database connection:**
```bash
# Check database is running
docker-compose ps
docker-compose logs postgres
```

## 🎯 Ready to Code!

The project is now fully set up for local development with:

- ✅ **Hot reloading** for instant feedback
- ✅ **Mock data** so no external APIs needed
- ✅ **Test mode** for easy development
- ✅ **Complete database** with sample data
- ✅ **File storage** for media uploads
- ✅ **Authentication** with JWT inspection
- ✅ **Real-time features** ready to go

Start coding and see changes instantly! 🚀