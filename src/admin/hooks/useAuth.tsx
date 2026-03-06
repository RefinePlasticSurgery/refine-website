import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { handleSupabaseAuthError, AuthError } from '@/lib/errors';

interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  created_at: string;
  last_login: string | null;
}

interface AuthContextType {
  user: AdminUser | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  loading: boolean;
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

/**
 * Fetch admin user profile from database
 * ✅ This ensures we get the ACTUAL user role from the database,
 * not a hardcoded client-side role
 */
const fetchAdminUserProfile = async (userId: string): Promise<AdminUser | null> => {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('id, email, role, created_at, last_login')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching admin user profile:', error);
      return null;
    }

    if (!data) {
      console.warn('Admin user profile not found for user:', userId);
      return null;
    }

    return data as AdminUser;
  } catch (err) {
    console.error('Unexpected error fetching admin user profile:', err);
    return null;
  }
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Prevent memory leaks on unmount
    let isMounted = true;

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!isMounted) return;
        
        setSession(session);

        if (session?.user) {
          // ✅ Fetch user profile from database instead of creating client-side
          const adminUser = await fetchAdminUserProfile(session.user.id);
          if (isMounted) {
            if (adminUser) {
              setUser(adminUser);
            } else {
              // Auth session exists but admin profile doesn't
              // Don't log out, just leave user as null - ProtectedRoute will redirect
              console.warn('Admin profile not found for authenticated user:', session.user.id);
            }
          }
        } else {
          // No session at all
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    checkSession();

    // ✅ Listen for auth changes with proper cleanup
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!isMounted) return;
        setSession(session);

        if (session?.user) {
          // ✅ Fetch user profile from database
          const adminUser = await fetchAdminUserProfile(session.user.id);
          if (isMounted) {
            if (adminUser) {
              setUser(adminUser);
            } else {
              // Auth session exists but admin profile doesn't
              setUser(null);
            }
          }
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      // ✅ Clean up on unmount
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error: AuthError | null }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user && data.session) {
        // ✅ Fetch user profile from database
        const adminUser = await fetchAdminUserProfile(data.user.id);
        
        if (adminUser) {
          // Profile exists - user is properly configured as admin
          setUser(adminUser);
          setSession(data.session);
          return { error: null };
        } else {
          // Auth succeeded but admin profile doesn't exist
          // Sign out immediately to prevent confusion
          await supabase.auth.signOut();
          setUser(null);
          setSession(null);
          return { 
            error: new AuthError(
              'Your account is not configured as an admin user. Please contact the administrator.',
              'ADMIN_NOT_CONFIGURED'
            ) 
          };
        }
      }

      return { 
        error: new AuthError('Sign in failed. Please try again.', 'SIGN_IN_FAILED') 
      };
    } catch (error: unknown) {
      const authError = handleSupabaseAuthError(error);
      console.error('Sign in error:', authError.code, authError.message);
      return { error: authError };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const signUp = async (email: string, password: string): Promise<{ error: AuthError | null }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      return { error: null };
    } catch (error: unknown) {
      const authError = handleSupabaseAuthError(error);
      console.error('Sign up error:', authError.code, authError.message);
      return { error: authError };
    }
  };

  const value = {
    user,
    session,
    signIn,
    signOut,
    signUp,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};