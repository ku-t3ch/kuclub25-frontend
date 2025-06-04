import { TokenResponse } from '../types/auth';
import { API_CONFIG, getApiUrl } from '../configs/API.config';
import { LocalStorageManager, StorageKeys } from '../types/storage';

export class AuthService {
  private token: string | null = null;
  private tokenExpiry: number | null = null;
  private isInitialized: boolean = false;

  async initializeToken(): Promise<void> {
    if (this.isInitialized) return;

    // ตรวจสอบ token ที่เก็บไว้ก่อน
    const existingToken = this.getStoredToken();
    if (existingToken) {
      this.isInitialized = true;
      return;
    }

    // ถ้าไม่มี token หรือหมดอายุ ให้ขอ token ใหม่
    try {
      await this.requestNewToken();
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize token:', error);
      // อย่า throw error เพื่อให้แอปยังใช้งานได้
    }
  }

  private async requestNewToken(): Promise<string> {
    // ใช้ NEXT_PUBLIC_CLIENT_SECRET สำหรับ client-side
    const clientSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET || '';
    
    if (!clientSecret) {
      throw new Error('Client secret not configured. Please set NEXT_PUBLIC_CLIENT_SECRET in your .env file');
    }

    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.AUTH.GET_TOKEN), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-client-secret': clientSecret
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data: TokenResponse = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to get token');
      }

      this.setToken(data.token);
      return data.token;
    } catch (error) {
      console.error('Error getting token:', error);
      throw error;
    }
  }

  private setToken(token: string): void {
    this.token = token;
    // Set expiry time (7 days from now)
    this.tokenExpiry = Date.now() + (7 * 24 * 60 * 60 * 1000);
    
    // Store in localStorage
    LocalStorageManager.setItem(StorageKeys.AUTH_TOKEN, token);
    LocalStorageManager.setItem(StorageKeys.AUTH_TOKEN_EXPIRY, this.tokenExpiry.toString());
  }

  getStoredToken(): string | null {
    // Check memory first
    if (this.token && this.isTokenValid()) {
      return this.token;
    }

    // Try to get from localStorage
    const storedToken = LocalStorageManager.getItem(StorageKeys.AUTH_TOKEN);
    const storedExpiry = LocalStorageManager.getItem(StorageKeys.AUTH_TOKEN_EXPIRY);

    if (storedToken && storedExpiry) {
      const expiryTime = parseInt(storedExpiry, 10);
      if (!isNaN(expiryTime) && Date.now() < expiryTime) {
        this.token = storedToken;
        this.tokenExpiry = expiryTime;
        return storedToken;
      } else {
        // Token expired
        this.clearToken();
      }
    }

    return null;
  }

  isTokenValid(): boolean {
    return this.tokenExpiry !== null && Date.now() < this.tokenExpiry;
  }

  clearToken(): void {
    this.token = null;
    this.tokenExpiry = null;
    this.isInitialized = false;
    LocalStorageManager.removeItem(StorageKeys.AUTH_TOKEN);
    LocalStorageManager.removeItem(StorageKeys.AUTH_TOKEN_EXPIRY);
  }

  async getAuthHeaders(): Promise<Record<string, string>> {
    // ตรวจสอบว่ามี token และยังไม่หมดอายุ
    let token = this.getStoredToken();
    
    // ถ้าไม่มี token หรือหมดอายุ ให้ขอใหม่
    if (!token) {
      try {
        token = await this.requestNewToken();
      } catch (error) {
        console.error('Failed to get fresh token:', error);
        // ส่ง headers แบบไม่มี token
        return {
          'Content-Type': 'application/json'
        };
      }
    }

    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }

  // Method เพื่อ refresh token ถ้าต้องการ
  async refreshToken(): Promise<boolean> {
    try {
      await this.requestNewToken();
      return true;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      return false;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();