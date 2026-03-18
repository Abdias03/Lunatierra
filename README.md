# Lunatierra

Lunatierra is a mobile-first MVP for small farmers that combines crop tracking, simple weather insight, lunar phases, and practical recommendations.

## Structure

- `backend`: Spring Boot REST API with H2 database and rule-based recommendations
- `frontend`: React + Vite + Tailwind client for dashboard, crop registration, and tracking

## Run locally

### Backend

```bash
cd backend
mvn spring-boot:run
```

API runs at `http://localhost:8080`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173` and proxies `/api` requests to the backend.
App agrícola inteligente basada en luna, clima y cultivo
