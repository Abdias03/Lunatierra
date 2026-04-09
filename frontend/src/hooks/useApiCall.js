import { useState, useRef, useEffect, useCallback } from 'react';

export function useApiCall(initialData = null) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(initialData);
  const mountedRef = useRef(true);
  const lastApiCallRef = useRef(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const execute = useCallback(async (apiCall, successCallback = null, errorCallback = null) => {
    if (!mountedRef.current) return null;

    lastApiCallRef.current = apiCall;
    setLoading(true);
    setError('');

    try {
      const result = await apiCall();
      if (mountedRef.current) {
        setData(result);
        if (successCallback) {
          successCallback(result);
        }
      }
      return result;
    } catch (err) {
      const errorMessage = err.message || 'An error occurred';
      if (mountedRef.current) {
        setError(errorMessage);
        if (errorCallback) {
          errorCallback(err);
        }
      }
      throw err;
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  const retry = useCallback(async () => {
    if (lastApiCallRef.current) {
      return execute(lastApiCallRef.current);
    }
  }, [execute]);

  const clearError = useCallback(() => {
    if (mountedRef.current) {
      setError('');
    }
  }, []);

  const reset = useCallback(() => {
    if (mountedRef.current) {
      setData(initialData);
      setError('');
      setLoading(false);
    }
  }, [initialData]);

  return { data, loading, error, execute, retry, clearError, reset };
}