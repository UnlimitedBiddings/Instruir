import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Settings, 
  CreditCard, 
  Bell, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Car,
  MapPin,
  Shield,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export function ProfilePage() {
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
      description: 'Nome, e-mail, telefone',
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
    ] : []),
    {
      icon: CreditCard,
      label: isProfessional ? 'Dados bancários' : 'Pagamentos',
      description: isProfessional ? 'Conta para recebimentos' : 'Cartões e histórico',
      onClick: () => {},
    },
    {
      icon: Bell,
      label: 'Notificações',
      description: 'Preferências de alertas',
      onClick: () => {},
    },
    {
      icon: HelpCircle,
      label: 'Ajuda',
      description: 'Dúvidas e suporte',
      onClick: () => {},
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 pt-4 pb-6 safe-area-top">
        <h1 className="font-display text-2xl font-bold mb-6">
          {isProfessional ? 'Perfil Pro' : 'Meu Perfil'}
        </h1>

        {/* Profile Card */}
        <div className="flex items-center gap-4">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.name}
              className="h-20 w-20 rounded-2xl object-cover"
            />
          ) : (
            <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center">
              <User className="h-10 w-10 text-primary" />
            </div>
          )}
          <div className="flex-1">
            <h2 className="font-display text-xl font-bold">{profile?.name}</h2>
            <p className="text-muted-foreground">{profile?.email}</p>
            
            {isProfessional && (
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Shield className="h-4 w-4 text-accent" />
                  <span className="text-sm">Verificado</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Theme Settings */}
      <div className="p-4">
        <div className="card-elevated p-4 mb-4">
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

          <div className="space-y-3">
            <button 
              onClick={() => setTheme('light')}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${
                theme === 'light' 
                  ? 'bg-primary/10 border-2 border-primary' 
                  : 'bg-muted/50 hover:bg-muted'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sun className="h-5 w-5 text-amber-500" />
                <span>Claro</span>
              </div>
              {theme === 'light' && (
                <div className="w-2 h-2 rounded-full bg-primary" />
              )}
            </button>

            <button 
              onClick={() => setTheme('dark')}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${
                theme === 'dark' 
                  ? 'bg-primary/10 border-2 border-primary' 
                  : 'bg-muted/50 hover:bg-muted'
              }`}
            >
              <div className="flex items-center gap-3">
                <Moon className="h-5 w-5 text-blue-400" />
                <span>Escuro</span>
              </div>
              {theme === 'dark' && (
                <div className="w-2 h-2 rounded-full bg-primary" />
              )}
            </button>

            <button 
              onClick={() => setTheme('system')}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${
                theme === 'system' 
                  ? 'bg-primary/10 border-2 border-primary' 
                  : 'bg-muted/50 hover:bg-muted'
              }`}
            >
              <div className="flex items-center gap-3">
                <Monitor className="h-5 w-5 text-muted-foreground" />
                <span>Automático (sistema)</span>
              </div>
              {theme === 'system' && (
                <div className="w-2 h-2 rounded-full bg-primary" />
              )}
            </button>
          </div>
        </div>

        {/* Menu */}
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
          className="w-full mt-6 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-2" />
          Sair da conta
        </Button>
      </div>
    </div>
  );
}
