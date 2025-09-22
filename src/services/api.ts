import { supabaseApiService } from './supabaseApi';

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || '/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('farmfresh_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Check if Supabase is configured
  private isSupabaseConfigured(): boolean {
    return !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
  }

  // Auth endpoints
  async login(email: string, password: string, role: string) {
    if (this.isSupabaseConfigured()) {
      try {
        const result = await supabaseApiService.login(email, password);
        if (result.user) {
          localStorage.setItem('farmfresh_user', JSON.stringify(result.user));
        }
        return result;
      } catch (error) {
        throw error;
      }
    }

    // Fallback to REST API
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ email, password, role }),
    });
    
    const data = await this.handleResponse<any>(response);
    
    if (data.token) {
      localStorage.setItem('farmfresh_token', data.token);
      localStorage.setItem('farmfresh_user', JSON.stringify(data.user));
    }
    
    return data;
  }

  async register(name: string, email: string, password: string, role: string) {
    if (this.isSupabaseConfigured()) {
      try {
        const result = await supabaseApiService.register(name, email, password, role as 'farmer' | 'vendor' | 'customer');
        if (result.user) {
          localStorage.setItem('farmfresh_user', JSON.stringify(result.user));
        }
        return result;
      } catch (error) {
        throw error;
      }
    }

    // Fallback to REST API
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ name, email, password, role }),
    });
    
    const data = await this.handleResponse<any>(response);
    
    if (data.token) {
      localStorage.setItem('farmfresh_token', data.token);
      localStorage.setItem('farmfresh_user', JSON.stringify(data.user));
    }
    
    return data;
  }

  async getCurrentUser() {
    if (this.isSupabaseConfigured()) {
      try {
        return await supabaseApiService.getCurrentUser();
      } catch (error) {
        throw error;
      }
    }

    // Fallback to REST API
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: this.getAuthHeaders(),
    });
    
    return this.handleResponse<any>(response);
  }

  async logout() {
    if (this.isSupabaseConfigured()) {
      try {
        await supabaseApiService.logout();
      } catch (error) {
        console.error('Supabase logout error:', error);
      }
    }
    
    localStorage.removeItem('farmfresh_token');
    localStorage.removeItem('farmfresh_user');
  }

  // Products endpoints
  async getProducts(filters?: { category?: string; search?: string; organic?: boolean }) {
    if (this.isSupabaseConfigured()) {
      try {
        return await supabaseApiService.getProducts(filters);
      } catch (error) {
        throw error;
      }
    }

    // Fallback to REST API
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.organic) params.append('organic', 'true');
    
    const response = await fetch(`${API_BASE_URL}/products?${params}`, {
      headers: this.getAuthHeaders(),
    });
    
    return this.handleResponse<any>(response);
  }

  async getProduct(id: string) {
    if (this.isSupabaseConfigured()) {
      try {
        return await supabaseApiService.getProduct(id);
      } catch (error) {
        throw error;
      }
    }

    // Fallback to REST API
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      headers: this.getAuthHeaders(),
    });
    
    return this.handleResponse<any>(response);
  }

  async createProduct(productData: any) {
    if (this.isSupabaseConfigured()) {
      try {
        return await supabaseApiService.createProduct(productData);
      } catch (error) {
        throw error;
      }
    }

    // Fallback to REST API
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(productData),
    });
    
    return this.handleResponse<any>(response);
  }

  // Orders endpoints
  async createOrder(orderData: any) {
    if (this.isSupabaseConfigured()) {
      try {
        return await supabaseApiService.createOrder(orderData);
      } catch (error) {
        throw error;
      }
    }

    // Fallback to REST API
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(orderData),
    });
    
    return this.handleResponse<any>(response);
  }

  async getOrders() {
    if (this.isSupabaseConfigured()) {
      try {
        return await supabaseApiService.getOrders();
      } catch (error) {
        throw error;
      }
    }

    // Fallback to REST API
    const response = await fetch(`${API_BASE_URL}/orders`, {
      headers: this.getAuthHeaders(),
    });
    
    return this.handleResponse<any>(response);
  }

  // Analytics endpoints
  async getDashboardAnalytics() {
    if (this.isSupabaseConfigured()) {
      try {
        const user = await this.getCurrentUser();
        if (user) {
          return await supabaseApiService.getDashboardAnalytics(user.id, user.role);
        }
        return {};
      } catch (error) {
        throw error;
      }
    }

    // Fallback to REST API
    const response = await fetch(`${API_BASE_URL}/analytics/dashboard`, {
      headers: this.getAuthHeaders(),
    });
    
    return this.handleResponse<any>(response);
  }

  // Real-time subscriptions (Supabase only)
  subscribeToOrders(callback: (payload: any) => void) {
    if (this.isSupabaseConfigured()) {
      return supabaseApiService.subscribeToOrders(callback);
    }
    return null;
  }

  subscribeToProducts(callback: (payload: any) => void) {
    if (this.isSupabaseConfigured()) {
      return supabaseApiService.subscribeToProducts(callback);
    }
    return null;
  }

  // Health check
  async healthCheck() {
    const response = await fetch(`${API_BASE_URL}/health`);
    return this.handleResponse<any>(response);
  }
}

export const apiService = new ApiService();