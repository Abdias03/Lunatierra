const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    const message = errorText || 'Request failed';
    throw new Error(message);
  }
  return response.json();
};

export const apiGet = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'GET',
    ...options
  });
  return handleResponse(response);
};

export const apiPost = async (path, body, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    body: JSON.stringify(body),
    ...options
  });
  return handleResponse(response);
};

export const apiFetch = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, options);
  return handleResponse(response);
};
