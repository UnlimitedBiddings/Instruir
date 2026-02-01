-- =====================================================
-- INSTRUIR - Sistema Multi-Profissional
-- Migração completa para suportar CNPJ/MEI e multi-categoria
-- =====================================================

-- 1. ADICIONAR CAMPO CNPJ ao professionals (opcional para PF ou MEI)
ALTER TABLE public.professionals 
ADD COLUMN IF NOT EXISTS cnpj TEXT,
ADD COLUMN IF NOT EXISTS skills TEXT[],
ADD COLUMN IF NOT EXISTS specializations TEXT[],
ADD COLUMN IF NOT EXISTS employment_type TEXT CHECK (employment_type IN ('clt', 'autonomous'));

-- 2. TABELA DE ROLES (separada por segurança - evita privilege escalation)
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('student', 'professional', 'school_admin')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checking (prevents recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS for user_roles
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own role" 
ON public.user_roles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 3. TABELA DE STUDENTS (dados específicos de alunos)
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    lessons_completed INTEGER NOT NULL DEFAULT 0,
    upcoming_lessons INTEGER NOT NULL DEFAULT 0,
    preferred_categories TEXT[],
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their own data" 
ON public.students 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Students can insert their own data" 
ON public.students 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Students can update their own data" 
ON public.students 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Trigger for students updated_at
CREATE TRIGGER update_students_updated_at
BEFORE UPDATE ON public.students
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 4. TABELA DE PACOTES DE SERVIÇOS
CREATE TABLE IF NOT EXISTS public.service_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    total_sessions INTEGER NOT NULL,
    price_total NUMERIC NOT NULL,
    price_per_session NUMERIC NOT NULL,
    validity_days INTEGER NOT NULL DEFAULT 180,
    includes TEXT[],
    popular BOOLEAN DEFAULT false,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.service_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service packages are viewable by everyone" 
ON public.service_packages 
FOR SELECT 
USING (true);

CREATE POLICY "Company owners can manage their packages" 
ON public.service_packages 
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.companies 
        WHERE id = service_packages.company_id 
        AND owner_id = auth.uid()
    )
);

-- Trigger for service_packages updated_at
CREATE TRIGGER update_service_packages_updated_at
BEFORE UPDATE ON public.service_packages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 5. ADICIONAR CAMPOS DE LOCALIZAÇÃO À COMPANIES
ALTER TABLE public.companies
ADD COLUMN IF NOT EXISTS latitude NUMERIC,
ADD COLUMN IF NOT EXISTS longitude NUMERIC;

-- 6. TABELA DE NOTIFICAÇÕES
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('session_request', 'session_confirmed', 'session_reminder', 'review', 'system')),
    read BOOLEAN NOT NULL DEFAULT false,
    data JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications" 
ON public.notifications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
ON public.notifications 
FOR UPDATE 
USING (auth.uid() = user_id);

-- System can insert notifications for anyone (handled by edge functions with service role)
CREATE POLICY "Service role can insert notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (true);

-- 7. TABELA DE DISPONIBILIDADE DOS PROFISSIONAIS
CREATE TABLE IF NOT EXISTS public.availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    professional_id UUID REFERENCES public.professionals(id) ON DELETE CASCADE NOT NULL,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (professional_id, day_of_week, start_time)
);

ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Availability is viewable by everyone" 
ON public.availability 
FOR SELECT 
USING (true);

CREATE POLICY "Professionals can manage their availability" 
ON public.availability 
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.professionals 
        WHERE id = availability.professional_id 
        AND user_id = auth.uid()
    )
);

-- 8. TABELA DE MENSAGENS (CHAT)
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL,
    sender_id UUID NOT NULL,
    content TEXT NOT NULL,
    read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 9. TABELA DE CONVERSAS
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_1 UUID NOT NULL,
    participant_2 UUID NOT NULL,
    last_message TEXT,
    last_message_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their conversations" 
ON public.conversations 
FOR SELECT 
USING (auth.uid() = participant_1 OR auth.uid() = participant_2);

CREATE POLICY "Users can create conversations" 
ON public.conversations 
FOR INSERT 
WITH CHECK (auth.uid() = participant_1 OR auth.uid() = participant_2);

CREATE POLICY "Users can update their conversations" 
ON public.conversations 
FOR UPDATE 
USING (auth.uid() = participant_1 OR auth.uid() = participant_2);

-- Messages RLS
CREATE POLICY "Users can view messages in their conversations" 
ON public.messages 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.conversations 
        WHERE id = messages.conversation_id 
        AND (participant_1 = auth.uid() OR participant_2 = auth.uid())
    )
);

CREATE POLICY "Users can send messages in their conversations" 
ON public.messages 
FOR INSERT 
WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
        SELECT 1 FROM public.conversations 
        WHERE id = messages.conversation_id 
        AND (participant_1 = auth.uid() OR participant_2 = auth.uid())
    )
);

CREATE POLICY "Users can update their sent messages" 
ON public.messages 
FOR UPDATE 
USING (auth.uid() = sender_id);

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;

-- 10. ATUALIZAR handle_new_user para criar role automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Get the role from metadata or default to 'student'
  user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'student');
  
  -- Insert profile
  INSERT INTO public.profiles (user_id, name, email, avatar_url, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url',
    user_role::user_role
  );
  
  -- Insert role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, user_role);
  
  -- If student, create student record
  IF user_role = 'student' THEN
    INSERT INTO public.students (user_id)
    VALUES (NEW.id);
  END IF;
  
  RETURN NEW;
END;
$$;