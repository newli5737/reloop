import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, UserProfile } from '../lib/api';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserProfile>;
  register: (data: { email: string; password: string; name: string; phone?: string }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isAdmin: boolean;
  isVerified: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    const data = await api.auth.me();
    setUser(data);
  };

  useEffect(() => {
    const token = localStorage.getItem('reloop_token');
    if (token) {
      api.auth
        .me()
        .then(setUser)
        .catch(() => localStorage.removeItem('reloop_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const { token, user } = await api.auth.login({ email, password });
    localStorage.setItem('reloop_token', token);
    setUser(user);
    return user;
  };

  const register = async (data: { email: string; password: string; name: string; phone?: string }) => {
    const { token, user } = await api.auth.register(data);
    localStorage.setItem('reloop_token', token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('reloop_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshUser,
        isAdmin: user?.role === 'ADMIN',
        isVerified: user?.verificationStatus === 'VERIFIED',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
