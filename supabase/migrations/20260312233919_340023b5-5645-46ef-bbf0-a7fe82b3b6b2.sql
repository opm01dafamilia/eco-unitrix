
CREATE TABLE public.sso_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text NOT NULL UNIQUE,
  user_id uuid NOT NULL,
  user_email text,
  app_key text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  used boolean NOT NULL DEFAULT false,
  used_at timestamptz
);

ALTER TABLE public.sso_tokens ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_sso_tokens_token ON public.sso_tokens(token);
CREATE INDEX idx_sso_tokens_expires ON public.sso_tokens(expires_at);

-- Users can insert their own tokens
CREATE POLICY "Users can create own sso tokens" ON public.sso_tokens
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Admins can view all
CREATE POLICY "Admins can view sso tokens" ON public.sso_tokens
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Cleanup function for expired tokens
CREATE OR REPLACE FUNCTION public.cleanup_expired_sso_tokens()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM public.sso_tokens WHERE expires_at < now() - interval '1 hour';
$$;
