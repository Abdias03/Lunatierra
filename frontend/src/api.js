import i18n from './i18n';

const GUEST_CROPS_KEY = 'guest_crops';
const GUEST_LAST_CHECK_KEY = 'guest_last_check_date';
const GUEST_STREAK_KEY = 'guest_streak_count';
const AUTH_TOKEN_KEY = 'auth_token';
const LEGACY_TOKEN_KEY = 'token';
const AUTH_USER_KEY = 'user';

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
  return {
    'Accept-Language': i18n.language || 'es',
    ...headers
  };
}

function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY) || localStorage.getItem(LEGACY_TOKEN_KEY) || '';
}

export function isGuestMode() {
  return !getAuthToken();
}

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_USER_KEY) || 'null');
  } catch {
    return null;
  }
}

export function saveAuthSession(authResponse) {
  if (!authResponse?.token) {
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

async function handleResponse(response) {
  if (!response.ok) {
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

function daysSince(dateText) {
  const planted = new Date(`${dateText}T00:00:00`);
  const today = new Date(`${getTodayDate()}T00:00:00`);
  return Math.max(0, Math.floor((today - planted) / (1000 * 60 * 60 * 24)));
}

function resolveStage(cropName, plantingDate) {
  const lang = getLanguage();
  const days = daysSince(plantingDate);
  const definitions = stageDefinitions[cropName] || stageDefinitions.corn;
  const stage = definitions.find((item) => days >= item.min && days <= item.max) || definitions[definitions.length - 1];

  return {
    daysSincePlanting: days,
    growthStage: lang === 'es' ? stage.nameEs : stage.nameEn,
    expectedBehavior: lang === 'es' ? stage.behaviorEs : stage.behaviorEn
  };
}

function buildGuestCrop(rawCrop, index) {
  const lang = getLanguage();
  const stage = resolveStage(rawCrop.cropName, rawCrop.plantingDate);

  return {
    id: rawCrop.id ?? index + 1,
    cropName: rawCrop.cropName,
    cropDisplayName: cropDisplayNames[lang][rawCrop.cropName] || rawCrop.cropName,
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
    warnings.push(lang === 'es' ? 'Hoy mejor no apliques nada, la lluvia hará su parte.' : 'Today is better for waiting, rain will do its part.');
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
    reason: lang === 'es' ? 'Lo vimos con base en la etapa y el clima de hoy.' : 'This is based on today’s stage and weather.',
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
    title: crops[index]?.cropDisplayName || '',
    message: detail.actionToday,
    severity: 'info'
  }));
  const dailyFocus = recommendations[0]?.message || (getLanguage() === 'es'
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
    headers: buildHeaders({
      Authorization: getAuthToken()
    })
  });
  return handleResponse(response);
}

export async function loginWithGoogle(token) {
  const response = await fetch('/api/auth/google', {
    method: 'POST',
    headers: buildHeaders({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify({ token })
  });

  const authResponse = await handleResponse(response);
  saveAuthSession(authResponse);
  return authResponse;
}

export async function migrateLocalData() {
  const guestCrops = getGuestCrops();

  if (!guestCrops.length || isGuestMode()) {
    return;
  }

  await fetch('/api/user/migrate', {
    method: 'POST',
    headers: buildHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAuthToken()}`
    }),
    body: JSON.stringify({
      crops: guestCrops.map((crop) => ({
        cropName: crop.cropName,
        plantingDate: crop.plantingDate,
        waterAvailable: crop.waterAvailable
      }))
    })
  }).then(handleResponse);

  clearGuestData();
}

export async function createCrop(payload) {
  if (isGuestMode()) {
    const currentCrops = getGuestCrops();
    const createdCrop = {
      id: Date.now(),
      cropName: payload.cropName,
      plantingDate: payload.plantingDate,
      waterAvailable: payload.waterAvailable
    };
    setGuestCrops([...currentCrops, createdCrop]);
    return buildGuestCrop(createdCrop, currentCrops.length);
  }

  const response = await fetch('/api/crops', {
    method: 'POST',
    headers: buildHeaders({
      'Content-Type': 'application/json',
      Authorization: getAuthToken()
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
    headers: buildHeaders({
      Authorization: getAuthToken()
    })
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
    headers: buildHeaders({
      Authorization: getAuthToken()
    })
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
    headers: buildHeaders({
      Authorization: getAuthToken()
    })
  });
  return handleResponse(response);
}

export async function fetchOnboardingRecommendation() {
  if (isGuestMode()) {
    const phaseName = buildGuestLunarPhase();
    const recommendedCrops = buildGuestRecommendedCrops().slice(0, 2);
    const lowerPhase = phaseName.toLowerCase();

    if (lowerPhase.includes('llena') || lowerPhase.includes('full')) {
      return {
        lunarPhase: phaseName,
        message: 'Hoy conviene cuidar y nutrir. No hace falta sembrar algo nuevo.',
        recommendedCrops: [],
        actionType: 'maintain'
      };
    }

    if (lowerPhase.includes('menguante') || lowerPhase.includes('waning')) {
      return {
        lunarPhase: phaseName,
        message: 'Hoy es mejor limpiar y observar. Si quieres, te muestro más opciones.',
        recommendedCrops: [],
        actionType: 'maintain'
      };
    }

    return {
      lunarPhase: phaseName,
      message: 'Hoy es buen día para sembrar 🌱',
      recommendedCrops,
      actionType: 'plant'
    };
  }

  const response = await fetch('/api/onboarding/recommendation', {
    headers: buildHeaders({
      Authorization: getAuthToken()
    })
  });
  return handleResponse(response);
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
    headers: buildHeaders({
      Authorization: getAuthToken()
    })
  });
  return handleResponse(response);
}

export async function fetchLunarDayInsight(date) {
  if (isGuestMode()) {
    const phase = buildGuestLunarPhase().toLowerCase();

    if (phase.includes('llena') || phase.includes('full')) {
      return {
        phase: 'FULL_MOON',
        message: 'Dale mantenimiento a tu cultivo',
        actions: ['Observar hojas', 'Fertilizar ligero'],
        avoid: ['Sembrar'],
        recommendedCrops: ['beans']
      };
    }

    if (phase.includes('menguante') || phase.includes('waning')) {
      return {
        phase: 'WANING',
        message: 'Buen día para limpiar y podar',
        actions: ['Podar', 'Limpiar'],
        avoid: ['Sembrar'],
        recommendedCrops: ['beans']
      };
    }

    if (phase.includes('nueva') || phase.includes('new')) {
      return {
        phase: 'NEW_MOON',
        message: 'Día ideal para empezar 🌱',
        actions: ['Preparar la tierra', 'Sembrar frijol'],
        avoid: ['Podar fuerte'],
        recommendedCrops: ['beans']
      };
    }

    return {
      phase: 'WAXING',
      message: 'Buen día para sembrar y ayudar al crecimiento 🌱',
      actions: ['Sembrar', 'Revisar brotes', 'Mover la tierra con calma'],
      avoid: ['Dejar la tierra seca'],
      recommendedCrops: ['corn', 'squash']
    };
  }

  const response = await fetch(`/api/onboarding/day-insight?date=${date}`, {
    headers: buildHeaders({
      Authorization: getAuthToken()
    })
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
    headers: buildHeaders({
      Authorization: getAuthToken()
    })
  });
  return handleResponse(response);
}

export async function askQuestion(question) {
  if (isGuestMode()) {
    const lowerQuestion = question.toLowerCase();
    const answer = lowerQuestion.includes('amarill')
      ? 'Puede faltarle agua o verse cansada. Revisa la tierra y las hojas hoy.'
      : lowerQuestion.includes('agua')
        ? 'Toca revisar la humedad de la tierra con calma antes de regar.'
        : 'Hoy dale una revisada ligera y fíjate cómo se ven sus hojas.';

    return { answer };
  }

  const response = await fetch('/api/questions', {
    method: 'POST',
    headers: buildHeaders({
      'Content-Type': 'application/json',
      Authorization: getAuthToken()
    }),
    body: JSON.stringify({ question }),
  });

  return handleResponse(response);
}
