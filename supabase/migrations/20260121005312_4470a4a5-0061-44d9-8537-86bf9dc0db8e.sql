-- ============================================
-- INSTRUIR - Database Schema
-- ============================================

-- 1. Enum Types
CREATE TYPE public.user_role AS ENUM ('student', 'professional', 'school_admin');
CREATE TYPE public.professional_category AS ENUM ('driving_instructor', 'language_teacher', 'music_teacher', 'personal_trainer', 'tutor');
CREATE TYPE public.provider_type AS ENUM ('independent', 'company');
CREATE TYPE public.session_status AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled');
CREATE TYPE public.transmission_type AS ENUM ('manual', 'automatic');

-- 2. Profiles Table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'student',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 3. Professionals Table (for instructors, teachers, etc.)
CREATE TABLE public.professionals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  category professional_category NOT NULL,
  bio TEXT,
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  price_per_hour DECIMAL(10,2) NOT NULL,
  total_sessions INTEGER DEFAULT 0,
  experience_years INTEGER DEFAULT 0,
  provider_type provider_type DEFAULT 'independent',
  company_id UUID,
  -- Location
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  address TEXT,
  city TEXT,
  service_zones TEXT[],
  -- Verification
  identity_verified BOOLEAN DEFAULT false,
  background_verified BOOLEAN DEFAULT false,
  credentials_verified BOOLEAN DEFAULT false,
  -- Vehicle (for driving instructors)
  vehicle_model TEXT,
  vehicle_year INTEGER,
  vehicle_color TEXT,
  vehicle_transmission transmission_type,
  vehicle_has_ac BOOLEAN DEFAULT true,
  vehicle_image_url TEXT,
  -- Additional driving instructor fields
  cnh_verified BOOLEAN DEFAULT false,
  vehicle_inspection_verified BOOLEAN DEFAULT false,
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 4. Companies Table (autoescolas, schools, etc.)
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  cnpj TEXT UNIQUE,
  type professional_category NOT NULL,
  logo_url TEXT,
  description TEXT,
  address TEXT,
  city TEXT,
  phone TEXT,
  email TEXT,
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 5. Add foreign key for company_id in professionals
ALTER TABLE public.professionals 
  ADD CONSTRAINT fk_professionals_company 
  FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE SET NULL;

-- 6. Sessions Table (appointments/lessons)
CREATE TABLE public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  professional_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  category professional_category NOT NULL,
  session_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status session_status DEFAULT 'pending' NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  -- Location
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  address TEXT,
  city TEXT,
  -- Additional info
  notes TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 7. Reviews Table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE NOT NULL UNIQUE,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  professional_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- ============================================
-- Enable RLS on all tables
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS Policies - Profiles
-- ============================================
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- RLS Policies - Professionals
-- ============================================
CREATE POLICY "Professionals are viewable by everyone"
  ON public.professionals FOR SELECT
  USING (true);

CREATE POLICY "Professionals can update their own profile"
  ON public.professionals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create professional profile"
  ON public.professionals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- RLS Policies - Companies
-- ============================================
CREATE POLICY "Companies are viewable by everyone"
  ON public.companies FOR SELECT
  USING (true);

CREATE POLICY "Company owners can update their company"
  ON public.companies FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can create companies"
  ON public.companies FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- ============================================
-- RLS Policies - Sessions
-- ============================================
CREATE POLICY "Users can view their own sessions"
  ON public.sessions FOR SELECT
  USING (auth.uid() = student_id OR auth.uid() = professional_id);

CREATE POLICY "Students can create sessions"
  ON public.sessions FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Participants can update sessions"
  ON public.sessions FOR UPDATE
  USING (auth.uid() = student_id OR auth.uid() = professional_id);

-- ============================================
-- RLS Policies - Reviews
-- ============================================
CREATE POLICY "Reviews are viewable by everyone"
  ON public.reviews FOR SELECT
  USING (true);

CREATE POLICY "Students can create reviews for their sessions"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() = student_id);

-- ============================================
-- Trigger for updated_at
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_professionals_updated_at
  BEFORE UPDATE ON public.professionals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at
  BEFORE UPDATE ON public.sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- Function to auto-create profile on signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- Indexes for performance
-- ============================================
CREATE INDEX idx_professionals_category ON public.professionals(category);
CREATE INDEX idx_professionals_city ON public.professionals(city);
CREATE INDEX idx_professionals_rating ON public.professionals(rating DESC);
CREATE INDEX idx_sessions_student ON public.sessions(student_id);
CREATE INDEX idx_sessions_professional ON public.sessions(professional_id);
CREATE INDEX idx_sessions_date ON public.sessions(session_date);
CREATE INDEX idx_reviews_professional ON public.reviews(professional_id);