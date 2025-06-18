export interface Campus {
  name: string;
}

export interface CampusApiResponse {
  success: boolean;
  data: Campus[]; 
  message?: string;
}

export interface CampusResponse {
  success: boolean;
  data: Campus[];
  message?: string;
}



export interface Organization {
  org_type_id: string;
  id: string;
  orgnameen: string;
  orgnameth: string;
  organizationMark: string;
  org_image: string;
  description: string;
  instagram: string;
  facebook: string;
  views: number;
  org_nickname: string;
  org_type_name?: string;
  details?: string;
  campus_name?: string;
  campus_id?: string;
}

export interface OrganizationAllReturn {
  organizations: Organization[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  clearError: () => void;
  updateViews: (orgId: string) => Promise<void>;
}

export interface OrganizationsResponse {
  success: boolean;
  data: Organization[];
  message?: string;
}

export interface OrganizationDetailResponse {
  success: boolean;
  data: Organization;
  message?: string;
}

export interface OrganizationFilters {
  search?: string;
  orgTypeName?: string;
  campusId?: string; // Changed from number to string to match Campus.id
  campusName?: string; // Add this for filtering by campus name
  limit?: number;
  offset?: number;
  sortBy?: "name" | "views" | "latest";
  sortOrder?: "asc" | "desc" | "default";
}
