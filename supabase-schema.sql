-- ============================================
-- AEAB - Schéma Supabase
-- À exécuter dans l'éditeur SQL de Supabase
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE articles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT DEFAULT '',
  image_url TEXT,
  category TEXT,
  author TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','published')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  image_url TEXT,
  date DATE,
  time TEXT,
  location TEXT,
  maps_link TEXT,
  capacity INT,
  is_free BOOLEAN DEFAULT true,
  price NUMERIC(10,2),
  organizer TEXT,
  registration_link TEXT,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming','past')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE team_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  description TEXT,
  photo_url TEXT,
  email TEXT,
  order_index INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE partners (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  website TEXT,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE gallery_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  image_url TEXT NOT NULL,
  caption TEXT,
  album TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE memberships (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  city TEXT,
  institution TEXT,
  field TEXT,
  level TEXT,
  arrival_year TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE help_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  age INT,
  institution TEXT,
  field TEXT,
  situation TEXT,
  help_type TEXT,
  urgency TEXT DEFAULT 'medium' CHECK (urgency IN ('low','medium','high','critical')),
  description TEXT,
  attachment_url TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new','in_progress','resolved','closed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE contacts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE donations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  donor_name TEXT,
  donor_email TEXT,
  amount NUMERIC(10,2),
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','completed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE page_contents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  page_slug TEXT NOT NULL,
  section_key TEXT NOT NULL,
  content TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by TEXT,
  UNIQUE(page_slug, section_key)
);

CREATE TABLE site_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT DEFAULT ''
);

-- RLS
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE help_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "pub_read_articles" ON articles FOR SELECT USING (status = 'published');
CREATE POLICY "pub_read_events" ON events FOR SELECT USING (true);
CREATE POLICY "pub_read_team" ON team_members FOR SELECT USING (is_active = true);
CREATE POLICY "pub_read_partners" ON partners FOR SELECT USING (true);
CREATE POLICY "pub_read_gallery" ON gallery_items FOR SELECT USING (true);
CREATE POLICY "pub_read_pages" ON page_contents FOR SELECT USING (true);
CREATE POLICY "pub_read_settings" ON site_settings FOR SELECT USING (true);

-- Public insert (formulaires)
CREATE POLICY "pub_insert_memberships" ON memberships FOR INSERT WITH CHECK (true);
CREATE POLICY "pub_insert_help" ON help_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "pub_insert_contacts" ON contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "pub_insert_donations" ON donations FOR INSERT WITH CHECK (true);

-- Admin full access
CREATE POLICY "admin_articles" ON articles FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_events" ON events FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_team" ON team_members FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_partners" ON partners FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_gallery" ON gallery_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_memberships" ON memberships FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_help" ON help_requests FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_contacts" ON contacts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_donations" ON donations FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_pages" ON page_contents FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');
