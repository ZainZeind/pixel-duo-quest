// ============================================
// ACHIEVEMENTS DEFINITIONS
// ============================================

import { Achievement } from '@/types';

export const ACHIEVEMENTS: Achievement[] = [
    // Relationship Category
    {
        id: 'first_love',
        name: 'First Love',
        description: 'Link with your partner',
        icon: '💕',
        category: 'relationship',
        requirement: 1,
        reward: { xp: 100, gold: 50 },
    },
    {
        id: 'week_together',
        name: 'One Week Strong',
        description: '7 days together',
        icon: '📅',
        category: 'relationship',
        requirement: 7,
        reward: { xp: 50, gold: 30 },
    },
    {
        id: 'month_together',
        name: 'Monthly Milestone',
        description: '30 days together',
        icon: '🌙',
        category: 'relationship',
        requirement: 30,
        reward: { xp: 200, gold: 100 },
    },
    {
        id: 'anniversary',
        name: 'Anniversary!',
        description: '365 days together',
        icon: '🎂',
        category: 'relationship',
        requirement: 365,
        reward: { xp: 1000, gold: 500, title: 'Soulmate' },
    },
    {
        id: 'love_letter_sender',
        name: 'Love Letter Writer',
        description: 'Send 10 love letters',
        icon: '💌',
        category: 'relationship',
        requirement: 10,
        reward: { xp: 150, gold: 75 },
    },

    // Quests Category
    {
        id: 'first_quest',
        name: 'Adventurer',
        description: 'Complete your first quest',
        icon: '⚔️',
        category: 'quests',
        requirement: 1,
        reward: { xp: 25, gold: 10 },
    },
    {
        id: 'quest_novice',
        name: 'Quest Novice',
        description: 'Complete 10 quests',
        icon: '🗡️',
        category: 'quests',
        requirement: 10,
        reward: { xp: 100, gold: 50 },
    },
    {
        id: 'quest_expert',
        name: 'Quest Expert',
        description: 'Complete 50 quests',
        icon: '🏹',
        category: 'quests',
        requirement: 50,
        reward: { xp: 300, gold: 150 },
    },
    {
        id: 'quest_master',
        name: 'Quest Master',
        description: 'Complete 100 quests',
        icon: '👑',
        category: 'quests',
        requirement: 100,
        reward: { xp: 500, gold: 250, title: 'Questmaster' },
    },
    {
        id: 'boss_slayer',
        name: 'Boss Slayer',
        description: 'Complete 5 boss quests',
        icon: '🐉',
        category: 'quests',
        requirement: 5,
        reward: { xp: 200, gold: 100 },
    },

    // Financial Category
    {
        id: 'first_save',
        name: 'Piggy Bank',
        description: 'Save your first 100G',
        icon: '🐷',
        category: 'financial',
        requirement: 100,
        reward: { xp: 50, gold: 25 },
    },
    {
        id: 'rich_adventurer',
        name: 'Rich Adventurer',
        description: 'Accumulate 1000G',
        icon: '💰',
        category: 'financial',
        requirement: 1000,
        reward: { xp: 100, gold: 50 },
    },
    {
        id: 'treasurer',
        name: 'Treasurer',
        description: 'Add 500G to treasury',
        icon: '🏦',
        category: 'financial',
        requirement: 500,
        reward: { xp: 150, gold: 75 },
    },
    {
        id: 'budget_master',
        name: 'Budget Master',
        description: 'Track 30 transactions',
        icon: '📊',
        category: 'financial',
        requirement: 30,
        reward: { xp: 100, gold: 50 },
    },
    {
        id: 'goal_achiever',
        name: 'Goal Achiever',
        description: 'Complete a savings goal',
        icon: '🎯',
        category: 'financial',
        requirement: 1,
        reward: { xp: 200, gold: 100 },
    },

    // Games Category
    {
        id: 'arcade_rookie',
        name: 'Arcade Rookie',
        description: 'Play 10 arcade games',
        icon: '🕹️',
        category: 'games',
        requirement: 10,
        reward: { xp: 50, gold: 25 },
    },
    {
        id: 'high_scorer',
        name: 'High Scorer',
        description: 'Get a score of 100+',
        icon: '🏆',
        category: 'games',
        requirement: 100,
        reward: { xp: 150, gold: 75 },
    },
    {
        id: 'game_master',
        name: 'Game Master',
        description: 'Play 50 arcade games',
        icon: '🎮',
        category: 'games',
        requirement: 50,
        reward: { xp: 200, gold: 100, title: 'Gamer' },
    },

    // Pets Category
    {
        id: 'pet_owner',
        name: 'Pet Owner',
        description: 'Feed your pet 10 times',
        icon: '🐱',
        category: 'pets',
        requirement: 10,
        reward: { xp: 50, gold: 25 },
    },
    {
        id: 'pet_lover',
        name: 'Pet Lover',
        description: 'Pet happiness at 100',
        icon: '😻',
        category: 'pets',
        requirement: 100,
        reward: { xp: 100, gold: 50 },
    },
    {
        id: 'fashionista_pet',
        name: 'Fashionista',
        description: 'Collect 5 pet outfits',
        icon: '👗',
        category: 'pets',
        requirement: 5,
        reward: { xp: 150, gold: 75 },
    },
    {
        id: 'pet_trainer',
        name: 'Pet Trainer',
        description: 'Pet reaches level 10',
        icon: '🎓',
        category: 'pets',
        requirement: 10,
        reward: { xp: 300, gold: 150, title: 'Pet Whisperer' },
    },

    // Social Category
    {
        id: 'first_login',
        name: 'Welcome!',
        description: 'First login',
        icon: '🎉',
        category: 'social',
        requirement: 1,
        reward: { xp: 10, gold: 5 },
    },
    {
        id: 'streak_3',
        name: '3 Day Streak',
        description: 'Login 3 days in a row',
        icon: '🔥',
        category: 'social',
        requirement: 3,
        reward: { xp: 30, gold: 15 },
    },
    {
        id: 'streak_7',
        name: 'Week Warrior',
        description: 'Login 7 days in a row',
        icon: '🌟',
        category: 'social',
        requirement: 7,
        reward: { xp: 100, gold: 50 },
    },
    {
        id: 'streak_30',
        name: 'Dedicated Player',
        description: 'Login 30 days in a row',
        icon: '💎',
        category: 'social',
        requirement: 30,
        reward: { xp: 500, gold: 250, title: 'Legendary' },
    },
    {
        id: 'memory_keeper',
        name: 'Memory Keeper',
        description: 'Upload 10 memories',
        icon: '📸',
        category: 'social',
        requirement: 10,
        reward: { xp: 100, gold: 50 },
    },
];

export function getAchievementById(id: string): Achievement | undefined {
    return ACHIEVEMENTS.find(a => a.id === id);
}

export function getAchievementsByCategory(category: Achievement['category']): Achievement[] {
    return ACHIEVEMENTS.filter(a => a.category === category);
}
