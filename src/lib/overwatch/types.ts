export type Platform = 'pc' | 'console';

export interface PlayerSearchResult {
  id: number;
  player_id: string;
  name: string;
  title?: string | null;
  career_url: string;
  blizzard_id: string;
  avatar: string;
  namecard: string;
  privacy: 'public' | 'private';
  last_updated_at: string;
}

export interface PlayerSummary {
  username: string;
  avatar: string;
  namecard: string;
  title?: string | null;
  endorsement: {
    level: number;
    frame: string;
  };
  competitive: {
    pc?: CompetitiveData | null;
    console?: CompetitiveData | null;
  };
  privacy?: 'public' | 'private';
  last_updated_at: number;
}

export interface CompetitiveData {
  season: number;
  tank?: CompetitiveRank | null;
  damage?: CompetitiveRank | null;
  support?: CompetitiveRank | null;
  open?: CompetitiveRank | null;
}

export interface CompetitiveRank {
  skill_rating?: number;
  division?: string;  
  tier?: number;      
  role_icon?: string;
  rank_icon?: string;
  tier_icon?: string;
}

export interface PlayerStats {
  [platform: string]: {
    [gamemode: string]: GameModeStats;
  } | null | undefined;
}

export interface GameModeStats {
  general?: {
    time_played?: number;
    games_played?: number;
    games_won?: number;
    games_lost?: number;
    winrate?: number;
    kda?: number;
  };
  roles?: {
    [role: string]: RoleStats;
  };
  heroes_comparisons?: HeroesComparisons;
  career_stats?: CareerStats;
  [key: string]: any;
}

export interface RoleStats {
  time_played?: number;
  games_played?: number;
  games_won?: number;
  winrate?: number;
}

export interface HeroesComparisons {
  time_played_avg_per_10_min?: ComparisonData;
  games_played?: ComparisonData;
  winrate?: ComparisonData;
  weapon_accuracy?: ComparisonData;
  eliminations_per_life?: ComparisonData;
  multikill_best?: ComparisonData;
  objective_kills_avg_per_10_min?: ComparisonData;
  deaths_avg_per_10_min?: ComparisonData;
  eliminations_avg_per_10_min?: ComparisonData;
  damage_dealt_avg_per_10_min?: ComparisonData;
  healing_dealt_avg_per_10_min?: ComparisonData;
  [key: string]: ComparisonData | undefined;
}

export interface ComparisonData {
  label: string;
  values: Array<{
    hero: string;
    value: number;
  }>;
}

export interface CareerStats {
  [hero: string]: Array<{
    category: string;
    label: string;
    stats: Array<{
      key: string;
      label: string;
      value: number | string;
    }>;
  }>;
}

// Combined response from OverFast API
export interface FullPlayerData {
  summary: PlayerSummary;
  stats: PlayerStats | null;
}

export interface AggregatedUserData {
  summary: PlayerSummary;
  stats: PlayerStats | null;
  aggregated: {
    total_playtime: number;
    favorite_hero: string;
    overall_win_rate: number;
    total_games_played: number;
    total_games_won: number;
    competitive_sr_average?: number;
  };
}