# 🏙️ Smart Civic App

A full-stack civic engagement platform that empowers citizens to interact with city services intelligently. Built with TypeScript/JavaScript and powered by a local LLM (via Ollama), the app bridges the gap between residents and municipal administration.

---

## 📁 Project Structure

```
Smart-Civic-App/
├── backend v2/          # Node.js/TypeScript REST API server
│   ├── Dockerfile
│   └── .env
├── frontend v2/         # TypeScript frontend (served via Nginx)
│   └── Dockerfile
├── docker-compose.yml   # Multi-service orchestration
└── .gitignore
```

---

## 🚀 Features

- **AI-Powered Assistance** — Integrates with [Ollama](https://ollama.com) to provide local LLM-driven civic guidance
- **Full-Stack TypeScript** — Type-safe codebase across both frontend and backend
- **Containerized Deployment** — Docker Compose setup for one-command spin-up
- **RESTful Backend** — Node.js API server with environment-based configuration
- **Production-Ready Frontend** — Static assets served via Nginx

---

## 🛠️ Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | TypeScript, Nginx (containerized) |
| Backend   | Node.js, TypeScript               |
| AI/LLM    | Ollama (local model inference)    |
| DevOps    | Docker, Docker Compose            |

---

## ⚙️ Prerequisites

- [Docker](https://docs.docker.com/get-docker/) & [Docker Compose](https://docs.docker.com/compose/install/)
- [Ollama](https://ollama.com/download) installed and running locally
- Node.js `>=18` (for local development without Docker)

---

## 🏃 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Chirag-gehlot/Smart-Civic-App.git
cd Smart-Civic-App
```

### 2. Configure Environment Variables

Copy and fill in the backend environment file:

```bash
cp "backend v2/.env.example" "backend v2/.env"
```

Edit `backend v2/.env` with your configuration values (database URIs, API keys, etc.).

### 3. Start Ollama

Make sure Ollama is running on your machine before starting the app:

```bash
ollama serve
```

Pull a model if you haven't already (e.g.):

```bash
ollama pull llama3
```

### 4. Run with Docker Compose

```bash
docker compose up --build
```

| Service  | URL                        |
|----------|----------------------------|
| Frontend | http://localhost:5001       |
| Backend  | http://localhost:3000       |
| Ollama   | http://localhost:11434      |

To stop all services:

```bash
docker compose down
```

---

## 💻 Local Development (without Docker)

### Backend

```bash
cd "backend v2"
npm install
cp .env.example .env   # configure your env vars
npm run dev
```

### Frontend

```bash
cd "frontend v2"
npm install
npm run dev
```

---

## 🔑 Environment Variables

The backend requires a `.env` file inside `backend v2/`. Key variables include:

| Variable       | Description                                  | Default                              |
|----------------|----------------------------------------------|--------------------------------------|
| `PORT`         | Port the backend server listens on           | `3000`                               |
| `OLLAMA_HOST`  | URL of the Ollama inference server           | `http://host.docker.internal:11434`  |
| *(others)*     | Database connection strings, secrets, etc.   | —                                    |

> **Note:** Never commit `.env` files to version control.

---

## 🐳 Docker Details

The `docker-compose.yml` defines two services:

- **`backend`** — Builds from `backend v2/Dockerfile`, exposes port `3000`, connects to Ollama via host networking.
- **`frontend`** — Builds from `frontend v2/Dockerfile`, serves on port `5001` (mapped to Nginx's port `80`), and depends on the backend being up.

The backend uses `extra_hosts: host.docker.internal:host-gateway` to reach Ollama running on the host machine from inside the container.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to your branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source. See the repository for license details.

---

## 👤 Author

**Chirag Gehlot** — [@Chirag-gehlot](https://github.com/Chirag-gehlot)
**Pushkar Bihani** — [@Pushkar-Bihani](https://github.com/Pushkar-03/)
