import { useAuth } from '@/contexts/AuthContext';
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
  Star,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ProfilePage() {
  const { profile, logout, userRole } = useAuth();
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
      icon: Settings,
      label: 'Configurações',
      description: 'Privacidade e segurança',
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
    <div className="min-h-screen bg-background">
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

      {/* Menu */}
      <div className="p-4">
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
