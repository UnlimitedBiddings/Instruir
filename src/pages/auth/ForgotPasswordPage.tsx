import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Car, Mail, ArrowLeft, ArrowRight, MailCheck } from 'lucide-react';
import { toast } from 'sonner';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await resetPassword(email);
      
      if (result.error) {
        toast.error(result.error);
        return;
      }
      
      setEmailSent(true);
    } catch (error) {
      toast.error('Erro ao enviar e-mail. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <div className="flex-1 flex items-center justify-center px-6 py-8">
          <div className="max-w-md w-full text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <MailCheck className="h-10 w-10 text-primary" />
            </div>
            
            <h2 className="font-display text-2xl font-bold mb-3">
              E-mail enviado!
            </h2>
            
            <p className="text-muted-foreground mb-6">
              Enviamos um link de recuperação para <strong className="text-foreground">{email}</strong>. 
              Clique no link para redefinir sua senha.
            </p>
            
            <div className="bg-muted/50 rounded-xl p-4 mb-6">
              <p className="text-sm text-muted-foreground">
                Não recebeu o e-mail? Verifique sua pasta de spam ou{' '}
                <button 
                  className="text-primary hover:underline font-medium"
                  onClick={() => setEmailSent(false)}
                >
                  tente novamente
                </button>
              </p>
            </div>
            
            <Button
              variant="outline"
              onClick={() => navigate('/login')}
              className="w-full"
            >
              Voltar para o login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="px-4 py-4 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/login')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
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

          <div className="animate-fade-in">
            <h2 className="font-display text-2xl font-bold mb-2">
              Recuperar senha
            </h2>
            <p className="text-muted-foreground mb-8">
              Digite seu e-mail e enviaremos um link para redefinir sua senha.
            </p>

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
                    Enviando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Enviar link
                    <ArrowRight className="h-5 w-5" />
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-muted-foreground">
                Lembrou sua senha?{' '}
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
    </div>
  );
}
