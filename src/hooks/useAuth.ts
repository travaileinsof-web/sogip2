import { useState, useEffect } from 'react';
import { api } from '../services/api';

export interface AdminUser {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
}

export function useAuth() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('sogip_admin_token');
    const storedUser = localStorage.getItem('sogip_admin_user');
    
    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      // If we have stored user data, use it immediately for fast render
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
      
      // Verify token with backend
      const res = await api.get('/auth/check');
      if (res.success && res.admin) {
        setUser(res.admin);
        setIsAuthenticated(true);
        localStorage.setItem('sogip_admin_user', JSON.stringify(res.admin));
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = (token: string, userData: AdminUser) => {
    localStorage.setItem('sogip_admin_token', token);
    localStorage.setItem('sogip_admin_user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout', {});
    } catch (e) {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('sogip_admin_token');
      localStorage.removeItem('sogip_admin_user');
      setUser(null);
      setIsAuthenticated(false);
      window.location.href = '/admin';
    }
  };

  return { user, isAuthenticated, isLoading, login, logout, checkAuth };
}
