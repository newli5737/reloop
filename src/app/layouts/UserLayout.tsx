import { Outlet } from 'react-router';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import FloatPostButton from '../components/FloatPostButton';

export default function UserLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0A0F1C] via-[#0F172A] to-[#1E293B]">
      <Navigation />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <FloatPostButton />
    </div>
  );
}
