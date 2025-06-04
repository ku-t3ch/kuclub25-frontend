import { useState, useEffect, useCallback } from "react";
import { apiService, ApiError } from "../services/apiService";
import { API_CONFIG } from "../configs/API.config";
import {
  OrganizationType,
  OrganizationTypesResponse,
} from "../types/organizationType";

interface UseOrganizationTypesReturn {
  organizationTypes: OrganizationType[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  clearError: () => void;
}

export const useOrganizationTypes = (): UseOrganizationTypesReturn => {
  const [organizationTypes, setOrganizationTypes] = useState<
    OrganizationType[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganizationTypes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.get<OrganizationTypesResponse>(
        API_CONFIG.ENDPOINTS.ORGANIZATION_TYPES.LIST
      );

      if (response.success && response.data) {
        // Normalize data - แปลง id เป็น string
        const normalizedData = response.data.map((type) => ({
          ...type,
          id: type.id,
        }));

        setOrganizationTypes(normalizedData);
      } else {
        throw new Error(
          response.message || "Failed to fetch organization types"
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof ApiError
          ? error.message
          : "An unexpected error occurred while fetching organization types";

      console.error("Error fetching organization types:", error);
      setError(errorMessage);
      setOrganizationTypes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    fetchOrganizationTypes();
  }, [fetchOrganizationTypes]);

  return {
    organizationTypes,
    loading,
    error,
    refetch: fetchOrganizationTypes,
    clearError,
  };
};
