import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { nutritionist, patients } from '../data/mockData';

export type UserRole = 'nutritionist' | 'patient' | null;

export interface User {
  id: string;
  name: string;
  role: 'nutritionist' | 'patient';
  avatar: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  login: (role: 'nutritionist' | 'patient') => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('optimeal_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const login = (role: 'nutritionist' | 'patient') => {
    const userData: User = role === 'nutritionist'
      ? {
          id: nutritionist.id,
          name: nutritionist.name,
          role: 'nutritionist',
          avatar: nutritionist.avatar,
          email: 'pamela.angelus@optimeal.cl',
        }
      : {
          id: patients[0].id,
          name: patients[0].name,
          role: 'patient',
          avatar: patients[0].avatar,
          email: patients[0].email,
        };

    setUser(userData);
    localStorage.setItem('optimeal_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('optimeal_user');
    localStorage.removeItem('optimeal_plan');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
