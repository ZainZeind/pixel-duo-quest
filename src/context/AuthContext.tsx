// ============================================
// AUTH CONTEXT - User Authentication Provider
// ============================================

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Couple, Gender, MALE_AVATARS, FEMALE_AVATARS } from '@/types';
import { userDb, coupleDb, logDb } from '@/lib/db';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  couple: Couple | null;
  partner: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Auth actions
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  
  // User actions
  updateUser: (updates: Partial<User>) => void;
  addGold: (amount: number) => void;
  spendGold: (amount: number) => boolean;
  addXp: (amount: number) => void;
  
  // Couple actions
  linkPartner: (partnerEmail: string, coupleName: string, anniversary: string) => Promise<boolean>;
  updateCouple: (updates: Partial<Couple>) => void;
  addToTreasury: (amount: number) => void;
  
  // Daily login
  checkDailyLogin: () => boolean;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  gender: Gender;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [couple, setCouple] = useState<Couple | null>(null);
  const [partner, setPartner] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    const currentUser = userDb.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      loadCoupleData(currentUser.id);
    }
    setIsLoading(false);
  }, []);

  const loadCoupleData = (userId: string) => {
    const coupleData = coupleDb.getByUserId(userId);
    if (coupleData) {
      setCouple(coupleData);
      // Load partner
      const partnerId = coupleData.user1Id === userId ? coupleData.user2Id : coupleData.user1Id;
      const partnerData = userDb.getById(partnerId);
      setPartner(partnerData);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    const existingUser = userDb.getByEmail(email);
    
    if (!existingUser) {
      toast.error('User tidak ditemukan!');
      return false;
    }
    
    if (existingUser.password !== password) {
      toast.error('Password salah!');
      return false;
    }
    
    // Update login streak
    const today = new Date().toDateString();
    const lastLogin = new Date(existingUser.lastLoginDate).toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    let newStreak = existingUser.loginStreak;
    if (lastLogin !== today) {
      if (lastLogin === yesterday) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }
    }
    
    const updatedUser: User = {
      ...existingUser,
      loginStreak: newStreak,
      lastLoginDate: new Date().toISOString(),
    };
    
    userDb.save(updatedUser);
    userDb.setCurrentUser(updatedUser.id);
    setUser(updatedUser);
    loadCoupleData(updatedUser.id);
    
    logDb.add(updatedUser.id, 'logged in', 'system');
    toast.success(`Selamat datang kembali, ${updatedUser.username}!`);
    
    return true;
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    // Check if email already exists
    if (userDb.getByEmail(data.email)) {
      toast.error('Email sudah terdaftar!');
      return false;
    }
    
    // Check if username already exists
    if (userDb.getByUsername(data.username)) {
      toast.error('Username sudah digunakan!');
      return false;
    }
    
    // Pick default avatar based on gender
    const defaultAvatar = data.gender === 'male' 
      ? MALE_AVATARS[0].id 
      : FEMALE_AVATARS[0].id;
    
    const newUser = userDb.create({
      username: data.username,
      email: data.email,
      password: data.password,
      gender: data.gender,
      avatarId: defaultAvatar,
    });
    
    userDb.setCurrentUser(newUser.id);
    setUser(newUser);
    
    logDb.add(newUser.id, 'joined the adventure!', 'system');
    toast.success('Akun berhasil dibuat! Selamat berpetualang!');
    
    return true;
  };

  const logout = () => {
    if (user) {
      logDb.add(user.id, 'logged out', 'system');
    }
    userDb.setCurrentUser(null);
    setUser(null);
    setCouple(null);
    setPartner(null);
    toast.success('Sampai jumpa lagi!');
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    userDb.save(updatedUser);
    setUser(updatedUser);
  };

  const addGold = (amount: number) => {
    if (!user) return;
    const newGold = user.gold + amount;
    updateUser({ gold: newGold });
    logDb.add(user.id, `earned ${amount}G`, 'gold');
  };

  const spendGold = (amount: number): boolean => {
    if (!user || user.gold < amount) {
      toast.error('Gold tidak cukup!');
      return false;
    }
    updateUser({ gold: user.gold - amount });
    return true;
  };

  const addXp = (amount: number) => {
    if (!user) return;
    
    let newXp = user.xp + amount;
    let newLevel = user.level;
    let newMaxXp = user.maxXp;
    
    // Level up check
    while (newXp >= newMaxXp) {
      newXp -= newMaxXp;
      newLevel += 1;
      newMaxXp = Math.floor(newMaxXp * 1.5);
      logDb.add(user.id, `leveled up to ${newLevel}!`, 'level');
      toast.success(`🎉 Level Up! Sekarang Level ${newLevel}!`);
    }
    
    updateUser({ xp: newXp, level: newLevel, maxXp: newMaxXp });
  };

  const linkPartner = async (partnerEmail: string, coupleName: string, anniversary: string): Promise<boolean> => {
    if (!user) return false;
    
    const partnerUser = userDb.getByEmail(partnerEmail);
    if (!partnerUser) {
      toast.error('Partner tidak ditemukan! Pastikan mereka sudah register.');
      return false;
    }
    
    if (partnerUser.id === user.id) {
      toast.error('Tidak bisa link dengan diri sendiri!');
      return false;
    }
    
    // Check if either already has a couple
    if (coupleDb.getByUserId(user.id)) {
      toast.error('Kamu sudah punya partner!');
      return false;
    }
    
    if (coupleDb.getByUserId(partnerUser.id)) {
      toast.error('Partner sudah punya couple!');
      return false;
    }
    
    // Create couple
    const newCouple = coupleDb.create(user.id, partnerUser.id, coupleName, anniversary);
    
    // Update both users
    userDb.save({ ...user, partnerId: partnerUser.id });
    userDb.save({ ...partnerUser, partnerId: user.id });
    
    setCouple(newCouple);
    setPartner(partnerUser);
    updateUser({ partnerId: partnerUser.id });
    
    logDb.add(user.id, `linked with ${partnerUser.username}!`, 'heart');
    toast.success(`💕 Berhasil terhubung dengan ${partnerUser.username}!`);
    
    return true;
  };

  const updateCouple = (updates: Partial<Couple>) => {
    if (!couple) return;
    const updatedCouple = { ...couple, ...updates };
    coupleDb.save(updatedCouple);
    setCouple(updatedCouple);
  };

  const addToTreasury = (amount: number) => {
    if (!couple || !user) return;
    updateCouple({ treasury: couple.treasury + amount });
    logDb.add(user.id, `added ${amount}G to Treasury`, 'gold');
  };

  const checkDailyLogin = (): boolean => {
    if (!user) return false;
    
    const today = new Date().toDateString();
    const lastReward = user.lastDailyReward ? new Date(user.lastDailyReward).toDateString() : null;
    
    if (lastReward === today) {
      return false; // Already claimed today
    }
    
    return true; // Can claim
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        couple,
        partner,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
        addGold,
        spendGold,
        addXp,
        linkPartner,
        updateCouple,
        addToTreasury,
        checkDailyLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
