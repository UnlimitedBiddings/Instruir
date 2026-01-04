import { Outlet } from 'react-router-dom';
import { BottomNavigation } from './BottomNavigation';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <main className="animate-fade-in">
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  );
}
