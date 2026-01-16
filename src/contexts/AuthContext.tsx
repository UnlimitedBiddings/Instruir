import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, UserRole, Student, Instructor } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  userRole: UserRole | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockStudent: Student = {
  id: '1',
  name: 'João Silva',
  email: 'joao@email.com',
  phone: '(11) 99999-9999',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  role: 'student',
  createdAt: new Date(),
  lessonsCompleted: 12,
  upcomingLessons: 2,
};

const mockInstructor: Instructor = {
  id: '2',
  name: 'Carlos Oliveira',
  email: 'carlos@email.com',
  phone: '(11) 98888-8888',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  role: 'professional',
  category: 'driving_instructor',
  createdAt: new Date(),
  bio: 'Instrutor com 10 anos de experiência.',
  rating: 4.9,
  reviewCount: 234,
  pricePerHour: 80,
  vehicle: { model: 'Chevrolet Onix Plus', year: 2024, color: 'Prata', transmission: 'manual', hasAirConditioning: true },
  location: { lat: -23.5505, lng: -46.6333, address: 'Av. Paulista, São Paulo', city: 'São Paulo', distance: 2.5 },
  serviceZones: ['Centro', 'Paulista', 'Pinheiros', 'Vila Mariana'],
  availability: [],
  verified: { identity: true, background: true, credentials: true, cnh: true, criminalRecord: true, vehicleInspection: true },
  totalLessons: 1250,
  experience: 10,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (email.includes('instrutor') || email.includes('instructor')) {
      setUser(mockInstructor);
    } else {
      setUser(mockStudent);
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (data.role === 'professional') {
      setUser({ ...mockInstructor, name: data.name, email: data.email, phone: data.phone });
    } else {
      setUser({ ...mockStudent, name: data.name, email: data.email, phone: data.phone });
    }
  }, []);

  const logout = useCallback(() => { setUser(null); }, []);

  const switchRole = useCallback((role: UserRole) => {
    if (role === 'professional') { setUser(mockInstructor); } else { setUser(mockStudent); }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, userRole: user?.role ?? null, login, register, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) { throw new Error('useAuth must be used within an AuthProvider'); }
  return context;
}
