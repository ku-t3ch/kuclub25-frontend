import { useState, useEffect, useCallback, useMemo, useRef } from "react";
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


const normalizeOrganization = (() => {
  const cache = new WeakMap<any, Organization>();
  
  return (org: any): Organization => {
    if (cache.has(org)) {
      return cache.get(org)!;
    }

    const normalized = {
      ...org,
      id: String(org.id),
      org_type_id: String(org.org_type_id),
      org_type_name: org.org_type_name || "",
      campus_name: org.campus_name || "",
      campus_id: org.campus_id || "",
      views: Number(org.views) || 0,
    };

    cache.set(org, normalized);
    return normalized;
  };
})();

export const useOrganizations = (): OrganizationAllReturn => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchOrganizations = useCallback(async () => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.get<OrganizationsResponse>(
        API_CONFIG.ENDPOINTS.ORGANIZATIONS.LIST
      );

      if (!controller.signal.aborted) {
        if (response.success && response.data) {
          setOrganizations(response.data.map(normalizeOrganization));
        } else {
          throw new Error(response.message || "Failed to fetch organizations");
        }
      }
    } catch (error) {
      if (!controller.signal.aborted) {
        const errorMessage = error instanceof ApiError 
          ? error.message 
          : "An unexpected error occurred while fetching organizations";
        
        setError(errorMessage);
        setOrganizations([]);
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
    fetchOrganizations();

    // Cleanup on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchOrganizations]);

  return {
    organizations,
    loading,
    error,
    refetch: fetchOrganizations,
    clearError,
  };
};

interface UseOrganizationsWithFiltersReturn extends OrganizationAllReturn {
  filteredOrganizations: Organization[];
  setFilters: (filters: OrganizationFilters) => void;
  currentFilters: OrganizationFilters;
}

export const useOrganizationsWithFilters = (): UseOrganizationsWithFiltersReturn => {
  const { organizations, loading, error, refetch, clearError } = useOrganizations();
  const { projects } = useProjects();
  const [filters, setFilters] = useState<OrganizationFilters>({});

  // Memoized filter functions
  const filterByType = useCallback((orgs: Organization[], typeName: string) => 
    orgs.filter(org => org.org_type_name === typeName), []);

  const filterByCampus = useCallback((orgs: Organization[], campusId: string) => 
    orgs.filter(org => org.campus_id === campusId), []);

  const filterBySearch = useCallback((orgs: Organization[], search: string) => {
    const searchLower = search.toLowerCase();
    return orgs.filter(org =>
      org.orgnameth.toLowerCase().includes(searchLower) ||
      org.orgnameen.toLowerCase().includes(searchLower) ||
      org.org_nickname?.toLowerCase().includes(searchLower) ||
      org.description?.toLowerCase().includes(searchLower)
    );
  }, []);

  // Memoized sorting with performance optimization
  const sortOrganizations = useCallback((orgs: Organization[], sortBy: string) => {
    switch (sortBy) {
      case "latest":
        return orgs.sort((a, b) => {
          if (!projects?.length) return parseInt(b.id) - parseInt(a.id);

          const now = new Date();
          const getUpcomingProjects = (orgId: string) => 
            projects.filter(project => 
              project.organization_orgid === orgId &&
              project.date_start &&
              new Date(project.date_start) >= now
            );

          const aProjects = getUpcomingProjects(a.id);
          const bProjects = getUpcomingProjects(b.id);

          if (!aProjects.length && !bProjects.length) {
            return parseInt(b.id) - parseInt(a.id);
          }
          if (!aProjects.length) return 1;
          if (!bProjects.length) return -1;

          const getNextProject = (projects: any[]) => 
            projects.sort((p1, p2) => 
              new Date(p1.date_start).getTime() - new Date(p2.date_start).getTime()
            )[0];

          const nextProjectA = getNextProject(aProjects);
          const nextProjectB = getNextProject(bProjects);

          return new Date(nextProjectA.date_start).getTime() - 
                 new Date(nextProjectB.date_start).getTime();
        });

      case "name":
        return orgs.sort((a, b) =>
          (a.orgnameen || "").localeCompare(b.orgnameen || "") ||
          (a.orgnameth || "").localeCompare(b.orgnameth || "") ||
          (a.org_nickname || "").localeCompare(b.org_nickname || "")
        );

      case "views":
        return orgs.sort((a, b) => (b.views || 0) - (a.views || 0));

      default:
        return orgs;
    }
  }, [projects]);

  const applyPagination = useCallback((orgs: Organization[], offset?: number, limit?: number) => {
    if (offset !== undefined && limit !== undefined) {
      return orgs.slice(offset, offset + limit);
    }
    if (limit !== undefined) {
      return orgs.slice(0, limit);
    }
    return orgs;
  }, []);


  const filteredOrganizations = useMemo(() => {
    let result = [...organizations];

    if (filters.orgTypeName) {
      result = filterByType(result, filters.orgTypeName);
    }

    if (filters.campusId) {
      result = filterByCampus(result, filters.campusId);
    }

    if (filters.search) {
      result = filterBySearch(result, filters.search);
    }

    if (filters.sortBy) {
      result = sortOrganizations(result, filters.sortBy);
    }

    return applyPagination(result, filters.offset, filters.limit);
  }, [organizations, filters, filterByType, filterByCampus, filterBySearch, sortOrganizations, applyPagination]);

  // Optimized setFilters to avoid unnecessary updates
  const optimizedSetFilters = useCallback((newFilters: OrganizationFilters) => {
    setFilters(prev => {
      const merged = { ...prev, ...newFilters };
      // Only update if actually different
      if (JSON.stringify(merged) !== JSON.stringify(prev)) {
        return merged;
      }
      return prev;
    });
  }, []);

  return {
    organizations,
    filteredOrganizations,
    loading,
    error,
    refetch,
    clearError,
    setFilters: optimizedSetFilters,
    currentFilters: filters,
  };
};

interface UseOrganizationDetailReturn {
  organization: Organization | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  clearError: () => void;
}

export const useOrganizationDetail = (id: string | null): UseOrganizationDetailReturn => {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchOrganization = useCallback(async () => {
    if (!id) return;

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const response = await apiService.get<OrganizationDetailResponse>(
        API_CONFIG.ENDPOINTS.ORGANIZATIONS.DETAIL(id)
      );

      if (!controller.signal.aborted) {
        if (response.success && response.data) {
          setOrganization(normalizeOrganization(response.data));
        } else {
          throw new Error(response.message || "Failed to fetch organization");
        }
      }
    } catch (error) {
      if (!controller.signal.aborted) {
        const errorMessage = error instanceof ApiError 
          ? error.message 
          : "An unexpected error occurred while fetching organization";
        
        setError(errorMessage);
        setOrganization(null);
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [id]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    fetchOrganization();

    // Cleanup on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
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
      return await apiService.put(
        API_CONFIG.ENDPOINTS.ORGANIZATIONS.UPDATE_VIEWS(orgId)
      );
    } catch (error) {
      throw error;
    }
  }, []);

  return { updateViews };
};