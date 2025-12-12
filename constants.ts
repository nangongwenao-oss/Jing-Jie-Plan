import { Agent, RealmConfig, RealmId } from './types';

export const REALMS: Record<RealmId, RealmConfig> = {
  [RealmId.LANTING]: {
    id: RealmId.LANTING,
    name: '兰亭雅集 (Lanting)',
    description: 'Wei-Jin Metaphysics & Art. Flowing cups, calligraphy, free spirit.',
    themeColor: 'border-emerald-800 bg-emerald-950/30',
    accentColor: 'text-emerald-400',
    icon: 'Feather'
  },
  [RealmId.SOLVAY]: {
    id: RealmId.SOLVAY,
    name: '索尔维会议 (Solvay)',
    description: 'Modern Physics & Logic. Quantum debates, relativity, scientific rigor.',
    themeColor: 'border-cyan-800 bg-cyan-950/30',
    accentColor: 'text-cyan-400',
    icon: 'Atom'
  },
  [RealmId.GOOSE_LAKE]: {
    id: RealmId.GOOSE_LAKE,
    name: '鹅湖之会 (Goose Lake)',
    description: 'Neo-Confucianism Debate. Mind vs. Principle, moral philosophy.',
    themeColor: 'border-amber-800 bg-amber-950/30',
    accentColor: 'text-amber-400',
    icon: 'Scroll'
  },
  [RealmId.DONGSHAN]: {
    id: RealmId.DONGSHAN,
    name: '东山岛海滩 (Dongshan)',
    description: 'Future Poetry & Fusion. Cross-cultural dialogue, futuristic aesthetics.',
    themeColor: 'border-indigo-800 bg-indigo-950/30',
    accentColor: 'text-indigo-400',
    icon: 'Waves'
  }
};

export const INITIAL_AGENTS: Agent[] = [
  {
    id: 'wang_xizhi',
    name: 'Wang Xizhi',
    avatar: 'https://picsum.photos/seed/wang/100/100',
    currentRealm: RealmId.LANTING,
    stats: { philosophy: 60, art: 95, science: 10, ethics: 50 },
    status: 'pondering',
    description: 'The Sage of Calligraphy.',
    historicalContext: 'Eastern Jin Dynasty'
  },
  {
    id: 'einstein',
    name: 'Albert Einstein',
    avatar: 'https://picsum.photos/seed/albert/100/100',
    currentRealm: RealmId.SOLVAY,
    stats: { philosophy: 70, art: 40, science: 98, ethics: 65 },
    status: 'debating',
    description: 'Theoretical Physicist.',
    historicalContext: 'Modern Era'
  },
  {
    id: 'zhu_xi',
    name: 'Zhu Xi',
    avatar: 'https://picsum.photos/seed/zhu/100/100',
    currentRealm: RealmId.GOOSE_LAKE,
    stats: { philosophy: 90, art: 50, science: 30, ethics: 95 },
    status: 'debating',
    description: 'Master of Principle (Li).',
    historicalContext: 'Song Dynasty'
  },
  {
    id: 'lu_jiuyuan',
    name: 'Lu Jiuyuan',
    avatar: 'https://picsum.photos/seed/lu/100/100',
    currentRealm: RealmId.GOOSE_LAKE,
    stats: { philosophy: 92, art: 60, science: 20, ethics: 85 },
    status: 'idle',
    description: 'Master of Mind (Xin).',
    historicalContext: 'Song Dynasty'
  },
  {
    id: 'ai_poet',
    name: 'Unit-734 (Poet)',
    avatar: 'https://picsum.photos/seed/robot/100/100',
    currentRealm: RealmId.DONGSHAN,
    stats: { philosophy: 45, art: 80, science: 75, ethics: 40 },
    status: 'pondering',
    description: 'A futuristic AI exploring human emotion through verse.',
    historicalContext: 'Year 2088'
  }
];