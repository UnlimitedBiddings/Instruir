-- Corrigir política permissiva de audit_logs
-- Remover política antiga e criar uma mais restritiva

DROP POLICY IF EXISTS "System can insert audit logs" ON public.audit_logs;

-- Criar política que permite inserção apenas para usuários autenticados ou service role
CREATE POLICY "Authenticated users can insert audit logs"
ON public.audit_logs FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL OR auth.role() = 'service_role');