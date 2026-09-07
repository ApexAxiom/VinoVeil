import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../lib/api';

interface AuthUser { username: string; email?: string; groups: string[] }
interface AuthContextValue {
  user: AuthUser | null; loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  confirmSignUp: (email: string, code: string) => Promise<void>;
  resendConfirmation: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  confirmResetPassword: (email: string, code: string, newPassword: string) => Promise<void>;
}
const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const currentUser = async () => (await apiRequest<{ data: AuthUser }>('/api/me')).data;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    currentUser().then(value => { if (active) setUser(value); }).catch(() => { if (active) setUser(null); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  const value = useMemo<AuthContextValue>(() => ({
    user, loading,
    signIn: async (email, password) => { await apiRequest('/api/auth/sign-in/email', { email, password }); setUser(await currentUser()); },
    signUp: async (email, password) => { await apiRequest('/api/auth/sign-up/email', { email, password, name: email }); },
    confirmSignUp: async (email, code) => { await apiRequest('/api/auth/email-otp/verify-email', { email, otp: code }); },
    resendConfirmation: async email => { await apiRequest('/api/auth/email-otp/send-verification-otp', { email, type: 'email-verification' }); },
    signOut: async () => { await apiRequest('/api/auth/sign-out', {}); setUser(null); },
    forgotPassword: async email => { await apiRequest('/api/auth/email-otp/request-password-reset', { email }); },
    confirmResetPassword: async (email, code, newPassword) => {
      await apiRequest('/api/auth/email-otp/reset-password', { email, otp: code, password: newPassword }); setUser(null);
    },
  }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
