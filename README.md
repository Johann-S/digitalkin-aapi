# DigitalKin Agent API

AdonisJS-based API for DigitalKin agents.

## 🧠 Overview

The **DigitalKin Agent API** provides a framework for creating and interacting with autonomous agents.

Agents can be:
- **Built-in** agents like `EchoAgent` or `RpsAgent`
- **AI-powered** agents leveraging OpenAI's API with customizable personas

This API handles:
- Agent creation and persistence in Redis
- Conversation management and message history
- Locking and concurrency control via AdonisJS Lock
- Streaming responses

## 🤖 Agent Types

- **EchoAgent** → repeats user messages  
- **RpsAgent** → plays Rock-Paper-Scissors, I dare you to beat it!
- **OpenAIAgent** → uses OpenAI to generate contextual replies  

## 📘 API Reference

See full API documentation here:  
➡️ [docs/API.md](./docs/API.md)

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
REDIS_PASSWORD="your-redis-password"
LOCK_STORE=redis
OPENAI_API_KEY="" #optional
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
