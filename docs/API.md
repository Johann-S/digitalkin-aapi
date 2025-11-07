# 📘 DigitalKin Agent API Documentation

This document provides a complete reference for all available API endpoints.

You can also test all routes directly using the provided **Postman collection**:

> 📂 [`postman_collection.json`](../postman_collection.json)

---

## 🧭 Base URL

```
http://localhost:3300
```

---

## 🔹 Agents Endpoints

### ➕ Create an Agent

**POST** `/agents`

```bash
curl -X POST http://localhost:3300/agents -H "Content-Type: application/json" -d '{"name":"RpsAgent","type":"rps","persona":"The best at rock paper scissors"}'
```

**Response**
```json
{
  "id": 1,
  "name": "RPS",
  "type": "rps",
  "persona": "The best at rock paper scissors",
  "createdAt": "2025-11-06T14:11:20.563Z",
  "updatedAt": "2025-11-06T14:11:20.563Z"
}
```

---

### 📜 List All Agents

**GET** `/agents`

```bash
curl http://localhost:3300/agents
```

**Response**
```json
[
  {
    "id": 1,
    "name": "RPS",
    "type": "rps",
    "persona": "The best at rock paper scissors",
    "createdAt": "2025-11-06T14:11:20.563Z",
    "updatedAt": "2025-11-06T14:11:20.563Z"
  }
]
```

---

### 🔍 Get an Agent by ID

**GET** `/agents/:id`

```bash
curl http://localhost:3300/agents/1
```

**Response**
```json
{
  "id": 1,
  "name": "RPS",
  "type": "rps",
  "persona": "The best at rock paper scissors",
  "createdAt": "2025-11-06T14:11:20.563Z",
  "updatedAt": "2025-11-06T14:11:20.563Z"
}
```

---

### ✏️ Update an Agent

**PUT** `/agents/:id`

```bash
curl -X PUT http://localhost:3300/agents/1 -H "Content-Type: application/json" -d '{"persona":"The best of the best at RPS"}'
```

**Response**
```json
{
  "id": 1,
  "name": "RPS",
  "type": "rps",
  "persona": "The best of the best at RPS",
  "createdAt": "2025-11-06T14:11:20.563Z",
  "updatedAt": "2025-11-06T14:11:20.563Z"
}
```

---

### 🗑️ Delete an Agent

**DELETE** `/agents/:id`

```bash
curl -X DELETE http://localhost:3300/agents/1
```

---

## 💬 Conversations Endpoints

### 🧠 Start a New Conversation

**POST** `/conversations`

```bash
curl -X POST http://localhost:3300/conversations -H "Content-Type: application/json" -d '{"agentId":1,"message":"✂️"}'
```

**Response**
```json
{
  "type": "complete",
  "conversationId": "wMsKuMaJHb3gScmPHlsSQ",
  "message": {
    "id": "bPBIFp82U-Ouza1pCNukX",
    "role": "assistant",
    "content": "📄",
    "createdAt": "2025-11-06T20:52:22.326Z"
  }
}
```

---

### 💭 Send a Message to a Conversation

**POST** `/conversations/:id/messages`

```bash
curl -X POST http://localhost:3300/conversations/wMsKuMaJHb3gScmPHlsSQ/messages -H "Content-Type: application/json" -d '{"message": "🪨"}'
```

**Response**
```json
{
  "type": "complete",
  "message": {
    "id": "dyvwL71jo5qy4mS6EwE2e",
    "role": "assistant",
    "content": "✂️",
    "createdAt": "2025-11-06T20:52:54.801Z"
  }
}
```

---

### 📜 Get All Messages in a Conversation

**GET** `/conversations/:id`

```bash
curl http://localhost:3300/conversations/wMsKuMaJHb3gScmPHlsSQ
```

**Response**
```json
{
  "id": "wMsKuMaJHb3gScmPHlsSQ",
  "agentId": 1,
  "messages": [
    {
      "id": "XIDZjRUxanakQFXn4xAD2",
      "role": "user",
      "content": "paper",
      "createdAt": "2025-11-06T20:52:22.024Z"
    },
    {
      "id": "bPBIFp82U-Ouza1pCNukX",
      "role": "assistant",
      "content": "📄",
      "createdAt": "2025-11-06T20:52:22.326Z"
    },
    {
      "id": "X3Pg5R9GyVbv-OnZA6dCa",
      "role": "user",
      "content": "🪨",
      "createdAt": "2025-11-06T20:52:54.499Z"
    },
    {
      "id": "dyvwL71jo5qy4mS6EwE2e",
      "role": "assistant",
      "content": "✂️",
      "createdAt": "2025-11-06T20:52:54.801Z"
    }
  ],
  "createdAt": "2025-11-06T20:52:22.024Z",
  "updatedAt": "2025-11-06T20:52:54.801Z"
}
```

---

## ⚡ Streaming Responses

All of our agents answers with a **real-time streaming** response.

---

## 🧪 Testing with Postman

You can use the provided Postman collection to explore the API:

1. Import `postman_collection.json` into Postman.  
2. Set `{{host}}` to `http://localhost:3300`.  
3. Run the predefined requests to create agents and start conversations.  
4. Observe agent responses (Echo, RPS, OpenAI).

---

## 🧾 Notes

- Built-in agents (`Echo`, `RPS`) do not require any external API keys.  
- OpenAI-based agents need a valid `OPENAI_API_KEY` set in your environment.  
- If OpenAI is unavailable, the API automatically falls back to a local echo response.
