
-- Assign admin role to lp070087@gmail.com
INSERT INTO public.user_roles (user_id, role)
SELECT '906a540f-e70d-48f2-99d3-99d1f3376f09', 'admin'
ON CONFLICT (user_id, role) DO NOTHING;

-- Set WhatsApp Auto to inactive
UPDATE public.platform_apps SET app_status = 'inactive' WHERE app_key = 'whatsapp_auto';
