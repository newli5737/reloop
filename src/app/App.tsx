import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';
import LandingPage from './pages/LandingPage';
import Marketplace from './pages/Marketplace';
import ProductDetail from './pages/ProductDetail';
import PostListing from './pages/PostListing';
import Dashboard from './pages/Dashboard';
import CollectorPage from './pages/CollectorPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import AdminLoginPage from './pages/AdminLoginPage';
import MessagesPage from './pages/MessagesPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" theme="dark" richColors />
        <Routes>
          {/* Admin — layout riêng, không dùng header user */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }
          >
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<AdminPage section="overview" />} />
            <Route path="listings" element={<AdminPage section="listings" />} />
            <Route path="users" element={<AdminPage section="users" />} />
            <Route path="verifications" element={<AdminPage section="verifications" />} />
          </Route>

          {/* User — layout thường */}
          <Route element={<UserLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/collectors" element={<CollectorPage />} />
            <Route path="/post" element={<ProtectedRoute><PostListing /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
