import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store';
import { Heart } from 'lucide-react';

type ProtectedRouteProps = {
  children: React.ReactNode;
  roles?: Array<'donor' | 'organizer' | 'admin'>;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="size-20 rounded-full bg-primary/10 animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Heart className="size-10 text-primary animate-bounce" aria-hidden="true" />
            </div>
            <div className="absolute -right-2 -top-1 size-4 rounded-full bg-primary animate-ping" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-700">Processing your donation journey</p>
            <p className="text-xs text-gray-500">Warming up your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
