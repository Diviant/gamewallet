
import { Server, User, Game, Tag, Favorite, UserRole, Review, Investment, ServerStatus } from '../types';
import { INITIAL_GAMES, INITIAL_TAGS, INITIAL_SERVERS, INITIAL_USERS } from '../constants';
import { supabase } from './supabase';

const STORAGE_KEYS = {
  SERVERS: 'gv_v3_servers',
  USERS: 'gv_v3_users',
  GAMES: 'gv_v3_games',
  TAGS: 'gv_v3_tags',
  FAVORITES: 'gv_v3_favorites',
  CURRENT_USER: 'gv_v3_current_user',
  REVIEWS: 'gv_v3_reviews',
  INVESTMENTS: 'gv_v3_investments'
};

class DatabaseService {
  private listeners: Set<() => void> = new Set();

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
    window.dispatchEvent(new Event('gv_db_update'));
  }

  // --- INITIALIZATION ---
  
  init() {
    // Ensure initial data exists in localStorage
    if (!localStorage.getItem(STORAGE_KEYS.SERVERS)) {
      localStorage.setItem(STORAGE_KEYS.SERVERS, JSON.stringify(INITIAL_SERVERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.GAMES)) {
      localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(INITIAL_GAMES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TAGS)) {
      localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(INITIAL_TAGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    }

    // Attempt to sync with cloud in background
    this.fetchServers().catch(() => console.log("Operating in offline/cached mode"));
  }

  // --- SERVER OPERATIONS ---

  async fetchServers(): Promise<Server[]> {
    try {
      const { data, error } = await supabase
        .from('servers')
        .select('*')
        .order('current_players', { ascending: false });
      
      if (error || !data || data.length === 0) {
        return this.getServers();
      }
      
      const mapped = data.map(s => ({
        ...s,
        gameId: s.game_id,
        shortDescription: s.short_description,
        iconUrl: s.icon_url,
        maxPlayers: s.max_players,
        currentPlayers: s.current_players,
        daysOnline: s.days_online,
        totalInvested: s.total_invested,
        investmentTier: s.investment_tier,
        createdAt: s.created_at,
        updatedAt: s.updated_at
      }));

      localStorage.setItem(STORAGE_KEYS.SERVERS, JSON.stringify(mapped));
      this.notify();
      return mapped as Server[];
    } catch (e) {
      console.error("Supabase fetch failed, falling back to local storage");
      return this.getServers();
    }
  }

  getServers(): Server[] {
    const data = localStorage.getItem(STORAGE_KEYS.SERVERS);
    return data ? JSON.parse(data) : INITIAL_SERVERS;
  }

  async saveServer(server: Server) {
    const servers = this.getServers();
    const index = servers.findIndex(s => s.id === server.id);
    if (index > -1) servers[index] = server;
    else servers.push(server);
    
    localStorage.setItem(STORAGE_KEYS.SERVERS, JSON.stringify(servers));

    // Sync to Supabase
    try {
      await supabase.from('servers').upsert({
        id: server.id,
        title: server.title,
        description: server.description,
        short_description: server.shortDescription,
        ip: server.ip,
        port: server.port,
        game_id: server.gameId,
        version: server.version,
        max_players: server.maxPlayers,
        current_players: server.currentPlayers,
        status: server.status,
        icon_url: server.iconUrl,
        images: server.images,
        tags: server.tags,
        featured: server.featured,
        added_by_id: server.addedById,
        views: server.views,
        days_online: server.daysOnline,
        total_invested: server.totalInvested,
        investment_tier: server.investmentTier
      });
    } catch (e) {
      console.warn("Cloud save failed, data saved locally");
    }

    this.notify();
  }

  async deleteServer(id: string) {
    const servers = this.getServers().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SERVERS, JSON.stringify(servers));
    
    try {
      await supabase.from('servers').delete().eq('id', id);
    } catch (e) {}

    this.notify();
  }

  // --- USER OPERATIONS ---

  getCurrentUser(): User | null {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  }

  setCurrentUser(user: User | null): void {
    if (user) localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    this.notify();
  }

  getUsers(): User[] {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : INITIAL_USERS;
  }

  registerUser(email: string, name: string, referralCode?: string): User {
    const users = this.getUsers();
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      role: UserRole.USER,
      tokens: 100 + (referralCode ? 50 : 0),
      xp: 0,
      level: 1,
      referralCode: `REF-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      transactions: [],
      votedServerIds: [],
      reviewedServerIds: [],
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    this.notify();
    return newUser;
  }

  async authTelegramUser(tgUser: any, referralCode?: string): Promise<User> {
    const userId = tgUser.id.toString();
    
    // 1. Try cloud lookup
    try {
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (profile) {
        const user = {
          ...profile,
          avatarUrl: profile.avatar_url,
          role: profile.role as UserRole,
          transactions: [],
          votedServerIds: [],
          reviewedServerIds: profile.reviewed_server_ids || []
        } as User;
        this.setCurrentUser(user);
        return user;
      }
    } catch (e) {}

    // 2. If not in cloud, create new profile
    const newUser: User = {
      id: userId,
      name: tgUser.name || tgUser.first_name || 'Player',
      username: tgUser.username,
      avatarUrl: tgUser.photo_url,
      role: UserRole.USER,
      tokens: 100 + (referralCode ? 50 : 0),
      xp: 0,
      level: 1,
      referralCode: `TG-${userId}`,
      transactions: [],
      votedServerIds: [],
      reviewedServerIds: [],
      createdAt: new Date().toISOString()
    };

    // 3. Sync new profile to cloud
    try {
      await supabase.from('profiles').upsert({
        id: newUser.id,
        name: newUser.name,
        username: newUser.username,
        avatar_url: newUser.avatarUrl,
        tokens: newUser.tokens,
        xp: newUser.xp,
        level: newUser.level,
        referral_code: newUser.referralCode
      });
    } catch (e) {}
    
    this.setCurrentUser(newUser);
    return newUser;
  }

  // --- ECONOMY & INTERACTION ---

  async investInServer(userId: string, serverId: string, amount: number): Promise<{ success: boolean; error?: string }> {
    const user = this.getCurrentUser();
    if (!user || user.tokens < amount) return { success: false, error: 'Недостаточно VT' };

    const server = this.getServers().find(s => s.id === serverId);
    if (!server) return { success: false, error: 'Сервер не найден' };

    // Update locally
    user.tokens -= amount;
    user.transactions.push({
      id: Math.random().toString(36).substr(2, 9),
      type: 'INVESTMENT',
      amount: -amount,
      description: `Вклад в ${server.title}`,
      createdAt: new Date().toISOString()
    });

    const investments = JSON.parse(localStorage.getItem(STORAGE_KEYS.INVESTMENTS) || '[]');
    const roi = 5 + (server.investmentTier * 2);
    const newInvestment: Investment = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      serverId,
      serverTitle: server.title,
      amount,
      roi,
      accumulatedDividends: 0,
      createdAt: new Date().toISOString()
    };

    investments.push(newInvestment);
    localStorage.setItem(STORAGE_KEYS.INVESTMENTS, JSON.stringify(investments));
    this.setCurrentUser(user);

    // Sync to Cloud
    try {
      await supabase.from('profiles').update({ tokens: user.tokens }).eq('id', userId);
      await supabase.from('investments').insert({
        user_id: userId,
        server_id: serverId,
        server_title: server.title,
        amount: amount,
        roi: roi
      });
    } catch (e) {
      console.warn("Cloud sync of investment failed, saved locally");
    }

    this.notify();
    return { success: true };
  }

  getInvestments(userId?: string): Investment[] {
    const data = localStorage.getItem(STORAGE_KEYS.INVESTMENTS);
    if (!data) return [];
    const all = JSON.parse(data);
    if (!userId) return all;
    return all.filter((i: Investment) => i.userId === userId);
  }

  toggleFavorite(userId: string, serverId: string) {
    let favs = JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES) || '[]');
    const index = favs.findIndex((f: Favorite) => f.userId === userId && f.serverId === serverId);
    
    if (index > -1) {
      favs.splice(index, 1);
    } else {
      favs.push({ id: Math.random().toString(36).substr(2, 9), userId, serverId });
    }
    
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favs));
    this.notify();
  }

  getFavorites(userId: string): Favorite[] {
    const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    if (!data) return [];
    const all = JSON.parse(data);
    return all.filter((f: Favorite) => f.userId === userId);
  }

  async addReview(userId: string, serverId: string, text: string, rating: number): Promise<{ success: boolean }> {
    const reviews = JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS) || '[]');
    const user = this.getCurrentUser();
    if (!user) return { success: false };

    const newReview: Review = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      userName: user.name,
      userAvatar: user.avatarUrl,
      serverId,
      text,
      rating,
      createdAt: new Date().toISOString()
    };

    reviews.push(newReview);
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));

    user.tokens += 20;
    user.xp += 50;
    user.level = Math.floor(user.xp / 200) + 1;
    if (!user.reviewedServerIds.includes(serverId)) user.reviewedServerIds.push(serverId);
    
    user.transactions.push({
      id: Math.random().toString(36).substr(2, 9),
      type: 'SERVER_REVIEW',
      amount: 20,
      description: 'Бонус за отзыв',
      createdAt: new Date().toISOString()
    });

    this.setCurrentUser(user);

    // Sync review to cloud
    try {
      await supabase.from('profiles').update({ 
        tokens: user.tokens, 
        xp: user.xp, 
        level: user.level,
        reviewed_server_ids: user.reviewedServerIds 
      }).eq('id', userId);
    } catch (e) {}

    this.notify();
    return { success: true };
  }

  getReviews(serverId: string): Review[] {
    const data = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    if (!data) return [];
    const all = JSON.parse(data);
    return all.filter((r: Review) => r.serverId === serverId);
  }

  getGames(): Game[] {
    const data = localStorage.getItem(STORAGE_KEYS.GAMES);
    return data ? JSON.parse(data) : INITIAL_GAMES;
  }

  getXpProgress(user: User) {
    const xpPerLevel = 200;
    const currentXp = user.xp || 0;
    const progress = (currentXp % xpPerLevel) / xpPerLevel * 100;
    return {
      progress,
      xpIntoLevel: currentXp % xpPerLevel,
      xpNeededForNext: xpPerLevel
    };
  }

  purchaseTokens(userId: string, tokens: number, stars: number) {
    const user = this.getCurrentUser();
    if (!user || user.id !== userId) return { success: false };
    user.tokens += tokens;
    user.transactions.push({
      id: Math.random().toString(36).substr(2, 9),
      type: 'PURCHASE',
      amount: tokens,
      description: `Покупка VT за ${stars} звёзд`,
      createdAt: new Date().toISOString()
    });
    this.setCurrentUser(user);
    
    try {
      supabase.from('profiles').update({ tokens: user.tokens }).eq('id', userId);
    } catch (e) {}

    return { success: true };
  }
}

export const db = new DatabaseService();
db.init();
