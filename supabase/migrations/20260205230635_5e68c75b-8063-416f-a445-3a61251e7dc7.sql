-- =============================================
-- FASE 1: DADOS PESSOAIS E LGPD
-- =============================================

-- Adicionar campos de dados pessoais em profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS cpf TEXT,
ADD COLUMN IF NOT EXISTS birth_date DATE,
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS address_number TEXT,
ADD COLUMN IF NOT EXISTS address_complement TEXT,
ADD COLUMN IF NOT EXISTS neighborhood TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS zip_code TEXT,
ADD COLUMN IF NOT EXISTS terms_accepted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS privacy_accepted_at TIMESTAMP WITH TIME ZONE;

-- Adicionar campos de documentos em professionals
ALTER TABLE public.professionals
ADD COLUMN IF NOT EXISTS rg TEXT,
ADD COLUMN IF NOT EXISTS rg_issuer TEXT,
ADD COLUMN IF NOT EXISTS cnh_number TEXT,
ADD COLUMN IF NOT EXISTS cnh_category TEXT,
ADD COLUMN IF NOT EXISTS cnh_expiry DATE,
ADD COLUMN IF NOT EXISTS cnh_document_url TEXT,
ADD COLUMN IF NOT EXISTS criminal_record_url TEXT,
ADD COLUMN IF NOT EXISTS criminal_record_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS profile_document_url TEXT,
ADD COLUMN IF NOT EXISTS service_radius_km NUMERIC DEFAULT 10,
ADD COLUMN IF NOT EXISTS accepts_displacement BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS displacement_fee_per_km NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS neighborhoods_served TEXT[],
ADD COLUMN IF NOT EXISTS cities_served TEXT[];

-- =============================================
-- FASE 2: TABELA DE VEÍCULOS (EXPANDIDA)
-- =============================================

CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  plate TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  color TEXT NOT NULL,
  transmission TEXT NOT NULL CHECK (transmission IN ('manual', 'automatic')),
  has_ac BOOLEAN DEFAULT true,
  has_dual_controls BOOLEAN DEFAULT false,
  renavam TEXT,
  chassis TEXT,
  vehicle_document_url TEXT,
  insurance_company TEXT,
  insurance_policy_number TEXT,
  insurance_expiry DATE,
  inspection_url TEXT,
  inspection_expiry DATE,
  dpvat_paid BOOLEAN DEFAULT false,
  is_primary BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on vehicles
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

-- Vehicles RLS Policies
CREATE POLICY "Vehicles are viewable by everyone"
ON public.vehicles FOR SELECT
USING (true);

CREATE POLICY "Professionals can manage their vehicles"
ON public.vehicles FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.professionals
    WHERE professionals.id = vehicles.professional_id
    AND professionals.user_id = auth.uid()
  )
);

-- Trigger for updated_at on vehicles
CREATE TRIGGER update_vehicles_updated_at
BEFORE UPDATE ON public.vehicles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- FASE 3: CONTAS BANCÁRIAS / PIX
-- =============================================

CREATE TABLE IF NOT EXISTS public.professional_bank_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  bank_code TEXT NOT NULL,
  bank_name TEXT NOT NULL,
  agency TEXT NOT NULL,
  account_number TEXT NOT NULL,
  account_type TEXT NOT NULL CHECK (account_type IN ('checking', 'savings', 'payment')),
  holder_name TEXT NOT NULL,
  holder_cpf TEXT NOT NULL,
  pix_key_type TEXT CHECK (pix_key_type IN ('cpf', 'email', 'phone', 'random')),
  pix_key TEXT,
  proof_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_primary BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on bank accounts
ALTER TABLE public.professional_bank_accounts ENABLE ROW LEVEL SECURITY;

-- Bank accounts RLS Policies (only owner can see/manage)
CREATE POLICY "Professionals can view their own bank accounts"
ON public.professional_bank_accounts FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.professionals
    WHERE professionals.id = professional_bank_accounts.professional_id
    AND professionals.user_id = auth.uid()
  )
);

CREATE POLICY "Professionals can manage their bank accounts"
ON public.professional_bank_accounts FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.professionals
    WHERE professionals.id = professional_bank_accounts.professional_id
    AND professionals.user_id = auth.uid()
  )
);

-- Trigger for updated_at on bank accounts
CREATE TRIGGER update_bank_accounts_updated_at
BEFORE UPDATE ON public.professional_bank_accounts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- FASE 4: AUDITORIA E HISTÓRICO
-- =============================================

-- Audit logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on audit logs (admins only)
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Audit logs RLS - only admins can view
CREATE POLICY "Only admins can view audit logs"
ON public.audit_logs FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert audit logs"
ON public.audit_logs FOR INSERT
WITH CHECK (true);

-- Verification history table
CREATE TABLE IF NOT EXISTS public.verification_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  verification_type TEXT NOT NULL CHECK (verification_type IN ('identity', 'cnh', 'criminal_record', 'vehicle', 'address', 'bank_account')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
  verified_by UUID,
  verification_date TIMESTAMP WITH TIME ZONE,
  expiry_date TIMESTAMP WITH TIME ZONE,
  document_url TEXT,
  notes TEXT,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on verification history
ALTER TABLE public.verification_history ENABLE ROW LEVEL SECURITY;

-- Verification history RLS
CREATE POLICY "Professionals can view their verification history"
ON public.verification_history FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.professionals
    WHERE professionals.id = verification_history.professional_id
    AND professionals.user_id = auth.uid()
  )
  OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Only admins can manage verification history"
ON public.verification_history FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at on verification history
CREATE TRIGGER update_verification_history_updated_at
BEFORE UPDATE ON public.verification_history
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- FASE 5: STORAGE BUCKETS
-- =============================================

-- Create storage bucket for professional documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'professional-documents',
  'professional-documents',
  false,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for vehicle documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'vehicle-documents',
  'vehicle-documents',
  false,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for profile photos (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  2097152, -- 2MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for professional-documents (private)
CREATE POLICY "Users can upload their own professional documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'professional-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own professional documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'professional-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own professional documents"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'professional-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own professional documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'professional-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Storage policies for vehicle-documents (private)
CREATE POLICY "Users can upload their own vehicle documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'vehicle-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own vehicle documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'vehicle-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own vehicle documents"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'vehicle-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own vehicle documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'vehicle-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Storage policies for avatars (public read, private write)
CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);