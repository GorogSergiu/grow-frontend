export type Platform = "tiktok" | "instagram" | "youtube";

export type BusinessOnboardingProfile = {
  industry: string;
  products_services: string;

  social_goals: string[]; // ex: ["leads", "sales", "awareness"]
  kpi_targets: string;

  ideal_customer: string;

  platforms: Platform[];
  primary_platform: Platform | "";

  preferred_content_types: string[]; // multi
  avoid_content: string;

  weekly_hours: "0_2" | "3_5" | "6_10" | "10_plus" | "";
  has_ads_budget: "no" | "some" | "yes" | "";
};

export function getDefaultBusinessProfile(): BusinessOnboardingProfile {
  return {
    industry: "",
    products_services: "",

    social_goals: [],
    kpi_targets: "",

    ideal_customer: "",

    platforms: [],
    primary_platform: "",

    preferred_content_types: [],
    avoid_content: "",

    weekly_hours: "",
    has_ads_budget: "",
  };
}
