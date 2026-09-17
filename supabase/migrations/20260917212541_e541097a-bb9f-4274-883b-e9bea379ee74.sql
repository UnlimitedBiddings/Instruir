-- 1. Sensitive professional documents move to their own owner-only table
CREATE TABLE public.professional_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_id UUID NOT NULL UNIQUE REFERENCES public.professionals(id) ON DELETE CASCADE,
  rg TEXT,
  rg_issuer TEXT,
  cnh_number TEXT,
  cnh_category TEXT,
  cnh_expiry DATE,
  cnh_document_url TEXT,
  criminal_record_url TEXT,
  profile_document_url TEXT,
  cnpj TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.professional_documents TO authenticated;
GRANT ALL ON public.professional_documents TO service_role;

ALTER TABLE public.professional_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Professionals manage their own documents"
ON public.professional_documents FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.professionals p WHERE p.id = professional_documents.professional_id AND p.user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.professionals p WHERE p.id = professional_documents.professional_id AND p.user_id = auth.uid()));

CREATE POLICY "Admins can view professional documents"
ON public.professional_documents FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'));

CREATE TRIGGER update_professional_documents_updated_at
BEFORE UPDATE ON public.professional_documents
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. Copy existing data over
INSERT INTO public.professional_documents
  (professional_id, rg, rg_issuer, cnh_number, cnh_category, cnh_expiry,
   cnh_document_url, criminal_record_url, profile_document_url, cnpj)
SELECT id, rg, rg_issuer, cnh_number, cnh_category, cnh_expiry,
       cnh_document_url, criminal_record_url, profile_document_url, cnpj
FROM public.professionals
WHERE COALESCE(rg, rg_issuer, cnh_number, cnh_category, cnh_document_url,
               criminal_record_url, profile_document_url, cnpj) IS NOT NULL
   OR cnh_expiry IS NOT NULL;

-- 3. Remove the sensitive columns from the marketplace table
ALTER TABLE public.professionals
  DROP COLUMN rg,
  DROP COLUMN rg_issuer,
  DROP COLUMN cnh_number,
  DROP COLUMN cnh_category,
  DROP COLUMN cnh_expiry,
  DROP COLUMN cnh_document_url,
  DROP COLUMN criminal_record_url,
  DROP COLUMN profile_document_url,
  DROP COLUMN cnpj;

-- 4. Marketplace browsing no longer needs elevated views or functions
ALTER VIEW public.public_professionals SET (security_invoker = true);
ALTER VIEW public.public_companies SET (security_invoker = true);

CREATE POLICY "Signed-in users can browse professionals"
ON public.professionals FOR SELECT TO authenticated USING (true);