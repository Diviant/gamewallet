
import { Game, Tag, Server, ServerStatus, UserRole, User } from './types';

export const INITIAL_GAMES: Game[] = [
  { id: 'all', name: 'Все игры', slug: 'top', icon: '✨' },
  { id: 'g1', name: 'Lineage 2', slug: 'lineage', icon: '⚔️' },
  { id: 'g2', name: 'GTA 5 / RP', slug: 'gta-5', icon: '🚗' },
  { id: 'g5', name: 'Minecraft', slug: 'minecraft', icon: '🧊' },
  { id: 'g6', name: 'CS 2', slug: 'cs2', icon: '🔫' },
  { id: 'g7', name: 'World of Warcraft', slug: 'wow', icon: '📜' },
  { id: 'g8', name: 'Rust', slug: 'rust', icon: '⚙️' },
  { id: 'g9', name: 'ARK: Survival', slug: 'ark', icon: '🦖' },
  { id: 'g10', name: 'DayZ', slug: 'dayz', icon: '🧟' },
  { id: 'g11', name: 'Valheim', slug: 'valheim', icon: '⛵' },
  { id: 'g12', name: 'Terraria', slug: 'terraria', icon: '🌳' },
  { id: 'g13', name: 'Garry\'s Mod', slug: 'gmod', icon: '🛠️' },
  { id: 'g14', name: 'Unturned', slug: 'unturned', icon: '🧟‍♂️' },
  { id: 'g15', name: 'Roblox', slug: 'roblox', icon: '🧱' },
  { id: 'g16', name: '7 Days to Die', slug: '7dtd', icon: '🏚️' },
];

export const INITIAL_TAGS: Tag[] = [
  { id: 't1', name: 'PvP' },
  { id: 't2', name: 'PvE' },
  { id: 't3', name: 'Survival' },
  { id: 't4', name: 'Roleplay' },
  { id: 't5', name: 'Craft' },
  { id: 't6', name: 'Classic' },
];

export const INITIAL_USERS: User[] = [
  {
    id: 'u1',
    email: 'admin@vault.com',
    name: 'Vault Admin',
    role: UserRole.ADMIN,
    avatarUrl: 'https://picsum.photos/seed/admin/200',
    tokens: 1000,
    // Add xp and level properties to satisfy User interface
    xp: 0,
    level: 1,
    referralCode: 'VAULT-ADMIN',
    transactions: [],
    votedServerIds: [],
    reviewedServerIds: [],
    createdAt: new Date('2024-01-01').toISOString()
  },
];

// Added missing totalInvested and investmentTier properties to satisfy Server interface
const generateServer = (id: string, gameId: string, title: string, version: string, ip: string, players: number, featured: boolean = false, tags: string[] = ['t4']): Server => ({
  id,
  title,
  shortDescription: `${version} | ${ip}`,
  description: `Добро пожаловать на ${title}. Лучший проект в своей нише. Стабильный онлайн, уникальные системы и адекватная администрация. Постоянные ивенты, отзывчивая поддержка и сбалансированная экономика ждут вас!`,
  ip,
  gameId,
  version,
  maxPlayers: players + 500,
  currentPlayers: Math.floor(players * 0.8), 
  status: ServerStatus.APPROVED,
  iconUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${id}`,
  images: [`https://picsum.photos/seed/${id}/800/600`],
  tags,
  featured,
  daysOnline: Math.floor(Math.random() * 100) + 1,
  addedById: 'u1',
  views: Math.floor(Math.random() * 5000),
  totalInvested: 0,
  investmentTier: Math.floor(Math.random() * 5) + 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

export const INITIAL_SERVERS: Server[] = [
  generateServer('l2-1', 'g1', 'Asterios x5', 'High Five', 'asterios.tm', 8500, true, ['t5', 't6']),
  generateServer('l2-2', 'g1', 'Scryde x100', 'High Five', 'scryde.net', 7200, true, ['t1']),
  generateServer('mc-1', 'g5', 'Hypixel', '1.20.x', 'mc.hypixel.net', 45000, true, ['t5', 't3']),
  generateServer('cs-1', 'g6', 'Cybershoke DM', 'Latest', 'cs2.cybershoke.net', 12000, true, ['t1']),
  generateServer('wow-1', 'g7', 'Warmane', '3.3.5a', 'warmane.com', 15000, true, ['t6', 't2']),
  generateServer('rust-1', 'g8', 'Rustafied Main', 'Latest', 'rustafied.com', 400, true, ['t1', 't3']),
  generateServer('gta-1', 'g2', 'Majestic #1', 'GTA 5', 'majestic-rp.ru', 4500, true, ['t4']),
  generateServer('ark-1', 'g9', 'SmallTribes #2', 'Survival Evolved', 'ark-official.com', 70, false, ['t3']),
  generateServer('dayz-1', 'g10', 'Stalker RP', '1.24', 'dayz-stalker.ru', 60, false, ['t4', 't3']),
];
