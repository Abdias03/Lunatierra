export const cropCodeToBackend = {
  CORN: 'MAIZ',
  BEANS: 'FRIJOL',
  SQUASH: 'CALABAZA',
  TOMATO: 'JITOMATE',
  CHILE: 'CHILE'
};

export function mapCropToBackend(code) {
  if (!code || typeof code !== 'string') {
    return '';
  }

  const normalized = code.trim().toUpperCase();
  return cropCodeToBackend[normalized] || normalized;
}
