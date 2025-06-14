/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, useMemo } from "react";
import { apiService, ApiError } from "../services/apiService";
import { API_CONFIG } from "../configs/API.config";
import { useProjects } from "./useProject";
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
        const normalizedData = response.data.map((org) => ({
          ...org,
          id: String(org.id),
          org_type_id: String(org.org_type_id),
          org_type_name: org.org_type_name || "",
          views: Number(org.views) || 0,
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
    const { projects } = useProjects(); // ดึงข้อมูล projects
    const [filters, setFilters] = useState<OrganizationFilters>({});

    const filteredOrganizations = useMemo(() => {
      let result = [...organizations];
      const now = new Date();

      // Filter by org type name
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
        switch (filters.sortBy) {
          case "latest":
            // เรียงตามกิจกรรมที่กำลังจะมาถึงเร็วที่สุด
            result = result.sort((a, b) => {
              if (!projects || !projects.length) {
                return parseInt(b.id) - parseInt(a.id);
              }

              const aProjects = projects.filter(
                (project) =>
                  project.organization_orgid === a.id &&
                  project.date_start &&
                  new Date(project.date_start) >= now
              );

              const bProjects = projects.filter(
                (project) =>
                  project.organization_orgid === b.id &&
                  project.date_start &&
                  new Date(project.date_start) >= now
              );

              if (aProjects.length === 0 && bProjects.length === 0) {
                return parseInt(b.id) - parseInt(a.id);
              }

              if (aProjects.length === 0) return 1;

              if (bProjects.length === 0) return -1;

              try {
                const nextProjectA = aProjects.sort((p1, p2) => {
                  const date1 = new Date(p1.date_start);
                  const date2 = new Date(p2.date_start);
                  return date1.getTime() - date2.getTime();
                })[0];

                const nextProjectB = bProjects.sort((p1, p2) => {
                  const date1 = new Date(p1.date_start);
                  const date2 = new Date(p2.date_start);
                  return date1.getTime() - date2.getTime();
                })[0];

                // ใช้ date_start โดยตรงในการเปรียบเทียบ
                const dateTimeA = new Date(nextProjectA.date_start);
                const dateTimeB = new Date(nextProjectB.date_start);

                return dateTimeA.getTime() - dateTimeB.getTime();
              } catch (error) {
                console.error("Error sorting projects:", error);
                return 0;
              }
            });
            break;

          case "name":
            result = result.sort(
              (a, b) =>
                (a.orgnameen || "").localeCompare(b.orgnameen || "") ||
                (a.orgnameth || "").localeCompare(b.orgnameth || "") ||
                (a.org_nickname || "").localeCompare(b.org_nickname || "")
            );
            break;

          case "views":
            result = result.sort((a, b) => (b.views || 0) - (a.views || 0));
            break;

          default:
            break;
        }
      }

      // Pagination
      if (filters.offset !== undefined && filters.limit !== undefined) {
        result = result.slice(filters.offset, filters.offset + filters.limit);
      } else if (filters.limit !== undefined) {
        result = result.slice(0, filters.limit);
      }

      return result;
    }, [organizations, projects, filters]);

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

export const useUpdateOrganizationViews = () => {
  const updateViews = useCallback(async (orgId: string) => {
    try {
      const response = await apiService.put(
        API_CONFIG.ENDPOINTS.ORGANIZATIONS.UPDATE_VIEWS(orgId)
      );
      return response;
    } catch (error) {
      console.error("Error updating organization views:", error);
      throw error;
    }
  }, []);

  return { updateViews };
};
