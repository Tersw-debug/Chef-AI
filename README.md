# 🤖 Chef AI – Agentic AI Web Application (Gemini-like System)

Chef AI is a full-stack **agentic AI web application** inspired by systems like Gemini.

It combines:
- A modern React frontend
- A secure Node.js backend (authentication + authorization + quota system)
- A Python FastAPI ReAct Agent system (LLM + tool-using AI agent)

The system is designed to simulate an **intelligent AI assistant capable of reasoning, using tools, and interacting through structured agent loops**.

---

## 🧠 System Overview

Chef AI is built as a **multi-layer AI architecture**:
Frontend (React)
↓
Backend API (Node.js + Express)
↓
Auth / Quota / Email / Redis / MongoDB
↓
ReAct Agent System (Python + FastAPI)
↓
LLM + Tools + Agent Loop


---

## 🚀 Features

### 🖥 Frontend (React)
- Modern UI built with React + Vite
- Authentication pages (Login / Signup / Reset Password)
- User profile dashboard
- Email verification flow UI
- Context-based auth system
- API integration with backend
- Responsive design

---

### ⚙️ Backend (Node.js + Express)

#### 🔐 Authentication & Authorization
- User registration & login
- JWT-based authentication
- Refresh token system
- Role-based access control
- Password reset system
- Email verification system

#### 🚦 Rate Limiting & Quota System
- API quota tracking per user
- Login attempt limiter
- Abuse prevention middleware

#### 📧 Email System
- Verification emails
- Password reset emails

#### 🧠 Infrastructure
- Redis caching (sessions / tokens / quotas)
- MongoDB + Mongoose ORM
- CORS & security configuration
- Dockerized backend environment

---

### 🤖 ReAct Agent System (Python + FastAPI)

This is the **AI brain of the system**.

#### 🧠 Agent Capabilities
- ReAct (Reasoning + Acting) loop implementation
- Tool-using AI agent
- Structured schema-based reasoning
- Prompt engineering system
- LLM integration layer

#### 🛠 Core Components
- `agent.py` → main agent loop
- `llm.py` → LLM abstraction layer
- `tools.py` → tool execution system
- `schema.py` → structured outputs
- `prompts.py` → system prompts
- `logging_config.py` → debugging + tracing

#### 🔬 Testing
- Agent loop validation tests
- JSON parsing tests
- Schema correctness tests

---

## 🧱 Project Architecture

📦 Chef AI System
│
├── 🎨 Frontend (React)
│ ├── Authentication UI
│ ├── Profile Dashboard
│ └── API Communication Layer
│
├── ⚙️ Backend (Node.js / Express)
│ ├── Auth System (JWT + Refresh Tokens)
│ ├── Email Verification
│ ├── Quota & Rate Limiting
│ ├── Redis Caching
│ └── MongoDB Database Layer
│
└── 🤖 ReAct Agent (Python / FastAPI)
├── LLM Interface
├── Agent Loop Engine
├── Tool System
├── Prompt Engineering
└── Structured Reasoning Layer


---

## 🧰 Tech Stack

### Frontend
- React
- Vite
- JavaScript (ES6+)
- CSS Modules

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- Redis
- Docker
- JWT Authentication
- Nodemailer (email system)

### AI Agent System
- Python
- FastAPI
- LLM integration
- ReAct architecture
- Logging & testing framework

---

## 🔐 Authentication Flow

1. User registers
2. Backend sends verification email
3. User verifies account
4. Login generates:
   - Access token (JWT)
   - Refresh token (Redis stored)
5. Quota system tracks usage
6. Protected routes require JWT validation

---

## 🤖 AI Agent Flow (ReAct System)

1. User sends query from frontend
2. Backend forwards request to agent API
3. Agent executes:
   - Reasoning step
   - Tool selection (if needed)
   - Action execution
   - Final response generation
4. Response returned to frontend

---

## 📂 Project Structure

### 🤖 ReAct Agent System
Re-Act Agent/
├── agent.py
├── app.py
├── llm.py
├── tools.py
├── schema.py
├── prompts.py
├── logging_config.py
├── logs/
└── tests/


---

### ⚙️ Backend

Backend/
├── server.js
├── auth.js
├── refreshToken.js
├── verification.js
├── resetpassword.js
├── config/
├── controllers/
├── middleware/
├── utils/
└── public/


---

### 🎨 Frontend

Frontend/
├── index.html
├── vite.config.js
├── component/
├── src/
│ ├── App.jsx
│ ├── context/
│ └── hooks/
└── public/


---

## ▶️ Installation

### 1. Clone Repository
```bash id="clone1"
git clone https://github.com/Tersw-debug/Chef-AI
cd Chef-AI

2. Backend Setup

cd Backend
npm install
npm run dev

3. Frontend Setup

cd Frontend
npm install
npm run dev

4. Agent System Setup

cd Re-Act Agent
pip install -r requirements.txt
uvicorn app:app --reload

🐳 Docker Support

Backend supports Docker deployment:

docker build -t chef-ai-backend .
docker run -p 5000:5000 chef-ai-backend