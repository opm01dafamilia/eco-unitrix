
-- Create avatars storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Storage policies for avatars
CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Anyone can view avatars"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'avatars');

-- Subscription plans table
CREATE TABLE public.subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_name text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view plans"
  ON public.subscription_plans FOR SELECT TO authenticated
  USING (true);

-- User subscriptions table
CREATE TABLE public.user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  plan_id uuid NOT NULL REFERENCES public.subscription_plans(id),
  status text NOT NULL DEFAULT 'active',
  started_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscriptions"
  ON public.user_subscriptions FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Insert default plan
INSERT INTO public.subscription_plans (plan_name, description, status)
VALUES ('Gratuito', 'Plano gratuito com acesso básico a todos os aplicativos da plataforma.', 'active');

-- Assign default plan to existing users
INSERT INTO public.user_subscriptions (user_id, plan_id, status)
SELECT p.user_id, sp.id, 'active'
FROM public.profiles p
CROSS JOIN public.subscription_plans sp
WHERE sp.plan_name = 'Gratuito'
ON CONFLICT DO NOTHING;

-- Update handle_new_user to also assign default plan
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), NEW.email);
  
  INSERT INTO public.user_app_access (user_id, app_key, access_status)
  SELECT NEW.id, app_key, 'active' FROM public.platform_apps WHERE app_status = 'active';
  
  INSERT INTO public.user_subscriptions (user_id, plan_id, status)
  SELECT NEW.id, id, 'active' FROM public.subscription_plans WHERE plan_name = 'Gratuito' LIMIT 1;
  
  RETURN NEW;
END;
$$;
