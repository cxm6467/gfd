import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import jwt from '@fastify/jwt';
import multipart from '@fastify/multipart';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { mediaRoutes } from './routes/media';

// TODO: Import GraphQL Apollo Server integration
// TODO: Import authentication middleware
// TODO: Import database connection (Prisma)
// TODO: Import route handlers

const fastify = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  },
});

// Security middleware
await fastify.register(helmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
});

// CORS configuration
await fastify.register(cors, {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://glutenconnect.com'] 
    : ['http://localhost:5173'],
  credentials: true,
});

// Rate limiting
await fastify.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
});

// JWT authentication
await fastify.register(jwt, {
  secret: process.env.JWT_SECRET || 'your-secret-key',
});

// File upload support
await fastify.register(multipart);

// API documentation
await fastify.register(swagger, {
  swagger: {
    info: {
      title: 'GlutenConnect API',
      description: 'Dating platform for gluten-free community',
      version: '1.0.0',
    },
    host: 'localhost:4000',
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
  },
});

await fastify.register(swaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false,
  },
});

// Health check endpoint
fastify.get('/health', async (request, reply) => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// TODO: Register GraphQL endpoint
// TODO: Register authentication routes
// TODO: Register profile service routes
// TODO: Register messaging routes
// Register media upload routes
await fastify.register(mediaRoutes, { prefix: '/api/media' });
// TODO: Register payment routes
// TODO: Register restaurant API routes

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 4000;
    const host = '0.0.0.0';
    
    await fastify.listen({ port, host });
    console.log(`🚀 Server running at http://${host}:${port}`);
    console.log(`📚 API docs available at http://${host}:${port}/docs`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();