# AI Development Training - Node.js Track
# Build 1 — Streaming LLM API

Fastify backend API for streaming LLM responses using SSE.

## Features

- Fastify server
- SSE streaming chat endpoint
- Groq provider using OpenAI-compatible API
- Provider abstraction layer
- Zod request validation
- Redis conversation memory with 24-hour TTL
- Chat history endpoint
- Delete session endpoint
- Usage tracking endpoint
- Retry utility for 429/503 errors
- Pino logging with pretty logs in development

## Requirements

- Node.js 20+
- Redis running locally
- Groq API key

## Setup

Install dependencies:

```bash
npm install
```

Create `.env`:

```bash
cp .env.example .env
```

Update `.env`:

```env
GROQ_API_KEY=your_groq_api_key_here
DEFAULT_PROVIDER=groq
DEFAULT_GROQ_MODEL=llama-3.1-8b-instant
REDIS_URL=redis://localhost:6379
```

Start Redis:

```bash
sudo systemctl start redis-server
redis-cli ping
```

Expected:

```txt
PONG
```

Start server:

```bash
npm run dev
```

## Endpoints

### Health Check

```bash
curl http://localhost:3000/api/health
```

### Streaming Chat

```bash
curl -N -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test-session-1",
    "message": "Explain RAG in 3 simple bullet points",
    "provider": "groq",
    "systemPrompt": "You are an AI engineering tutor. RAG means Retrieval-Augmented Generation."
  }'
```

### Get Chat History

```bash
curl http://localhost:3000/api/chat/test-session-1/history
```

### Clear Chat Session

```bash
curl -X DELETE http://localhost:3000/api/chat/test-session-1
```

### Usage Summary

```bash
curl http://localhost:3000/api/usage
```

### Retry Test

```bash
node src/scripts/test-retry.js
```

## Notes

- Usage tracking is currently stored in memory and resets when the server restarts.
- Conversation memory is stored in Redis with a 24-hour TTL.
- Groq is used as the free learning provider.
- OpenAI and Anthropic providers can be added later using the same provider abstraction.