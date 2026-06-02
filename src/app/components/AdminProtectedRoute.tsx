import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

export default function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c0c0e] text-zinc-500">
        Đang tải...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (user.role !== 'ADMIN') {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
