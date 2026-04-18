import type { Platform } from "@/types/platform.types";

export type StrategyResponse = {
  strategy: {
    id: string;
    entity_type: string;
    strategy_json: {
      summary: string;
      positioning: string;
      core_objectives: string[];
      content_pillars: Array<{
        name: string;
        description: string;
        why_it_matters: string;
        formats: string[];
      }>;
      platform_strategy: Array<{
        platform: Platform;
        role: string;
        posting_frequency: string;
        content_focus: string[];
      }>;
      growth_moves: string[];
      next_30_days_focus: string[];
    };
    created_at: string;
    updated_at: string;
  } | null;
};

export type StrategyPeriodPreset = "1_month" | "3_months" | "6_months";
export type StrategyPeriodType = "preset" | "custom";

export type StrategyGeneratePayload = {
  periodType: "preset" | "custom";
  preset: StrategyPeriodPreset | null;
  startDate: string | null;
  endDate: string | null;
};
