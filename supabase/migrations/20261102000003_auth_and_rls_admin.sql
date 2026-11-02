-- ==============================================================================
-- PERSONAL PRAYER TRACKER — MIGRATION: AUTH, ROLE MANAGEMENT & ADMIN DATA CLAIM
-- ==============================================================================

-- 1. Add role column to profiles table if not exists
ALTER TABLE public.profiles 
    ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user'
    CHECK (role IN ('admin', 'user'));

-- 2. Create index on role for fast lookups
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- ==============================================================================
-- 3. FUNCTION TO CLAIM ADMIN LEGACY RECORDS SAFELY (NON-DESTRUCTIVE)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.claim_admin_legacy_records(admin_id UUID)
RETURNS VOID AS $$
BEGIN
    -- Pastikan seluruh data master pribadi Harits (1 & 2 November 2026) tersimpan permanen
    INSERT INTO public.prayer_records (
        user_id, prayer_date, prayer_name, status, completed_at, timing_category, congregation_type, rakaat, created_at, updated_at
    )
    VALUES
        -- 1 November 2026 (5 Fardhu Terlaksana 100%, 3 Sunnah Tidak Terlaksana)
        (admin_id, '2026-11-01', 'subuh', 'completed', '04:35', 'on_time', 'alone', 2, '2026-11-01 22:00:00+00', '2026-11-01 22:00:00+00'),
        (admin_id, '2026-11-01', 'zuhur', 'completed', '11:58', 'on_time', 'alone', 4, '2026-11-01 22:00:00+00', '2026-11-01 22:00:00+00'),
        (admin_id, '2026-11-01', 'asar', 'completed', '15:12', 'on_time', 'alone', 4, '2026-11-01 22:00:00+00', '2026-11-01 22:00:00+00'),
        (admin_id, '2026-11-01', 'magrib', 'completed', '18:03', 'on_time', 'alone', 3, '2026-11-01 22:00:00+00', '2026-11-01 22:00:00+00'),
        (admin_id, '2026-11-01', 'isya', 'completed', '19:14', 'on_time', 'alone', 4, '2026-11-01 22:00:00+00', '2026-11-01 22:00:00+00'),
        (admin_id, '2026-11-01', 'dhuha', 'not_completed', NULL, NULL, NULL, 0, '2026-11-01 22:00:00+00', '2026-11-01 22:00:00+00'),
        (admin_id, '2026-11-01', 'tahajud', 'not_completed', NULL, NULL, NULL, 0, '2026-11-01 22:00:00+00', '2026-11-01 22:00:00+00'),
        (admin_id, '2026-11-01', 'rawatib', 'not_completed', NULL, NULL, NULL, 0, '2026-11-01 22:00:00+00', '2026-11-01 22:00:00+00'),
        -- 2 November 2026 (Subuh Terlaksana)
        (admin_id, '2026-11-02', 'subuh', 'completed', '04:35', 'on_time', 'alone', 2, '2026-11-01 22:00:00+00', '2026-11-01 22:00:00+00')
    ON CONFLICT (user_id, prayer_date, prayer_name) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- 4. UPDATE AUTOMATIC PROFILE & ROLE TRIGGER ON SIGNUP
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    is_admin BOOLEAN := FALSE;
    assigned_role TEXT := 'user';
    assigned_name TEXT;
BEGIN
    -- Periksa apakah email pendaftar adalah pemilik utama / administrator
    IF LOWER(NEW.email) = 'haritsromadhon001@gmail.com' THEN
        is_admin := TRUE;
        assigned_role := 'admin';
        assigned_name := 'Harits Abdullah';
    ELSE
        assigned_name := COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1));
    END IF;

    -- 1. Buat profil dengan role yang sesuai
    INSERT INTO public.profiles (id, display_name, timezone, role)
    VALUES (
        NEW.id,
        assigned_name,
        COALESCE(NEW.raw_user_meta_data->>'timezone', 'Asia/Jakarta'),
        assigned_role
    )
    ON CONFLICT (id) DO UPDATE
    SET role = EXCLUDED.role,
        display_name = COALESCE(public.profiles.display_name, EXCLUDED.display_name);

    -- 2. Buat default user_settings
    INSERT INTO public.user_settings (user_id, location_name, calculation_method, asr_method)
    VALUES (NEW.id, 'Jakarta', 'KEMENAG', 'STANDARD')
    ON CONFLICT (user_id) DO NOTHING;

    -- 3. Buat default reminder_preferences untuk 5 sholat wajib
    INSERT INTO public.reminder_preferences (user_id, prayer_name, enabled, minutes_before)
    VALUES
        (NEW.id, 'subuh', true, 0),
        (NEW.id, 'zuhur', true, 0),
        (NEW.id, 'asar', true, 0),
        (NEW.id, 'magrib', true, 0),
        (NEW.id, 'isya', true, 0)
    ON CONFLICT (user_id, prayer_name) DO NOTHING;

    -- 4. Jika Administrator, tautkan data legacy sholat master
    IF is_admin THEN
        PERFORM public.claim_admin_legacy_records(NEW.id);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Pasang trigger ke auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 5. KLAIM RETROAKTIF (Jika akun admin sudah terdaftar sebelumnya di auth.users)
-- ==============================================================================
DO $$
DECLARE
    admin_user RECORD;
BEGIN
    FOR admin_user IN 
        SELECT id FROM auth.users WHERE LOWER(email) = 'haritsromadhon001@gmail.com'
    LOOP
        UPDATE public.profiles 
        SET role = 'admin', display_name = 'Harits Abdullah' 
        WHERE id = admin_user.id;
        
        PERFORM public.claim_admin_legacy_records(admin_user.id);
    END LOOP;
END $$;

-- ==============================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES — PERLINDUNGAN AKSES KETAT
-- ==============================================================================

-- Aktifkan RLS di semua tabel
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayer_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminder_preferences ENABLE ROW LEVEL SECURITY;

-- Reset policies untuk profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

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

-- Reset policies untuk prayer_records
DROP POLICY IF EXISTS "Users can view their own prayer records" ON public.prayer_records;
DROP POLICY IF EXISTS "Users can insert their own prayer records" ON public.prayer_records;
DROP POLICY IF EXISTS "Users can update their own prayer records" ON public.prayer_records;
DROP POLICY IF EXISTS "Users can delete their own prayer records" ON public.prayer_records;

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

-- Reset policies untuk user_settings
DROP POLICY IF EXISTS "Users can view their own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can insert their own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can update their own settings" ON public.user_settings;

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

-- Reset policies untuk reminder_preferences
DROP POLICY IF EXISTS "Users can view their own reminder preferences" ON public.reminder_preferences;
DROP POLICY IF EXISTS "Users can insert their own reminder preferences" ON public.reminder_preferences;
DROP POLICY IF EXISTS "Users can update their own reminder preferences" ON public.reminder_preferences;

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

