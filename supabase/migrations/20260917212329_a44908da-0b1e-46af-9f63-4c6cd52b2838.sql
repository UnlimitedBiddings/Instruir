-- 1. Public professionals showcase: definer view instead of definer function
ALTER VIEW public.public_professionals SET (security_invoker = false);
GRANT SELECT ON public.public_professionals TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.list_public_professionals()
RETURNS SETOF public.public_professionals
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT * FROM public.public_professionals;
$$;
GRANT EXECUTE ON FUNCTION public.list_public_professionals() TO anon, authenticated;

-- 2. Safe public view for companies (no cnpj / email / phone / owner_id)
CREATE OR REPLACE VIEW public.public_companies AS
  SELECT id, name, type, logo_url, description, address, city,
         rating, review_count, verified, latitude, longitude, created_at
  FROM public.companies;
ALTER VIEW public.public_companies SET (security_invoker = false);
GRANT SELECT ON public.public_companies TO anon, authenticated;

-- 3. Companies: full rows require sign-in
DROP POLICY IF EXISTS "Companies are viewable by everyone" ON public.companies;
CREATE POLICY "Signed-in users can view companies"
ON public.companies FOR SELECT TO authenticated USING (true);
REVOKE SELECT ON public.companies FROM anon;

-- 4. Availability: signed-in only
DROP POLICY IF EXISTS "Availability is viewable by everyone" ON public.availability;
CREATE POLICY "Signed-in users can view availability"
ON public.availability FOR SELECT TO authenticated USING (true);
REVOKE SELECT ON public.availability FROM anon;

-- 5. Reviews: signed-in only
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON public.reviews;
CREATE POLICY "Signed-in users can view reviews"
ON public.reviews FOR SELECT TO authenticated USING (true);
REVOKE SELECT ON public.reviews FROM anon;

-- 6. Vehicles: owner only (sensitive identifiers)
DROP POLICY IF EXISTS "Vehicles are viewable by everyone" ON public.vehicles;
REVOKE SELECT ON public.vehicles FROM anon;

-- 7. Inline the admin check in every policy, then retire the exposed helpers
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'));

DROP POLICY IF EXISTS "Admins can view all professionals" ON public.professionals;
CREATE POLICY "Admins can view all professionals"
ON public.professionals FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'));

DROP POLICY IF EXISTS "Only admins can view audit logs" ON public.audit_logs;
CREATE POLICY "Only admins can view audit logs"
ON public.audit_logs FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'));

DROP POLICY IF EXISTS "Professionals can view their verification history" ON public.verification_history;
CREATE POLICY "Professionals can view their verification history"
ON public.verification_history FOR SELECT TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.professionals p WHERE p.id = verification_history.professional_id AND p.user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin')
);

DROP POLICY IF EXISTS "Only admins can manage verification history" ON public.verification_history;
CREATE POLICY "Only admins can manage verification history"
ON public.verification_history FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'));

DROP FUNCTION IF EXISTS public.has_role(uuid, text);

REVOKE ALL ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO supabase_auth_admin;

-- Timestamp trigger helper does not need elevated rights
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;