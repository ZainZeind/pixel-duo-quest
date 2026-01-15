// ============================================
// PIXEL DUO QUEST - TYPE DEFINITIONS
// ============================================

// ---- User & Authentication ----
export type Gender = 'male' | 'female';

export interface User {
    id: string;
    username: string;
    email: string;
    password: string; // hashed
    gender: Gender;
    avatarId: string;
    createdAt: string;
    partnerId?: string; // linked partner

    // Stats
    level: number;
    xp: number;
    maxXp: number;
    hp: number;
    maxHp: number;
    mp: number;
    maxMp: number;
    gold: number;

    // Customization
    themeColor?: string;
    bgPattern?: string;

    // Streaks
    loginStreak: number;
    lastLoginDate: string;
    lastDailyReward?: string;
}

export interface Couple {
    id: string;
    user1Id: string;
    user2Id: string;
    name: string;
    level: number;
    hearts: number;
    maxHearts: number;
    treasury: number;
    daysTogether: number;
    anniversaryDate: string;
    createdAt: string;
}

// ---- Quests ----
export type QuestDifficulty = 'easy' | 'medium' | 'hard' | 'boss';
export type QuestStatus = 'pending' | 'in_progress' | 'waiting_approval' | 'completed';
export type QuestScope = 'personal' | 'shared';

export interface Quest {
    id: string;
    title: string;
    description: string;
    xpReward: number;
    goldReward: number;
    difficulty: QuestDifficulty;
    status: QuestStatus;
    scope: QuestScope;
    createdBy: string;
    assignedTo?: string;
    dueDate?: string;
    completedAt?: string;
    createdAt: string;
}

// ---- Achievements ----
export type AchievementCategory = 'relationship' | 'quests' | 'financial' | 'games' | 'pets' | 'social';

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: AchievementCategory;
    requirement: number;
    reward: {
        xp?: number;
        gold?: number;
        title?: string;
    };
}

export interface UserAchievement {
    userId: string;
    achievementId: string;
    unlockedAt: string;
    progress: number;
}

// ---- Financial ----
export type TransactionType = 'income' | 'expense';
export type TransactionCategory =
    | 'food' | 'transport' | 'entertainment' | 'shopping'
    | 'bills' | 'health' | 'education' | 'savings' | 'gift' | 'other';

export interface Transaction {
    id: string;
    userId: string;
    type: TransactionType;
    category: TransactionCategory;
    amount: number;
    description: string;
    date: string;
    isShared: boolean;
    createdAt: string;
}

export interface SavingsGoal {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline?: string;
    icon: string;
    createdAt: string;
}

export interface Budget {
    id: string;
    category: TransactionCategory;
    limit: number;
    period: 'weekly' | 'monthly';
}

// ---- Calendar & Events ----
export type EventType = 'anniversary' | 'birthday' | 'date' | 'reminder' | 'milestone';

export interface CalendarEvent {
    id: string;
    title: string;
    description?: string;
    date: string;
    type: EventType;
    recurring?: 'yearly' | 'monthly' | 'weekly';
    reminder?: boolean;
    createdBy: string;
}

// ---- Memory Gallery ----
export interface Memory {
    id: string;
    imageData: string; // base64
    caption: string;
    date: string;
    frameStyle: string;
    tags?: string[];
    createdBy: string;
    createdAt: string;
}

// ---- Goals & Milestones ----
export type GoalCategory = 'relationship' | 'career' | 'health' | 'financial' | 'travel' | 'learning' | 'other';

export interface Goal {
    id: string;
    title: string;
    description?: string;
    category: GoalCategory;
    targetValue: number;
    currentValue: number;
    unit: string;
    deadline?: string;
    milestones?: Milestone[];
    isShared: boolean;
    createdBy: string;
    createdAt: string;
}

export interface Milestone {
    id: string;
    title: string;
    value: number;
    completed: boolean;
    completedAt?: string;
}

// ---- Daily Rewards ----
export interface DailyReward {
    day: number;
    reward: {
        gold?: number;
        xp?: number;
        item?: string;
    };
    claimed: boolean;
}

export interface SpinWheelResult {
    prize: string;
    amount: number;
    type: 'gold' | 'xp' | 'item';
}

// ---- Love Letters ----
export interface LoveLetter {
    id: string;
    senderId: string;
    receiverId: string;
    content: string;
    isSecret: boolean;
    revealDate?: string;
    isOpened: boolean;
    createdAt: string;
}

// ---- Date Ideas ----
export type DateCategory = 'indoor' | 'outdoor' | 'budget' | 'fancy' | 'adventure' | 'relaxing';

export interface DateIdea {
    id: string;
    title: string;
    description: string;
    categories: DateCategory[];
    estimatedCost: 'free' | 'low' | 'medium' | 'high';
    duration: string;
}

// ---- Pet ----
export interface Pet {
    id: string;
    name: string;
    type: 'cat' | 'dog' | 'bunny' | 'bird';
    hunger: number;
    happiness: number;
    level: number;
    xp: number;
    currentOutfit?: string;
    ownedOutfits: string[];
    ownedToys: string[];
    foodInventory: PetFood[];
    lastFed: string;
    lastPlayed: string;
}

export interface PetFood {
    id: string;
    name: string;
    icon: string;
    hungerValue: number;
    quantity: number;
}

export interface PetOutfit {
    id: string;
    name: string;
    icon: string;
    price: number;
}

export interface PetToy {
    id: string;
    name: string;
    icon: string;
    happinessValue: number;
    price: number;
}

// ---- Leaderboard ----
export interface LeaderboardEntry {
    rank: number;
    userId: string;
    username: string;
    gender: Gender;
    avatarId: string;
    score: number;
    questsCompleted: number;
}

// ---- Logbook ----
export interface LogEntry {
    id: string;
    userId: string;
    action: string;
    type: 'quest' | 'gold' | 'level' | 'heart' | 'achievement' | 'pet' | 'system';
    timestamp: string;
}

// ---- Avatar Options ----
export interface AvatarOption {
    id: string;
    emoji: string;
    name: string;
    gender: Gender | 'neutral';
    unlockRequirement?: string;
}

// Default avatars
export const MALE_AVATARS: AvatarOption[] = [
    { id: 'wizard_m', emoji: '🧙‍♂️', name: 'Wizard', gender: 'male' },
    { id: 'knight_m', emoji: '🤴', name: 'Prince', gender: 'male' },
    { id: 'ninja_m', emoji: '🥷', name: 'Ninja', gender: 'male' },
    { id: 'astronaut_m', emoji: '👨‍🚀', name: 'Astronaut', gender: 'male' },
    { id: 'detective_m', emoji: '🕵️‍♂️', name: 'Detective', gender: 'male' },
    { id: 'artist_m', emoji: '👨‍🎨', name: 'Artist', gender: 'male' },
    { id: 'chef_m', emoji: '👨‍🍳', name: 'Chef', gender: 'male' },
    { id: 'rockstar_m', emoji: '🧑‍🎤', name: 'Rockstar', gender: 'male' },
];

export const FEMALE_AVATARS: AvatarOption[] = [
    { id: 'wizard_f', emoji: '🧙‍♀️', name: 'Witch', gender: 'female' },
    { id: 'princess_f', emoji: '👸', name: 'Princess', gender: 'female' },
    { id: 'fairy_f', emoji: '🧚‍♀️', name: 'Fairy', gender: 'female' },
    { id: 'astronaut_f', emoji: '👩‍🚀', name: 'Astronaut', gender: 'female' },
    { id: 'detective_f', emoji: '🕵️‍♀️', name: 'Detective', gender: 'female' },
    { id: 'artist_f', emoji: '👩‍🎨', name: 'Artist', gender: 'female' },
    { id: 'chef_f', emoji: '👩‍🍳', name: 'Chef', gender: 'female' },
    { id: 'mermaid_f', emoji: '🧜‍♀️', name: 'Mermaid', gender: 'female' },
];

// ---- Theme Options ----
export const THEME_COLORS = [
    { id: 'default', name: 'Classic Purple', primary: 'hsl(271, 91%, 65%)' },
    { id: 'ocean', name: 'Ocean Blue', primary: 'hsl(200, 91%, 55%)' },
    { id: 'forest', name: 'Forest Green', primary: 'hsl(140, 70%, 45%)' },
    { id: 'sunset', name: 'Sunset Orange', primary: 'hsl(25, 95%, 55%)' },
    { id: 'cherry', name: 'Cherry Pink', primary: 'hsl(340, 82%, 60%)' },
    { id: 'galaxy', name: 'Galaxy Indigo', primary: 'hsl(260, 80%, 55%)' },
];
