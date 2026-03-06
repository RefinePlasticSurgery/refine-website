import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/admin/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, session, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If still loading, wait
    if (loading) {
      return;
    }

    // Not loading anymore - check if authenticated
    // User is authenticated if we have both a session and a user profile
    if (!session || !user) {
      // Not authenticated - redirect to login
      // Only redirect if we're not already on the login page
      if (!location.pathname.includes('/admin/login')) {
        navigate('/admin/login', { replace: true });
      }
    }
  }, [user, session, loading, navigate, location]);

  // Still loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!session || !user) {
    return null;
  }

  // Authenticated - render children
  return <>{children}</>;
};