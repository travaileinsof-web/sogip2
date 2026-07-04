export const BACKEND_URL = '';
export const API_BASE_URL = '/api/v1';

class ApiService {
  private getHeaders(isFormData = false) {
    const token = localStorage.getItem('sogip_admin_token');
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  private async handleResponse(response: Response) {
    const data = await response.json().catch(() => ({}));
    
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('sogip_admin_token');
        localStorage.removeItem('sogip_admin_user');
        window.location.href = '/admin'; // Redirect to login
      }
      throw new Error(data.message || 'Une erreur est survenue');
    }
    
    return data;
  }

  async get(endpoint: string, params: Record<string, any> = {}) {
    const baseUrl = window.location.origin;
    const url = new URL(`${API_BASE_URL}${endpoint}`, baseUrl);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getHeaders(),
      cache: 'no-store'
    });
    
    return this.handleResponse(response);
  }

  async post(endpoint: string, data: any) {
    const isFormData = data instanceof FormData;
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(isFormData),
      body: isFormData ? data : JSON.stringify(data),
    });
    
    return this.handleResponse(response);
  }

  async put(endpoint: string, data: any) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    
    return this.handleResponse(response);
  }

  async delete(endpoint: string) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }
}

export const api = new ApiService();
