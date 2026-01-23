import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  getCurrentUser,
  signIn as amplifySignIn,
  signOut as amplifySignOut,
  signUp as amplifySignUp,
  confirmSignUp as amplifyConfirmSignUp,
  resetPassword,
  confirmResetPassword,
  fetchAuthSession
} from "aws-amplify/auth";

interface AuthUser {
  username: string;
  email?: string;
  groups: string[];
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  confirmSignUp: (email: string, code: string) => Promise<void>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  confirmResetPassword: (email: string, code: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/** Global authentication provider for Cognito user pool. */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadUser() {
      try {
        const currentUser = await getCurrentUser();
        const session = await fetchAuthSession();
        const groups =
          (session.tokens?.idToken?.payload["cognito:groups"] as string[] | undefined) ?? [];
        if (active) {
          setUser({
            username: currentUser.username,
            email: currentUser.signInDetails?.loginId,
            groups
          });
        }
      } catch {
        if (active) {
          setUser(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadUser();
    return () => {
      active = false;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      signIn: async (email, password) => {
        await amplifySignIn({ username: email, password });
        const session = await fetchAuthSession();
        const groups =
          (session.tokens?.idToken?.payload["cognito:groups"] as string[] | undefined) ?? [];
        setUser({ username: email, email, groups });
      },
      signUp: async (email, password) => {
        await amplifySignUp({
          username: email,
          password,
          options: {
            userAttributes: {
              email
            }
          }
        });
      },
      confirmSignUp: async (email, code) => {
        await amplifyConfirmSignUp({ username: email, confirmationCode: code });
      },
      signOut: async () => {
        await amplifySignOut();
        setUser(null);
      },
      forgotPassword: async (email) => {
        await resetPassword({ username: email });
      },
      confirmResetPassword: async (email, code, newPassword) => {
        await confirmResetPassword({ username: email, confirmationCode: code, newPassword });
      }
    }),
    [loading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** Hook to use auth context. */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
