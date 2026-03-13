import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import type {
  BusinessOnboardingProfile,
  Platform,
} from "@/pages/onboarding/business/types/business.types";

function toggleInArray<T extends string>(arr: T[], value: T) {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

const contentTypeOptions = [
  { id: "educational", labelKey: "onboarding.business.contentTypeOptions.educational" },
  { id: "behind_the_scenes", labelKey: "onboarding.business.contentTypeOptions.behind_the_scenes" },
  { id: "testimonials", labelKey: "onboarding.business.contentTypeOptions.testimonials" },
  { id: "product_showcase", labelKey: "onboarding.business.contentTypeOptions.product_showcase" },
  { id: "offers_promos", labelKey: "onboarding.business.contentTypeOptions.offers_promos" },
  { id: "authority_content", labelKey: "onboarding.business.contentTypeOptions.authority_content" },
] as const;

const platforms = ["tiktok", "instagram", "youtube"] as Platform[];

export default function BusinessOnboarding({
  step,
  value,
  onChange,
}: {
  step: number;
  totalSteps: number;
  value: BusinessOnboardingProfile;
  onChange: (next: BusinessOnboardingProfile) => void;
}) {
  const { t } = useTranslation();

  // Business flow = 7 steps, starting from global step 2
  const localStep = useMemo(() => Math.max(1, step - 1), [step]);

  const weeklyHoursOptions = useMemo(
    () =>
      [
        ["0_2", "onboarding.business.weeklyHoursOptions.0_2"],
        ["3_5", "onboarding.business.weeklyHoursOptions.3_5"],
        ["6_10", "onboarding.business.weeklyHoursOptions.6_10"],
        ["10_plus", "onboarding.business.weeklyHoursOptions.10_plus"],
      ] as const,
    [],
  );

  const adsBudgetOptions = useMemo(
    () =>
      [
        ["no", "onboarding.business.adsBudgetOptions.no"],
        ["some", "onboarding.business.adsBudgetOptions.some"],
        ["yes", "onboarding.business.adsBudgetOptions.yes"],
      ] as const,
    [],
  );

  const socialGoalOptions = useMemo(
    () =>
      [
        ["leads", "onboarding.business.socialGoalOptions.leads"],
        ["sales", "onboarding.business.socialGoalOptions.sales"],
        ["traffic", "onboarding.business.socialGoalOptions.traffic"],
        ["awareness", "onboarding.business.socialGoalOptions.awareness"],
      ] as const,
    [],
  );

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
        <div className="text-sm font-semibold">
          {t("onboarding.business.title")}
        </div>
      </div>

      {/* Step 1: industry + products/services */}
      {localStep === 1 ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm font-semibold">
              {t("onboarding.business.industry")}
            </div>
            <Textarea
              value={value.industry}
              onChange={(e) => onChange({ ...value, industry: e.target.value })}
              placeholder={t("onboarding.business.industryPlaceholder")}
            />
          </div>

          <div className="space-y-2">
            <div className="text-sm font-semibold">
              {t("onboarding.business.productsServices")}
            </div>
            <Textarea
              value={value.products_services}
              onChange={(e) =>
                onChange({ ...value, products_services: e.target.value })
              }
              placeholder={t("onboarding.business.productsServicesPlaceholder")}
            />
          </div>
        </div>
      ) : null}

      {/* Step 2: social goals + KPI */}
      {localStep === 2 ? (
        <div className="space-y-5">
          <div className="space-y-3">
            <div className="text-sm font-semibold">
              {t("onboarding.business.socialGoals")}
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {socialGoalOptions.map(([id, labelKey]) => {
                const checked = value.social_goals.includes(id);
                return (
                  <button
                    type="button"
                    key={id}
                    onClick={() =>
                      onChange({
                        ...value,
                        social_goals: toggleInArray(value.social_goals, id),
                      })
                    }
                    className="flex items-center justify-between rounded-2xl border border-border bg-background p-4 text-left hover:bg-accent"
                  >
                    <span className="text-sm">{t(labelKey)}</span>
                    <Checkbox checked={checked} />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-semibold">
              {t("onboarding.business.kpiTargets")}
            </div>
            <Textarea
              value={value.kpi_targets}
              onChange={(e) =>
                onChange({ ...value, kpi_targets: e.target.value })
              }
              placeholder={t("onboarding.business.kpiTargetsPlaceholder")}
            />
          </div>
        </div>
      ) : null}

      {/* Step 3: ideal customer */}
      {localStep === 3 ? (
        <div className="space-y-2">
          <div className="text-sm font-semibold">
            {t("onboarding.business.idealCustomer")}
          </div>
          <Textarea
            value={value.ideal_customer}
            onChange={(e) =>
              onChange({ ...value, ideal_customer: e.target.value })
            }
            placeholder={t("onboarding.business.idealCustomerPlaceholder")}
          />
        </div>
      ) : null}

      {/* Step 4: time + ads budget */}
      {localStep === 4 ? (
        <div className="space-y-5">
          <div className="space-y-3">
            <div className="text-sm font-semibold">
              {t("onboarding.business.weeklyHours")}
            </div>
            <RadioGroup
              value={value.weekly_hours}
              onValueChange={(v) =>
                onChange({
                  ...value,
                  weekly_hours: v as BusinessOnboardingProfile["weekly_hours"],
                })
              }
            >
              {weeklyHoursOptions.map(([id, labelKey]) => (
                <div
                  key={id}
                  className="flex items-center gap-3 rounded-2xl bg-background/60 p-4 hover:bg-accent transition-colors"
                >
                  <RadioGroupItem value={id} id={`bh-${id}`} />
                  <Label htmlFor={`bh-${id}`}>{t(labelKey)}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-semibold">
              {t("onboarding.business.adsBudget")}
            </div>
            <RadioGroup
              value={value.has_ads_budget}
              onValueChange={(v) =>
                onChange({
                  ...value,
                  has_ads_budget:
                    v as BusinessOnboardingProfile["has_ads_budget"],
                })
              }
            >
              {adsBudgetOptions.map(([id, labelKey]) => (
                <div
                  key={id}
                  className="flex items-center gap-3 rounded-2xl bg-background/60 p-4 hover:bg-accent transition-colors"
                >
                  <RadioGroupItem value={id} id={`ab-${id}`} />
                  <Label htmlFor={`ab-${id}`}>{t(labelKey)}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      ) : null}

      {/* Step 5: platforms + primary */}
      {localStep === 5 ? (
        <div className="space-y-5">
          <div className="space-y-3">
            <div className="text-sm font-semibold">
              {t("onboarding.business.platforms")}
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {platforms.map((p) => {
                const checked = value.platforms.includes(p);
                return (
                  <button
                    type="button"
                    key={p}
                    onClick={() => {
                      const nextPlatforms = toggleInArray(value.platforms, p);

                      const nextPrimary: BusinessOnboardingProfile["primary_platform"] =
                        value.primary_platform === p
                          ? ""
                          : value.primary_platform;

                      onChange({
                        ...value,
                        platforms: nextPlatforms,
                        primary_platform: nextPrimary,
                      });
                    }}
                    className="flex items-center justify-between rounded-2xl border border-border bg-background p-4 text-left hover:bg-accent"
                  >
                    <span className="text-sm">{t(`dashboard.platforms.${p}`)}</span>
                    <Checkbox checked={checked} />
                  </button>
                );
              })}
            </div>
            {value.platforms.length === 0 ? (
              <div className="text-xs text-destructive">
                {t("onboarding.business.selectPlatform")}
              </div>
            ) : null}
          </div>

          <div className="space-y-3">
            <div className="text-sm font-semibold">
              {t("onboarding.business.primaryPlatform")}
            </div>
            <RadioGroup
              value={value.primary_platform}
              onValueChange={(v) =>
                onChange({ ...value, primary_platform: v as Platform })
              }
            >
              {value.platforms.map((p) => (
                <div
                  key={p}
                  className="flex items-center gap-3 rounded-2xl bg-background/60 p-4 hover:bg-accent transition-colors"
                >
                  <RadioGroupItem value={p} id={`bp-${p}`} />
                  <Label htmlFor={`bp-${p}`}>{t(`dashboard.platforms.${p}`)}</Label>
                </div>
              ))}
            </RadioGroup>

            {value.platforms.length > 0 && !value.primary_platform ? (
              <div className="text-xs text-destructive">
                {t("onboarding.business.choosePrimary")}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* Step 6: preferred content types */}
      {localStep === 6 ? (
        <div className="space-y-3">
          <div className="text-sm font-semibold">
            {t("onboarding.business.preferredContentTypes")}
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {contentTypeOptions.map((opt) => {
              const checked = value.preferred_content_types.includes(opt.id);
              return (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() =>
                    onChange({
                      ...value,
                      preferred_content_types: toggleInArray(
                        value.preferred_content_types,
                        opt.id,
                      ),
                    })
                  }
                  className="flex items-center justify-between rounded-2xl border border-border bg-background p-4 text-left hover:bg-accent"
                >
                  <span className="text-sm">{t(opt.labelKey)}</span>
                  <Checkbox checked={checked} />
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* Step 7: avoid content */}
      {localStep === 7 ? (
        <div className="space-y-2">
          <div className="text-sm font-semibold">
            {t("onboarding.business.avoidContent")}
          </div>
          <Textarea
            value={value.avoid_content}
            onChange={(e) =>
              onChange({ ...value, avoid_content: e.target.value })
            }
            placeholder={t("onboarding.business.avoidContentPlaceholder")}
          />
        </div>
      ) : null}
    </div>
  );
}
