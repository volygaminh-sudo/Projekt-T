export type Role = 'all' | 'assassin' | 'fighter' | 'mage' | 'marksman' | 'support' | 'tank';
export type TierKey = 'S+' | 'S' | 'A' | 'B' | 'C' | 'D';

export interface Hero {
  id: string;
  name: string;
  role: Exclude<Role, 'all'>;
  image: string;
}

export interface TierRow {
  tier: TierKey;
  color: string;
  bg: string;
  heroes: Hero[];
}

export interface TierState {
  tiers: TierRow[];
  inventory: Hero[];
}

export interface SavedTierList {
  tiers: TierRow[];
  timestamp: string;
}

export type AppMode = 'META' | 'MAKER';
export type UserRole = 'GUEST' | 'ADMIN';
