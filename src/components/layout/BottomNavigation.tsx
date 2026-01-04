import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  MapPin, 
  Calendar, 
  Bell, 
  User, 
  Inbox,
  Wallet,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

const studentNavItems: NavItem[] = [
  { icon: Search, label: 'Explorar', path: '/explore' },
  { icon: Calendar, label: 'Minhas Aulas', path: '/lessons' },
  { icon: Bell, label: 'Notificações', path: '/notifications' },
  { icon: User, label: 'Perfil', path: '/profile' },
];

const instructorNavItems: NavItem[] = [
  { icon: Calendar, label: 'Agenda', path: '/schedule' },
  { icon: Inbox, label: 'Solicitações', path: '/requests' },
  { icon: Wallet, label: 'Financeiro', path: '/earnings' },
  { icon: User, label: 'Perfil Pro', path: '/profile' },
];

export function BottomNavigation() {
  const { userRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = userRole === 'instructor' ? instructorNavItems : studentNavItems;

  return (
    <nav className="bottom-nav z-50">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path !== '/' && location.pathname.startsWith(item.path));
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 min-w-[72px]",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Icon 
                className={cn(
                  "transition-all duration-200",
                  isActive ? "h-6 w-6" : "h-5 w-5"
                )} 
              />
              <span className={cn(
                "text-[10px] font-medium transition-all",
                isActive && "font-semibold"
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
