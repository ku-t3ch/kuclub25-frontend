import { useState, useEffect, useCallback } from 'react';
import { apiService, ApiError } from "../services/apiService";
import { API_CONFIG } from "../configs/API.config";
import { Campus, CampusResponse } from '../types/organization';

export const useCampuses = () => {
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCampuses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.get<CampusResponse>(
        API_CONFIG.ENDPOINTS.CAMPUSES || '/campuses'
      );
      
      if (response.success && response.data) {
        setCampuses(response.data);
      } else {
        setError(response.message || 'Failed to fetch campuses');
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Error fetching campuses');
      }
      console.error('Error fetching campuses:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCampuses();
  }, [fetchCampuses]);

  const refetch = useCallback(async () => {
    await fetchCampuses();
  }, [fetchCampuses]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { 
    campuses, 
    loading, 
    error,
    refetch,
    clearError
  };
};