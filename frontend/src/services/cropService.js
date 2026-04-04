import { fetchCrops, fetchCropCatalog, createCrop } from '../api';

export const getCrops = () => fetchCrops();
export const getCropCatalog = () => fetchCropCatalog();
export const addCrop = (payload) => createCrop(payload);
