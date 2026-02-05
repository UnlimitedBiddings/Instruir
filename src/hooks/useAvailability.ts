import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AvailabilitySlot {
  id: string;
  professional_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

const DAY_NAMES = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

export function useAvailability(professionalId?: string) {
  const { user } = useAuth();
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAvailability = useCallback(async () => {
    if (!professionalId && !user?.id) return;

    try {
      setIsLoading(true);
      setError(null);

      let query = supabase
        .from('availability')
        .select('*')
        .order('day_of_week')
        .order('start_time');

      if (professionalId) {
        query = query.eq('professional_id', professionalId);
      } else {
        // Get current user's professional profile
        const { data: profData } = await supabase
          .from('professionals')
          .select('id')
          .eq('user_id', user?.id)
          .single();

        if (profData) {
          query = query.eq('professional_id', profData.id);
        }
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setAvailability(data || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching availability:', err);
    } finally {
      setIsLoading(false);
    }
  }, [professionalId, user?.id]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  const addSlot = async (slot: Omit<AvailabilitySlot, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('availability')
        .insert(slot)
        .select()
        .single();

      if (error) throw error;

      setAvailability(prev => [...prev, data]);
      toast.success('Horário adicionado!');
      return { success: true, data };
    } catch (err: any) {
      toast.error('Erro ao adicionar horário');
      return { error: err.message };
    }
  };

  const updateSlot = async (slotId: string, updates: Partial<AvailabilitySlot>) => {
    try {
      const { error } = await supabase
        .from('availability')
        .update(updates)
        .eq('id', slotId);

      if (error) throw error;

      setAvailability(prev => prev.map(s => s.id === slotId ? { ...s, ...updates } : s));
      toast.success('Horário atualizado!');
      return { success: true };
    } catch (err: any) {
      toast.error('Erro ao atualizar horário');
      return { error: err.message };
    }
  };

  const removeSlot = async (slotId: string) => {
    try {
      const { error } = await supabase
        .from('availability')
        .delete()
        .eq('id', slotId);

      if (error) throw error;

      setAvailability(prev => prev.filter(s => s.id !== slotId));
      toast.success('Horário removido!');
      return { success: true };
    } catch (err: any) {
      toast.error('Erro ao remover horário');
      return { error: err.message };
    }
  };

  const toggleSlotAvailability = async (slotId: string) => {
    const slot = availability.find(s => s.id === slotId);
    if (!slot) return { error: 'Slot não encontrado' };
    
    return updateSlot(slotId, { is_available: !slot.is_available });
  };

  // Group by day of week
  const groupedByDay = availability.reduce((acc, slot) => {
    const day = slot.day_of_week;
    if (!acc[day]) {
      acc[day] = { dayName: DAY_NAMES[day], slots: [] };
    }
    acc[day].slots.push(slot);
    return acc;
  }, {} as Record<number, { dayName: string; slots: AvailabilitySlot[] }>);

  // Check if a specific time is available
  const isTimeAvailable = (dayOfWeek: number, time: string): boolean => {
    return availability.some(slot => 
      slot.day_of_week === dayOfWeek &&
      slot.is_available &&
      slot.start_time <= time &&
      slot.end_time > time
    );
  };

  // Get available slots for a specific date
  const getAvailableSlots = (date: Date): AvailabilitySlot[] => {
    const dayOfWeek = date.getDay();
    return availability.filter(
      slot => slot.day_of_week === dayOfWeek && slot.is_available
    );
  };

  return {
    availability,
    groupedByDay,
    isLoading,
    error,
    refetch: fetchAvailability,
    addSlot,
    updateSlot,
    removeSlot,
    toggleSlotAvailability,
    isTimeAvailable,
    getAvailableSlots,
    DAY_NAMES,
  };
}
