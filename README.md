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

## API Endpoints

### Autenticación
- POST `/api/auth/google`
  - body: `{ "token": "<google-id-token>" }`
  - response: `AuthResponse`

### Administración
- GET `/api/admin/overview`
- GET `/api/admin/crops`
- GET `/api/admin/stages`
- GET `/api/admin/recommendations`
- GET `/api/admin/lunar-activities`
- POST `/api/admin/crops` (body: `AdminCreateCropRequest`)
- POST `/api/admin/stages` (body: `AdminCreateStageRequest`)
- POST `/api/admin/recommendations` (body: `AdminCreateRecommendationRequest`)
- POST `/api/admin/lunar-activities` (body: `AdminLunarActivityRequest`)

### Cultivos
- GET `/api/crops/catalog`
- POST `/api/crops` (body: `CreateUserCropRequest`, header `Authorization: Bearer <token>`)
- GET `/api/crops` (header `Authorization: Bearer <token>`, optional)
- GET `/api/crops/{id}/intelligence` (header `Authorization: Bearer <token>`)

### Progreso diario
- GET `/api/daily-progress` (header `Authorization: Bearer <token>`, optional)
- POST `/api/daily-progress/check-in` (header `Authorization: Bearer <token>`, optional)

### Fases lunares y calendario
- GET `/api/lunar-phase`
- GET `/api/lunar/recommendations`
- GET `/api/lunar/calendar?month=<m>&year=<y>`

### Onboarding
- GET `/api/onboarding/recommendation`
- GET `/api/onboarding/day-insight?date=<yyyy-MM-dd>`

### Preguntas
- POST `/api/questions` (body: `QuestionRequest`, header `Authorization: Bearer <token>` opcional)

### Migración de usuario invitado
- POST `/api/user/migrate` (body: `MigrateUserDataRequest`, header `Authorization: Bearer <token>`)

App agrícola inteligente basada en luna, clima y cultivo
