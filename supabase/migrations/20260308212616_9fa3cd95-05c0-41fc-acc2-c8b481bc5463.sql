
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  theme_preference TEXT DEFAULT 'dark',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create platform_apps table
CREATE TABLE public.platform_apps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  app_key TEXT NOT NULL UNIQUE,
  app_name TEXT NOT NULL,
  app_description TEXT,
  app_status TEXT NOT NULL DEFAULT 'active',
  app_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.platform_apps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view apps" ON public.platform_apps FOR SELECT TO authenticated USING (true);

-- Create user_app_access table
CREATE TABLE public.user_app_access (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  app_key TEXT NOT NULL REFERENCES public.platform_apps(app_key) ON DELETE CASCADE,
  access_status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, app_key)
);

ALTER TABLE public.user_app_access ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own app access" ON public.user_app_access FOR SELECT USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), NEW.email);
  
  -- Grant access to all active apps
  INSERT INTO public.user_app_access (user_id, app_key, access_status)
  SELECT NEW.id, app_key, 'active' FROM public.platform_apps WHERE app_status = 'active';
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Seed platform apps
INSERT INTO public.platform_apps (app_key, app_name, app_description, app_status, app_url) VALUES
  ('fitpulse', 'FitPulse', 'Aplicativo fitness e acompanhamento físico', 'active', '/apps/fitpulse'),
  ('financeflow', 'FinanceFlow', 'Controle e planejamento financeiro', 'active', '/apps/financeflow'),
  ('marketflow', 'MarketFlow', 'Ferramentas de marketing digital', 'active', '/apps/marketflow'),
  ('whatsapp_auto', 'WhatsApp Auto', 'Automação para WhatsApp', 'coming_soon', NULL);
