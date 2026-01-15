// ============================================
// DATABASE UTILITY - localStorage Wrapper
// ============================================

import {
    User, Couple, Quest, Transaction, SavingsGoal,
    CalendarEvent, Memory, Goal, LoveLetter, Pet, LogEntry,
    UserAchievement, DailyReward
} from '@/types';

const DB_KEYS = {
    USERS: 'pdq_users',
    COUPLES: 'pdq_couples',
    QUESTS: 'pdq_quests',
    TRANSACTIONS: 'pdq_transactions',
    SAVINGS_GOALS: 'pdq_savings_goals',
    EVENTS: 'pdq_events',
    MEMORIES: 'pdq_memories',
    GOALS: 'pdq_goals',
    LOVE_LETTERS: 'pdq_love_letters',
    PETS: 'pdq_pets',
    LOG_ENTRIES: 'pdq_log_entries',
    USER_ACHIEVEMENTS: 'pdq_user_achievements',
    DAILY_REWARDS: 'pdq_daily_rewards',
    CURRENT_USER: 'pdq_current_user',
};

// Generic CRUD operations
function getAll<T>(key: string): T[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

function getById<T extends { id: string }>(key: string, id: string): T | null {
    const items = getAll<T>(key);
    return items.find(item => item.id === id) || null;
}

function save<T extends { id: string }>(key: string, item: T): T {
    const items = getAll<T>(key);
    const existingIndex = items.findIndex(i => i.id === item.id);

    if (existingIndex >= 0) {
        items[existingIndex] = item;
    } else {
        items.push(item);
    }

    localStorage.setItem(key, JSON.stringify(items));
    return item;
}

function remove<T extends { id: string }>(key: string, id: string): boolean {
    const items = getAll<T>(key);
    const filteredItems = items.filter(item => item.id !== id);
    localStorage.setItem(key, JSON.stringify(filteredItems));
    return items.length !== filteredItems.length;
}

function generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ---- User Operations ----
export const userDb = {
    getAll: () => getAll<User>(DB_KEYS.USERS),
    getById: (id: string) => getById<User>(DB_KEYS.USERS, id),
    getByEmail: (email: string): User | null => {
        const users = getAll<User>(DB_KEYS.USERS);
        return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
    },
    getByUsername: (username: string): User | null => {
        const users = getAll<User>(DB_KEYS.USERS);
        return users.find(u => u.username.toLowerCase() === username.toLowerCase()) || null;
    },
    save: (user: User) => save<User>(DB_KEYS.USERS, user),
    remove: (id: string) => remove<User>(DB_KEYS.USERS, id),

    // Session
    getCurrentUser: (): User | null => {
        const userId = localStorage.getItem(DB_KEYS.CURRENT_USER);
        return userId ? getById<User>(DB_KEYS.USERS, userId) : null;
    },
    setCurrentUser: (userId: string | null) => {
        if (userId) {
            localStorage.setItem(DB_KEYS.CURRENT_USER, userId);
        } else {
            localStorage.removeItem(DB_KEYS.CURRENT_USER);
        }
    },

    // Create new user
    create: (data: Omit<User, 'id' | 'createdAt' | 'level' | 'xp' | 'maxXp' | 'hp' | 'maxHp' | 'mp' | 'maxMp' | 'gold' | 'loginStreak' | 'lastLoginDate'>): User => {
        const newUser: User = {
            ...data,
            id: generateId(),
            createdAt: new Date().toISOString(),
            level: 1,
            xp: 0,
            maxXp: 100,
            hp: 100,
            maxHp: 100,
            mp: 50,
            maxMp: 50,
            gold: 500, // Starting gold
            loginStreak: 0,
            lastLoginDate: new Date().toISOString(),
        };
        return save<User>(DB_KEYS.USERS, newUser);
    },
};

// ---- Couple Operations ----
export const coupleDb = {
    getAll: () => getAll<Couple>(DB_KEYS.COUPLES),
    getById: (id: string) => getById<Couple>(DB_KEYS.COUPLES, id),
    getByUserId: (userId: string): Couple | null => {
        const couples = getAll<Couple>(DB_KEYS.COUPLES);
        return couples.find(c => c.user1Id === userId || c.user2Id === userId) || null;
    },
    save: (couple: Couple) => save<Couple>(DB_KEYS.COUPLES, couple),

    create: (user1Id: string, user2Id: string, name: string, anniversaryDate: string): Couple => {
        const newCouple: Couple = {
            id: generateId(),
            user1Id,
            user2Id,
            name,
            level: 1,
            hearts: 50,
            maxHearts: 100,
            treasury: 0,
            daysTogether: 0,
            anniversaryDate,
            createdAt: new Date().toISOString(),
        };
        return save<Couple>(DB_KEYS.COUPLES, newCouple);
    },
};

// ---- Quest Operations ----
export const questDb = {
    getAll: () => getAll<Quest>(DB_KEYS.QUESTS),
    getById: (id: string) => getById<Quest>(DB_KEYS.QUESTS, id),
    getByUserId: (userId: string): Quest[] => {
        const quests = getAll<Quest>(DB_KEYS.QUESTS);
        return quests.filter(q => q.createdBy === userId || q.assignedTo === userId);
    },
    save: (quest: Quest) => save<Quest>(DB_KEYS.QUESTS, quest),
    remove: (id: string) => remove<Quest>(DB_KEYS.QUESTS, id),

    create: (data: Omit<Quest, 'id' | 'createdAt'>): Quest => {
        const newQuest: Quest = {
            ...data,
            id: generateId(),
            createdAt: new Date().toISOString(),
        };
        return save<Quest>(DB_KEYS.QUESTS, newQuest);
    },
};

// ---- Transaction Operations ----
export const transactionDb = {
    getAll: () => getAll<Transaction>(DB_KEYS.TRANSACTIONS),
    getByUserId: (userId: string): Transaction[] => {
        const transactions = getAll<Transaction>(DB_KEYS.TRANSACTIONS);
        return transactions.filter(t => t.userId === userId);
    },
    save: (transaction: Transaction) => save<Transaction>(DB_KEYS.TRANSACTIONS, transaction),
    remove: (id: string) => remove<Transaction>(DB_KEYS.TRANSACTIONS, id),

    create: (data: Omit<Transaction, 'id' | 'createdAt'>): Transaction => {
        const newTransaction: Transaction = {
            ...data,
            id: generateId(),
            createdAt: new Date().toISOString(),
        };
        return save<Transaction>(DB_KEYS.TRANSACTIONS, newTransaction);
    },
};

// ---- Savings Goal Operations ----
export const savingsGoalDb = {
    getAll: () => getAll<SavingsGoal>(DB_KEYS.SAVINGS_GOALS),
    save: (goal: SavingsGoal) => save<SavingsGoal>(DB_KEYS.SAVINGS_GOALS, goal),
    remove: (id: string) => remove<SavingsGoal>(DB_KEYS.SAVINGS_GOALS, id),

    create: (data: Omit<SavingsGoal, 'id' | 'createdAt'>): SavingsGoal => {
        const newGoal: SavingsGoal = {
            ...data,
            id: generateId(),
            createdAt: new Date().toISOString(),
        };
        return save<SavingsGoal>(DB_KEYS.SAVINGS_GOALS, newGoal);
    },
};

// ---- Calendar Event Operations ----
export const eventDb = {
    getAll: () => getAll<CalendarEvent>(DB_KEYS.EVENTS),
    getByUserId: (userId: string): CalendarEvent[] => {
        const events = getAll<CalendarEvent>(DB_KEYS.EVENTS);
        return events.filter(e => e.createdBy === userId);
    },
    save: (event: CalendarEvent) => save<CalendarEvent>(DB_KEYS.EVENTS, event),
    remove: (id: string) => remove<CalendarEvent>(DB_KEYS.EVENTS, id),

    create: (data: Omit<CalendarEvent, 'id'>): CalendarEvent => {
        const newEvent: CalendarEvent = {
            ...data,
            id: generateId(),
        };
        return save<CalendarEvent>(DB_KEYS.EVENTS, newEvent);
    },
};

// ---- Memory Operations ----
export const memoryDb = {
    getAll: () => getAll<Memory>(DB_KEYS.MEMORIES),
    getByUserId: (userId: string): Memory[] => {
        const memories = getAll<Memory>(DB_KEYS.MEMORIES);
        return memories.filter(m => m.createdBy === userId);
    },
    save: (memory: Memory) => save<Memory>(DB_KEYS.MEMORIES, memory),
    remove: (id: string) => remove<Memory>(DB_KEYS.MEMORIES, id),

    create: (data: Omit<Memory, 'id' | 'createdAt'>): Memory => {
        const newMemory: Memory = {
            ...data,
            id: generateId(),
            createdAt: new Date().toISOString(),
        };
        return save<Memory>(DB_KEYS.MEMORIES, newMemory);
    },
};

// ---- Goal Operations ----
export const goalDb = {
    getAll: () => getAll<Goal>(DB_KEYS.GOALS),
    getByUserId: (userId: string): Goal[] => {
        const goals = getAll<Goal>(DB_KEYS.GOALS);
        return goals.filter(g => g.createdBy === userId);
    },
    save: (goal: Goal) => save<Goal>(DB_KEYS.GOALS, goal),
    remove: (id: string) => remove<Goal>(DB_KEYS.GOALS, id),

    create: (data: Omit<Goal, 'id' | 'createdAt'>): Goal => {
        const newGoal: Goal = {
            ...data,
            id: generateId(),
            createdAt: new Date().toISOString(),
        };
        return save<Goal>(DB_KEYS.GOALS, newGoal);
    },
};

// ---- Love Letter Operations ----
export const loveLetterDb = {
    getAll: () => getAll<LoveLetter>(DB_KEYS.LOVE_LETTERS),
    getByUserId: (userId: string): LoveLetter[] => {
        const letters = getAll<LoveLetter>(DB_KEYS.LOVE_LETTERS);
        return letters.filter(l => l.senderId === userId || l.receiverId === userId);
    },
    getUnread: (userId: string): LoveLetter[] => {
        const letters = getAll<LoveLetter>(DB_KEYS.LOVE_LETTERS);
        return letters.filter(l => l.receiverId === userId && !l.isOpened);
    },
    save: (letter: LoveLetter) => save<LoveLetter>(DB_KEYS.LOVE_LETTERS, letter),
    remove: (id: string) => remove<LoveLetter>(DB_KEYS.LOVE_LETTERS, id),

    create: (data: Omit<LoveLetter, 'id' | 'createdAt' | 'isOpened'>): LoveLetter => {
        const newLetter: LoveLetter = {
            ...data,
            id: generateId(),
            isOpened: false,
            createdAt: new Date().toISOString(),
        };
        return save<LoveLetter>(DB_KEYS.LOVE_LETTERS, newLetter);
    },
};

// ---- Pet Operations ----
export const petDb = {
    getAll: () => getAll<Pet>(DB_KEYS.PETS),
    getById: (id: string) => getById<Pet>(DB_KEYS.PETS, id),
    save: (pet: Pet) => save<Pet>(DB_KEYS.PETS, pet),

    create: (name: string): Pet => {
        const newPet: Pet = {
            id: generateId(),
            name,
            type: 'cat',
            hunger: 80,
            happiness: 70,
            level: 1,
            xp: 0,
            ownedOutfits: [],
            ownedToys: ['yarn'],
            foodInventory: [
                { id: 'fish', name: 'Ikan', icon: '🐟', hungerValue: 20, quantity: 3 },
                { id: 'milk', name: 'Susu', icon: '🥛', hungerValue: 15, quantity: 2 },
            ],
            lastFed: new Date().toISOString(),
            lastPlayed: new Date().toISOString(),
        };
        return save<Pet>(DB_KEYS.PETS, newPet);
    },
};

// ---- Log Entry Operations ----
export const logDb = {
    getAll: () => getAll<LogEntry>(DB_KEYS.LOG_ENTRIES),
    getRecent: (limit = 20): LogEntry[] => {
        const entries = getAll<LogEntry>(DB_KEYS.LOG_ENTRIES);
        return entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, limit);
    },

    add: (userId: string, action: string, type: LogEntry['type']): LogEntry => {
        const entry: LogEntry = {
            id: generateId(),
            userId,
            action,
            type,
            timestamp: new Date().toISOString(),
        };
        save<LogEntry>(DB_KEYS.LOG_ENTRIES, entry);
        return entry;
    },
};

// ---- Achievement Operations ----
export const achievementDb = {
    getByUserId: (userId: string): UserAchievement[] => {
        const all = getAll<UserAchievement>(DB_KEYS.USER_ACHIEVEMENTS);
        return all.filter((a: any) => a.userId === userId);
    },

    unlock: (userId: string, achievementId: string): UserAchievement => {
        const achievement: UserAchievement = {
            userId: userId,
            achievementId,
            unlockedAt: new Date().toISOString(),
            progress: 100,
        };
        const key = `${userId}_${achievementId}`;
        localStorage.setItem(`${DB_KEYS.USER_ACHIEVEMENTS}_${key}`, JSON.stringify(achievement));
        return achievement;
    },
};

// ---- Daily Rewards Operations ----
export const dailyRewardDb = {
    getByUserId: (userId: string): DailyReward[] => {
        const data = localStorage.getItem(`${DB_KEYS.DAILY_REWARDS}_${userId}`);
        return data ? JSON.parse(data) : [];
    },

    save: (userId: string, rewards: DailyReward[]) => {
        localStorage.setItem(`${DB_KEYS.DAILY_REWARDS}_${userId}`, JSON.stringify(rewards));
    },
};

// ----  Utility ----
export const dbUtils = {
    generateId,

    clearAll: () => {
        Object.values(DB_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
    },

    exportAll: () => {
        const data: Record<string, any> = {};
        Object.entries(DB_KEYS).forEach(([name, key]) => {
            data[name] = localStorage.getItem(key);
        });
        return JSON.stringify(data, null, 2);
    },

    importAll: (jsonStr: string) => {
        const data = JSON.parse(jsonStr);
        Object.entries(DB_KEYS).forEach(([name, key]) => {
            if (data[name]) {
                localStorage.setItem(key, data[name]);
            }
        });
    },
};
