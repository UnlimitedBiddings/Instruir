import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserProfileData {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  role: string;
  // Dados pessoais expandidos (LGPD)
  cpf: string | null;
  birth_date: string | null;
  gender: string | null;
  address: string | null;
  address_number: string | null;
  address_complement: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  terms_accepted_at: string | null;
  privacy_accepted_at: string | null;
}

export function useUserProfile() {
  const { user, profile: authProfile } = useAuth();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (fetchError) throw fetchError;

      setProfile(data);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching user profile:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (data: Partial<UserProfileData>) => {
    if (!profile?.id) return { error: 'Perfil não encontrado' };

    try {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', profile.id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, ...data } : null);
      toast.success('Perfil atualizado com sucesso!');
      return { success: true };
    } catch (err: any) {
      toast.error('Erro ao atualizar perfil');
      return { error: err.message };
    }
  };

  const uploadAvatar = async (file: File): Promise<{ url?: string; error?: string }> => {
    if (!user?.id) return { error: 'Usuário não autenticado' };

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const avatarUrl = urlData.publicUrl;

      // Update profile with new avatar URL
      await updateProfile({ avatar_url: avatarUrl });

      return { url: avatarUrl };
    } catch (err: any) {
      toast.error('Erro ao fazer upload da foto');
      return { error: err.message };
    }
  };

  const acceptTerms = async () => {
    if (!profile?.id) return { error: 'Perfil não encontrado' };

    const now = new Date().toISOString();
    return updateProfile({
      terms_accepted_at: now,
      privacy_accepted_at: now,
    });
  };

  return {
    profile,
    isLoading,
    error,
    refetch: fetchProfile,
    updateProfile,
    uploadAvatar,
    acceptTerms,
  };
}
