import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Role, isStaff } from '../../types';

const ProtectedRoute = ({ children, allowedRoles }: { children: ReactNode; allowedRoles?: Role[] }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to={isStaff(user.role) ? '/admin' : '/dashboard'} replace />;
  return <>{children}</>;
};

export default ProtectedRoute;
