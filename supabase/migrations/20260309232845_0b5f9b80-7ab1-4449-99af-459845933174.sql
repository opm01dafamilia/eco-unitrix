
-- Free trials table
CREATE TABLE public.free_trials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  app_key text, -- null means all apps
  trial_type text NOT NULL DEFAULT 'all_apps', -- 'single_app' or 'all_apps'
  duration_days integer NOT NULL DEFAULT 7,
  started_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'active',
  granted_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.free_trials ENABLE ROW LEVEL SECURITY;

-- Users can view their own trials
CREATE POLICY "Users can view own trials" ON public.free_trials
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Admins can do everything
CREATE POLICY "Admins can manage trials" ON public.free_trials
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Lifetime access table
CREATE TABLE public.lifetime_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  granted_at timestamptz NOT NULL DEFAULT now(),
  granted_by uuid,
  notes text
);

ALTER TABLE public.lifetime_access ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own lifetime access" ON public.lifetime_access
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage lifetime access" ON public.lifetime_access
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
