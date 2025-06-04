export interface OrganizationType {
  id: string;
  name: string;
}

export interface OrganizationTypesResponse {
  success: boolean;
  data: OrganizationType[];
  message?: string;
}