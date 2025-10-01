# Dev Platform Prototype

Simple full-stack prototype with a **React (Vite + TS + Ant Design)** frontend and a **Node.js (Express)** backend.  
Clear separation: client for UI, server for API. Runs out-of-the-box on a clean machine.

---

## Architecture
- **Frontend (client/)** — React + Vite + TypeScript + Ant Design. Handles UI: animated tag cloud, search with filters, profile cards.  
- **Backend (server/)** — Node.js + Express. Provides API endpoints (`/profiles`, `/search`) with JSON/in-memory data.  
- **Communication** — Client calls backend via REST (Axios).  
- **Separation of concerns** — Each part runs independently, can be deployed separately.

---

## How to Run

```bash
git clone https://github.com/OlhaKoziuk/dev-platform-prototype.git
cd dev-platform-prototype

# backend deps
cd server
npm install
cd ..

# frontend deps
cd client
npm install
cd ..

cd server
npm run server
# runs at http://localhost:3000

cd client
npm run dev
# runs at http://localhost:5173