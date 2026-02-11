import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { UserRole } from '@/types';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
}

interface SubscriptionStatus {
  subscribed: boolean;
  planType: 'monthly' | 'annual' | null;
  subscriptionEnd: string | null;
}

interface AuthContextType {
  user: SupabaseUser | null;
  profile: UserProfile | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  userRole: UserRole | null;
  subscription: SubscriptionStatus;
  checkSubscription: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (data: RegisterData) => Promise<{ error?: string; needsEmailConfirmation?: boolean }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
}

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const defaultSubscription: SubscriptionStatus = {
  subscribed: false,
  planType: null,
  subscriptionEnd: null,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionStatus>(defaultSubscription);

  // Fetch user profile from database
  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }, []);

  // Check subscription status
  const checkSubscription = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      if (error) {
        console.error('Error checking subscription:', error);
        return;
      }
      setSubscription({
        subscribed: data?.subscribed ?? false,
        planType: data?.plan_type ?? null,
        subscriptionEnd: data?.subscription_end ?? null,
      });
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          setTimeout(async () => {
            const userProfile = await fetchProfile(currentSession.user.id);
            setProfile(userProfile);
          }, 0);
        } else {
          setProfile(null);
          setSubscription(defaultSubscription);
        }

        setIsLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        fetchProfile(currentSession.user.id).then(setProfile);
      }

      setIsLoading(false);
    });

    return () => {
      authSub.unsubscribe();
    };
  }, [fetchProfile]);

  // Check subscription when session changes
  useEffect(() => {
    if (session) {
      checkSubscription();
      const interval = setInterval(checkSubscription, 60000);
      return () => clearInterval(interval);
    }
  }, [session, checkSubscription]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        if (error.message === 'Email not confirmed') {
          return { error: 'Por favor, confirme seu e-mail antes de fazer login. Verifique sua caixa de entrada.' };
        }
        if (error.message === 'Invalid login credentials') {
          return { error: 'E-mail ou senha incorretos.' };
        }
        return { error: error.message };
      }

      if (data.user) {
        const userProfile = await fetchProfile(data.user.id);
        setProfile(userProfile);
        toast.success('Login realizado com sucesso!');
      }

      return {};
    } catch (error: any) {
      return { error: error.message || 'Erro ao fazer login' };
    }
  }, [fetchProfile]);

  const register = useCallback(async (data: RegisterData) => {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            name: data.name,
            phone: data.phone,
            role: data.role,
          },
        },
      });

      if (error) {
        if (error.message.includes('already registered')) {
          return { error: 'Este e-mail já está cadastrado.' };
        }
        return { error: error.message };
      }

      if (authData.user && !authData.session) {
        return { needsEmailConfirmation: true };
      }

      if (authData.user && authData.session) {
        const userProfile = await fetchProfile(authData.user.id);
        setProfile(userProfile);
        toast.success('Conta criada com sucesso!');
      }

      return {};
    } catch (error: any) {
      return { error: error.message || 'Erro ao criar conta' };
    }
  }, [fetchProfile]);

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setSession(null);
      setSubscription(defaultSubscription);
      toast.success('Logout realizado com sucesso!');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Erro ao fazer logout');
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (error: any) {
      return { error: error.message || 'Erro ao enviar e-mail de recuperação' };
    }
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        profile,
        session,
        isAuthenticated: !!session, 
        isLoading,
        userRole: profile?.role ?? null, 
        subscription,
        checkSubscription,
        login, 
        register, 
        logout,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) { 
    throw new Error('useAuth must be used within an AuthProvider'); 
  }
  return context;
}
