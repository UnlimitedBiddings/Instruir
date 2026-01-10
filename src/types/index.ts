export type UserRole = 'student' | 'instructor' | 'school_admin';

export type ProviderType = 'independent' | 'school';

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

export interface DrivingSchool {
  id: string;
  name: string;
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
  // Package offerings
  packages?: LessonPackage[];
  // Instructors affiliated with this school
  instructorIds?: string[];
}

export interface LessonPackage {
  id: string;
  schoolId: string;
  name: string;
  description: string;
  totalLessons: number;
  priceTotal: number;
  pricePerLesson: number;
  validityDays: number; // Package validity in days
  includes: string[]; // What's included (e.g., "Material didático", "Exame simulado")
  popular?: boolean;
}

export interface Instructor extends User {
  role: 'instructor';
  bio: string;
  rating: number;
  reviewCount: number;
  pricePerHour: number;
  vehicle: Vehicle;
  location: Location;
  serviceZones: string[];
  availability: Availability[];
  verified: VerificationStatus;
  totalLessons: number;
  experience: number; // years
  // B2B2C fields - school affiliation (optional for backward compatibility)
  providerType?: ProviderType;
  schoolId?: string; // If affiliated with a driving school
  school?: DrivingSchool; // Populated school data
  employmentType?: 'clt' | 'autonomous'; // Employment relationship with school
}

export interface Vehicle {
  model: string;
  year: number;
  color: string;
  transmission: 'manual' | 'automatic';
  hasAirConditioning: boolean;
  image?: string;
}

export interface Location {
  lat: number;
  lng: number;
  address: string;
  city: string;
  distance?: number; // in km from user
}

export interface Availability {
  dayOfWeek: number; // 0-6
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  isAvailable: boolean;
}

export interface VerificationStatus {
  cnh: boolean;
  criminalRecord: boolean;
  vehicleInspection: boolean;
}

export interface Lesson {
  id: string;
  studentId: string;
  instructorId: string;
  instructor?: Instructor;
  student?: Student;
  date: Date;
  startTime: string;
  endTime: string;
  status: LessonStatus;
  price: number;
  location: Location;
  notes?: string;
  rating?: number;
  review?: string;
  // B2B2C fields
  schoolId?: string; // If booked through a school
  packageId?: string; // If part of a package
}

export type LessonStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled';

export interface Review {
  id: string;
  lessonId: string;
  studentId: string;
  instructorId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  student?: Student;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'lesson_request' | 'lesson_confirmed' | 'lesson_reminder' | 'review' | 'system';
  read: boolean;
  createdAt: Date;
  data?: Record<string, unknown>;
}

// Filter types for explore page
export interface InstructorFilters {
  priceRange?: [number, number];
  transmission?: 'manual' | 'automatic' | 'all';
  providerType?: ProviderType | 'all';
  minRating?: number;
  maxDistance?: number;
  hasAvailabilityToday?: boolean;
}
