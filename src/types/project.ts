export interface ActivityHours {
  social_activities?: number;
  university_activities?: number;
  competency_development_activities?: {
    health?: number;
    virtue?: number;
    thinking_and_learning?: number;
    interpersonal_relationships_and_communication?: number;
  };
}

export interface ProjectParticipants {
  guest?: number;
  coreteam?: number;
}

export interface ScheduleDay {
  date: string;
  time: string[];
  description: string;
}

export interface Schedule {
  each_day: ScheduleDay[];
  location: string;
}

export interface OutsideKaset {
  district?: string;
  province?: string;
}

export interface Project {
  id: string;
  
  // Database field names
  date_start_the_project?: Date;
  date_end_the_project?: Date;
  project_location?: string;
  project_name_en?: string;
  project_name_th?: string;
  campus_name?: string; 
  
  // Alternative field names (for compatibility)
  date_start?: Date;
  date_end?: Date;
  location?: string;
  name_en?: string;
  name_th?: string;
  
  // Organization info
  org_nickname?: string;
  org_name_en?: string;
  org_name_th?: string;
  organization_orgid: string; // Organization ID
  
  // Project details
  activity_hours: ActivityHours | string;
  activity_format: string[] | string; // รูปแบบกิจกรรม
  expected_project_outcome: string[] | string; // ผลลัพธ์ที่คาดหวัง
  schedule: Schedule | string; // ตารางเวลา
  outside_kaset: OutsideKaset | string | null; // ข้อมูลสถานที่นอก มก.
  
  principal_and_reasoning?: string; // Database field name
  project_objectives?: string[] | string;
}

// API Response types
export interface ProjectsResponse {
  success: boolean;
  data: Project[];
  message?: string;
}

export interface ProjectDetailResponse {
  success: boolean;
  data: Project;
  message?: string;
}

// Hook return types
export interface ProjectAllReturn {
  projects: Project[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  clearError: () => void;
}

export interface ProjectDetailReturn {
  project: Project | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  clearError: () => void;
}

// Project filters interface
export interface ProjectFilters {
  search?: string;
  organizationId?: string;
  activityFormat?: string;
  location?: string;
  dateFrom?: Date;
  dateTo?: Date;
  sortBy?: "name" | "date" | "latest";
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
}