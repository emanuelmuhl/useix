import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '../lib/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'tenant_admin';
  tenantId?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!token;

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('userix_token');
        const storedUser = localStorage.getItem('userix_user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          
          // Verify token is still valid
          try {
            const profileResponse = await authApi.getProfile();
            if (profileResponse.success) {
              setUser(profileResponse.data);
            } else {
              // Token invalid, clear storage
              localStorage.removeItem('userix_token');
              localStorage.removeItem('userix_user');
              setToken(null);
              setUser(null);
            }
          } catch (error) {
            // Token invalid, clear storage
            localStorage.removeItem('userix_token');
            localStorage.removeItem('userix_user');
            setToken(null);
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const response = await authApi.login(email, password);
      
      if (response.success) {
        const { accessToken, user: userData } = response.data;
        
        // Store in localStorage
        localStorage.setItem('userix_token', accessToken);
        localStorage.setItem('userix_user', JSON.stringify(userData));
        
        // Update state
        setToken(accessToken);
        setUser(userData);
        
        return { success: true };
      } else {
        return { success: false, error: 'Login failed' };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Invalid credentials' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear state regardless of API call success
      localStorage.removeItem('userix_token');
      localStorage.removeItem('userix_user');
      setToken(null);
      setUser(null);
    }
  };

  const refreshProfile = async (): Promise<void> => {
    try {
      if (token) {
        const response = await authApi.getProfile();
        if (response.success) {
          setUser(response.data);
          localStorage.setItem('userix_user', JSON.stringify(response.data));
        }
      }
    } catch (error) {
      console.error('Profile refresh error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
