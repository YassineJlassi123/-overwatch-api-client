import { z } from 'zod';

// BattleTag validation (format: Name-1234)
export const BattleTagSchema = z.string()
  .regex(/^[a-zA-Z0-9]{3,12}-[0-9]{4,5}$/, 'Invalid BattleTag format (should be: Name-1234)')
  .min(1, 'BattleTag is required');

export const PlatformSchema = z.enum(['pc', 'console']).default('pc');

export const CompetitiveRankSchema = z.object({
  skill_rating: z.number().optional(),
  division: z.string().optional(),
  tier: z.number().optional(),
  role_icon: z.string().optional(),
  rank_icon: z.string().optional(),
  tier_icon: z.string().optional(),
}).nullable();

export const CompetitiveDataSchema = z.object({
  season: z.number(),
  tank: CompetitiveRankSchema.optional(),
  damage: CompetitiveRankSchema.optional(),
  support: CompetitiveRankSchema.optional(),
  open: CompetitiveRankSchema.optional(),
}).nullable();

export const PlayerSummarySchema = z.object({
  username: z.string(),
  avatar: z.string(),
  namecard: z.string(),
  title: z.string().nullable().optional(),
  endorsement: z.object({
    level: z.number(),
    frame: z.string(),
  }),
  competitive: z.object({
    pc: CompetitiveDataSchema.optional(),
    console: CompetitiveDataSchema.optional(),
  }),
  privacy: z.enum(['public', 'private']).optional(),
  last_updated_at: z.number(),
});

export const ComparisonValueSchema = z.object({
  hero: z.string(),
  value: z.number(),
});

export const ComparisonDataSchema = z.object({
  label: z.string(),
  values: z.array(ComparisonValueSchema),
});

export const HeroesComparisonsSchema = z.object({
  time_played_avg_per_10_min: ComparisonDataSchema.optional(),
  games_played: ComparisonDataSchema.optional(),
  winrate: ComparisonDataSchema.optional(),
  weapon_accuracy: ComparisonDataSchema.optional(),
  eliminations_per_life: ComparisonDataSchema.optional(),
  multikill_best: ComparisonDataSchema.optional(),
  objective_kills_avg_per_10_min: ComparisonDataSchema.optional(),
  deaths_avg_per_10_min: ComparisonDataSchema.optional(),
  eliminations_avg_per_10_min: ComparisonDataSchema.optional(),
  damage_dealt_avg_per_10_min: ComparisonDataSchema.optional(),
  healing_dealt_avg_per_10_min: ComparisonDataSchema.optional(),
}).catchall(ComparisonDataSchema.optional());

export const RoleStatsSchema = z.object({
  time_played: z.number().optional(),
  games_played: z.number().optional(),
  games_won: z.number().optional(),
  winrate: z.number().optional(),
});

export const CareerStatsSchema = z.record(
  z.array(
    z.object({
      category: z.string(),
      label: z.string(),
      stats: z.array(
        z.object({
          key: z.string(),
          label: z.string(),
          value: z.union([z.number(), z.string()])
        })
      )
    })
  )
);

export const GameModeStatsSchema = z.object({
  general: z.object({
    time_played: z.number().optional(),
    games_played: z.number().optional(),
    games_won: z.number().optional(),
    games_lost: z.number().optional(),
    winrate: z.number().optional(),
    kda: z.number().optional(),
  }).optional(),
  roles: z.record(RoleStatsSchema).optional(),
  heroes_comparisons: HeroesComparisonsSchema.optional(),
  career_stats: CareerStatsSchema.optional(),
}).catchall(z.any()); 

export const PlatformStatsSchema = z.record(GameModeStatsSchema);

// Player stats schema that matches PlayerStats interface
export const PlayerStatsSchema = z.record(PlatformStatsSchema).nullable();

export const FullPlayerDataSchema = z.object({
  summary: PlayerSummarySchema,
  stats: PlayerStatsSchema,
});

export type PlayerSummary = z.infer<typeof PlayerSummarySchema>;
export type CompetitiveRank = z.infer<typeof CompetitiveRankSchema>;
export type CompetitiveData = z.infer<typeof CompetitiveDataSchema>;
export type HeroesComparisons = z.infer<typeof HeroesComparisonsSchema>;
export type ComparisonData = z.infer<typeof ComparisonDataSchema>;
export type GameModeStats = z.infer<typeof GameModeStatsSchema>;
export type PlayerStats = z.infer<typeof PlayerStatsSchema>;
export type FullPlayerData = z.infer<typeof FullPlayerDataSchema>;