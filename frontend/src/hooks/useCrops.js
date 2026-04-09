import { useEffect, useState } from 'react';
import { getCrops, getCropCatalog, addCrop } from '../services/cropService';

export function useCrops() {
  const [crops, setCrops] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadCrops = async () => {
    setLoading(true);
    setError('');

    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out')), 30000)
      );
      const apiPromise = Promise.all([getCrops(), getCropCatalog()]);
      const [cropData, catalogData] = await Promise.race([apiPromise, timeoutPromise]);
      setCrops(cropData || []);
      setCatalog(catalogData || []);
    } catch (err) {
      setError(err.message || 'Could not load crops');
    } finally {
      setLoading(false);
    }
  };

  const createNewCrop = async (payload) => {
    setLoading(true);
    setError('');
    try {
      const crop = await addCrop(payload);
      setCrops((prev) => [...prev, crop]);
      return crop;
    } catch (err) {
      console.error('[useCrops] createNewCrop failed', err);
      setError(err.message || 'Could not create crop');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCrops();
  }, []);

  return {
    crops,
    catalog,
    loading,
    error,
    loadCrops,
    createNewCrop,
    setError
  };
}
