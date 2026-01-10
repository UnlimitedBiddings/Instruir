import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserRole } from '@/types';
import { 
  Car, 
  Mail, 
  Lock, 
  User, 
  Phone,
  Eye, 
  EyeOff, 
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  Briefcase,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<UserRole | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;
    
    setIsLoading(true);
    
    try {
      await register({ name, email, phone, role, password });
      navigate(role === 'student' ? '/explore' : '/schedule');
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="px-4 py-4 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => step > 1 ? setStep(step - 1) : navigate('/login')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {[1, 2].map((s) => (
              <div
                key={s}
                className={cn(
                  "flex-1 h-1.5 rounded-full transition-colors",
                  s <= step ? "bg-primary" : "bg-muted"
                )}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 py-4">
        <div className="max-w-md mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Car className="h-6 w-6 text-primary" />
            </div>
            <span className="font-display text-xl font-bold">Instruir</span>
          </div>

          {step === 1 && (
            <div className="animate-fade-in">
              <h2 className="font-display text-2xl font-bold mb-2">
                Como você quer usar o app?
              </h2>
              <p className="text-muted-foreground mb-8">
                Escolha seu perfil para personalizarmos sua experiência.
              </p>

              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => {
                    setRole('student');
                    setStep(2);
                  }}
                  className={cn(
                    "w-full p-5 rounded-2xl border-2 text-left transition-all",
                    role === 'student'
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "p-3 rounded-xl",
                      role === 'student' ? "bg-primary text-primary-foreground" : "bg-muted"
                    )}>
                      <GraduationCap className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display font-semibold text-lg mb-1">
                        Sou Aluno
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Quero encontrar instrutores para aulas de direção
                      </p>
                    </div>
                    {role === 'student' && (
                      <div className="p-1 bg-primary rounded-full">
                        <Check className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRole('instructor');
                    setStep(2);
                  }}
                  className={cn(
                    "w-full p-5 rounded-2xl border-2 text-left transition-all",
                    role === 'instructor'
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "p-3 rounded-xl",
                      role === 'instructor' ? "bg-primary text-primary-foreground" : "bg-muted"
                    )}>
                      <Briefcase className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display font-semibold text-lg mb-1">
                        Sou Instrutor
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Quero oferecer aulas e gerenciar minha agenda
                      </p>
                    </div>
                    {role === 'instructor' && (
                      <div className="p-1 bg-primary rounded-full">
                        <Check className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in">
              <h2 className="font-display text-2xl font-bold mb-2">
                Criar sua conta
              </h2>
              <p className="text-muted-foreground mb-8">
                {role === 'student' 
                  ? 'Preencha seus dados para começar a buscar instrutores.'
                  : 'Preencha seus dados para começar a receber alunos.'
                }
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Seu nome"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-11 h-12"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-11 h-12"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(11) 99999-9999"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-11 h-12"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Mínimo 6 caracteres"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-11 pr-11 h-12"
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Criando conta...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Criar conta
                      <ArrowRight className="h-5 w-5" />
                    </span>
                  )}
                </Button>
              </form>
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              Já tem uma conta?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-primary font-semibold hover:underline"
              >
                Fazer login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
