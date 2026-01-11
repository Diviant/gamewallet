-- SQL script to set up GameVault database in Supabase

-- Create profiles table
CREATE TABLE profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT,
  avatar_url TEXT,
  tokens INTEGER DEFAULT 100,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  referral_code TEXT,
  referred_by TEXT,
  reviewed_server_ids TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create servers table
CREATE TABLE servers (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  ip TEXT NOT NULL,
  port INTEGER,
  game_id TEXT NOT NULL,
  version TEXT,
  max_players INTEGER,
  current_players INTEGER,
  status TEXT DEFAULT 'approved',
  icon_url TEXT,
  images TEXT[],
  tags TEXT[],
  featured BOOLEAN DEFAULT FALSE,
  added_by_id TEXT,
  views INTEGER DEFAULT 0,
  days_online INTEGER DEFAULT 0,
  total_invested INTEGER DEFAULT 0,
  investment_tier INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create investments table
CREATE TABLE investments (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT REFERENCES profiles(id),
  server_id TEXT REFERENCES servers(id),
  server_title TEXT,
  amount INTEGER NOT NULL,
  roi INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial admin user
INSERT INTO profiles (id, name, username, avatar_url, tokens, xp, level, referral_code, referred_by, reviewed_server_ids, created_at)
VALUES ('u1', 'Vault Admin', NULL, 'https://picsum.photos/seed/admin/200', 1000, 0, 1, 'VAULT-ADMIN', NULL, '{}', '2024-01-01T00:00:00Z');

-- Insert initial servers
INSERT INTO servers (id, title, description, short_description, ip, game_id, version, max_players, current_players, status, icon_url, images, tags, featured, added_by_id, views, days_online, total_invested, investment_tier, created_at, updated_at)
VALUES
('l2-1', 'Asterios x5', 'Добро пожаловать на Asterios x5. Лучший проект в своей нише. Стабильный онлайн, уникальные системы и адекватная администрация. Постоянные ивенты, отзывчивая поддержка и сбалансированная экономика ждут вас!', 'High Five | asterios.tm', 'asterios.tm', 'g1', 'High Five', 9000, 6800, 'approved', 'https://api.dicebear.com/7.x/identicon/svg?seed=l2-1', ARRAY['https://picsum.photos/seed/l2-1/800/600'], ARRAY['t5', 't6'], TRUE, 'u1', 1234, 45, 0, 3, NOW(), NOW()),
('l2-2', 'Scryde x100', 'Добро пожаловать на Scryde x100. Лучший проект в своей нише. Стабильный онлайн, уникальные системы и адекватная администрация. Постоянные ивенты, отзывчивая поддержка и сбалансированная экономика ждут вас!', 'High Five | scryde.net', 'scryde.net', 'g1', 'High Five', 7700, 5760, 'approved', 'https://api.dicebear.com/7.x/identicon/svg?seed=l2-2', ARRAY['https://picsum.photos/seed/l2-2/800/600'], ARRAY['t1'], TRUE, 'u1', 2345, 67, 0, 4, NOW(), NOW()),
('mc-1', 'Hypixel', 'Добро пожаловать на Hypixel. Лучший проект в своей нише. Стабильный онлайн, уникальные системы и адекватная администрация. Постоянные ивенты, отзывчивая поддержка и сбалансированная экономика ждут вас!', '1.20.x | mc.hypixel.net', 'mc.hypixel.net', 'g5', '1.20.x', 45500, 36000, 'approved', 'https://api.dicebear.com/7.x/identicon/svg?seed=mc-1', ARRAY['https://picsum.photos/seed/mc-1/800/600'], ARRAY['t5', 't3'], TRUE, 'u1', 3456, 89, 0, 5, NOW(), NOW()),
('cs-1', 'Cybershoke DM', 'Добро пожаловать на Cybershoke DM. Лучший проект в своей нише. Стабильный онлайн, уникальные системы и адекватная администрация. Постоянные ивенты, отзывчивая поддержка и сбалансированная экономика ждут вас!', 'Latest | cs2.cybershoke.net', 'cs2.cybershoke.net', 'g6', 'Latest', 12500, 9600, 'approved', 'https://api.dicebear.com/7.x/identicon/svg?seed=cs-1', ARRAY['https://picsum.photos/seed/cs-1/800/600'], ARRAY['t1'], TRUE, 'u1', 4567, 23, 0, 2, NOW(), NOW()),
('wow-1', 'Warmane', 'Добро пожаловать на Warmane. Лучший проект в своей нише. Стабильный онлайн, уникальные системы и адекватная администрация. Постоянные ивенты, отзывчивая поддержка и сбалансированная экономика ждут вас!', '3.3.5a | warmane.com', 'warmane.com', 'g7', '3.3.5a', 15500, 12000, 'approved', 'https://api.dicebear.com/7.x/identicon/svg?seed=wow-1', ARRAY['https://picsum.photos/seed/wow-1/800/600'], ARRAY['t6', 't2'], TRUE, 'u1', 5678, 12, 0, 1, NOW(), NOW()),
('rust-1', 'Rustafied Main', 'Добро пожаловать на Rustafied Main. Лучший проект в своей нише. Стабильный онлайн, уникальные системы и адекватная администрация. Постоянные ивенты, отзывчивая поддержка и сбалансированная экономика ждут вас!', 'Latest | rustafied.com', 'rustafied.com', 'g8', 'Latest', 900, 320, 'approved', 'https://api.dicebear.com/7.x/identicon/svg?seed=rust-1', ARRAY['https://picsum.photos/seed/rust-1/800/600'], ARRAY['t1', 't3'], TRUE, 'u1', 6789, 78, 0, 4, NOW(), NOW()),
('gta-1', 'Majestic #1', 'Добро пожаловать на Majestic #1. Лучший проект в своей нише. Стабильный онлайн, уникальные системы и адекватная администрация. Постоянные ивенты, отзывчивая поддержка и сбалансированная экономика ждут вас!', 'GTA 5 | majestic-rp.ru', 'majestic-rp.ru', 'g2', 'GTA 5', 5000, 3600, 'approved', 'https://api.dicebear.com/7.x/identicon/svg?seed=gta-1', ARRAY['https://picsum.photos/seed/gta-1/800/600'], ARRAY['t4'], TRUE, 'u1', 7890, 34, 0, 3, NOW(), NOW()),
('ark-1', 'SmallTribes #2', 'Добро пожаловать на SmallTribes #2. Лучший проект в своей нише. Стабильный онлайн, уникальные системы и адекватная администрация. Постоянные ивенты, отзывчивая поддержка и сбалансированная экономика ждут вас!', 'Survival Evolved | ark-official.com', 'ark-official.com', 'g9', 'Survival Evolved', 570, 56, 'approved', 'https://api.dicebear.com/7.x/identicon/svg?seed=ark-1', ARRAY['https://picsum.photos/seed/ark-1/800/600'], ARRAY['t3'], FALSE, 'u1', 890, 56, 0, 2, NOW(), NOW()),
('dayz-1', 'Stalker RP', 'Добро пожаловать на Stalker RP. Лучший проект в своей нише. Стабильный онлайн, уникальные системы и адекватная администрация. Постоянные ивенты, отзывчивая поддержка и сбалансированная экономика ждут вас!', '1.24 | dayz-stalker.ru', 'dayz-stalker.ru', 'g10', '1.24', 560, 48, 'approved', 'https://api.dicebear.com/7.x/identicon/svg?seed=dayz-1', ARRAY['https://picsum.photos/seed/dayz-1/800/600'], ARRAY['t4', 't3'], FALSE, 'u1', 901, 78, 0, 1, NOW(), NOW());

-- Enable Row Level Security (optional, for security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE servers ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all for simplicity, adjust as needed)
CREATE POLICY "Allow all operations on profiles" ON profiles FOR ALL USING (true);
CREATE POLICY "Allow all operations on servers" ON servers FOR ALL USING (true);
CREATE POLICY "Allow all operations on investments" ON investments FOR ALL USING (true);