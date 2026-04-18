import type { Platform } from "@/types/platform.types";

export type CreatorOnboardingProfile = {
  goals: string;
  challenges: string;
  outcomes_3_6_months: string;
  audience_age_ranges: string[];
  audience_genders: string[];
  audience_locations: string[];
  audience_interests: string;
  audience_problems: string;
  voice_styles: string[];
  content_types: string[];
  values_themes: string[];
  weekly_hours: "0_2" | "3_5" | "6_10" | "10_plus" | "";
  has_team_or_budget: "no" | "some" | "yes" | "";
  primary_platform: Platform | "";
  platforms: Platform[];
  posting_frequency: string;
  avoid_content: string;
};
