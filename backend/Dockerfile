# Development Dockerfile for Backend
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Expose port
EXPOSE 4000

# Start development server
CMD ["npm", "run", "dev"]