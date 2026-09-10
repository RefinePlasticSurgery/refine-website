import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { handleSupabaseAuthError, type AuthError } from '@/lib/errors';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

// ─── Provider ─────────────────────────────────────────────────────────────────

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser]       = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    /**
     * IMPORTANT: Subscribe to auth state changes BEFORE calling getSession.
     * This ensures we never miss a token-refresh or sign-in event.
     */
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!active) return;
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);
    });

    // Restore existing session from localStorage / cookie
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  /**
   * ROOT CAUSE FIX for the "{}" / infinite loading bug:
   *
   * Previous versions called signInWithPassword() then waited for
   * onAuthStateChange to update session state. But AdminLogin called
   * navigate() synchronously AFTER signIn() resolved — before the
   * async onAuthStateChange could run. ProtectedRoute saw session=null
   * and immediately redirected back to login. The spinner never stopped.
   *
   * Fix: set session + user state synchronously from the response data
   * returned by signInWithPassword(). onAuthStateChange will still fire
   * and produce an identical update, which is harmless.
   */
  const signIn = useCallback(
    async (email: string, password: string): Promise<{ error: AuthError | null }> => {
      try {
        console.debug('[Auth] SignIn request →', { email });
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });

        // Log raw Supabase response for debugging
        console.debug('[Auth] Supabase response', { data, error });

        if (error) {
          // Build a detailed message, include HTTP status if available
          const status = (error as any)?.status;
          const msg = error.message ?? 'Authentication error';
          const detailedMessage = status ? `(${status}) ${msg}` : msg;
          console.error('[Auth] SignIn error', detailedMessage);
          return { error: new AuthError(detailedMessage, 'SIGN_IN_FAILED') };
        }

        // Sync state immediately — do NOT wait for onAuthStateChange
        if (data.session) {
          setSession(data.session);
          setUser(data.user ?? null);
        }

        return { error: null };
      } catch (err) {
        console.error('[Auth] SignIn caught exception', err);
        return { error: handleSupabaseAuthError(err) };
      }
    },
    []
  );

  const signOut = useCallback(async () => {
    // Clear state first for instant UI feedback
    setUser(null);
    setSession(null);
    await supabase.auth.signOut().catch(() => { /* ignore */ });
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
