
-- Create app_usage_logs table
CREATE TABLE public.app_usage_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  app_key text NOT NULL,
  accessed_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.app_usage_logs ENABLE ROW LEVEL SECURITY;

-- Users can insert their own logs
CREATE POLICY "Users can insert their own usage logs"
  ON public.app_usage_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can view their own logs
CREATE POLICY "Users can view their own usage logs"
  ON public.app_usage_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
