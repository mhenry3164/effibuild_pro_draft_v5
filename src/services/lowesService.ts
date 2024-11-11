import axios from 'axios';
import { LOWES_API } from '@/config/constants';
import Logger from '@/lib/utils/logger';

interface LowesAuthToken {
  access_token: string;
  expires_in: number;
  token_type: string;
}

class LowesService {
  private token: string | null = null;
  private tokenExpiration: number = 0;

  private async getAuthToken(): Promise<string> {
    if (this.token && Date.now() < this.tokenExpiration) {
      return this.token;
    }

    try {
      const response = await axios.post<LowesAuthToken>(
        LOWES_API.AUTH_URL,
        {
          grant_type: 'client_credentials',
          scope: LOWES_API.SCOPES.join(' '),
        },
        {
          auth: {
            username: process.env.LOWES_CLIENT_ID!,
            password: process.env.LOWES_CLIENT_SECRET!,
          },
        }
      );

      this.token = response.data.access_token;
      this.tokenExpiration = Date.now() + (response.data.expires_in * 1000);

      return this.token;
    } catch (error) {
      Logger.error('Failed to get Lowe\'s auth token:', error);
      throw new Error('Failed to authenticate with Lowe\'s API');
    }
  }

  private async request<T>(
    endpoint: string,
    params: Record<string, any> = {}
  ): Promise<T> {
    try {
      const token = await this.getAuthToken();
      const response = await axios.get<T>(`${LOWES_API.BASE_URL}${endpoint}`, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      Logger.error(`Lowe's API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async getProductDetails(sku: string) {
    return this.request(`${LOWES_API.ENDPOINTS.PRODUCTS}/${sku}`);
  }

  async getProductPrice(sku: string) {
    return this.request(`${LOWES_API.ENDPOINTS.PRICING}/${sku}`);
  }

  async searchProducts(query: string, category?: string) {
    return this.request(LOWES_API.ENDPOINTS.PRODUCTS, {
      q: query,
      category,
      limit: 50,
    });
  }

  async checkInventory(sku: string, storeId: string) {
    return this.request(`${LOWES_API.ENDPOINTS.INVENTORY}/${sku}`, {
      storeId,
    });
  }
}

export const lowesService = new LowesService();