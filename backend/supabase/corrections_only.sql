-- ============================================================
-- MINERVA ALCARAZ JOYERÍA
-- SQL Corrections — ONLY modifications for existing databases
-- ============================================================

-- 1. Update the user registration trigger function (avoids gen_random_bytes dependency)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, circle_code)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    upper(substring(md5(random()::text), 1, 8))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- 2. Alter column defaults to use schema-safe random generators
ALTER TABLE public.albums 
  ALTER COLUMN share_token SET DEFAULT substring(md5(random()::text) || md5(random()::text), 1, 24);

ALTER TABLE public.circle_reward_redemptions 
  ALTER COLUMN redemption_code SET DEFAULT upper(substring(md5(random()::text), 1, 12));

ALTER TABLE public.customization_requests 
  ALTER COLUMN request_number SET DEFAULT 'ATL-' || upper(substring(md5(random()::text), 1, 8));

ALTER TABLE public.newsletter_subscriptions 
  ALTER COLUMN confirmation_token SET DEFAULT md5(random()::text) || md5(random()::text);
