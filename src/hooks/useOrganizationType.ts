import { useState, useEffect, useCallback, useRef } from "react";
import { apiService, ApiError } from "../services/apiService";
import { API_CONFIG } from "../configs/API.config";
import {
  OrganizationType,
  OrganizationTypesApiResponse,
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
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchOrganizationTypes = useCallback(async () => {
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setLoading(true);
      setError(null);

      const response = await apiService.get<OrganizationTypesApiResponse>(
        API_CONFIG.ENDPOINTS.ORGANIZATION_TYPES.LIST
      );

      if (!controller.signal.aborted) {
        if (response.success && response.data) {
          setOrganizationTypes(response.data);

          if (process.env.NODE_ENV === "development") {
            console.log("🏷️ Organization types loaded:", {
              count: response.data.length,
              data: response.data,
            });
          }
        } else {
          throw new Error(
            response.message || "Failed to fetch organization types"
          );
        }
      }
    } catch (error) {
      if (!controller.signal.aborted) {
        const errorMessage =
          error instanceof ApiError
            ? error.message
            : "An unexpected error occurred while fetching organization types";

        console.error("Error fetching organization types:", error);
        setError(errorMessage);
        setOrganizationTypes([]);
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    fetchOrganizationTypes();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchOrganizationTypes]);

  return {
    organizationTypes,
    loading,
    error,
    refetch: fetchOrganizationTypes,
    clearError,
  };
};
