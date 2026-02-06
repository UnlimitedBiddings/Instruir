import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function VerifyEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleEmailVerification = async () => {
      // Check for error in URL params (from Supabase redirect)
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');
      
      if (error) {
        setStatus('error');
        setErrorMessage(errorDescription || 'Erro na verificação do e-mail');
        return;
      }

      // Check if there's a session (means verification was successful)
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        setStatus('error');
        setErrorMessage('Erro ao verificar sessão');
        return;
      }

      if (session) {
        // User is authenticated, verification was successful
        setStatus('success');
        toast.success('E-mail verificado com sucesso!');
        
        // Redirect after 2 seconds
        setTimeout(() => {
          navigate('/explore', { replace: true });
        }, 2000);
      } else {
        // No session, check if this is a token verification attempt
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        const type = searchParams.get('type');

        if (type === 'signup' && accessToken && refreshToken) {
          // Set the session from URL tokens
          const { error: setSessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (setSessionError) {
            setStatus('error');
            setErrorMessage('Link expirado ou inválido');
            return;
          }

          setStatus('success');
          toast.success('E-mail verificado com sucesso!');
          
          setTimeout(() => {
            navigate('/explore', { replace: true });
          }, 2000);
        } else if (type === 'recovery') {
          // Password reset flow
          navigate('/reset-password', { replace: true });
        } else {
          // No valid tokens found
          setStatus('expired');
          setErrorMessage('Link de verificação expirado ou já utilizado');
        }
      }
    };

    handleEmailVerification();
  }, [navigate, searchParams]);

  const handleResendEmail = async () => {
    toast.info('Por favor, faça login novamente para solicitar um novo link de verificação.');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
            </div>
            <h2 className="font-display text-2xl font-bold mb-3">
              Verificando seu e-mail...
            </h2>
            <p className="text-muted-foreground">
              Aguarde enquanto confirmamos seu endereço de e-mail.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-success" />
            </div>
            <h2 className="font-display text-2xl font-bold mb-3 text-success">
              E-mail verificado!
            </h2>
            <p className="text-muted-foreground mb-6">
              Sua conta foi ativada com sucesso. Você será redirecionado automaticamente.
            </p>
            <Button onClick={() => navigate('/explore')} variant="hero">
              Continuar para o app
            </Button>
          </>
        )}

        {(status === 'error' || status === 'expired') && (
          <>
            <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="h-10 w-10 text-destructive" />
            </div>
            <h2 className="font-display text-2xl font-bold mb-3 text-destructive">
              {status === 'expired' ? 'Link expirado' : 'Erro na verificação'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {errorMessage || 'Não foi possível verificar seu e-mail. O link pode ter expirado ou já foi utilizado.'}
            </p>
            
            <div className="space-y-3">
              <Button onClick={handleResendEmail} variant="outline" className="w-full">
                <Mail className="h-4 w-4 mr-2" />
                Solicitar novo link
              </Button>
              <Button onClick={() => navigate('/login')} variant="ghost" className="w-full">
                Voltar para o login
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
