import { createContext, useContext, useState, type ReactNode } from 'react';

const ADMIN_EMAIL = 'admin@lasmoras.com';
const ADMIN_PASSWORD = 'lasmoras';
const AUTH_KEY = 'lasmoras_admin_auth';

interface AuthContextValue {
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readAuth(): boolean {
  return sessionStorage.getItem(AUTH_KEY) === 'true';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(readAuth);

  const login = (email: string, password: string) => {
    const valid =
      email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD;
    if (valid) {
      sessionStorage.setItem(AUTH_KEY, 'true');
      setIsAuthenticated(true);
    }
    return valid;
  };

  const logout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
