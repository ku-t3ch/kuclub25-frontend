import { Project } from '../types/project';

export interface ActivityType {
  id: string;
  label: string;
  color: string;
}

export interface ActivityHours {
  social_activities?: number;
  university_activities?: number;
  competency_development_activities?: {
    health?: number;
    virtue?: number;
    thinking_and_learning?: number;
    interpersonal_relationships_and_communication?: number;
  } | number;
}

// Optimized activity types extraction with memoization
const activityTypeCache = new WeakMap<Project, string[]>();

export const getActivityTypes = (project: Project): string[] => {
  // Check cache first
  if (activityTypeCache.has(project)) {
    return activityTypeCache.get(project)!;
  }

  const types: string[] = [];
  
  if (!project?.activity_hours || typeof project.activity_hours !== 'object') {
    activityTypeCache.set(project, types);
    return types;
  }

  const activityHours = project.activity_hours as ActivityHours;

  // Process each activity type efficiently
  Object.entries(activityHours).forEach(([key, value]) => {
    if (key === '__proto__' || !value) return;

    if (key === 'competency_development_activities') {
      if (typeof value === 'object' && !Array.isArray(value)) {
        // Handle nested competency activities
        const totalHours = Object.values(value)
          .filter((hours): hours is number => typeof hours === 'number' && hours > 0)
          .reduce((sum, hours) => sum + hours, 0);
        
        if (totalHours > 0) types.push(key);
      } else if (typeof value === 'number' && value > 0) {
        types.push(key);
      }
    } else if (typeof value === 'number' && value > 0) {
      types.push(key);
    }
  });

  // Cache the result
  activityTypeCache.set(project, types);
  return types;
};

// Optimized filter matching
export const projectMatchesFilters = (
  project: Project, 
  filters: string[], 
  getActivityTypesFunc: typeof getActivityTypes = getActivityTypes
): boolean => {
  if (!filters.length || filters.includes('all')) return true;
  
  const activityTypes = getActivityTypesFunc(project);
  return filters.some(filter => activityTypes.includes(filter));
};

// Optimized color lookup with fallback
export const getActivityColor = (type: string, ACTIVITY_TYPES: ActivityType[]): string => {
  const activityType = ACTIVITY_TYPES.find(activity => activity.id === type);
  return activityType?.color ?? '#6B7280';
};

// Utility for date operations
export const createDateKey = (date: Date): string => {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
};

// Optimized project grouping by date
export const groupProjectsByDate = (projects: any[]): Map<string, any[]> => {
  const groupedProjects = new Map<string, any[]>();
  
  projects.forEach(project => {
    if (!project.start) return;
    
    const dateKey = createDateKey(new Date(project.start));
    const existingProjects = groupedProjects.get(dateKey) || [];
    existingProjects.push(project);
    groupedProjects.set(dateKey, existingProjects);
  });
  
  return groupedProjects;
};

// Clear cache when needed (for memory management)
export const clearActivityTypeCache = (): void => {
  // WeakMap automatically clears when objects are garbage collected
  // This is just for explicit clearing if needed
};

// Helper function for backward compatibility (deprecated - use projectMatchesFilters)
export const eventMatchesFilters = projectMatchesFilters;