
-- Add new columns to platform_apps
ALTER TABLE public.platform_apps 
  ADD COLUMN IF NOT EXISTS is_visible boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS app_category text NOT NULL DEFAULT 'produtividade',
  ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0;

-- Update existing apps with categories and featured status
UPDATE public.platform_apps SET app_category = 'saúde', is_featured = true, sort_order = 1 WHERE app_key = 'fitpulse';
UPDATE public.platform_apps SET app_category = 'finanças', is_featured = true, sort_order = 2 WHERE app_key = 'financeflow';
UPDATE public.platform_apps SET app_category = 'marketing', is_featured = true, sort_order = 3 WHERE app_key = 'marketflow';
UPDATE public.platform_apps SET app_category = 'automação', is_featured = false, sort_order = 4 WHERE app_key = 'whatsapp_auto';
UPDATE public.platform_apps SET app_category = 'agendamento', is_featured = false, sort_order = 5 WHERE app_key = 'ia_agenda';
