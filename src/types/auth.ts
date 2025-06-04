export interface TokenResponse {
  message: string;
  success: boolean;
  token: string;
  expiresIn: string;
  type: string;
}

export interface JWTPayload {
  type: 'client';
  iat: number;
  exp: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}