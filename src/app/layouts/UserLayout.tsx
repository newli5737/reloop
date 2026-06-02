import { Outlet } from 'react-router';
import Navigation from '../components/Navigation';
import FloatPostButton from '../components/FloatPostButton';

export default function UserLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0F1C] via-[#0F172A] to-[#1E293B]">
      <Navigation />
      <Outlet />
      <FloatPostButton />
    </div>
  );
}
