import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AddressData {
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
}

interface ValidationResult<T = any> {
  valid: boolean;
  data?: T;
  error?: string;
}

export function useValidation() {
  const [isValidating, setIsValidating] = useState(false);

  const validateCPF = useCallback(async (cpf: string): Promise<ValidationResult<{ cpf: string; raw: string }>> => {
    setIsValidating(true);
    try {
      const { data, error } = await supabase.functions.invoke('validate-cpf', {
        body: { cpf },
      });

      if (error) throw error;

      return {
        valid: data.valid,
        data: data.valid ? { cpf: data.cpf, raw: data.raw } : undefined,
        error: data.error,
      };
    } catch (err: any) {
      return { valid: false, error: err.message || 'Erro ao validar CPF' };
    } finally {
      setIsValidating(false);
    }
  }, []);

  const validateCEP = useCallback(async (cep: string): Promise<ValidationResult<AddressData>> => {
    setIsValidating(true);
    try {
      const { data, error } = await supabase.functions.invoke('validate-cep', {
        body: { cep },
      });

      if (error) throw error;

      return {
        valid: data.valid,
        data: data.valid ? {
          address: data.address,
          neighborhood: data.neighborhood,
          city: data.city,
          state: data.state,
          cep: data.cep,
        } : undefined,
        error: data.error,
      };
    } catch (err: any) {
      return { valid: false, error: err.message || 'Erro ao validar CEP' };
    } finally {
      setIsValidating(false);
    }
  }, []);

  const validateBankAccount = useCallback(async (data: {
    bank_code: string;
    agency: string;
    account: string;
    account_type: string;
    holder_cpf?: string;
    pix_key_type?: string;
    pix_key?: string;
  }): Promise<ValidationResult<{ bank_name: string; formatted: { agency: string; account: string } }>> => {
    setIsValidating(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('validate-bank-account', {
        body: data,
      });

      if (error) throw error;

      return {
        valid: result.valid,
        data: result.valid ? {
          bank_name: result.bank_name,
          formatted: result.formatted,
        } : undefined,
        error: result.errors?.join(', ') || result.error,
      };
    } catch (err: any) {
      return { valid: false, error: err.message || 'Erro ao validar conta bancária' };
    } finally {
      setIsValidating(false);
    }
  }, []);

  // Client-side quick validation (before API call)
  const quickValidateCPF = (cpf: string): boolean => {
    const clean = cpf.replace(/[^\d]/g, '');
    if (clean.length !== 11) return false;
    if (/^(\d)\1+$/.test(clean)) return false;
    return true;
  };

  const quickValidateCEP = (cep: string): boolean => {
    const clean = cep.replace(/[^\d]/g, '');
    return clean.length === 8;
  };

  const quickValidateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const quickValidatePhone = (phone: string): boolean => {
    const clean = phone.replace(/[^\d]/g, '');
    return clean.length >= 10 && clean.length <= 11;
  };

  // Format helpers
  const formatCPF = (cpf: string): string => {
    const clean = cpf.replace(/[^\d]/g, '');
    return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatCEP = (cep: string): string => {
    const clean = cep.replace(/[^\d]/g, '');
    return clean.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  const formatPhone = (phone: string): string => {
    const clean = phone.replace(/[^\d]/g, '');
    if (clean.length === 11) {
      return clean.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return clean.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  };

  return {
    isValidating,
    validateCPF,
    validateCEP,
    validateBankAccount,
    quickValidateCPF,
    quickValidateCEP,
    quickValidateEmail,
    quickValidatePhone,
    formatCPF,
    formatCEP,
    formatPhone,
  };
}
