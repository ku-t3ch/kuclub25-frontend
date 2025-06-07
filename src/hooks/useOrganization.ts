/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, useMemo } from "react";
import { apiService, ApiError } from "../services/apiService";
import { API_CONFIG } from "../configs/API.config";
import {
  Organization,
  OrganizationsResponse,
  OrganizationDetailResponse,
  OrganizationAllReturn,
  OrganizationFilters,
} from "../types/organization";

export const useOrganizations = (): OrganizationAllReturn => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganizations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.get<OrganizationsResponse>(
        API_CONFIG.ENDPOINTS.ORGANIZATIONS.LIST
      );

      if (response.success && response.data) {
        // Normalize data - แปลงข้อมูลให้ตรงกับ interface
        const normalizedData = response.data.map((org) => ({
          ...org,
          id: String(org.id), // ให้แน่ใจว่า id เป็น string
          org_type_id: String(org.org_type_id), // ให้แน่ใจว่า org_type_id เป็น string
          org_type_name: org.org_type_name || "", // ให้แน่ใจว่า org_type_name มีค่า
          views: Number(org.views) || 0, // แปลงเป็น number
        }));

        setOrganizations(normalizedData);
      } else {
        throw new Error(response.message || "Failed to fetch organizations");
      }
    } catch (error) {
      const errorMessage =
        error instanceof ApiError
          ? error.message
          : "An unexpected error occurred while fetching organizations";

      console.error("Error fetching organizations:", error);
      setError(errorMessage);
      setOrganizations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  return {
    organizations,
    loading,
    error,
    refetch: fetchOrganizations,
    clearError,
  };
};

// Hook สำหรับดึงข้อมูลองค์กรด้วย filters
interface UseOrganizationsWithFiltersReturn extends OrganizationAllReturn {
  filteredOrganizations: Organization[];
  setFilters: (filters: OrganizationFilters) => void;
  currentFilters: OrganizationFilters;
}

export const useOrganizationsWithFilters =
  (): UseOrganizationsWithFiltersReturn => {
    const { organizations, loading, error, refetch, clearError } =
      useOrganizations();
    const [filters, setFilters] = useState<OrganizationFilters>({});

    const filteredOrganizations = useMemo(() => {
      let result = [...organizations];

      // Filter by org type name - ใช้ org_type_name แทน org_type_id
      if (filters.orgTypeName !== undefined && filters.orgTypeName !== "") {
        result = result.filter((org) => {
          return org.org_type_name === filters.orgTypeName;
        });
      }

      // Filter by search
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        result = result.filter(
          (org) =>
            org.orgnameth.toLowerCase().includes(searchLower) ||
            org.orgnameen.toLowerCase().includes(searchLower) ||
            org.org_nickname?.toLowerCase().includes(searchLower) ||
            org.description?.toLowerCase().includes(searchLower)
        );
      }

      // Sort
      if (filters.sortBy) {
        result.sort((a, b) => {
          let aValue: any, bValue: any;

          switch (filters.sortBy) {
            case "name":
              aValue = a.orgnameth || a.orgnameen;
              bValue = b.orgnameth || b.orgnameen;
              break;
            case "views":
              aValue = a.views;
              bValue = b.views;
              break;
            case "latest":
              aValue = a.id;
              bValue = b.id;
              break;
            default:
              return 0;
          }

          if (filters.sortOrder === "desc") {
            return aValue < bValue ? 1 : -1;
          }
          return aValue > bValue ? 1 : -1;
        });
      }

      // Pagination
      if (filters.offset !== undefined && filters.limit !== undefined) {
        result = result.slice(filters.offset, filters.offset + filters.limit);
      } else if (filters.limit !== undefined) {
        result = result.slice(0, filters.limit);
      }

      return result;
    }, [organizations, filters]);

    return {
      organizations,
      filteredOrganizations,
      loading,
      error,
      refetch,
      clearError,
      setFilters,
      currentFilters: filters,
    };
  };

// Hook สำหรับดึงข้อมูลองค์กรเฉพาะ ID
interface UseOrganizationDetailReturn {
  organization: Organization | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  clearError: () => void;
}

export const useOrganizationDetail = (
  id: string | null
): UseOrganizationDetailReturn => {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganization = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const endpoint = API_CONFIG.ENDPOINTS.ORGANIZATIONS.DETAIL(id);
      const response = await apiService.get<OrganizationDetailResponse>(
        endpoint
      );

      if (response.success && response.data) {
        // Normalize data
        const normalizedData = {
          ...response.data,
          id: String(response.data.id),
          org_type_id: String(response.data.org_type_id),
          org_type_name: response.data.org_type_name || "",
          views: Number(response.data.views) || 0,
        };

        setOrganization(normalizedData);
      } else {
        throw new Error(response.message || "Failed to fetch organization");
      }
    } catch (error) {
      const errorMessage =
        error instanceof ApiError
          ? error.message
          : "An unexpected error occurred while fetching organization";

      console.error("Error fetching organization:", error);
      setError(errorMessage);
      setOrganization(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    fetchOrganization();
  }, [fetchOrganization]);

  return {
    organization,
    loading,
    error,
    refetch: fetchOrganization,
    clearError,
  };
};
