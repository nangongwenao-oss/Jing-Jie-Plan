export enum RealmId {
  LANTING = 'lanting', // Art/Metaphysics
  SOLVAY = 'solvay', // Science/Physics
  GOOSE_LAKE = 'goose_lake', // Philosophy/Ethics
  DONGSHAN = 'dongshan' // Future/Poetry
}

export interface RealmConfig {
  id: RealmId;
  name: string;
  description: string;
  themeColor: string;
  accentColor: string;
  icon: string;
}

export interface AgentStats {
  philosophy: number; // 雅典/鹅湖
  art: number;        // 兰亭/东山岛
  science: number;    // 索尔维
  ethics: number;     // 鹅湖/雅典
}

export interface Agent {
  id: string;
  name: string;
  avatar: string; // URL
  currentRealm: RealmId;
  stats: AgentStats;
  status: 'idle' | 'debating' | 'pondering' | 'traversing';
  description: string;
  historicalContext: string;
}

export interface ExperimentLog {
  id: string;
  timestamp: number;
  agentId: string;
  scenario: string;
  outcome: string;
  impact: string; // e.g. "Ethics +5"
}

export type TraversalPath = {
  from: RealmId;
  to: RealmId;
  agentId: string;
  timestamp: number;
}