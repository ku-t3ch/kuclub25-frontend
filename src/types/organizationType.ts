export interface OrganizationType {
  name: string;
}

export interface OrganizationTypesApiResponse {
  success: boolean;
  data: string[]; 
  message?: string;
}


export interface OrganizationTypesResponse {
  success: boolean;
  data: OrganizationType[];
  message?: string;
}