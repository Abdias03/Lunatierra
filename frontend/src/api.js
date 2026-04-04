import i18n from './i18n';
import { STORAGE_KEYS } from './constants/storageKeys';

const {
  GUEST_CROPS: GUEST_CROPS_KEY,
  GUEST_LAST_CHECK: GUEST_LAST_CHECK_KEY,
  GUEST_STREAK: GUEST_STREAK_KEY,
  GUEST_GROWTH_LOGS: GUEST_GROWTH_LOGS_KEY,
  GUEST_GROWTH_LOG_CROP: GUEST_GROWTH_LOG_CROP_KEY,
  AUTH_TOKEN: AUTH_TOKEN_KEY,
  LEGACY_AUTH_TOKEN: LEGACY_TOKEN_KEY,
  AUTH_USER: AUTH_USER_KEY
} = STORAGE_KEYS;
const FORCE_BACKEND = true; // permite usar backend aunque sea guest
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';


const cropDisplayNames = {
  es: {
    corn: 'Maíz',
    beans: 'Frijol',
    squash: 'Calabaza'
  },
  en: {
    corn: 'Corn',
    beans: 'Beans',
    squash: 'Squash'
  }
};

const stageDefinitions = {
  corn: [
    { min: 0, max: 7, nameEs: 'Germinación', nameEn: 'Germination', behaviorEs: 'La semilla está despertando y necesita humedad pareja.', behaviorEn: 'The seed is waking up and needs steady moisture.' },
    { min: 8, max: 25, nameEs: 'Crecimiento inicial', nameEn: 'Early growth', behaviorEs: 'Las primeras hojas deberían abrirse y verse sanas.', behaviorEn: 'The first leaves should open and look healthy.' },
    { min: 26, max: 50, nameEs: 'Vegetativo', nameEn: 'Vegetative', behaviorEs: 'Tu maíz debería crecer con más fuerza cada día.', behaviorEn: 'Your corn should be gaining strength each day.' },
    { min: 51, max: 70, nameEs: 'Floración', nameEn: 'Flowering', behaviorEs: 'Es un momento delicado, conviene revisarlo con calma.', behaviorEn: 'This is a delicate moment, so a calm check helps.' },
    { min: 71, max: 90, nameEs: 'Formación de mazorca', nameEn: 'Ear formation', behaviorEs: 'La mazorca empieza a formarse y pide atención ligera.', behaviorEn: 'The ear is starting to form and needs light attention.' },
    { min: 91, max: Number.POSITIVE_INFINITY, nameEs: 'Maduración', nameEn: 'Maturation', behaviorEs: 'Tu maíz se acerca al momento de cosecha.', behaviorEn: 'Your corn is moving closer to harvest time.' }
  ],
  beans: [
    { min: 0, max: 5, nameEs: 'Germinación', nameEn: 'Germination', behaviorEs: 'El frijol apenas empieza y agradece humedad suave.', behaviorEn: 'Your beans are just starting and like gentle moisture.' },
    { min: 6, max: 20, nameEs: 'Crecimiento inicial', nameEn: 'Early growth', behaviorEs: 'Las primeras hojas deben verse parejas y firmes.', behaviorEn: 'The first leaves should look even and steady.' },
    { min: 21, max: 40, nameEs: 'Vegetativo', nameEn: 'Vegetative', behaviorEs: 'Tu frijol debería verse más verde y con mejor fuerza.', behaviorEn: 'Your beans should look greener and stronger.' },
    { min: 41, max: 55, nameEs: 'Floración', nameEn: 'Flowering', behaviorEs: 'Las flores empiezan a aparecer y conviene evitar estrés.', behaviorEn: 'Flowers are starting to show, so avoid stress.' },
    { min: 56, max: 75, nameEs: 'Formación de vainas', nameEn: 'Pod formation', behaviorEs: 'Las vainas ya se están formando poco a poco.', behaviorEn: 'Pods are slowly starting to form.' },
    { min: 76, max: Number.POSITIVE_INFINITY, nameEs: 'Maduración', nameEn: 'Maturation', behaviorEs: 'Tu frijol ya va entrando a su etapa final.', behaviorEn: 'Your beans are reaching their final stage.' }
  ],
  squash: [
    { min: 0, max: 7, nameEs: 'Germinación', nameEn: 'Germination', behaviorEs: 'La calabaza está arrancando y necesita una tierra amable.', behaviorEn: 'Your squash is starting and needs gentle soil.' },
    { min: 8, max: 20, nameEs: 'Crecimiento inicial', nameEn: 'Early growth', behaviorEs: 'Las primeras hojas ya deben empezar a abrir bien.', behaviorEn: 'The first leaves should start opening well.' },
    { min: 21, max: 40, nameEs: 'Desarrollo de guías', nameEn: 'Vine development', behaviorEs: 'Las guías empiezan a tomar espacio y fuerza.', behaviorEn: 'The vines are starting to spread and gain strength.' },
    { min: 41, max: 60, nameEs: 'Floración', nameEn: 'Flowering', behaviorEs: 'Es momento de mirar flores y cuidar el ambiente.', behaviorEn: 'It is time to watch the flowers and keep conditions calm.' },
    { min: 61, max: 90, nameEs: 'Desarrollo del fruto', nameEn: 'Fruit development', behaviorEs: 'El fruto empieza a crecer y agradece humedad pareja.', behaviorEn: 'The fruit is starting to grow and likes steady moisture.' },
    { min: 91, max: Number.POSITIVE_INFINITY, nameEs: 'Maduración', nameEn: 'Maturation', behaviorEs: 'Tu calabaza ya va llegando a cosecha.', behaviorEn: 'Your squash is getting close to harvest.' }
  ]
};

function buildHeaders(headers = {}) {
  return { 'Accept-Language': i18n.language || 'es',
    ...headers
  };
}

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY) || localStorage.getItem(LEGACY_TOKEN_KEY) || '';
}

export function getAuthorizationHeaderValue() {
  const token = getAuthToken();
  return token ? `Bearer ${token}` : '';
}

export function buildAuthHeaders(headers = {}) {
  const authorization = getAuthorizationHeaderValue();
  return buildHeaders({
    ...headers,
    ...(authorization ? { Authorization: authorization } : {})
  });
}

export function isGuestMode() {
  return !getAuthToken();
}

export function getStoredUser() {
  if (!getAuthToken()) {
    localStorage.removeItem(AUTH_USER_KEY);
    return null;
  }

  try {
    return JSON.parse(localStorage.getItem(AUTH_USER_KEY) || 'null');
  } catch {
    return null;
  }
}

export function saveAuthSession(authResponse) {
  if (!authResponse.token) {
    return;
  }

  localStorage.setItem(AUTH_TOKEN_KEY, authResponse.token);
  localStorage.setItem(LEGACY_TOKEN_KEY, authResponse.token);
  if (authResponse.user) {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authResponse.user));
  }
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(LEGACY_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

export function clearGuestData() {
  localStorage.removeItem(GUEST_CROPS_KEY);
  localStorage.removeItem(GUEST_LAST_CHECK_KEY);
  localStorage.removeItem(GUEST_STREAK_KEY);
}

function clearGuestGrowthLogs() {
  localStorage.removeItem(GUEST_GROWTH_LOGS_KEY);
  localStorage.removeItem(GUEST_GROWTH_LOG_CROP_KEY);
}

async function handleResponse(response) {
  if (!response.ok) {
    if (response.status === 401) {
      clearAuthSession();
      throw new Error('Unauthorized: Please log in again');
    }

    const message = await response.text();
    throw new Error(message || 'Request failed');
  }

  return response.json();
}

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

function getLanguage() {
  return (i18n.language || 'es').startsWith('es') ? 'es' : 'en';
}

function getGuestCrops() {
  try {
    return JSON.parse(localStorage.getItem(GUEST_CROPS_KEY) || '[]');
  } catch {
    return [];
  }
}

function setGuestCrops(crops) {
  localStorage.setItem(GUEST_CROPS_KEY, JSON.stringify(crops));
}

function getGuestGrowthLogs() {
  try {
    return JSON.parse(localStorage.getItem(GUEST_GROWTH_LOGS_KEY) || '{}');
  } catch {
    return {};
  }
}

function parsePlantingDate(dateText) {
  if (!dateText || typeof dateText !== 'string') {
    return null;
  }
  // Accept both pure date and full ISO datetime strings
  const raw = dateText.trim();
  let parsed = new Date(raw);

  if (Number.isNaN(parsed.getTime())) {
    const [datePart] = raw.split('T');
    if (!datePart) return null;
    parsed = new Date(`${datePart}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) {
      return null;
    }
  }

  return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
}

function daysSince(dateText) {
  const planted = parsePlantingDate(dateText);
  if (!planted) {
    console.warn('[daysSince]Invalid planting date:', dateText);
    return 0;
  }
  const today = new Date(getTodayDate());
  return Math.max(0, Math.floor((today - planted) / (1000 * 60 * 60 * 24)));
}

const cropGrowthEmoji = {
  corn: ['🌰', '🌱', '🌿', '🌾', '🌽'],
  beans: ['🫘', '🌱', '🍃', '🌸', '🫘'],
  squash: ['🎃', '🌱', '🍃', '🌼', '🎃'],
  pumpkin: ['🎃', '🌱', '🍃', '🌼', '🎃'],
  tomato: ['🍅', '🌱', '🌿', '🌼', '🍅']
};

const cropStageThresholds = {
  corn: [7, 25, 50, 70],
  beans: [5, 20, 40, 55],
  squash: [7, 20, 40, 60],
  pumpkin: [7, 20, 40, 60],
  tomato: [5, 20, 35, 55]
};

function normalizeCropName(cropName) {
  if (!cropName) return 'corn';
  const name = cropName.toString().trim().toLowerCase();
  if (['maiz', 'maíz', 'corn'].includes(name)) return 'corn';
  if (['frijol', 'beans', 'bean'].includes(name)) return 'beans';
  if (['calabaza', 'squash', 'pumpkin'].includes(name)) return 'pumpkin';
  if (['jitomate', 'tomato'].includes(name)) return 'tomato';
  return name;
}

function findMatchingServerCrop(serverCrops, guestCrop) {
  const normalizedGuestCode = normalizeCropName(guestCrop.cropName);

  return serverCrops.find((serverCrop) => ( normalizeCropName(serverCrop.cropName) === normalizedGuestCode
      && serverCrop.plantingDate === guestCrop.plantingDate
  )) || null;
}

async function dataUrlToFile(dataUrl, fileName) {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  return new File([blob], fileName, { type: blob.type || 'image/jpeg' });
}

async function uploadGrowthLogPhoto(userCropId, file, description = '') {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('userCropId', userCropId);
  if (description) {
    formData.append('description', description);
  }

  const response = await fetch('/api/growth-log', {
    method: 'POST',
    headers: buildAuthHeaders(),
    body: formData
  });

  return handleResponse(response);
}

async function migrateGuestGrowthLogs(serverCrops, guestCrops) {
  const growthLogsByCropId = getGuestGrowthLogs();
  const uploadTasks = [];

  guestCrops.forEach((guestCrop) => {
    const matchedServerCrop = findMatchingServerCrop(serverCrops, guestCrop);
    const guestPhotos = Array.isArray(growthLogsByCropId[guestCrop.id]) ? growthLogsByCropId[guestCrop.id] : [];

    if (!matchedServerCrop || !guestPhotos.length) {
      return;
    }

    guestPhotos.forEach((photo, index) => {
      if (!photo.imageUrl.startsWith('data:')) {
        return;
      }

      uploadTasks.push( dataUrlToFile(photo.imageUrl, `growth-log-${matchedServerCrop.id}-${index + 1}.jpg`)
          .then((file) => uploadGrowthLogPhoto(matchedServerCrop.id, file, photo.description || ''))
      );
    });
  });

  if (!uploadTasks.length) { clearGuestGrowthLogs();
    return;
  }

  await Promise.all(uploadTasks); clearGuestGrowthLogs();
}

function stageIndexFor(days, cropName) {
  const normalized = normalizeCropName(cropName);
  const thresholds = cropStageThresholds[normalized] || cropStageThresholds.corn;
  if (days <= 0) return 0;
  for (let i = 0; i < thresholds.length; i += 1) {
    if (days <= thresholds[i]) {
      return i;
    }
  }
  return 4;
}

function resolveGrowthStageIcon(cropName, plantingDate) {
  const normalized = normalizeCropName(cropName);
  const days = daysSince(plantingDate);
  const idx = stageIndexFor(days, normalized);
  const icons = cropGrowthEmoji[normalized] || cropGrowthEmoji.corn;
  return icons[idx] || icons[icons.length - 1];
}

function resolveStage(cropName, plantingDate) {
  const lang = getLanguage();
  const days = daysSince(plantingDate);
  const definitions = stageDefinitions[cropName] || stageDefinitions.corn;
  const stage = definitions.find((item) => days >= item.min && days <= item.max) || definitions[definitions.length - 1];

  return {
    daysSincePlanting: days,
    growthStage: lang === 'es' ? stage.nameEs : stage.nameEn,
    growthStageIcon: resolveGrowthStageIcon(cropName, plantingDate),
    expectedBehavior: lang === 'es' ? stage.behaviorEs : stage.behaviorEn
  };
}

function buildGuestCrop(rawCrop, index) {
  const lang = getLanguage();
  const normalizedCode = String(rawCrop.cropName || '').toLowerCase();
  const stage = resolveStage(normalizedCode, rawCrop.plantingDate);

  return {
    id: rawCrop.id ?? index + 1,
    cropName: normalizedCode,
    cropDisplayName: cropDisplayNames[lang][normalizedCode] || rawCrop.cropDisplayName || rawCrop.cropName,
    plantingDate: rawCrop.plantingDate,
    waterAvailable: rawCrop.waterAvailable,
    ...stage
  };
}

function buildGuestWeather() {
  const today = new Date().getDate();
  const lang = getLanguage();
  const patterns = [
    { condition: lang === 'es' ? 'Puede llover' : 'Rain may come', maxTemperature: 24, rainChance: 76, humidity: 81 },
    { condition: lang === 'es' ? 'Nublado' : 'Cloudy', maxTemperature: 22, rainChance: 35, humidity: 58 },
    { condition: lang === 'es' ? 'Seco y cálido' : 'Dry and warm', maxTemperature: 29, rainChance: 14, humidity: 33 }
  ];

  return patterns[today % patterns.length];
}

function buildGuestLunarPhase() {
  const phasesEs = ['Luna nueva', 'Creciente', 'Cuarto creciente', 'Luna llena', 'Menguante'];
  const phasesEn = ['New moon', 'Waxing', 'First quarter', 'Full moon', 'Waning'];
  const today = new Date().getDate();
  const lang = getLanguage();
  return (lang === 'es' ? phasesEs : phasesEn)[today % 5];
}

function buildGuestLunarActivities() {
  const lang = getLanguage();
  return lang === 'es'
    ? ['Fertilizar ligero', 'Sembrar con calma', 'Revisar humedad y hojas']
    : ['Light fertilizing', 'Gentle planting', 'Check moisture and leaves'];
}

function buildGuestRecommendedCrops() {
  const month = new Date().getMonth() + 1;
  const lang = getLanguage();
  const phase = buildGuestLunarPhase().toLowerCase();

  if (phase.includes('nueva') || phase.includes('new') || phase.includes('menguante') || phase.includes('waning')) {
    return month >= 3 && month <= 8 ? ['beans', 'squash'] : ['beans'];
  }

  if (phase.includes('creciente') || phase.includes('waxing') || phase.includes('quarter')) {
    return month >= 3 && month <= 9 ? ['corn', 'beans'] : ['corn'];
  }

  return month >= 4 && month <= 9 ? ['corn', 'squash'] : ['beans', 'squash'];
}

function getGuestDailyProgress() {
  const lastCheckDate = localStorage.getItem(GUEST_LAST_CHECK_KEY);
  const streakCount = Number(localStorage.getItem(GUEST_STREAK_KEY) || '0');
  return {
    streakCount,
    lastCheckDate,
    checkedToday: lastCheckDate === getTodayDate()
  };
}

function buildGuestInsight(crop, weather) {
  const lang = getLanguage();
  const warnings = [];

  if (!crop.waterAvailable) {
    warnings.push(lang === 'es' ? 'Hoy cuida mucho el agua que tienes disponible.' : 'Be careful with the water you have today.');
  }

  if (weather.rainChance > 70) {
    warnings.push(lang === 'es' ? 'Hoy mejor no apliques nada, la lluvia hará su parte.' : 'Today is better for waiting, the rain will do its part.');
  }

  const early = crop.daysSincePlanting <= 10;
  const mid = crop.daysSincePlanting > 10 && crop.daysSincePlanting <= 60;

  let actionToday = lang === 'es'
    ? 'Revisa la humedad del suelo y acompaña tu planta con calma.'
    : 'Check the soil moisture and stay close to your plant today.';
  let fieldObservation = lang === 'es'
    ? 'Fíjate si las hojas se ven firmes y con buen color.'
    : 'Look for firm leaves with healthy color.';

  if (early) {
    actionToday = lang === 'es'
      ? 'Hoy solo revisa que la tierra siga húmeda.'
      : 'Today, just make sure the soil stays moist.';
    fieldObservation = lang === 'es'
      ? 'Busca brotes parejos y una salida tranquila.'
      : 'Look for even sprouts and a calm start.';
  } else if (mid) {
    actionToday = lang === 'es'
      ? 'Quita maleza cercana y deja espacio para que siga creciendo.'
      : 'Clear nearby weeds and give it space to keep growing.';
    fieldObservation = lang === 'es'
      ? 'Mira el color de las hojas y cómo va tomando fuerza.'
      : 'Look at leaf color and how it is gaining strength.';
  }

  if (!warnings.length) {
    warnings.push(lang === 'es' ? 'Por ahora todo va tranquilo.' : 'Everything looks calm for now.');
  }

  return {
    actionToday,
    fieldObservation,
    reason: lang === 'es' ? 'Lo vimos con base en la etapa y el clima de hoy.' : "This is based on today's stage and weather.",
    warnings
  };
}


function buildGuestDailyMessage(crops, weather, dailyProgress) {
  const lang = getLanguage();
  const featuredCrop = crops[0];
  if (weather.rainChance > 70) {
    return lang === 'es' ? 'Hoy mejor déjala descansar, la lluvia hará su trabajo ☔' : 'Let it rest today, the rain will do its part ☔';
  }
  if (dailyProgress.streakCount === 0) {
    return lang === 'es' ? 'Tu planta te está esperando hoy 🌱' : 'Your plant is waiting for you today 🌱';
  }
  if (featuredCrop && !featuredCrop.waterAvailable) {
    return lang === 'es' ? 'Tu planta necesita un poco de agua y tu mirada hoy 💧' : 'Your plant needs a little water and your attention today 💧';
  }
  return lang === 'es' ? 'Tu planta va muy bien, sigue así 🔥' : 'Your plant is doing really well, keep it up 🔥';
}


function buildGuestRecommendations(crops) {
  const weather = buildGuestWeather();
  const lunarPhase = buildGuestLunarPhase();
  const dailyProgress = getGuestDailyProgress();
  const cropDetails = crops.map((crop) => ({
    cropId: crop.id,
    ...buildGuestInsight(crop, weather)
  }));
  const recommendations = cropDetails.slice(0, 3).map((detail, index) => ({
    title: crops[index].cropDisplayName || '',
    message: detail.actionToday,
    severity: 'info'
  }));
  const dailyFocus = recommendations[0].message || (getLanguage() === 'es'
    ? 'Hoy basta con una revisión tranquila.'
    : 'A calm check is enough for today.');

  return {
    lunarPhase,
    weather,
    dailyFocus,
    dailyMessage: buildGuestDailyMessage(crops, weather, dailyProgress),
    recommendations,
    cropDetails,
    dailyProgress
  };
}

export async function fetchCrops() {
  if (isGuestMode()) {
    return getGuestCrops().map(buildGuestCrop);
  }

  const response = await fetch('/api/crops', {
    headers: buildAuthHeaders()
  });
  return handleResponse(response);
}

export async function fetchCropCatalog() {
  const response = await fetch('/api/crops/catalog', {
    headers: buildHeaders()
  });

  const catalog = await handleResponse(response);
  return Array.isArray(catalog) ? catalog : [];
}

export async function fetchAdminOverview() {
  const response = await fetch('/api/admin/overview', {
    headers: buildAuthHeaders()
  });
  return handleResponse(response);
}

export async function fetchAdminStages() {
  const response = await fetch('/api/admin/stages', {
    headers: buildAuthHeaders()
  });
  return handleResponse(response);
}

export async function fetchAdminRecommendations() {
  const response = await fetch('/api/admin/recommendations', {
    headers: buildAuthHeaders()
  });
  return handleResponse(response);
}

export async function fetchAdminLunarActivities() {
  const response = await fetch('/api/admin/lunar-activities', {
    headers: buildAuthHeaders()
  });
  return handleResponse(response);
}

export async function createAdminCrop(payload) {
  const response = await fetch('/api/admin/crops', {
    method: 'POST',
    headers: buildAuthHeaders({ 'Content-Type': 'application/json'
    }),
    body: JSON.stringify(payload)
  });
  return handleResponse(response);
}

export async function createAdminStage(payload) {
  const response = await fetch('/api/admin/stages', {
    method: 'POST',
    headers: buildAuthHeaders({ 'Content-Type': 'application/json'
    }),
    body: JSON.stringify(payload)
  });
  return handleResponse(response);
}

export async function createAdminRecommendation(payload) {
  const response = await fetch('/api/admin/recommendations', {
    method: 'POST',
    headers: buildAuthHeaders({ 'Content-Type': 'application/json'
    }),
    body: JSON.stringify(payload)
  });
  return handleResponse(response);
}

export async function createAdminLunarActivity(payload) {
  const response = await fetch('/api/admin/lunar-activities', {
    method: 'POST',
    headers: buildAuthHeaders({ 'Content-Type': 'application/json'
    }),
    body: JSON.stringify(payload)
  });
  return handleResponse(response);
}

export async function loginWithGoogle(token) {
  const response = await fetch('/api/auth/google', {
    method: 'POST',
    headers: buildHeaders({ 'Content-Type': 'application/json'
    }),
    body: JSON.stringify({ token })
  });

  const authResponse = await handleResponse(response); saveAuthSession(authResponse);
  return authResponse;
}

export async function migrateLocalData() {
  const guestCrops = getGuestCrops();
  const guestGrowthLogs = getGuestGrowthLogs();

  if ((!guestCrops.length && !Object.keys(guestGrowthLogs).length) || isGuestMode()) {
    return;
  }

  if (guestCrops.length) {
    await fetch('/api/user/migrate', {
      method: 'POST',
      headers: buildAuthHeaders({ 'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        crops: guestCrops.map((crop) => ({
          cropName: crop.cropName,
          plantingDate: crop.plantingDate,
          waterAvailable: crop.waterAvailable
        }))
      })
    }).then(handleResponse);
  }

  try {
    const serverCrops = await fetch('/api/crops', {
      headers: buildAuthHeaders()
    }).then(handleResponse);

    await migrateGuestGrowthLogs(Array.isArray(serverCrops) ? serverCrops : [], guestCrops); clearGuestData();
  } catch (error) {
    console.error('No se pudieron migrar las fotos locales al backend.', error);
  }
}

export async function createCrop(payload) {
  if (isGuestMode()) {
    const currentCrops = getGuestCrops();
    const normalizedCode = String(payload.cropName || '').toLowerCase();
    const createdCrop = {
      id: Date.now(),
      cropName: normalizedCode,
      plantingDate: payload.plantingDate,
      waterAvailable: payload.waterAvailable
    }; setGuestCrops([...currentCrops, createdCrop]);
    return buildGuestCrop(createdCrop, currentCrops.length);
  }

  const response = await fetch('/api/crops', {
    method: 'POST',
    headers: buildAuthHeaders({ 'Content-Type': 'application/json'
    }),
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
}

export async function fetchRecommendations() {
  if (isGuestMode()) {
    const crops = getGuestCrops().map(buildGuestCrop);
    return buildGuestRecommendations(crops);
  }

  const response = await fetch('/api/recommendations', {
    headers: buildAuthHeaders()
  });
  return handleResponse(response);
}

export async function fetchLunarPhase() {
  if (isGuestMode()) {
    return {
      phase: '',
      displayName: buildGuestLunarPhase(),
      activities: buildGuestLunarActivities(),
      recommendedCrops: buildGuestRecommendedCrops()
    };
  }

  const response = await fetch('/api/lunar-phase', {
    headers: buildAuthHeaders()
  });
  return handleResponse(response);
}

export async function fetchLunarRecommendations() {
  if (isGuestMode()) {
    return {
      phase: '',
      displayName: buildGuestLunarPhase(),
      activities: buildGuestLunarActivities(),
      recommendedCrops: buildGuestRecommendedCrops()
    };
  }

  const response = await fetch('/api/lunar/recommendations', {
    headers: buildAuthHeaders()
  });
  return handleResponse(response);
}

export async function fetchOnboardingRecommendation() {
  const useGuestFallback = isGuestMode() && !FORCE_BACKEND;
  console.log("Onboarding mode:", useGuestFallback ? "GUEST" : "BACKEND");
 // MODO GUEST (solo si NO forzamos backend) -- isGuestMode()
  if (useGuestFallback) {
    const lang = getLanguage();
    const phaseName = buildGuestLunarPhase();
    const recommendedCrops = buildGuestRecommendedCrops().slice(0, 2);
    const lowerPhase = phaseName.toLowerCase();

    if (lowerPhase.includes('llena') || lowerPhase.includes('full')) {
      return {
        lunarPhase: phaseName,
        message: lang === 'es' ? 'Hoy conviene cuidar y nutrir. No hace falta sembrar algo nuevo.' : 'Today is better for caring and feeding. No need to plant something new.',
        recommendedCrops: [],
        actionType: 'maintain'
      };
    }

    if (lowerPhase.includes('menguante') || lowerPhase.includes('waning')) {
      return {
        lunarPhase: phaseName,
        message: lang === 'es' ? 'Hoy es mejor limpiar y observar. Si quieres, te muestro más opciones.' : 'Today is better for cleaning and observing. If you want, I can show you more options.',
        recommendedCrops: [],
        actionType: 'maintain'
      };
    }

    return {
      lunarPhase: phaseName,
      message: lang === 'es' ? 'Hoy es buen día para sembrar 🌱' : 'Today is a good day to plant 🌱',
      recommendedCrops,
      actionType: 'plant'
    };
  }

  // MODO BACKEND (forzado o usuario autenticado)
  try {
    console.log("🚀 Calling backend /api/onboarding/recommendation");

    const response = await fetch('/api/onboarding/recommendation', {
      headers: buildHeaders() // sin necesidad de auth
    });

    const data = await handleResponse(response);

    console.log("Backend response:", data);

    return data;
  } catch (error) {
    console.error("Backend failed, fallback to guest mode:", error);

    // fallback automático
    const lang = getLanguage();
    return {
      lunarPhase: '',
      message: lang === 'es'
        ? 'No pudimos obtener recomendación, pero puedes elegir un cultivo.'
        : 'We could not fetch recommendation, but you can choose a crop.',
      recommendedCrops: ['corn', 'beans'], // fallback útil
      actionType: 'plant'
    };
  }
}

export async function fetchLunarCalendar(month, year) {
  if (isGuestMode()) {
    const language = getLanguage();
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);

    return Array.from({ length: end.getDate() }, (_, index) => {
      const date = new Date(year, month - 1, index + 1);
      const phaseIndex = (Math.floor((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 4)) % 8 + 8) % 8;
      const phaseMap = [
        { phase: 'NEW_MOON', nameEs: 'Luna nueva', nameEn: 'New moon', activitiesEs: ['Preparar la tierra', 'Sembrar con calma'], activitiesEn: ['Prepare the soil', 'Plant gently'] },
        { phase: 'WAXING_CRESCENT', nameEs: 'Creciente', nameEn: 'Waxing crescent', activitiesEs: ['Sembrar hojas', 'Revisar brotes'], activitiesEn: ['Plant leafy crops', 'Check sprouts'] },
        { phase: 'FIRST_QUARTER', nameEs: 'Cuarto creciente', nameEn: 'First quarter', activitiesEs: ['Dar seguimiento', 'Mover la tierra'], activitiesEn: ['Follow up', 'Loosen the soil'] },
        { phase: 'WAXING_GIBBOUS', nameEs: 'Gibosa creciente', nameEn: 'Waxing gibbous', activitiesEs: ['Fertilizar ligero', 'Acompañar el crecimiento'], activitiesEn: ['Light fertilizing', 'Support growth'] },
        { phase: 'FULL_MOON', nameEs: 'Luna llena', nameEn: 'Full moon', activitiesEs: ['Cosechar', 'Fertilizar'], activitiesEn: ['Harvest', 'Fertilize'] },
        { phase: 'WANING_GIBBOUS', nameEs: 'Gibosa menguante', nameEn: 'Waning gibbous', activitiesEs: ['Quitar maleza', 'Observar hojas'], activitiesEn: ['Clear weeds', 'Check leaves'] },
        { phase: 'LAST_QUARTER', nameEs: 'Cuarto menguante', nameEn: 'Last quarter', activitiesEs: ['Podar', 'Limpiar'], activitiesEn: ['Prune', 'Clean'] },
        { phase: 'WANING_CRESCENT', nameEs: 'Menguante', nameEn: 'Waning crescent', activitiesEs: ['Descansar la tierra', 'Preparar raíces'], activitiesEn: ['Let soil rest', 'Prepare root crops'] }
      ];
      const meta = phaseMap[phaseIndex];

      return {
        date: date.toISOString().slice(0, 10),
        phase: meta.phase,
        displayName: language === 'es' ? meta.nameEs : meta.nameEn,
        activities: language === 'es' ? meta.activitiesEs : meta.activitiesEn,
        crops: buildGuestRecommendedCrops()
      };
    });
  }

  const response = await fetch(`/api/lunar/calendar?month=${month}&year=${year}`, {
    headers: buildAuthHeaders()
  });
  return handleResponse(response);
}

export async function fetchLunarDayInsight(date) {
  if (isGuestMode()) {
    const lang = getLanguage();
    const phase = buildGuestLunarPhase().toLowerCase();

    if (phase.includes('llena') || phase.includes('full')) {
      return {
        phase: 'FULL_MOON',
        message: lang === 'es' ? 'Dale mantenimiento a tu cultivo' : 'Give your crop a little maintenance',
        actions: lang === 'es' ? ['Observar hojas', 'Fertilizar ligero'] : ['Check the leaves', 'Light fertilizing'],
        avoid: lang === 'es' ? ['Sembrar'] : ['Planting'],
        recommendedCrops: ['beans']
      };
    }

    if (phase.includes('menguante') || phase.includes('waning')) {
      return {
        phase: 'WANING',
        message: lang === 'es' ? 'Buen día para limpiar y podar' : 'A good day for pruning and cleaning',
        actions: lang === 'es' ? ['Podar', 'Limpiar'] : ['Prune', 'Clean'],
        avoid: lang === 'es' ? ['Sembrar'] : ['Planting'],
        recommendedCrops: ['beans']
      };
    }

    if (phase.includes('nueva') || phase.includes('new')) {
      return {
        phase: 'NEW_MOON',
        message: lang === 'es' ? 'Día ideal para empezar 🌱' : 'An ideal day to begin 🌱',
        actions: lang === 'es' ? ['Preparar la tierra', 'Sembrar frijol'] : ['Prepare the soil', 'Plant beans'],
        avoid: lang === 'es' ? ['Podar fuerte'] : ['Heavy pruning'],
        recommendedCrops: ['beans']
      };
    }

    return {
      phase: 'WAXING',
      message: lang === 'es' ? 'Buen día para sembrar y ayudar al crecimiento 🌱' : 'A good day to plant and support growth 🌱',
      actions: lang === 'es' ? ['Sembrar', 'Revisar brotes', 'Mover la tierra con calma'] : ['Plant', 'Check the sprouts', 'Loosen the soil gently'],
      avoid: lang === 'es' ? ['Dejar la tierra seca'] : ['Letting the soil dry out'],
      recommendedCrops: ['corn', 'squash']
    };
  }

  const response = await fetch(`/api/onboarding/day-insight?date=${date}`, {
    headers: buildAuthHeaders()
  });
  return handleResponse(response);
}

export async function checkInDaily() {
  if (isGuestMode()) {
    const today = getTodayDate();
    const lastCheckDate = localStorage.getItem(GUEST_LAST_CHECK_KEY);
    let streakCount = Number(localStorage.getItem(GUEST_STREAK_KEY) || '0');

    if (lastCheckDate !== today) {
      const yesterday = new Date(`${today}T00:00:00`);
      yesterday.setDate(yesterday.getDate() - 1);
      const expectedYesterday = yesterday.toISOString().slice(0, 10);
      streakCount = lastCheckDate === expectedYesterday ? streakCount + 1 : 1;
      localStorage.setItem(GUEST_STREAK_KEY, String(streakCount));
      localStorage.setItem(GUEST_LAST_CHECK_KEY, today);
    }

    return {
      streakCount,
      lastCheckDate: today,
      checkedToday: true
    };
  }

  const response = await fetch('/api/daily-progress/check-in', {
    method: 'POST',
    headers: buildAuthHeaders()
  });
  return handleResponse(response);
}

export async function askQuestion(question) {
  console.log('API askQuestion: Called with question:', question);
  console.log('API askQuestion: isGuestMode():', isGuestMode());

  // TEMPORAL: Forzar uso del backend incluso en modo invitado para testing
  if (false) { // Cambia a false para usar siempre el backend
    console.log('API askQuestion: Using guest mode fallback');
    const lowerQuestion = question.toLowerCase();
    const answer = lowerQuestion.includes('amarill')
      ? 'Puede faltarle agua o verse cansada. Revisa la tierra y las hojas hoy.'
      : lowerQuestion.includes('agua')
        ? 'Toca revisar la humedad de la tierra con calma antes de regar.'
        : 'Hoy dale una revisada ligera y fíjate cómo se ven sus hojas.';

    console.log('API askQuestion: Guest mode answer:', answer);
    return { answer };
  }

  console.log('API askQuestion: Making request to backend (forced for testing)');
  console.log('API askQuestion: Auth token present:', !!getAuthToken());

  const response = await fetch('/api/questions', {
    method: 'POST',
    headers: buildAuthHeaders({ 'Content-Type': 'application/json'
    }),
    body: JSON.stringify({ question }),
  });

  console.log('API askQuestion: Fetch response status:', response.status);
  const result = await handleResponse(response);
  console.log('API askQuestion: Final result:', result);

  return result;
}
