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

interface AuthContextType {
  user: SupabaseUser | null;
  profile: UserProfile | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  userRole: UserRole | null;
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  // Initialize auth state
  useEffect(() => {
    // Set up auth state listener BEFORE checking session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          // Use setTimeout to avoid potential race conditions
          setTimeout(async () => {
            const userProfile = await fetchProfile(currentSession.user.id);
            setProfile(userProfile);
          }, 0);
        } else {
          setProfile(null);
        }

        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        fetchProfile(currentSession.user.id).then(setProfile);
      }

      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

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

      // Check if email confirmation is required
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
