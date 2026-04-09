const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

async function fetchWithTimeout(url, options = {}, timeout = 8000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timed out after 8 seconds');
    }
    throw error;
  }
}

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    const message = errorText || 'Request failed';
    throw new Error(message);
  }
  return response.json();
};

export const apiGet = async (path, options = {}) => {
  const response = await fetchWithTimeout(`${API_BASE_URL}${path}`, {
    method: 'GET',
    ...options
  });
  return handleResponse(response);
};

export const apiPost = async (path, body, options = {}) => {
  const response = await fetchWithTimeout(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    body: JSON.stringify(body),
    ...options
  });
  return handleResponse(response);
};

export const apiFetch = async (path, options = {}) => {
  const response = await fetchWithTimeout(`${API_BASE_URL}${path}`, options);
  return handleResponse(response);
};
