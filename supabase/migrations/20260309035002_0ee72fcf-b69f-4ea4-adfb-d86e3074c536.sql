-- Add unique constraints for upsert operations in the webhook
ALTER TABLE public.user_subscriptions ADD CONSTRAINT user_subscriptions_user_plan_unique UNIQUE (user_id, plan_id);
ALTER TABLE public.user_app_access ADD CONSTRAINT user_app_access_user_app_unique UNIQUE (user_id, app_key);

-- Allow service role to insert/update user_app_access (RLS bypass via service role key is automatic)
-- Allow service role to insert/update user_subscriptions (RLS bypass via service role key is automatic)