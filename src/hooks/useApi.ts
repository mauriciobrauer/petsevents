import { useState, useEffect, useCallback } from 'react';
import { ApiError } from '../services/api';

export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface ApiActions<T> {
  refetch: () => Promise<void>;
  setData: (data: T | null) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
): ApiState<T> & ApiActions<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    setData,
    setError,
    setLoading,
  };
}

export function useApiMutation<T, P = any>(
  apiCall: (params: P) => Promise<T>
) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (params: P): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall(params);
      return result;
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('API Error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  return {
    mutate,
    loading,
    error,
    setError,
  };
}
