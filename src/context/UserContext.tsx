import React, { createContext, useState, useContext, ReactNode } from 'react';
import { supabaseApiService } from '../services/supabaseApi';
import { User, UserRole } from '../types';

interface UserContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<any>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await supabaseApiService.login(email, password);
      setUser(response.user);
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to login. Please check your credentials.';
      setError(errorMessage);
      console.error('Login error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('UserContext: Starting registration for:', email, 'with role:', role);
      const response = await supabaseApiService.register(name, email, password, role);
      console.log('UserContext: Registration response:', response);
      
      if (response.needsEmailConfirmation) {
        console.log('UserContext: Email confirmation required');
        setError('Please check your email and click the confirmation link to complete registration.');
        // Don't set user yet, wait for email confirmation
        return response;
      } else {
        console.log('UserContext: Registration successful, user:', response.user);
        setUser(response.user);
        return response;
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to register. Please try again.';
      console.error('UserContext: Registration error:', err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    supabaseApiService.logout();
    setUser(null);
    setError(null);
  };

  // Check for existing user session on mount
  React.useEffect(() => {
    const checkUser = async () => {
      setIsLoading(true);
      try {
        const currentUser = await supabaseApiService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Error checking user session:', error);
        // Don't set error state for session check failures
      } finally {
        setIsLoading(false);
      }
    };
    
    checkUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, login, register, logout, isLoading, error }}>
      {children}
    </UserContext.Provider>
  );
};