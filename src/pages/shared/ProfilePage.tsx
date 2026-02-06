import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Calendar,
  Wallet,
  Settings,
  ChevronRight,
  Car,
  MapPin,
  Shield,
  Moon,
  Sun,
  Monitor,
  LogOut,
  Bell,
  HelpCircle,
  CreditCard,
  Edit,
  Camera
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  ProfessionalDashboardStats, 
  StudentDashboardStats 
} from '@/components/dashboard/DashboardStats';
import { UpcomingSessionsList } from '@/components/dashboard/UpcomingSessionsList';

// Profile Header Component
function ProfileHeader() {
  const { profile, userRole } = useAuth();
  const isProfessional = userRole === 'professional';

  return (
    <div className="bg-gradient-to-br from-primary/10 via-background to-accent/5 border-b border-border px-4 pt-4 pb-6 safe-area-top">
      <div className="flex items-start gap-4">
        <div className="relative">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.name}
              className="h-20 w-20 rounded-2xl object-cover ring-2 ring-primary/20"
            />
          ) : (
            <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
              <User className="h-10 w-10 text-primary" />
            </div>
          )}
          <button className="absolute -bottom-1 -right-1 p-1.5 bg-primary rounded-full text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors">
            <Camera className="h-3.5 w-3.5" />
          </button>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="font-display text-xl font-bold truncate">{profile?.name}</h2>
              <p className="text-muted-foreground text-sm truncate">{profile?.email}</p>
            </div>
            <Button variant="ghost" size="icon" className="shrink-0">
              <Edit className="h-4 w-4" />
            </Button>
          </div>
          
          {isProfessional && (
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-accent/10 rounded-full">
                <Shield className="h-3.5 w-3.5 text-accent" />
                <span className="text-xs font-medium text-accent">Verificado</span>
              </div>
            </div>
          )}
          
          {!isProfessional && (
            <p className="text-xs text-muted-foreground mt-2">
              Membro desde {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Schedule Tab Content
function ScheduleTab() {
  const { userRole } = useAuth();
  const isProfessional = userRole === 'professional';

  return (
    <div className="p-4 space-y-6">
      {/* Stats Overview */}
      {isProfessional ? (
        <ProfessionalDashboardStats />
      ) : (
        <StudentDashboardStats />
      )}

      {/* Upcoming Sessions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-semibold text-lg">
            Próximas Aulas
          </h3>
          <Button variant="ghost" size="sm" className="text-primary">
            Ver todas
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        <UpcomingSessionsList />
      </div>
    </div>
  );
}

// Financials Tab Content
function FinancialsTab() {
  const { userRole } = useAuth();
  const isProfessional = userRole === 'professional';

  const mockEarnings = {
    thisMonth: 4850,
    lastMonth: 5200,
    pending: 850,
    totalLessons: 42
  };

  if (!isProfessional) {
    return (
      <div className="p-4 space-y-4">
        <h3 className="font-display font-semibold text-lg">Pagamentos</h3>
        <div className="card-elevated p-4">
          <p className="text-muted-foreground text-sm mb-4">Histórico de pagamentos</p>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-border">
              <div>
                <p className="font-medium">Aula com Carlos</p>
                <p className="text-sm text-muted-foreground">15 Jan 2025</p>
              </div>
              <span className="font-semibold">R$ 85,00</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <div>
                <p className="font-medium">Aula com Ana</p>
                <p className="text-sm text-muted-foreground">12 Jan 2025</p>
              </div>
              <span className="font-semibold">R$ 85,00</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h3 className="font-display font-semibold text-lg">Financeiro</h3>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card-elevated p-4">
          <p className="text-sm text-muted-foreground">Este mês</p>
          <p className="font-display text-2xl font-bold text-primary">
            R$ {mockEarnings.thisMonth.toLocaleString('pt-BR')}
          </p>
        </div>
        <div className="card-elevated p-4">
          <p className="text-sm text-muted-foreground">Pendente</p>
          <p className="font-display text-2xl font-bold text-warning">
            R$ {mockEarnings.pending.toLocaleString('pt-BR')}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="card-elevated p-4">
        <div className="flex justify-between items-center mb-4">
          <p className="font-medium">Aulas realizadas</p>
          <p className="font-display text-xl font-bold">{mockEarnings.totalLessons}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="font-medium">Mês anterior</p>
          <p className="text-muted-foreground">R$ {mockEarnings.lastMonth.toLocaleString('pt-BR')}</p>
        </div>
      </div>

      <Button variant="outline" className="w-full">
        <Wallet className="h-4 w-4 mr-2" />
        Ver extrato completo
      </Button>
    </div>
  );
}

// Settings Tab Content
function SettingsTab() {
  const { profile, logout, userRole } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const navigate = useNavigate();
  const isProfessional = userRole === 'professional';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    {
      icon: User,
      label: 'Dados pessoais',
      description: 'Nome, e-mail, telefone, CPF',
      onClick: () => {},
    },
    ...(isProfessional ? [
      {
        icon: Car,
        label: 'Meu veículo',
        description: 'Modelo, fotos, documentos',
        onClick: () => {},
      },
      {
        icon: MapPin,
        label: 'Zonas de atendimento',
        description: 'Regiões onde você atua',
        onClick: () => {},
      },
      {
        icon: Shield,
        label: 'Documentos',
        description: 'CNH, antecedentes, verificações',
        onClick: () => {},
      },
    ] : []),
    {
      icon: CreditCard,
      label: isProfessional ? 'Dados bancários' : 'Métodos de pagamento',
      description: isProfessional ? 'Conta para recebimentos' : 'Cartões salvos',
      onClick: () => {},
    },
    {
      icon: Bell,
      label: 'Notificações',
      description: 'Preferências de alertas',
      onClick: () => navigate('/notifications'),
    },
    {
      icon: HelpCircle,
      label: 'Ajuda',
      description: 'Dúvidas e suporte',
      onClick: () => {},
    },
  ];

  return (
    <div className="p-4 space-y-4">
      {/* Theme Settings */}
      <div className="card-elevated p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            {resolvedTheme === 'dark' ? (
              <Moon className="h-5 w-5 text-primary" />
            ) : (
              <Sun className="h-5 w-5 text-primary" />
            )}
          </div>
          <div className="flex-1">
            <p className="font-medium">Aparência</p>
            <p className="text-sm text-muted-foreground">Escolha o tema do app</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button 
            onClick={() => setTheme('light')}
            className={cn(
              "flex flex-col items-center gap-2 p-3 rounded-xl transition-colors",
              theme === 'light' 
                ? "bg-primary/10 border-2 border-primary" 
                : "bg-muted/50 hover:bg-muted"
            )}
          >
            <Sun className="h-5 w-5 text-warning" />
            <span className="text-xs font-medium">Claro</span>
          </button>

          <button 
            onClick={() => setTheme('dark')}
            className={cn(
              "flex flex-col items-center gap-2 p-3 rounded-xl transition-colors",
              theme === 'dark' 
                ? "bg-primary/10 border-2 border-primary" 
                : "bg-muted/50 hover:bg-muted"
            )}
          >
            <Moon className="h-5 w-5 text-primary" />
            <span className="text-xs font-medium">Escuro</span>
          </button>

          <button 
            onClick={() => setTheme('system')}
            className={cn(
              "flex flex-col items-center gap-2 p-3 rounded-xl transition-colors",
              theme === 'system' 
                ? "bg-primary/10 border-2 border-primary" 
                : "bg-muted/50 hover:bg-muted"
            )}
          >
            <Monitor className="h-5 w-5 text-muted-foreground" />
            <span className="text-xs font-medium">Auto</span>
          </button>
        </div>
      </div>

      {/* Menu Items */}
      <div className="space-y-2">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className="w-full card-elevated p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <item.icon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium">{item.label}</p>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
        ))}
      </div>

      {/* Logout */}
      <Button
        variant="ghost"
        className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
        onClick={handleLogout}
      >
        <LogOut className="h-5 w-5 mr-2" />
        Sair da conta
      </Button>

      {/* Version */}
      <p className="text-center text-xs text-muted-foreground pt-4">
        Instruir v1.0.0 • © 2025
      </p>
    </div>
  );
}

export function ProfilePage() {
  const { userRole } = useAuth();
  const isProfessional = userRole === 'professional';
  const [activeTab, setActiveTab] = useState('schedule');

  return (
    <div className="min-h-screen bg-background pb-24">
      <ProfileHeader />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="sticky top-0 z-10 bg-background border-b border-border">
          <TabsList className="w-full h-auto p-0 bg-transparent rounded-none">
            <TabsTrigger 
              value="schedule" 
              className="flex-1 py-3 rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
            >
              <Calendar className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Agenda</span>
            </TabsTrigger>
            {isProfessional && (
              <TabsTrigger 
                value="financials" 
                className="flex-1 py-3 rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
              >
                <Wallet className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Financeiro</span>
              </TabsTrigger>
            )}
            {!isProfessional && (
              <TabsTrigger 
                value="payments" 
                className="flex-1 py-3 rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Pagamentos</span>
              </TabsTrigger>
            )}
            <TabsTrigger 
              value="settings" 
              className="flex-1 py-3 rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
            >
              <Settings className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Ajustes</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="schedule" className="mt-0">
          <ScheduleTab />
        </TabsContent>
        
        {isProfessional && (
          <TabsContent value="financials" className="mt-0">
            <FinancialsTab />
          </TabsContent>
        )}

        {!isProfessional && (
          <TabsContent value="payments" className="mt-0">
            <FinancialsTab />
          </TabsContent>
        )}

        <TabsContent value="settings" className="mt-0">
          <SettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
