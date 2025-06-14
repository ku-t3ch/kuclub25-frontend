import { useState, useEffect, useCallback, useMemo } from 'react';
import { apiService, ApiError } from '../services/apiService';
import { API_CONFIG } from '../configs/API.config';
import { Project, ProjectsResponse, ProjectDetailResponse, ProjectAllReturn, ProjectDetailReturn, ProjectFilters } from '../types/project';
import { parseDate, formatDateForDisplay, formatDateTimeForDisplay, formatTimeOnly } from '../utils/formatdate';

const normalizeProject = (project: Project): Project => {
  const normalized = {
    ...project,
    id: String(project.id),
    organization_orgid: String(project.organization_orgid),
    date_start_the_project: parseDate(project.date_start_the_project),
    date_end_the_project: parseDate(project.date_end_the_project),
    date_start: parseDate(project.date_start),
    date_end: parseDate(project.date_end),
  };

  Object.defineProperties(normalized, {
    startDateFormatted: {
      get() {
        return formatDateForDisplay(this.date_start_the_project || this.date_start);
      },
      enumerable: false,
      configurable: true,
    },
    endDateFormatted: {
      get() {
        return formatDateForDisplay(this.date_end_the_project || this.date_end);
      },
      enumerable: false,
      configurable: true,
    },
    startDateTimeFormatted: {
      get() {
        return formatDateTimeForDisplay(this.date_start_the_project || this.date_start);
      },
      enumerable: false,
      configurable: true,
    },
    endDateTimeFormatted: {
      get() {
        return formatDateTimeForDisplay(this.date_end_the_project || this.date_end);
      },
      enumerable: false,
      configurable: true,
    },
    startTimeFormatted: {
      get() {
        return formatTimeOnly(this.date_start_the_project || this.date_start);
      },
      enumerable: false,
      configurable: true,
    },
    endTimeFormatted: {
      get() {
        return formatTimeOnly(this.date_end_the_project || this.date_end);
      },
      enumerable: false,
      configurable: true,
    },
    dateRangeFormatted: {
      get() {
        const start = this.date_start_the_project || this.date_start;
        const end = this.date_end_the_project || this.date_end;
        
        if (!start && !end) return '';
        if (!end) return formatDateForDisplay(start);
        if (!start) return formatDateForDisplay(end);
        
        const startFormatted = formatDateForDisplay(start);
        const endFormatted = formatDateForDisplay(end);
        
        if (startFormatted === endFormatted) {
          const startTime = formatTimeOnly(start);
          const endTime = formatTimeOnly(end);
          return `${startFormatted} (${startTime} - ${endTime})`;
        }
        
        return `${startFormatted} - ${endFormatted}`;
      },
      enumerable: false,
      configurable: true,
    },
  });

  return normalized;
};

const useApiRequest = <T>(
  fetchFunction: () => Promise<T>,
  dependencies: React.DependencyList = [],
  immediate = true
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(immediate);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFunction();
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : 'An unexpected error occurred';
      setError(errorMessage);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, dependencies);

  const clearError = useCallback(() => setError(null), []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { data, loading, error, refetch: execute, clearError };
};

export const useProjects = (): ProjectAllReturn => {
  const fetchProjects = useCallback(async (): Promise<Project[]> => {
    const response = await apiService.get<ProjectsResponse>(
      API_CONFIG.ENDPOINTS.PROJECTS.LIST
    );
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch projects');
    }
    
    return response.data.map(normalizeProject);
  }, []);

  const { data: projects, loading, error, refetch, clearError } = useApiRequest(
    fetchProjects,
    [],
    true
  );

  return {
    projects: projects || [],
    loading,
    error,
    refetch,
    clearError
  };
};

export const useProjectDetail = (id: string | null): ProjectDetailReturn => {
  const fetchProject = useCallback(async (): Promise<Project | null> => {
    if (!id) return null;

    const response = await apiService.get<ProjectDetailResponse>(
      `${API_CONFIG.ENDPOINTS.PROJECTS.LIST}/${id}`
    );
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch project');
    }
    
    return normalizeProject(response.data);
  }, [id]);

  const { data: project, loading, error, refetch, clearError } = useApiRequest(
    fetchProject,
    [id],
    !!id
  );

  return {
    project,
    loading,
    error,
    refetch,
    clearError
  };
};

export const useProjectsByOrganization = (orgId: string | null): ProjectAllReturn => {
  const fetchProjectsByOrganization = useCallback(async (): Promise<Project[]> => {
    if (!orgId) return [];

    const response = await apiService.get<ProjectsResponse>(
      `${API_CONFIG.ENDPOINTS.PROJECTS.LIST}/organization/${orgId}`
    );
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch projects by organization');
    }
    
    return response.data.map(normalizeProject);
  }, [orgId]);

  const { data: projects, loading, error, refetch, clearError } = useApiRequest(
    fetchProjectsByOrganization,
    [orgId],
    !!orgId
  );

  return {
    projects: projects || [],
    loading,
    error,
    refetch,
    clearError
  };
};

const filterProjects = (projects: Project[], filters: ProjectFilters): Project[] => {
  return projects.filter(project => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const searchableFields = [
        project.project_name_th,
        project.project_name_en,
        project.org_name_th,
        project.org_name_en,
        project.org_nickname
      ].filter(Boolean);

      if (!searchableFields.some(field => 
        field?.toLowerCase().includes(searchLower)
      )) return false;
    }

    if (filters.organizationId && project.organization_orgid !== filters.organizationId) {
      return false;
    }

    if (filters.activityFormat) {
      const format = filters.activityFormat.toLowerCase();
      const projectFormat = project.activity_format;
      
      if (typeof projectFormat === 'string') {
        if (!projectFormat.toLowerCase().includes(format)) return false;
      } else if (Array.isArray(projectFormat)) {
        if (!projectFormat.some(f => f.toLowerCase().includes(format))) return false;
      } else {
        return false;
      }
    }

    if (filters.location) {
      const location = filters.location.toLowerCase();
      if (!project.project_location?.toLowerCase().includes(location)) return false;
    }

    const projectStartDate = project.date_start_the_project || project.date_start;
    const projectEndDate = project.date_end_the_project || project.date_end;

    if (filters.dateFrom && projectStartDate) {
      if (projectStartDate < filters.dateFrom) return false;
    }

    if (filters.dateTo && projectEndDate) {
      if (projectEndDate > filters.dateTo) return false;
    }

    return true;
  });
};

const sortProjects = (projects: Project[], sortBy: string, sortOrder: 'asc' | 'desc' = 'asc'): Project[] => {
  return [...projects].sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortBy) {
      case 'name':
        aValue = a.project_name_th || a.project_name_en || '';
        bValue = b.project_name_th || b.project_name_en || '';
        break;
      case 'date':
        aValue = a.date_start_the_project || a.date_start || new Date(0);
        bValue = b.date_start_the_project || b.date_start || new Date(0);
        break;
      case 'latest':
        aValue = parseInt(a.id) || 0;
        bValue = parseInt(b.id) || 0;
        break;
      default:
        return 0;
    }

    const comparison = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    return sortOrder === 'desc' ? -comparison : comparison;
  });
};

const paginateProjects = (projects: Project[], offset?: number, limit?: number): Project[] => {
  if (offset !== undefined && limit !== undefined) {
    return projects.slice(offset, offset + limit);
  }
  if (limit !== undefined) {
    return projects.slice(0, limit);
  }
  return projects;
};

interface UseProjectsWithFiltersReturn extends ProjectAllReturn {
  filteredProjects: Project[];
  setFilters: (filters: ProjectFilters) => void;
  currentFilters: ProjectFilters;
}

export const useProjectsWithFilters = (): UseProjectsWithFiltersReturn => {
  const { projects, loading, error, refetch, clearError } = useProjects();
  const [filters, setFilters] = useState<ProjectFilters>({});

  const filteredProjects = useMemo(() => {
    let result = filterProjects(projects, filters);
    
    if (filters.sortBy) {
      result = sortProjects(result, filters.sortBy, filters.sortOrder);
    }
    
    result = paginateProjects(result, filters.offset, filters.limit);
    
    return result;
  }, [projects, filters]);

  const optimizedSetFilters = useCallback((newFilters: ProjectFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  return {
    projects,
    filteredProjects,
    loading,
    error,
    refetch,
    clearError,
    setFilters: optimizedSetFilters,
    currentFilters: filters
  };
};

export const useAllProjects = () => useProjects();

export const useProjectById = (id: string | undefined) => 
  useProjectDetail(id || null);

export const useProjectsByOrgId = (orgId: string | undefined) => 
  useProjectsByOrganization(orgId || null);