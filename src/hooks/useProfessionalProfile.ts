import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

type ProfessionalCategory = Database['public']['Enums']['professional_category'];
type ProviderType = Database['public']['Enums']['provider_type'];
type TransmissionType = Database['public']['Enums']['transmission_type'];

interface ProfessionalProfileData {
  id: string;
  user_id: string;
  category: ProfessionalCategory;
  bio: string | null;
  price_per_hour: number;
  rating: number | null;
  review_count: number | null;
  experience_years: number | null;
  total_sessions: number | null;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  city: string | null;
  service_zones: string[] | null;
  service_radius_km: number | null;
  accepts_displacement: boolean | null;
  displacement_fee_per_km: number | null;
  neighborhoods_served: string[] | null;
  cities_served: string[] | null;
  // Verificações
  identity_verified: boolean | null;
  background_verified: boolean | null;
  credentials_verified: boolean | null;
  cnh_verified: boolean | null;
  vehicle_inspection_verified: boolean | null;
  criminal_record_verified: boolean | null;
  // Documentos
  rg: string | null;
  rg_issuer: string | null;
  cnh_number: string | null;
  cnh_category: string | null;
  cnh_expiry: string | null;
  cnh_document_url: string | null;
  criminal_record_url: string | null;
  profile_document_url: string | null;
  // Veículo (campos legados)
  vehicle_model: string | null;
  vehicle_year: number | null;
  vehicle_color: string | null;
  vehicle_transmission: TransmissionType | null;
  vehicle_has_ac: boolean | null;
  vehicle_image_url: string | null;
  // Empresa
  provider_type: ProviderType | null;
  company_id: string | null;
  employment_type: string | null;
  cnpj: string | null;
  skills: string[] | null;
  specializations: string[] | null;
}

interface VehicleData {
  id: string;
  professional_id: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  transmission: string;
  has_ac: boolean;
  has_dual_controls: boolean;
  renavam: string | null;
  chassis: string | null;
  vehicle_document_url: string | null;
  insurance_company: string | null;
  insurance_policy_number: string | null;
  insurance_expiry: string | null;
  inspection_url: string | null;
  inspection_expiry: string | null;
  dpvat_paid: boolean;
  is_primary: boolean;
  is_active: boolean;
  image_url: string | null;
}

interface BankAccountData {
  id: string;
  professional_id: string;
  bank_code: string;
  bank_name: string;
  agency: string;
  account_number: string;
  account_type: string;
  holder_name: string;
  holder_cpf: string;
  pix_key_type: string | null;
  pix_key: string | null;
  proof_url: string | null;
  is_verified: boolean;
  is_primary: boolean;
}

export function useProfessionalProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfessionalProfileData | null>(null);
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccountData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      setError(null);

      // Fetch professional profile
      const { data: profData, error: profError } = await supabase
        .from('professionals')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profError && profError.code !== 'PGRST116') {
        throw profError;
      }

      if (profData) {
        // Sensitive documents live in a separate, owner-only table
        const { data: docData } = await supabase
          .from('professional_documents')
          .select('*')
          .eq('professional_id', profData.id)
          .maybeSingle();

        setProfile({
          ...profData,
          rg: docData?.rg ?? null,
          rg_issuer: docData?.rg_issuer ?? null,
          cnh_number: docData?.cnh_number ?? null,
          cnh_category: docData?.cnh_category ?? null,
          cnh_expiry: docData?.cnh_expiry ?? null,
          cnh_document_url: docData?.cnh_document_url ?? null,
          criminal_record_url: docData?.criminal_record_url ?? null,
          profile_document_url: docData?.profile_document_url ?? null,
          cnpj: docData?.cnpj ?? null,
        });

        // Fetch vehicles
        const { data: vehicleData, error: vehicleError } = await supabase
          .from('vehicles')
          .select('*')
          .eq('professional_id', profData.id)
          .order('is_primary', { ascending: false });

        if (vehicleError) {
          console.error('Error fetching vehicles:', vehicleError);
        } else {
          setVehicles(vehicleData || []);
        }

        // Fetch bank accounts
        const { data: bankData, error: bankError } = await supabase
          .from('professional_bank_accounts')
          .select('*')
          .eq('professional_id', profData.id)
          .order('is_primary', { ascending: false });

        if (bankError) {
          console.error('Error fetching bank accounts:', bankError);
        } else {
          setBankAccounts(bankData || []);
        }
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching professional profile:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (data: Partial<ProfessionalProfileData>) => {
    if (!profile?.id) return { error: 'Perfil não encontrado' };

    try {
      const { error } = await supabase
        .from('professionals')
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

  const addVehicle = async (data: Omit<VehicleData, 'id' | 'professional_id'>) => {
    if (!profile?.id) return { error: 'Perfil não encontrado' };

    try {
      const { data: newVehicle, error } = await supabase
        .from('vehicles')
        .insert({ ...data, professional_id: profile.id })
        .select()
        .single();

      if (error) throw error;

      setVehicles(prev => [...prev, newVehicle]);
      toast.success('Veículo adicionado com sucesso!');
      return { success: true, data: newVehicle };
    } catch (err: any) {
      toast.error('Erro ao adicionar veículo');
      return { error: err.message };
    }
  };

  const updateVehicle = async (vehicleId: string, data: Partial<VehicleData>) => {
    try {
      const { error } = await supabase
        .from('vehicles')
        .update(data)
        .eq('id', vehicleId);

      if (error) throw error;

      setVehicles(prev => prev.map(v => v.id === vehicleId ? { ...v, ...data } : v));
      toast.success('Veículo atualizado com sucesso!');
      return { success: true };
    } catch (err: any) {
      toast.error('Erro ao atualizar veículo');
      return { error: err.message };
    }
  };

  const deleteVehicle = async (vehicleId: string) => {
    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', vehicleId);

      if (error) throw error;

      setVehicles(prev => prev.filter(v => v.id !== vehicleId));
      toast.success('Veículo removido com sucesso!');
      return { success: true };
    } catch (err: any) {
      toast.error('Erro ao remover veículo');
      return { error: err.message };
    }
  };

  const addBankAccount = async (data: Omit<BankAccountData, 'id' | 'professional_id' | 'is_verified'>) => {
    if (!profile?.id) return { error: 'Perfil não encontrado' };

    try {
      const { data: newAccount, error } = await supabase
        .from('professional_bank_accounts')
        .insert({ ...data, professional_id: profile.id })
        .select()
        .single();

      if (error) throw error;

      setBankAccounts(prev => [...prev, newAccount]);
      toast.success('Conta bancária adicionada com sucesso!');
      return { success: true, data: newAccount };
    } catch (err: any) {
      toast.error('Erro ao adicionar conta bancária');
      return { error: err.message };
    }
  };

  const updateBankAccount = async (accountId: string, data: Partial<BankAccountData>) => {
    try {
      const { error } = await supabase
        .from('professional_bank_accounts')
        .update(data)
        .eq('id', accountId);

      if (error) throw error;

      setBankAccounts(prev => prev.map(a => a.id === accountId ? { ...a, ...data } : a));
      toast.success('Conta bancária atualizada com sucesso!');
      return { success: true };
    } catch (err: any) {
      toast.error('Erro ao atualizar conta bancária');
      return { error: err.message };
    }
  };

  const deleteBankAccount = async (accountId: string) => {
    try {
      const { error } = await supabase
        .from('professional_bank_accounts')
        .delete()
        .eq('id', accountId);

      if (error) throw error;

      setBankAccounts(prev => prev.filter(a => a.id !== accountId));
      toast.success('Conta bancária removida com sucesso!');
      return { success: true };
    } catch (err: any) {
      toast.error('Erro ao remover conta bancária');
      return { error: err.message };
    }
  };

  return {
    profile,
    vehicles,
    bankAccounts,
    isLoading,
    error,
    refetch: fetchProfile,
    updateProfile,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    addBankAccount,
    updateBankAccount,
    deleteBankAccount,
  };
}
