export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
  PREFIX: process.env.NEXT_API_PREFIX || '/api',
  CLIENT_SECRET: process.env.NEXT_PUBLIC_CLIENT_SECRET || '',
  TIMEOUT: 10000,
  
  // Endpoints
  ENDPOINTS: {
    AUTH: {
      GET_TOKEN: '/auth/get-token',
    },
    ORGANIZATIONS: {
      LIST: '/organizations',
      DETAIL: (id: number) => `/organizations/${id}`,
    //   CATEGORIES: '/organizations/categories',
    },
    PROJECTS: {
      LIST: '/projects',
      DETAIL: (id: number) => `/projects/${id}`,
    },
    // CAMPUSES: {
    //   LIST: '/campuses',
    //   DETAIL: (id: number) => `/campuses/${id}`,
    // },
    // ORGANIZATION_TYPES: {
    //   LIST: '/organization-types',
    //   DETAIL: (id: number) => `/organization-types/${id}`,
    // },
  }, 
  
  // Headers
  HEADERS: {
    CONTENT_TYPE: 'application/json',
    ACCEPT: 'application/json',
    CLIENT_SECRET: 'x-client-secret',
  },
  
  // Token keys
  STORAGE_KEYS: {
    CLIENT_TOKEN: 'client_token',
    TOKEN_EXPIRES: 'token_expires',
  },
} as const;

export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.PREFIX}${endpoint}`;
};