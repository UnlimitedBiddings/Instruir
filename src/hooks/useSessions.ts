import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

type SessionStatus = Database['public']['Enums']['session_status'];
type ProfessionalCategory = Database['public']['Enums']['professional_category'];

interface SessionData {
  id: string;
  student_id: string;
  professional_id: string;
  company_id: string | null;
  category: ProfessionalCategory;
  session_date: string;
  start_time: string;
  end_time: string;
  status: SessionStatus;
  price: number;
  address: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  notes: string | null;
  rating: number | null;
  review: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  professional?: {
    id: string;
    bio: string | null;
    vehicle_model: string | null;
    profile?: {
      name: string;
      avatar_url: string | null;
    };
  };
  student?: {
    id: string;
    profile?: {
      name: string;
      avatar_url: string | null;
      phone: string | null;
    };
  };
}

interface CreateSessionData {
  professional_id: string;
  category: ProfessionalCategory;
  session_date: string;
  start_time: string;
  end_time: string;
  price: number;
  address?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
  company_id?: string;
}

export function useSessions() {
  const { user, profile } = useAuth();
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      setError(null);

      // Get sessions for current user (as student or professional)
      const { data: sessionsData, error: fetchError } = await supabase
        .from('sessions')
        .select('*')
        .order('session_date', { ascending: true })
        .order('start_time', { ascending: true });

      if (fetchError) throw fetchError;

      // Fetch related data for each session
      const sessionsWithDetails = await Promise.all(
        (sessionsData || []).map(async (session) => {
          // Get professional details
          const { data: profData } = await supabase
            .from('professionals')
            .select('id, bio, vehicle_model, user_id')
            .eq('id', session.professional_id)
            .single();

          // Get student details
          const { data: studentData } = await supabase
            .from('students')
            .select('id, user_id')
            .eq('id', session.student_id)
            .single();

          let professionalProfile = null;
          let studentProfile = null;

          if (profData?.user_id) {
            const { data: profProfile } = await supabase
              .from('profiles')
              .select('name, avatar_url')
              .eq('user_id', profData.user_id)
              .single();
            professionalProfile = profProfile;
          }

          if (studentData?.user_id) {
            const { data: studProfile } = await supabase
              .from('profiles')
              .select('name, avatar_url, phone')
              .eq('user_id', studentData.user_id)
              .single();
            studentProfile = studProfile;
          }

          return {
            ...session,
            professional: profData ? {
              ...profData,
              profile: professionalProfile,
            } : undefined,
            student: studentData ? {
              ...studentData,
              profile: studentProfile,
            } : undefined,
          } as SessionData;
        })
      );

      setSessions(sessionsWithDetails);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching sessions:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const createSession = async (data: CreateSessionData) => {
    if (!user?.id) return { error: 'Usuário não autenticado' };

    // Get student record for current user
    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (studentError || !studentData) {
      return { error: 'Registro de aluno não encontrado' };
    }

    try {
      const { data: newSession, error } = await supabase
        .from('sessions')
        .insert({
          ...data,
          student_id: studentData.id,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Aula agendada com sucesso!');
      fetchSessions();
      return { success: true, data: newSession };
    } catch (err: any) {
      toast.error('Erro ao agendar aula');
      return { error: err.message };
    }
  };

  const updateSessionStatus = async (sessionId: string, status: SessionStatus) => {
    try {
      const { error } = await supabase
        .from('sessions')
        .update({ status })
        .eq('id', sessionId);

      if (error) throw error;

      setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, status } : s));
      
      const statusMessages: Record<SessionStatus, string> = {
        pending: 'Aula pendente',
        confirmed: 'Aula confirmada!',
        in_progress: 'Aula em andamento',
        completed: 'Aula concluída!',
        cancelled: 'Aula cancelada',
      };
      
      toast.success(statusMessages[status]);
      return { success: true };
    } catch (err: any) {
      toast.error('Erro ao atualizar status');
      return { error: err.message };
    }
  };

  const cancelSession = async (sessionId: string) => {
    return updateSessionStatus(sessionId, 'cancelled');
  };

  const confirmSession = async (sessionId: string) => {
    return updateSessionStatus(sessionId, 'confirmed');
  };

  const completeSession = async (sessionId: string) => {
    return updateSessionStatus(sessionId, 'completed');
  };

  const addReview = async (sessionId: string, rating: number, review: string) => {
    try {
      const session = sessions.find(s => s.id === sessionId);
      if (!session) return { error: 'Sessão não encontrada' };

      // Get student record
      const { data: studentData } = await supabase
        .from('students')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (!studentData) return { error: 'Registro de aluno não encontrado' };

      // Update session with rating
      const { error: sessionError } = await supabase
        .from('sessions')
        .update({ rating, review })
        .eq('id', sessionId);

      if (sessionError) throw sessionError;

      // Create review record
      const { error: reviewError } = await supabase
        .from('reviews')
        .insert({
          session_id: sessionId,
          student_id: studentData.id,
          professional_id: session.professional_id,
          rating,
          comment: review,
        });

      if (reviewError) throw reviewError;

      setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, rating, review } : s));
      toast.success('Avaliação enviada!');
      return { success: true };
    } catch (err: any) {
      toast.error('Erro ao enviar avaliação');
      return { error: err.message };
    }
  };

  // Filter helpers
  const upcomingSessions = sessions.filter(
    s => ['pending', 'confirmed'].includes(s.status) && new Date(s.session_date) >= new Date()
  );

  const pastSessions = sessions.filter(
    s => s.status === 'completed' || new Date(s.session_date) < new Date()
  );

  const pendingRequests = sessions.filter(s => s.status === 'pending');

  return {
    sessions,
    upcomingSessions,
    pastSessions,
    pendingRequests,
    isLoading,
    error,
    refetch: fetchSessions,
    createSession,
    updateSessionStatus,
    cancelSession,
    confirmSession,
    completeSession,
    addReview,
  };
}
