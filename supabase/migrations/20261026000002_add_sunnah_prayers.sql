-- ==============================================================================
-- PERSONAL PRAYER TRACKER — MIGRATION: ADD SUNNAH PRAYERS (RAWATIB, TAHAJUD, DHUHA)
-- ==============================================================================

-- 1. Update check constraint on prayer_records for prayer_name to include sunnah
ALTER TABLE public.prayer_records 
    DROP CONSTRAINT IF EXISTS prayer_records_prayer_name_check;

ALTER TABLE public.prayer_records
    ADD CONSTRAINT prayer_records_prayer_name_check 
    CHECK (prayer_name IN (
        -- Sholat Fardhu
        'subuh', 'zuhur', 'asar', 'magrib', 'isya',
        -- Sholat Sunnah
        'tahajud', 'dhuha', 'rawatib'
    ));

-- 2. Add optional column for rakaat count & sub_prayers details
ALTER TABLE public.prayer_records
    ADD COLUMN IF NOT EXISTS rakaat INTEGER,
    ADD COLUMN IF NOT EXISTS sub_prayers JSONB; -- e.g. for rawatib breakdown: ["qobliyah_subuh", "badiyah_magrib"]

-- 3. Update reminder_preferences check constraint
ALTER TABLE public.reminder_preferences
    DROP CONSTRAINT IF EXISTS reminder_preferences_prayer_name_check;

ALTER TABLE public.reminder_preferences
    ADD CONSTRAINT reminder_preferences_prayer_name_check
    CHECK (prayer_name IN (
        'subuh', 'zuhur', 'asar', 'magrib', 'isya',
        'tahajud', 'dhuha', 'rawatib'
    ));
