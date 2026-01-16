// ============================================
// INSTRUIR - Sistema de Tipos Multi-Profissional
// ============================================
// Arquitetura extensível para suportar diversos tipos de profissionais:
// - Instrutores de Direção (MVP inicial)
// - Professores de idiomas (futuro)
// - Professores de música/instrumentos (futuro)
// - Personal Trainers (futuro)
// - E outros profissionais de ensino

export type UserRole = 'student' | 'professional' | 'school_admin';

// Tipo do profissional - extensível para novas categorias
export type ProfessionalCategory = 
  | 'driving_instructor'    // Instrutor de direção (MVP)
  | 'language_teacher'      // Professor de idiomas
  | 'music_teacher'         // Professor de música/instrumento
  | 'personal_trainer'      // Personal trainer
  | 'tutor';                // Tutor acadêmico

// Tipo do provedor - individual ou vinculado a empresa
export type ProviderType = 'independent' | 'company';

// ============================================
// USUÁRIO BASE
// ============================================
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: UserRole;
  createdAt: Date;
}

export interface Student extends User {
  role: 'student';
  lessonsCompleted: number;
  upcomingLessons: number;
}

// ============================================
// PROFISSIONAL BASE (Genérico)
// ============================================
export interface Professional extends User {
  role: 'professional';
  category: ProfessionalCategory;
  bio: string;
  rating: number;
  reviewCount: number;
  pricePerHour: number;
  location: Location;
  serviceZones: string[];
  availability: Availability[];
  verified: VerificationStatus;
  totalLessons: number;
  experience: number; // years
  // Vínculo com empresa (opcional)
  providerType?: ProviderType;
  companyId?: string;
  company?: Company;
  employmentType?: 'clt' | 'autonomous';
  // Skills/especialidades específicas da categoria
  skills?: string[];
  specializations?: string[];
}

// ============================================
// INSTRUTOR DE DIREÇÃO (Especialização do Professional)
// ============================================
export interface Instructor extends Professional {
  category: 'driving_instructor';
  vehicle: Vehicle;
}

// Alias para compatibilidade com código existente
export type DrivingInstructor = Instructor;

// ============================================
// EMPRESA/ESCOLA (Genérico para múltiplos tipos)
// ============================================
export interface Company {
  id: string;
  name: string;
  type: ProfessionalCategory; // Tipo de profissionais que oferece
  cnpj: string;
  logo?: string;
  description: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  createdAt: Date;
  packages?: ServicePackage[];
  professionalIds?: string[];
}

// Alias para autoescolas (compatibilidade)
export interface DrivingSchool extends Company {
  type: 'driving_instructor';
}

// ============================================
// PACOTE DE SERVIÇOS (Genérico)
// ============================================
export interface ServicePackage {
  id: string;
  companyId: string;
  name: string;
  description: string;
  totalSessions: number;
  priceTotal: number;
  pricePerSession: number;
  validityDays: number;
  includes: string[];
  popular?: boolean;
}

// Alias para pacotes de aulas de direção (compatibilidade)
export type LessonPackage = ServicePackage;

// ============================================
// VEÍCULO (Para instrutores de direção)
// ============================================
export interface Vehicle {
  model: string;
  year: number;
  color: string;
  transmission: 'manual' | 'automatic';
  hasAirConditioning: boolean;
  image?: string;
}

// ============================================
// LOCALIZAÇÃO
// ============================================
export interface Location {
  lat: number;
  lng: number;
  address: string;
  city: string;
  distance?: number; // em km do usuário
}

// ============================================
// DISPONIBILIDADE
// ============================================
export interface Availability {
  dayOfWeek: number; // 0-6
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  isAvailable: boolean;
}

// ============================================
// VERIFICAÇÃO
// ============================================
export interface VerificationStatus {
  identity: boolean;      // Verificação de identidade (genérico)
  background: boolean;    // Verificação de antecedentes
  credentials: boolean;   // Verificação de credenciais profissionais
  // Campos específicos para instrutores de direção
  cnh?: boolean;
  criminalRecord?: boolean;
  vehicleInspection?: boolean;
}

// ============================================
// SESSÃO/AULA (Genérico)
// ============================================
export interface Session {
  id: string;
  studentId: string;
  professionalId: string;
  professional?: Professional;
  student?: Student;
  category: ProfessionalCategory;
  date: Date;
  startTime: string;
  endTime: string;
  status: SessionStatus;
  price: number;
  location: Location;
  notes?: string;
  rating?: number;
  review?: string;
  // Vínculo com empresa
  companyId?: string;
  packageId?: string;
}

// Alias para compatibilidade
export type Lesson = Session;

export type SessionStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled';

// Alias para compatibilidade
export type LessonStatus = SessionStatus;

// ============================================
// AVALIAÇÃO
// ============================================
export interface Review {
  id: string;
  sessionId: string;
  studentId: string;
  professionalId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  student?: Student;
}

// ============================================
// NOTIFICAÇÃO
// ============================================
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'session_request' | 'session_confirmed' | 'session_reminder' | 'review' | 'system';
  read: boolean;
  createdAt: Date;
  data?: Record<string, unknown>;
}

// ============================================
// FILTROS
// ============================================
export interface ProfessionalFilters {
  category?: ProfessionalCategory;
  priceRange?: [number, number];
  providerType?: ProviderType | 'all';
  minRating?: number;
  maxDistance?: number;
  hasAvailabilityToday?: boolean;
  // Filtros específicos para instrutores de direção
  transmission?: 'manual' | 'automatic' | 'all';
}

// Alias para compatibilidade
export type InstructorFilters = ProfessionalFilters;

// ============================================
// HELPERS - Metadados por categoria
// ============================================
export const CATEGORY_METADATA: Record<ProfessionalCategory, {
  label: string;
  labelPlural: string;
  icon: string;
  description: string;
  color: string;
}> = {
  driving_instructor: {
    label: 'Instrutor de Direção',
    labelPlural: 'Instrutores de Direção',
    icon: 'Car',
    description: 'Aprenda a dirigir com instrutores verificados',
    color: 'hsl(var(--primary))',
  },
  language_teacher: {
    label: 'Professor de Idiomas',
    labelPlural: 'Professores de Idiomas',
    icon: 'Languages',
    description: 'Aprenda novos idiomas com nativos e especialistas',
    color: 'hsl(220, 90%, 56%)',
  },
  music_teacher: {
    label: 'Professor de Música',
    labelPlural: 'Professores de Música',
    icon: 'Music',
    description: 'Domine instrumentos e teoria musical',
    color: 'hsl(280, 90%, 56%)',
  },
  personal_trainer: {
    label: 'Personal Trainer',
    labelPlural: 'Personal Trainers',
    icon: 'Dumbbell',
    description: 'Alcance seus objetivos físicos',
    color: 'hsl(25, 90%, 56%)',
  },
  tutor: {
    label: 'Tutor',
    labelPlural: 'Tutores',
    icon: 'GraduationCap',
    description: 'Reforce seus estudos acadêmicos',
    color: 'hsl(160, 90%, 40%)',
  },
};
