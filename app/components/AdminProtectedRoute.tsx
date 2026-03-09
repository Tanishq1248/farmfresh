"use client";
import { useAppContext } from '@/app/context/AppContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin } = useAppContext();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !isAdmin()) {
      router.push('/');
    } else {
      setIsLoading(false);
    }
  }, [user, isAdmin, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
};
