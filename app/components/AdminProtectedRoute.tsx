"use client";
import { useAppContext } from '@/app/context/AppContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Lock } from 'lucide-react';

export const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin, authLoading } = useAppContext();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) {
      return;
    }

    // Check if user is admin
    if (user && isAdmin && isAdmin()) {
      setIsAuthorized(true);
      setHasChecked(true);
    } else {
      setHasChecked(true);
      // Redirect after a brief delay to show message
      const timer = setTimeout(() => {
        router.push('/signin');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [user, isAdmin, authLoading, router]);

  if (!hasChecked || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="flex justify-center mb-4">
            <Lock size={64} className="text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Access Required</h1>
          <p className="text-gray-600 mb-4">
            You need to be logged in as an admin to access this page.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Please log in with your admin account or contact the site administrator.
          </p>
          <p className="text-xs text-gray-400">Redirecting to login in 2 seconds...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
