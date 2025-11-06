# DigitalKin Agent API

AdonisJS-based API for DigitalKin agents.

## Prerequisites

- Node.js 22.x
- npm
- Docker and Docker Compose (for containerized setup)

## Getting Started

### 1. Clone and Install Dependencies

```bash
npm ci
```

### 2. Environment Configuration

Create your environment file:

```bash
cp .env.example .env.development.local
```

Update `.env.development.local` with your configuration:

```env
NODE_ENV=development
PORT=3300
APP_KEY=your-app-key-here
HOST=0.0.0.0
LOG_LEVEL=info

REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password  # optional
LOCK_STORE=redis
```

> **Note:** Generate a secure `APP_KEY` using: `node ace generate:key`

### 3. Running the Project using Docker Compose

This will start both the API and Redis:

```bash
docker-compose up -d
```

To rebuild after changes:

```bash
docker-compose up --build
```

To stop:

```bash
docker-compose down
```

If using Redis with a password, please set `REDIS_PASSWORD` in your env files

```env
REDIS_PASSWORD=your-redis-password
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run test` - Run linting and build tests
- `npm run test:unit` - Run unit tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run typecheck` - Run TypeScript type checking

## API Access

Once running, the API will be available at:

```
http://localhost:3300
```
