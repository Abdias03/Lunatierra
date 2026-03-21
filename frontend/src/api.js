import i18n from './i18n';

function buildHeaders(headers = {}) {
  return {
    'Accept-Language': i18n.language || 'es',
    ...headers
  };
}

async function handleResponse(response) {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Request failed');
  }

  return response.json();
}

export async function fetchCrops() {
  const response = await fetch('/api/crops', {
    headers: buildHeaders()
  });
  return handleResponse(response);
}

export async function createCrop(payload) {
  const response = await fetch('/api/crops', {
    method: 'POST',
    headers: buildHeaders({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
}

export async function fetchRecommendations() {
  const response = await fetch('/api/recommendations', {
    headers: buildHeaders()
  });
  return handleResponse(response);
}

export async function checkInDaily() {
  const response = await fetch('/api/daily-progress/check-in', {
    method: 'POST',
    headers: buildHeaders()
  });
  return handleResponse(response);
}

export async function askQuestion(question) {
  const response = await fetch('/api/questions', {
    method: 'POST',
    headers: buildHeaders({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify({ question }),
  });

  return handleResponse(response);
}
