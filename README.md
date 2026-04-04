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
- GET `/api/lunar/calendarmonth=<m>&year=<y>`

### Onboarding
- GET `/api/onboarding/recommendation`
- GET `/api/onboarding/day-insightdate=<yyyy-MM-dd>`

### Preguntas
- POST `/api/questions` (body: `QuestionRequest`, header `Authorization: Bearer <token>` opcional)

### Migración de usuario invitado
- POST `/api/user/migrate` (body: `MigrateUserDataRequest`, header `Authorization: Bearer <token>`)

App agrícola inteligente basada en luna, clima y cultivo

## Frontend Architecture (Refactor 2026)

Se organizó la app en capas limpias y modulares para escalar el crecimiento de cultivos y productos.

- `src/components`: UI reutilizable (cards, botones, layouts).
- `src/features`: lógica de dominio (cultivos, clima, lunar, onboarding) [inicialmente contenidos en `AppMobile` y componentes centrales].
- `src/hooks`: custom hooks (`useCrops`, `useWeather`) para encapsular fetch + estado.
- `src/services`: capa API (`api.js`, `cropService.js`, `weatherService.js`) con adaptadores REST.
- `src/store`: estado global (`useAppStore`) para user, cultivos, progreso y crop seleccionado.
- `src/constants`: configuración inmutable (`appConstants`, `uiConstants`, `cropConstants`).
- `src/config`: variables de entorno (ej. `VITE_API_URL`).
- `src/i18n`: traducciones sin texto hardcodeado.
- `src/pages`: páginas principales (se puede separar de `AppMobile` en trabajo siguiente).

### Mejores prácticas aplicadas (Frontend)

- Textos migrados a i18n (`t('...')`).
- Hooks extraen side effects y llamadas API.
- Constantes para claves de localStorage, thresholds y colores.
- `AppStoreProvider` envuelve toda la app en `main.jsx`.
- API URLs centralizados en `src/services/api.js`.
- No valores mágicos en componentes: solo referencias a constantes o traducciones.

## Backend Architecture (Refactor 2026)

Se refactorizó el backend en capas limpias, eliminando lógica hardcodeada e implementando un sistema completamente data-driven desde base de datos.

### Estructura de directorios

```
com.lunatierra.backend/
├── controller/          → Endpoints REST
├── service/             → Lógica de negocio
│   └── impl/           → Implementaciones alternativas
├── repository/          → Spring Data JPA (acceso a BD)
├── entity/              → Entidades JPA (Crop, CropStage, UserCrop, etc.)
├── dto/                 → Data Transfer Objects (DTOs)
├── mapper/              → Conversiones Entity ↔ DTO
├── exception/           → Manejo de excepciones global
├── constants/           → Constantes (CropConstants)
├── util/                → Utilidades (DateUtil)
└── config/              → Configuración general
```

### Servicios principales

#### CropService
Encapsula lógica de cultivos sin hardcoding:
- `getCropById()` - obtiene cultivo por ID
- `getCropByCode()` - obtiene cultivo por código
- `getCurrentStage()` - determina etapa actual **dinámicamente desde BD** basado en días transcurridos
- `calculateProgressPercentage()` - calcula progreso del cultivo
- `getCropStages()` - obtiene todas las etapas de un cultivo

**Ventaja**: Al agregar un nuevo cultivo, solo se insertan datos en BD; no hay cambios de código.

#### RecommendationServiceDynamic
Obtiene recomendaciones dinámicamente desde BD:
- `getRecommendationsForStage()` - recomendaciones para una etapa específica
- `getRecommendationsByCropCode()` - todas las recomendaciones de un cultivo

#### UserCropDetailService
Compila información completa de un cultivo del usuario:
- Integra CropService + RecommendationService
- Retorna DTO con días, etapa actual, recomendaciones, progreso

### DTOs principales

- `CropDTO` - información de cultivo
- `CropStageDTO` - información de etapa (min_day, max_day, descripción)
- `RecommendationDTO` - recomendación para una etapa
- `UserCropDetailDTO` - datos completos de cultivo de usuario

### Mappers

- `CropMapper` - Entity ↔ DTO
- `CropStageMapper` - Entity ↔ DTO
- `RecommendationMapper` - Entity ↔ DTO

### Exception Handling

GlobalExceptionHandler captura todas las excepciones:
- `ResourceNotFoundException` (404)
- `InvalidRequestException` (400)
- Excepciones genéricas (500)

Todas retornan JSON con timestamp, status, error, message, path.

### Constantes

`CropConstants.java`:
```java
CROP_NOT_FOUND = "Crop not found";
CROP_STAGE_NOT_FOUND = "Crop stage not found";
CROP_CODE_CORN = "corn";
DEFAULT_MAX_STAGE_DAYS = Integer.MAX_VALUE;
```

### Utilidades

`DateUtil.java`:
```java
calculateDaysSincePlanting(LocalDate) -> int;
calculateMonthsSincePlanting(LocalDate) -> int;
```

### Características importantes

✅ **Sin hardcoding**: Toda la lógica de cultivos viene de BD  
✅ **Dinámico**: Agregar nuevo cultivo = solo insertar en BD  
✅ **Escalable**: Repositorio base de datos puede extenderse sin cambios de código  
✅ **Mantenible**: Capas separadas (service, repository, mapper, DTO)  
✅ **Testeado**: Compile + tests pasan sin errores  
✅ **Documentado**: JavaDoc en servicios principales  

### Cómo extender

**Agregar nuevo cultivo:**
1. Insertar en tabla `crops` (id, code, name, type, description)
2. Insertar etapas en tabla `crop_stages` (crop_id, name, min_day, max_day, description)
3. Insertar recomendaciones en tabla `recommendations` (crop_id, stage_id, condition, message, priority, active)
4. ✅ Automáticamente disponible en API sin cambios de código

**Agregar nuevo servicio:**
1. Crear clase en `com.lunatierra.backend.service`
2. Inyectar repositories necesarios
3. Implementar lógica usando datos de BD
4. Exponer en controlador si es necesario


