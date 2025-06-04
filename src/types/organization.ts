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
  campus_name?: string;
}

export interface OrganizationAllReturn {
  organizations: Organization[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  clearError: () => void;
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
  campusId?: number;
  limit?: number;
  offset?: number;
  sortBy?: "name" | "views" | "latest";
  sortOrder?: "asc" | "desc" | "default";
}
