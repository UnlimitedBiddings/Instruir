import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Car, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate('/explore');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="bg-gradient-hero text-primary-foreground px-6 pt-12 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-white/20 blur-3xl" />
        </div>
        
        <div className="relative z-10 max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-sm">
              <Car className="h-8 w-8" />
            </div>
            <h1 className="font-display text-2xl font-bold">
              Instruir
            </h1>
          </div>
          
          <h2 className="font-display text-3xl font-bold mb-3">
            Encontre seu instrutor ideal
          </h2>
          <p className="text-primary-foreground/80 text-lg">
            Conecte-se com os melhores instrutores de direção da sua região.
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex-1 bg-background px-6 py-8 -mt-6 rounded-t-3xl relative">
        <div className="max-w-md mx-auto">
          <h3 className="font-display text-xl font-semibold mb-6">
            Entrar na sua conta
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5">
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
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 pr-11 h-12"
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

            <div className="flex items-center justify-end">
              <button
                type="button"
                className="text-sm text-primary hover:underline"
              >
                Esqueceu a senha?
              </button>
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
                  Entrando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Entrar
                  <ArrowRight className="h-5 w-5" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              Não tem uma conta?{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-primary font-semibold hover:underline"
              >
                Cadastre-se
              </button>
            </p>
          </div>

          {/* Demo Access */}
          <div className="mt-8 p-4 bg-muted/50 rounded-xl">
            <p className="text-sm text-muted-foreground text-center mb-3">
              Acesso rápido para demonstração:
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => {
                  setEmail('aluno@email.com');
                  setPassword('123456');
                }}
              >
                Sou Aluno
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => {
                  setEmail('instrutor@email.com');
                  setPassword('123456');
                }}
              >
                Sou Instrutor
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
