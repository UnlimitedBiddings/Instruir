import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  MapPin, 
  Calendar, 
  Bell, 
  User, 
  Inbox,
  Wallet,
  Search,
  MessageCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockConversations } from '@/data/mockChats';

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: number;
}

export function BottomNavigation() {
  const { userRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Calculate unread messages
  const unreadCount = mockConversations.reduce((sum, c) => sum + c.unreadCount, 0);

  const studentNavItems: NavItem[] = [
    { icon: Search, label: 'Explorar', path: '/explore' },
    { icon: Calendar, label: 'Aulas', path: '/lessons' },
    { icon: MessageCircle, label: 'Chat', path: '/conversations', badge: unreadCount },
    { icon: User, label: 'Perfil', path: '/profile' },
  ];

  const instructorNavItems: NavItem[] = [
    { icon: Calendar, label: 'Agenda', path: '/schedule' },
    { icon: Inbox, label: 'Solicitações', path: '/requests' },
    { icon: MessageCircle, label: 'Chat', path: '/conversations', badge: unreadCount },
    { icon: Wallet, label: 'Financeiro', path: '/earnings' },
  ];

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
                "relative flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 min-w-[72px]",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <div className="relative">
                <Icon 
                  className={cn(
                    "transition-all duration-200",
                    isActive ? "h-6 w-6" : "h-5 w-5"
                  )} 
                />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 h-4 w-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
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