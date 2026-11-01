-- ==============================================================================
-- PERSONAL PRAYER TRACKER — SUPABASE POSTGRESQL SCHEMA & RLS MIGRATION
-- ==============================================================================

-- 1. Enable pgcrypto / uuid generation extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. TABLE: profiles
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    timezone TEXT NOT NULL DEFAULT 'Asia/Jakarta',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 3. TABLE: user_settings
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.user_settings (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    location_name TEXT NOT NULL DEFAULT 'Jakarta',
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    calculation_method TEXT NOT NULL DEFAULT 'KEMENAG',
    asr_method TEXT NOT NULL DEFAULT 'STANDARD',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 4. TABLE: prayer_records
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.prayer_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    prayer_date DATE NOT NULL,
    prayer_name TEXT NOT NULL CHECK (prayer_name IN ('subuh', 'zuhur', 'asar', 'magrib', 'isya')),
    status TEXT NOT NULL CHECK (status IN ('completed', 'not_completed')),
    completed_at TIME,
    timing_category TEXT CHECK (timing_category IS NULL OR timing_category IN ('on_time', 'late')),
    congregation_type TEXT CHECK (congregation_type IS NULL OR congregation_type IN ('congregation', 'alone')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_prayer_date UNIQUE (user_id, prayer_date, prayer_name)
);

-- Index for speedy queries on user date range
CREATE INDEX IF NOT EXISTS idx_prayer_records_user_date 
    ON public.prayer_records (user_id, prayer_date DESC);

-- ==============================================================================
-- 5. TABLE: reminder_preferences
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.reminder_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    prayer_name TEXT NOT NULL CHECK (prayer_name IN ('subuh', 'zuhur', 'asar', 'magrib', 'isya')),
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    minutes_before INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_prayer_reminder UNIQUE (user_id, prayer_name)
);

-- ==============================================================================
-- 6. TABLE: prayer_schedule_cache
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.prayer_schedule_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_name TEXT NOT NULL,
    schedule_date DATE NOT NULL,
    timezone TEXT NOT NULL DEFAULT 'Asia/Jakarta',
    calculation_method TEXT NOT NULL,
    timings JSONB NOT NULL,
    source TEXT NOT NULL DEFAULT 'api',
    fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_schedule_cache UNIQUE (location_name, schedule_date, calculation_method)
);

-- ==============================================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all user data tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayer_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminder_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayer_schedule_cache ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view their own profile" 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
    ON public.profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id) 
    WITH CHECK (auth.uid() = id);

-- User Settings Policies
CREATE POLICY "Users can view their own settings" 
    ON public.user_settings FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings" 
    ON public.user_settings FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" 
    ON public.user_settings FOR UPDATE 
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own settings" 
    ON public.user_settings FOR DELETE 
    USING (auth.uid() = user_id);

-- Prayer Records Policies
CREATE POLICY "Users can view their own prayer records" 
    ON public.prayer_records FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own prayer records" 
    ON public.prayer_records FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own prayer records" 
    ON public.prayer_records FOR UPDATE 
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own prayer records" 
    ON public.prayer_records FOR DELETE 
    USING (auth.uid() = user_id);

-- Reminder Preferences Policies
CREATE POLICY "Users can view their own reminder preferences" 
    ON public.reminder_preferences FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reminder preferences" 
    ON public.reminder_preferences FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reminder preferences" 
    ON public.reminder_preferences FOR UPDATE 
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reminder preferences" 
    ON public.reminder_preferences FOR DELETE 
    USING (auth.uid() = user_id);

-- Prayer Schedule Cache Policies (publicly readable for authenticated users)
CREATE POLICY "Authenticated users can read cached prayer schedules" 
    ON public.prayer_schedule_cache FOR SELECT 
    TO authenticated 
    USING (true);

CREATE POLICY "Authenticated users can insert cached prayer schedules" 
    ON public.prayer_schedule_cache FOR INSERT 
    TO authenticated 
    WITH CHECK (true);

-- ==============================================================================
-- 8. AUTOMATIC PROFILE TRIGGER ON SIGNUP
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, display_name, timezone)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'timezone', 'Asia/Jakarta')
    );

    INSERT INTO public.user_settings (user_id, location_name, calculation_method)
    VALUES (
        NEW.id,
        'Jakarta',
        'KEMENAG'
    );

    -- Seed default reminder preferences for all 5 prayers
    INSERT INTO public.reminder_preferences (user_id, prayer_name, enabled, minutes_before)
    VALUES
        (NEW.id, 'subuh', true, 0),
        (NEW.id, 'zuhur', true, 0),
        (NEW.id, 'asar', true, 0),
        (NEW.id, 'magrib', true, 0),
        (NEW.id, 'isya', true, 0);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute on auth.users creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger for auto updating updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_modtime
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_settings_modtime
    BEFORE UPDATE ON public.user_settings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_records_modtime
    BEFORE UPDATE ON public.prayer_records
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reminders_modtime
    BEFORE UPDATE ON public.reminder_preferences
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
