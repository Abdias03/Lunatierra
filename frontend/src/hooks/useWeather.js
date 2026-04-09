import { useEffect, useState } from 'react';
import { getRecommendations, getLunarPhase } from '../services/weatherService';

export function useWeather() {
  const [recommendations, setRecommendations] = useState(null);
  const [lunarPhase, setLunarPhase] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadWeather = async () => {
    setLoading(true);
    setError('');

    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out')), 30000)
      );
      const apiPromise = Promise.all([getRecommendations(), getLunarPhase()]);
      const [recommendationResult, lunarResult] = await Promise.race([apiPromise, timeoutPromise]);
      setRecommendations(recommendationResult);
      setLunarPhase(lunarResult);
    } catch (err) {
      setError(err.message || 'Could not load weather/lunar data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeather();
  }, []);

  return {
    recommendations,
    lunarPhase,
    loading,
    error,
    loadWeather,
    setError
  };
}
