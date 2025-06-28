// /src/context/AuthContext.tsx
import { createContext, useState, useContext, ReactNode } from 'react';

function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

interface AuthContextType {
  token: string | null;
  userId: number | null;
  login: (newToken: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [userId, setUserId] = useState<number | null>(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      const payload = parseJwt(storedToken);
      return payload?.sub || null;
    }
    return null;
  });

  const isAuthenticated = !!token;

  const login = (newToken: string) => {
    const payload = parseJwt(newToken);
    setToken(newToken);
    setUserId(payload?.sub || null);
    localStorage.setItem('authToken', newToken);
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem('authToken');
  };

  const value = { token, userId, login, logout, isAuthenticated };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
