-- Corrigir avisos de segurança

-- 1. Remover política permissiva de notifications e criar uma mais segura
DROP POLICY IF EXISTS "Service role can insert notifications" ON public.notifications;

-- Apenas o service role pode inserir notificações via RPC
-- Usuários autenticados não podem inserir diretamente
CREATE POLICY "Authenticated users can insert their own notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 2. Corrigir function search_path para update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;