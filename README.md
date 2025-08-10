# GF'd - Gluten-Free Dating Platform

A sophisticated dating platform designed for individuals with gluten-free dietary requirements, including those with celiac disease, non-celiac gluten sensitivity, and lifestyle choices.

## 🌟 Features

- **Specialized Matching**: Algorithm designed for gluten-free lifestyle compatibility
- **Safe Dating**: Built-in safety features and community guidelines
- **Restaurant Integration**: Find gluten-free friendly dining options
- **Real-time Messaging**: Secure, encrypted messaging system
- **Multi-platform Authentication**: Email, Google, and Facebook sign-in options
- **Premium Features**: Advanced filtering and enhanced matching capabilities

## 🚀 Quick Start with Docker

### Prerequisites
- Docker and Docker Compose installed
- Git

### Local Development Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd gfd-dating-app
```

2. **Copy environment files**
```bash
cp .env.local .env
```

3. **Start all services**
```bash
docker-compose up -d
```

4. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:4000
- Database: localhost:5432
- Redis: localhost:6379
- MinIO (File Storage): http://localhost:9001
- MongoDB: localhost:27017

### Services Included
- **Frontend**: React + Vite development server
- **Backend**: Fastify + GraphQL API server
- **PostgreSQL**: Primary database with PostGIS
- **Redis**: Caching and session storage
- **MinIO**: S3-compatible file storage
- **MongoDB**: Analytics and logging
- **Nginx**: Reverse proxy and load balancer
- **Supabase**: Authentication and real-time features

## 🏗️ Architecture

This application follows a modern full-stack architecture:

### Backend
- **[Fastify](https://fastify.dev/)** - Fast and low overhead web framework
- **[GraphQL](https://graphql.org/)** with **[Apollo Server](https://www.apollographql.com/docs/apollo-server/)** - Type-safe API layer
- **[Node.js LTS](https://nodejs.org/)** - JavaScript runtime (v20.x)
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety and developer experience

### Frontend  
- **[React 18+](https://react.dev/)** - Modern UI library with concurrent features
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Apollo Client](https://www.apollographql.com/docs/react/)** - GraphQL client with caching
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework

### Database & Storage
- **[PostgreSQL](https://www.postgresql.org/)** - Robust relational database
- **[Prisma](https://www.prisma.io/)** - Type-safe database ORM
- **[Redis](https://redis.io/)** - Caching and session storage

### Authentication & Security
- **[Supabase Auth](https://supabase.com/auth)** - Identity and access management
- **[JWT](https://jwt.io/)** - Secure token-based authentication
- **AES-256 Encryption** - Data protection at rest

### Payments
- **[Stripe](https://stripe.com/)** - Secure payment processing
- **Subscription Management** - Recurring billing support

### Real-time Features
- **[Socket.io](https://socket.io/)** - Real-time messaging
- **WebRTC** - Video calling capabilities

### External APIs
- **[Google Places API](https://developers.google.com/maps/documentation/places/web-service)** - Restaurant and location data
- **[Nutritionix API](https://www.nutritionix.com/business/api)** - Nutritional information

## 🛠️ Manual Development Setup

### Prerequisites

- Node.js 20.x or higher
- PostgreSQL 14+
- Redis 6+
- MongoDB 7+
- Yarn or npm

### Environment Setup

1. Clone the repository
```bash
git clone <repository-url> 
cd gfd-dating-app
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.local .env
```

4. Configure your `.env` file with:
- Database URLs (PostgreSQL, Redis, MongoDB)
- Supabase credentials
- Stripe keys
- External API keys

5. Run database migrations
```bash
npm run db:migrate
```

6. Start the development servers
```bash
# All services
npm run dev

# Or individually:
npm run dev:frontend
npm run dev:backend
```

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild services
docker-compose build

# Production deployment
docker-compose -f docker-compose.prod.yml up -d
```

## 🧪 Development Mode

The application includes a test mode toggle:

- **Red banner** always visible with iPhone-style toggle
- **Yellow toggle** when test mode is ON
- **Green toggle** when test mode is OFF
- **Quick sign-in** bypass available in test mode
- **Development features** enabled in test mode

## 📱 Design System

This project follows **Atomic Design** principles:

```
src/components/
├── atoms/          # Basic building blocks (buttons, inputs)
├── molecules/      # Simple groups of atoms
├── organisms/      # Complex components
├── templates/      # Page layouts
└── pages/          # Specific instances of templates
```

## 🗂️ Project Structure

```
├── backend/
│   ├── src/
│   │   ├── schemas/        # GraphQL schemas
│   │   ├── resolvers/      # GraphQL resolvers
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Custom middleware
│   │   └── utils/          # Utility functions
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── migrations/     # Database migrations
│   └── Dockerfile          # Backend container
├── frontend/
│   └── src/
│       ├── components/     # React components (Atomic Design)
│       ├── hooks/         # Custom React hooks
│       ├── utils/         # Utility functions
│       ├── types/         # TypeScript type definitions
│       └── graphql/       # GraphQL queries/mutations
├── docs/                  # Documentation
├── tests/                 # Test files
├── nginx/                 # Nginx configuration
├── database/              # Database initialization
├── docker-compose.yml     # Local development
├── docker-compose.prod.yml # Production deployment
├── .env.local             # Local environment template
└── .env.production        # Production environment template
```

## 🔒 Security Features

- **End-to-End Encryption** for messages
- **Multi-Factor Authentication** support
- **Rate Limiting** on sensitive endpoints
- **Input Sanitization** and validation
- **GDPR & CCPA Compliance** built-in
- **Security Headers** and CORS protection
- **Field-level Encryption** for sensitive data
- **Audit Logging** for all operations

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 📊 Performance

- **Core Web Vitals** optimized
- **Code Splitting** for optimal loading
- **Image Optimization** with lazy loading
- **Caching Strategies** at multiple levels
- **Database Query Optimization**

## 🚢 Production Deployment

### Docker Swarm / Kubernetes

```bash
# Build and deploy to production
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Setup
1. Copy `.env.production` and configure all production values
2. Set up managed databases (RDS, ElastiCache, etc.)
3. Configure SSL certificates
4. Set up monitoring and logging
5. Configure backup strategies
### Health Checks
- Backend: `GET /health`
- Database connectivity checks
- Redis connectivity checks
- File storage accessibility

## 🔧 Configuration

### Environment Variables
- **`.env.local`**: Local development settings
- **`.env.production`**: Production configuration
- **Docker environment**: Managed via docker-compose files

### Feature Flags
- `ENABLE_BACKGROUND_CHECKS`: Background verification
- `ENABLE_VIDEO_CALLS`: Video calling features  
- `ENABLE_AI_MODERATION`: AI content moderation
- `ENABLE_ANALYTICS`: User analytics tracking

## 🤖 AI Support Chat

The application includes an intelligent support chat system:

- **Context-aware responses** for common questions
- **Safety and reporting** guidance
- **Account management** assistance
- **Gluten-free dining** recommendations
- **Technical support** troubleshooting
- **24/7 availability** with human escalation

## 📋 Legal Pages

Comprehensive legal documentation included:

- **Privacy Policy** (`/privacy`): Data protection and user rights
- **Terms of Service** (`/terms`): User agreements and policies  
- **Safety Guidelines** (`/safety`): Dating safety and community guidelines

All pages are mobile-responsive and accessibility compliant.

## 🎨 Design System

**Blue/Grey/White Theme:**
- Professional and calming color palette
- Psychologically optimized for trust and safety
- Consistent spacing and typography
- Accessible contrast ratios
- Mobile-first responsive design

## 📚 Documentation

Detailed documentation is available in the `/docs` folder:

- [API Documentation](./docs/api.md)
- [Database Schema](./docs/database.md)
- [Security Guidelines](./docs/security.md)
- [Deployment Guide](./docs/deployment.md)
- [Atomic Design System](./docs/atomic-design.md)
- [Contributing Guide](./docs/contributing.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests for new functionality
5. Submit a pull request

## 🧪 Testing Strategy

- **Unit Tests**: Component and service testing
- **Integration Tests**: API and database testing  
- **E2E Tests**: Full user workflow testing
- **Security Tests**: Vulnerability scanning
- **Performance Tests**: Load and stress testing

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **AI Support Chat**: Available 24/7 in the app
- **Email Support**: support@gfd.com
- **Safety Issues**: safety@gfd.com  
- **Bug Reports**: Create an issue on GitHub
- **Documentation**: Check the `/docs` folder

---

**Built with ❤️ for the gluten-free community**