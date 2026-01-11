
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum ServerStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface Game {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface Transaction {
  id: string;
  type: 'FAVORITE_ADD' | 'FAVORITE_REMOVE' | 'REFERRAL' | 'BONUS' | 'SERVER_REVIEW' | 'PURCHASE' | 'INVESTMENT' | 'DIVIDEND' | 'WITHDRAWAL';
  amount: number;
  description: string;
  createdAt: string;
}

export interface Investment {
  id: string;
  userId: string;
  serverId: string;
  serverTitle: string;
  amount: number;
  roi: number; // Return on Investment percentage
  accumulatedDividends: number;
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  serverId: string;
  text: string;
  rating: number;
  createdAt: string;
}

export interface User {
  id: string;
  email?: string;
  telegramId?: string;
  username?: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  tokens: number;
  xp: number;
  level: number;
  referralCode: string;
  referredBy?: string;
  transactions: Transaction[];
  votedServerIds: string[];
  reviewedServerIds: string[];
  createdAt: string;
}

export interface Server {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  ip: string;
  port?: number;
  gameId: string;
  version: string;
  maxPlayers: number;
  currentPlayers: number;
  status: ServerStatus;
  iconUrl?: string;
  images: string[];
  tags: string[];
  discordUrl?: string;
  websiteUrl?: string;
  country?: string;
  featured: boolean;
  addedById: string;
  views: number;
  daysOnline: number;
  openedAt?: string;
  totalInvested: number;
  investmentTier: number; // 1-5, based on popularity/online
  createdAt: string;
  updatedAt: string;
}

export interface Favorite {
  id: string;
  userId: string;
  serverId: string;
}
