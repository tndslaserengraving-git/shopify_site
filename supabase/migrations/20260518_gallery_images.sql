-- Gallery images table for admin-managed portfolio photos
CREATE TABLE IF NOT EXISTS gallery_images (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_path TEXT       NOT NULL,
  public_url  TEXT        NOT NULL,
  alt_text    TEXT        NOT NULL DEFAULT '',
  caption     TEXT,
  sort_order  INTEGER     NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Public read access (gallery is visible to everyone)
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_gallery" ON gallery_images
  FOR SELECT USING (true);

-- Storage bucket for gallery images (run in Supabase dashboard if needed)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true)
-- ON CONFLICT (id) DO NOTHING;
