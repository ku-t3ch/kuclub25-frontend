import { useState, useEffect, useCallback } from "react";
import { apiService, ApiError } from "../services/apiService";
import { API_CONFIG } from "../configs/API.config";
import { Campus, CampusApiResponse } from "../types/organization";

export const useCampuses = () => {
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCampuses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.get<CampusApiResponse>(
        API_CONFIG.ENDPOINTS.CAMPUSES || "/campuses"
      );

      if (response.success && response.data) {
      
        setCampuses(response.data);

        if (process.env.NODE_ENV === "development") {
          console.log("🏛️ Campuses loaded:", {
            rawApiData: response.data,
            count: response.data.length,
          });
        }
      } else {
        throw new Error(response.message || "Failed to fetch campuses");
      }
    } catch (err) {
      const errorMessage =
        err instanceof ApiError ? err.message : "Error fetching campuses";

      setError(errorMessage);
      setCampuses([]);
      console.error("Error fetching campuses:", err);
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
    clearError,
  };
};
