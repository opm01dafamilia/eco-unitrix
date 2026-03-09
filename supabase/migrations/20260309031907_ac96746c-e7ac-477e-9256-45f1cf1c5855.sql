
-- Drop existing foreign keys and data to restructure
ALTER TABLE public.user_subscriptions DROP CONSTRAINT IF EXISTS user_subscriptions_plan_id_fkey;

-- Restructure subscription_plans table
ALTER TABLE public.subscription_plans 
  ADD COLUMN IF NOT EXISTS app_key text,
  ADD COLUMN IF NOT EXISTS billing_type text NOT NULL DEFAULT 'monthly',
  ADD COLUMN IF NOT EXISTS price_description text,
  ADD COLUMN IF NOT EXISTS kiwify_url text;

-- Remove old data
DELETE FROM public.user_subscriptions;
DELETE FROM public.subscription_plans;

-- Insert all plans
INSERT INTO public.subscription_plans (plan_name, app_key, billing_type, price_description, kiwify_url, status) VALUES
  ('FitPulse Mensal', 'fitpulse', 'monthly', 'Mensal', 'https://pay.kiwify.com.br/FmfsAjF', 'active'),
  ('FitPulse Anual', 'fitpulse', 'yearly', 'Anual', 'https://pay.kiwify.com.br/bEjpIv5', 'active'),
  ('FinanceFlow Mensal', 'financeflow', 'monthly', 'Mensal', 'https://pay.kiwify.com.br/3LAJoOX', 'active'),
  ('FinanceFlow Anual', 'financeflow', 'yearly', 'Anual', 'https://pay.kiwify.com.br/3ceiT9i', 'active'),
  ('MarketFlow Mensal', 'marketflow', 'monthly', 'Mensal', 'https://pay.kiwify.com.br/4AJ8xh5', 'active'),
  ('MarketFlow Anual', 'marketflow', 'yearly', 'Anual', 'https://pay.kiwify.com.br/h3YRnEk', 'active'),
  ('WhatsApp Auto Mensal', 'whatsapp_auto', 'monthly', 'Mensal', 'https://pay.kiwify.com.br/cyARoBC', 'active'),
  ('WhatsApp Auto Anual', 'whatsapp_auto', 'yearly', 'Anual', 'https://pay.kiwify.com.br/6ETkfqd', 'active'),
  ('IA Agenda Mensal', 'ia_agenda', 'monthly', 'Mensal', 'https://pay.kiwify.com.br/inANOs8', 'active'),
  ('IA Agenda Anual', 'ia_agenda', 'yearly', 'Anual', 'https://pay.kiwify.com.br/QEJsYBO', 'active');

-- Add app_key and subscription_status to user_subscriptions
ALTER TABLE public.user_subscriptions 
  ADD COLUMN IF NOT EXISTS app_key text,
  ADD COLUMN IF NOT EXISTS subscription_status text NOT NULL DEFAULT 'active';

-- Re-add foreign key
ALTER TABLE public.user_subscriptions 
  ADD CONSTRAINT user_subscriptions_plan_id_fkey 
  FOREIGN KEY (plan_id) REFERENCES public.subscription_plans(id);

-- Update handle_new_user to not auto-create subscription (no more free plan)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), NEW.email);
  
  INSERT INTO public.user_app_access (user_id, app_key, access_status)
  SELECT NEW.id, app_key, 'inactive' FROM public.platform_apps WHERE app_status = 'active';
  
  RETURN NEW;
END;
$function$;

-- Allow authenticated users to insert their own subscriptions  
CREATE POLICY "Users can insert own subscriptions" ON public.user_subscriptions
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to update their own subscriptions
CREATE POLICY "Users can update own subscriptions" ON public.user_subscriptions
FOR UPDATE TO authenticated
USING (auth.uid() = user_id);
