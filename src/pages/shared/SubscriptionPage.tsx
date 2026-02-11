import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, Zap, Shield, MapPin, Star, Loader2, ExternalLink, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PageTransition } from '@/components/common/PageTransition';

// Stripe price/product mapping
const PLANS = {
  monthly: {
    priceId: 'price_1SzdMxLDYhpSWGaMCtGkGnJc',
    name: 'Mensal',
    price: 59.90,
    interval: '/mês',
    description: 'Flexibilidade total, cancele quando quiser.',
    badge: null,
  },
  annual: {
    priceId: 'price_1SzdOBLDYhpSWGaMzLv3iDxe',
    name: 'Anual',
    price: 42.90,
    totalPrice: 514.80,
    interval: '/mês',
    description: 'Economize R$204,00 por ano.',
    badge: 'Mais Popular',
  },
} as const;

const FEATURES = [
  { icon: MapPin, text: 'Apareça no mapa de busca para alunos' },
  { icon: Star, text: 'Perfil destacado com selo de visibilidade' },
  { icon: Shield, text: 'Selo de profissional verificado' },
  { icon: Zap, text: 'Receba solicitações de aulas direto no app' },
];

export function SubscriptionPage() {
  const { subscription, checkSubscription, userRole } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [loadingPortal, setLoadingPortal] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Handle success/cancel redirects
  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      toast.success('Assinatura realizada com sucesso! 🎉');
      checkSubscription();
    } else if (searchParams.get('canceled') === 'true') {
      toast.info('Assinatura cancelada.');
    }
  }, [searchParams, checkSubscription]);

  const handleCheckout = async (planKey: 'monthly' | 'annual') => {
    setLoadingPlan(planKey);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId: PLANS[planKey].priceId },
      });

      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      toast.error('Erro ao iniciar o checkout. Tente novamente.');
      console.error('Checkout error:', error);
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleManageSubscription = async () => {
    setLoadingPortal(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      toast.error('Erro ao abrir o portal de assinatura.');
      console.error('Portal error:', error);
    } finally {
      setLoadingPortal(false);
    }
  };

  const isProfessional = userRole === 'professional' || userRole === 'school_admin';

  return (
    <PageTransition className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 pt-4 pb-6 safe-area-top">
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-display text-xl font-bold">Assinatura</h1>
        </div>

        {subscription.subscribed ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary/10 border border-primary/20 rounded-2xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Crown className="h-5 w-5 text-primary" />
              <span className="font-semibold text-primary">Assinatura Ativa</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Plano {subscription.planType === 'annual' ? 'Anual' : 'Mensal'} • 
              Válido até {subscription.subscriptionEnd 
                ? new Date(subscription.subscriptionEnd).toLocaleDateString('pt-BR')
                : '—'}
            </p>
            <Button 
              variant="outline" 
              className="mt-3 w-full"
              onClick={handleManageSubscription}
              disabled={loadingPortal}
            >
              {loadingPortal ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <ExternalLink className="h-4 w-4 mr-2" />
              )}
              Gerenciar Assinatura
            </Button>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-muted-foreground text-sm">
              {isProfessional
                ? 'Assine para aparecer no mapa e receber solicitações de alunos.'
                : 'Planos para profissionais e autoescolas.'}
            </p>
          </motion.div>
        )}
      </div>

      <div className="p-4 space-y-6">
        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <h2 className="font-display font-semibold text-lg">O que está incluso</h2>
          {FEATURES.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
              className="flex items-center gap-3"
            >
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <feature.icon className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm">{feature.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Plans */}
        {!subscription.subscribed && (
          <div className="space-y-4">
            <h2 className="font-display font-semibold text-lg">Escolha seu plano</h2>

            {/* Annual Plan - Highlighted */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-5 border-2 border-primary relative overflow-hidden">
                {PLANS.annual.badge && (
                  <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
                    {PLANS.annual.badge}
                  </Badge>
                )}
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-bold">R${PLANS.annual.price.toFixed(2).replace('.', ',')}</span>
                  <span className="text-muted-foreground text-sm">{PLANS.annual.interval}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{PLANS.annual.name} — cobrado R${PLANS.annual.totalPrice?.toFixed(2).replace('.', ',')}/ano</p>
                <p className="text-xs text-primary font-medium mb-4">{PLANS.annual.description}</p>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => handleCheckout('annual')}
                  disabled={!!loadingPlan}
                >
                  {loadingPlan === 'annual' ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Crown className="h-4 w-4 mr-2" />
                  )}
                  Assinar Plano Anual
                </Button>
              </Card>
            </motion.div>

            {/* Monthly Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-5">
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-bold">R${PLANS.monthly.price.toFixed(2).replace('.', ',')}</span>
                  <span className="text-muted-foreground text-sm">{PLANS.monthly.interval}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{PLANS.monthly.name}</p>
                <p className="text-xs text-muted-foreground mb-4">{PLANS.monthly.description}</p>
                <Button
                  variant="outline"
                  className="w-full"
                  size="lg"
                  onClick={() => handleCheckout('monthly')}
                  disabled={!!loadingPlan}
                >
                  {loadingPlan === 'monthly' ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Assinar Plano Mensal
                </Button>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Refresh */}
        <div className="text-center">
          <Button variant="ghost" size="sm" onClick={checkSubscription}>
            Atualizar status da assinatura
          </Button>
        </div>
      </div>
    </PageTransition>
  );
}
