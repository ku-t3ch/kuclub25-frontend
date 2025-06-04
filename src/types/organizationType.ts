export interface OrganizationType {
  id: number;
  name: string;
}

export interface OrganizationTypesResponse {
  success: boolean;
  data: OrganizationType[];
  message?: string;
}