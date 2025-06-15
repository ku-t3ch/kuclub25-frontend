// Get API base URL dynamically based on current hostname
const getApiBaseUrl = (): string => {

  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000";
  }

  // For client-side, check hostname
  const hostname = window.location.hostname;

  if (hostname === process.env.NEXT_PUBLIC_NETWORK) {
    return `http://${process.env.NEXT_PUBLIC_NETWORK}:9000` || "http://localhost:4000";
  }

  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
};

export const API_CONFIG = {
  get BASE_URL() {
    return getApiBaseUrl();
  },
  PREFIX: process.env.NEXT_PUBLIC_API_PREFIX || "/api",
  CLIENT_SECRET: process.env.NEXT_PUBLIC_CLIENT_SECRET || "",
  TIMEOUT: 10000,


  ENDPOINTS: {
    AUTH: {
      GET_TOKEN: "/auth/get-token",
    },
    ORGANIZATION_TYPES: {
      LIST: "/organization-types",
      DETAIL: (id: string) => `/organization-types/${id}`,
    },
    ORGANIZATIONS: {
      LIST: "/organizations",
      DETAIL: (id: string) => `/organizations/${id}`,
      UPDATE_VIEWS : (id: string) => `/organizations/${id}/views`,
    },
    PROJECTS: {
      LIST: "/projects",
      DETAIL: (id: string) => `/projects/${id}`,
      BY_ORGANIZATION: (orgId: string) => `/projects/organization/${orgId}`

    },
    CAMPUSES: "/campuses",
    CAMPUS: (id: string) => `/campuses/${id}`,
   
  },

  // Headers
  HEADERS: {
    CONTENT_TYPE: "application/json",
    ACCEPT: "application/json",
    CLIENT_SECRET: "x-client-secret",
  },

  // Token keys
  STORAGE_KEYS: {
    CLIENT_TOKEN: "client_token",
    TOKEN_EXPIRES: "token_expires",
  },
} as const;

export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.PREFIX}${endpoint}`;
};


export const getCurrentApiUrl = (): string => {
  return API_CONFIG.BASE_URL;
};

export const isNetworkMode = (): boolean => {
  if (typeof window !== "undefined") {
    return window.location.hostname === process.env.NEXT_PUBLIC_NETWORK;
  }
  return false;
};
