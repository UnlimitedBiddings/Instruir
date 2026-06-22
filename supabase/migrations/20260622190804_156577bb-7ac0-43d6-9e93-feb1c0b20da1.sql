
-- ============================================================
-- PROFILES: restrict overly-permissive SELECT
-- ============================================================
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view profiles of session counterparties"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.sessions s
      WHERE (s.student_id = auth.uid() AND s.professional_id = profiles.user_id)
         OR (s.professional_id = auth.uid() AND s.student_id = profiles.user_id)
    )
  );

-- ============================================================
-- PROFESSIONALS: restrict overly-permissive SELECT
-- ============================================================
DROP POLICY IF EXISTS "Professionals are viewable by everyone" ON public.professionals;

CREATE POLICY "Professionals can view own record"
  ON public.professionals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all professionals"
  ON public.professionals FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Session counterparties can view professional"
  ON public.professionals FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.sessions s
      WHERE s.professional_id = professionals.user_id
        AND s.student_id = auth.uid()
    )
  );

-- ============================================================
-- PUBLIC PROFESSIONALS VIEW: safe marketplace fields only
-- (NO RG, CNH, criminal record, exact address, document urls)
-- ============================================================
DROP VIEW IF EXISTS public.public_professionals;

CREATE VIEW public.public_professionals
WITH (security_invoker = true) AS
SELECT
  p.id,
  p.user_id,
  p.category,
  p.bio,
  p.rating,
  p.review_count,
  p.price_per_hour,
  p.total_sessions,
  p.experience_years,
  p.provider_type,
  p.company_id,
  p.city,
  p.neighborhoods_served,
  p.cities_served,
  p.service_radius_km,
  p.accepts_displacement,
  p.displacement_fee_per_km,
  p.skills,
  p.specializations,
  p.vehicle_model,
  p.vehicle_year,
  p.vehicle_color,
  p.vehicle_transmission,
  p.vehicle_has_ac,
  p.vehicle_image_url,
  p.identity_verified,
  p.background_verified,
  p.credentials_verified,
  p.cnh_verified,
  p.criminal_record_verified,
  p.vehicle_inspection_verified,
  p.created_at,
  p.updated_at
FROM public.professionals p;

GRANT SELECT ON public.public_professionals TO anon, authenticated;

-- Allow the view's underlying selection to bypass the new restrictive
-- professionals RLS by reading via a security-definer wrapper function
-- for marketplace listings. We expose only safe fields.
CREATE OR REPLACE FUNCTION public.list_public_professionals()
RETURNS SETOF public.public_professionals
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM public.public_professionals;
$$;

GRANT EXECUTE ON FUNCTION public.list_public_professionals() TO anon, authenticated;

-- ============================================================
-- VERIFICATION_HISTORY: explicit anon block (defense in depth)
-- Existing professional/admin policies remain. Revoke anon grant.
-- ============================================================
REVOKE ALL ON public.verification_history FROM anon;
