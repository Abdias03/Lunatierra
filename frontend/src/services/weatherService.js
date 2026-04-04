import { fetchRecommendations, fetchLunarPhase, fetchLunarRecommendations } from '../api';

export const getRecommendations = () => fetchRecommendations();
export const getLunarPhase = () => fetchLunarPhase();
export const getLunarRecommendations = () => fetchLunarRecommendations();
