-- ============================================================
-- Migration: Create all missing application tables
-- Run this in Supabase SQL Editor
-- ============================================================

-- ── 1. appointments ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    procedure TEXT NOT NULL,
    preferred_date DATE,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS appointments_status_idx  ON appointments (status);
CREATE INDEX IF NOT EXISTS appointments_created_idx ON appointments (created_at DESC);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Appointments are viewable by admins" ON appointments;
CREATE POLICY "Appointments are viewable by admins"
    ON appointments FOR SELECT
    USING (auth.uid() = '4181663c-4b85-4c6b-93ca-2524a0cec5d6');

DROP POLICY IF EXISTS "Appointments can be inserted by anyone" ON appointments;
CREATE POLICY "Appointments can be inserted by anyone"
    ON appointments FOR INSERT
    WITH CHECK (true);  -- public contact form submits appointments

DROP POLICY IF EXISTS "Appointments can be updated by admins" ON appointments;
CREATE POLICY "Appointments can be updated by admins"
    ON appointments FOR UPDATE
    USING (auth.uid() = '4181663c-4b85-4c6b-93ca-2524a0cec5d6');

DROP POLICY IF EXISTS "Appointments can be deleted by admins" ON appointments;
CREATE POLICY "Appointments can be deleted by admins"
    ON appointments FOR DELETE
    USING (auth.uid() = '4181663c-4b85-4c6b-93ca-2524a0cec5d6');

-- ── 2. blog_posts ────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT,
    image_url TEXT,
    status TEXT NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS blog_posts_slug_idx    ON blog_posts (slug);
CREATE INDEX IF NOT EXISTS blog_posts_status_idx  ON blog_posts (status);
CREATE INDEX IF NOT EXISTS blog_posts_created_idx ON blog_posts (created_at DESC);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Published blog posts are viewable by everyone" ON blog_posts;
CREATE POLICY "Published blog posts are viewable by everyone"
    ON blog_posts FOR SELECT
    USING (status = 'published' OR auth.uid() = '4181663c-4b85-4c6b-93ca-2524a0cec5d6');

DROP POLICY IF EXISTS "Blog posts can be inserted by admins" ON blog_posts;
CREATE POLICY "Blog posts can be inserted by admins"
    ON blog_posts FOR INSERT
    WITH CHECK (auth.uid() = '4181663c-4b85-4c6b-93ca-2524a0cec5d6');

DROP POLICY IF EXISTS "Blog posts can be updated by admins" ON blog_posts;
CREATE POLICY "Blog posts can be updated by admins"
    ON blog_posts FOR UPDATE
    USING (auth.uid() = '4181663c-4b85-4c6b-93ca-2524a0cec5d6');

DROP POLICY IF EXISTS "Blog posts can be deleted by admins" ON blog_posts;
CREATE POLICY "Blog posts can be deleted by admins"
    ON blog_posts FOR DELETE
    USING (auth.uid() = '4181663c-4b85-4c6b-93ca-2524a0cec5d6');

-- ── 3. gallery_images ────────────────────────────────────────

CREATE TABLE IF NOT EXISTS gallery_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT,
    image_url TEXT NOT NULL,
    category TEXT,
    before_after BOOLEAN NOT NULL DEFAULT false,
    display_order INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS gallery_images_category_idx ON gallery_images (category);
CREATE INDEX IF NOT EXISTS gallery_images_order_idx    ON gallery_images (display_order);
CREATE INDEX IF NOT EXISTS gallery_images_created_idx  ON gallery_images (created_at DESC);

ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Gallery images are viewable by everyone" ON gallery_images;
CREATE POLICY "Gallery images are viewable by everyone"
    ON gallery_images FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Gallery images can be inserted by admins" ON gallery_images;
CREATE POLICY "Gallery images can be inserted by admins"
    ON gallery_images FOR INSERT
    WITH CHECK (auth.uid() = '4181663c-4b85-4c6b-93ca-2524a0cec5d6');

DROP POLICY IF EXISTS "Gallery images can be updated by admins" ON gallery_images;
CREATE POLICY "Gallery images can be updated by admins"
    ON gallery_images FOR UPDATE
    USING (auth.uid() = '4181663c-4b85-4c6b-93ca-2524a0cec5d6');

DROP POLICY IF EXISTS "Gallery images can be deleted by admins" ON gallery_images;
CREATE POLICY "Gallery images can be deleted by admins"
    ON gallery_images FOR DELETE
    USING (auth.uid() = '4181663c-4b85-4c6b-93ca-2524a0cec5d6');

-- ── Storage bucket for gallery uploads ───────────────────────
-- Run this separately in Supabase Dashboard > Storage if needed:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true)
-- ON CONFLICT (id) DO NOTHING;
