
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), NEW.email);
  
  -- Grant inactive access to all active apps
  INSERT INTO public.user_app_access (user_id, app_key, access_status)
  SELECT NEW.id, app_key, 'inactive' FROM public.platform_apps WHERE app_status = 'active';
  
  -- Auto-grant 7-day free trial for the full ecosystem
  INSERT INTO public.free_trials (user_id, trial_type, duration_days, started_at, expires_at, status)
  VALUES (
    NEW.id,
    'all_apps',
    7,
    now(),
    now() + interval '7 days',
    'active'
  );
  
  RETURN NEW;
END;
$function$;
