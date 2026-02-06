import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Calendar, 
  Star, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardStats {
  upcomingSessions: number;
  completedSessions: number;
  totalEarnings: number;
  averageRating: number;
  reviewCount: number;
  pendingRequests: number;
  totalStudents: number;
}

interface StudentStats {
  upcomingLessons: number;
  completedLessons: number;
  totalSpent: number;
  favoriteInstructors: number;
}

export function useDashboardStats() {
  const { user, userRole } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [professionalStats, setProfessionalStats] = useState<DashboardStats | null>(null);
  const [studentStats, setStudentStats] = useState<StudentStats | null>(null);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchStats = async () => {
      setIsLoading(true);
      
      try {
        if (userRole === 'professional') {
          // Fetch professional stats
          const [sessionsResult, reviewsResult] = await Promise.all([
            supabase
              .from('sessions')
              .select('id, status, price')
              .eq('professional_id', user.id),
            supabase
              .from('reviews')
              .select('rating')
              .eq('professional_id', user.id)
          ]);

          const sessions = sessionsResult.data || [];
          const reviews = reviewsResult.data || [];

          const upcomingSessions = sessions.filter(s => 
            s.status === 'pending' || s.status === 'confirmed'
          ).length;
          
          const completedSessions = sessions.filter(s => 
            s.status === 'completed'
          ).length;

          const totalEarnings = sessions
            .filter(s => s.status === 'completed')
            .reduce((sum, s) => sum + (s.price || 0), 0);

          const avgRating = reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;

          const pendingRequests = sessions.filter(s => 
            s.status === 'pending'
          ).length;

          // Get unique students
          const uniqueStudents = new Set(sessions.map(s => s.id)).size;

          setProfessionalStats({
            upcomingSessions,
            completedSessions,
            totalEarnings,
            averageRating: avgRating,
            reviewCount: reviews.length,
            pendingRequests,
            totalStudents: uniqueStudents,
          });
        } else {
          // Fetch student stats
          const sessionsResult = await supabase
            .from('sessions')
            .select('id, status, price')
            .eq('student_id', user.id);

          const sessions = sessionsResult.data || [];

          const upcomingLessons = sessions.filter(s => 
            s.status === 'pending' || s.status === 'confirmed'
          ).length;
          
          const completedLessons = sessions.filter(s => 
            s.status === 'completed'
          ).length;

          const totalSpent = sessions
            .filter(s => s.status === 'completed')
            .reduce((sum, s) => sum + (s.price || 0), 0);

          setStudentStats({
            upcomingLessons,
            completedLessons,
            totalSpent,
            favoriteInstructors: 0,
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [user, userRole]);

  return {
    isLoading,
    professionalStats,
    studentStats,
    isProfessional: userRole === 'professional',
  };
}

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  colorClass?: string;
}

export function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  subValue, 
  trend, 
  trendValue,
  colorClass = 'text-primary'
}: StatCardProps) {
  return (
    <div className="card-elevated p-4">
      <div className="flex items-start justify-between mb-2">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", 
          colorClass === 'text-primary' ? "bg-primary/10" : 
          colorClass === 'text-success' ? "bg-success/10" :
          colorClass === 'text-warning' ? "bg-warning/10" :
          colorClass === 'text-accent' ? "bg-accent/10" : "bg-muted"
        )}>
          <Icon className={cn("h-5 w-5", colorClass)} />
        </div>
        {trend && trendValue && (
          <span className={cn(
            "text-xs font-medium px-2 py-0.5 rounded-full",
            trend === 'up' ? "bg-success/10 text-success" :
            trend === 'down' ? "bg-destructive/10 text-destructive" :
            "bg-muted text-muted-foreground"
          )}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '•'} {trendValue}
          </span>
        )}
      </div>
      <p className="text-2xl font-display font-bold">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
      {subValue && (
        <p className="text-xs text-muted-foreground mt-1">{subValue}</p>
      )}
    </div>
  );
}

export function ProfessionalDashboardStats() {
  const { professionalStats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card-elevated p-4 animate-pulse">
            <div className="w-10 h-10 rounded-xl bg-muted mb-2" />
            <div className="h-6 w-16 bg-muted rounded mb-1" />
            <div className="h-4 w-24 bg-muted rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (!professionalStats) return null;

  return (
    <div className="grid grid-cols-2 gap-3 mb-4">
      <StatCard
        icon={Calendar}
        label="Aulas agendadas"
        value={professionalStats.upcomingSessions}
        colorClass="text-primary"
      />
      <StatCard
        icon={AlertCircle}
        label="Solicitações"
        value={professionalStats.pendingRequests}
        colorClass="text-warning"
      />
      <StatCard
        icon={CheckCircle}
        label="Aulas realizadas"
        value={professionalStats.completedSessions}
        colorClass="text-success"
      />
      <StatCard
        icon={Star}
        label="Avaliação média"
        value={professionalStats.averageRating.toFixed(1)}
        subValue={`${professionalStats.reviewCount} avaliações`}
        colorClass="text-warning"
      />
    </div>
  );
}

export function StudentDashboardStats() {
  const { studentStats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[1, 2].map((i) => (
          <div key={i} className="card-elevated p-4 animate-pulse">
            <div className="w-10 h-10 rounded-xl bg-muted mb-2" />
            <div className="h-6 w-16 bg-muted rounded mb-1" />
            <div className="h-4 w-24 bg-muted rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (!studentStats) return null;

  return (
    <div className="grid grid-cols-2 gap-3 mb-4">
      <StatCard
        icon={Calendar}
        label="Aulas agendadas"
        value={studentStats.upcomingLessons}
        colorClass="text-primary"
      />
      <StatCard
        icon={CheckCircle}
        label="Aulas concluídas"
        value={studentStats.completedLessons}
        colorClass="text-success"
      />
    </div>
  );
}
