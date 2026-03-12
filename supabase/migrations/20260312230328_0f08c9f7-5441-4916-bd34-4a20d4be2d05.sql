
-- Allow admins to view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to manage user_app_access
CREATE POLICY "Admins can manage user_app_access"
ON public.user_app_access FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to manage user_roles
CREATE POLICY "Admins can manage user_roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to view all subscriptions
CREATE POLICY "Admins can view all subscriptions"
ON public.user_subscriptions FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to manage all subscriptions
CREATE POLICY "Admins can manage all subscriptions"
ON public.user_subscriptions FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to insert app access
CREATE POLICY "Admins can insert user_app_access"
ON public.user_app_access FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to view all usage logs
CREATE POLICY "Admins can view all usage logs"
ON public.app_usage_logs FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));
