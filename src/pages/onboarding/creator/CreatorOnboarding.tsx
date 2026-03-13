import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export type Platform = "tiktok" | "instagram" | "youtube";

export type CreatorOnboardingProfile = {
  goals: string; // free text
  challenges: string; // free text
  outcomes_3_6_months: string; // free text
  audience_ideal: string; // free text
  voice_unique: string; // free text
  content_types: string[]; // multi
  values_themes: string; // free text
  weekly_hours: "0_2" | "3_5" | "6_10" | "10_plus" | "";
  has_team_or_budget: "no" | "some" | "yes" | "";
  primary_platform: Platform | "";
  platforms: Platform[]; // multi
  posting_frequency: string; // free text (for now)
  avoid_content: string; // free text
};

function toggleInArray<T extends string>(arr: T[], value: T) {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

export default function CreatorOnboarding({
  step,
  value,
  onChange,
}: {
  step: number;
  totalSteps: number;
  value: CreatorOnboardingProfile;
  onChange: (next: CreatorOnboardingProfile) => void;
}) {
  const { t } = useTranslation();

  // map steps (Creator = 6 steps, starting from global step 2)
  // global step: 2..7 -> local: 1..6
  const localStep = useMemo(() => Math.max(1, step - 1), [step]);

  const contentTypeOptions = useMemo(
    () =>
      [
        { id: "vlog", labelKey: "onboarding.creator.contentTypeOptions.vlog" },
        { id: "tutorial", labelKey: "onboarding.creator.contentTypeOptions.tutorial" },
        { id: "challenge", labelKey: "onboarding.creator.contentTypeOptions.challenge" },
        { id: "stories", labelKey: "onboarding.creator.contentTypeOptions.stories" },
        { id: "bts", labelKey: "onboarding.creator.contentTypeOptions.bts" },
        { id: "reviews", labelKey: "onboarding.creator.contentTypeOptions.reviews" },
      ] as const,
    [],
  );

  const weeklyHoursOptions = useMemo(
    () =>
      [
        ["0_2", "onboarding.creator.weeklyHoursOptions.0_2"],
        ["3_5", "onboarding.creator.weeklyHoursOptions.3_5"],
        ["6_10", "onboarding.creator.weeklyHoursOptions.6_10"],
        ["10_plus", "onboarding.creator.weeklyHoursOptions.10_plus"],
      ] as const,
    [],
  );

  const teamBudgetOptions = useMemo(
    () =>
      [
        ["no", "onboarding.creator.teamBudgetOptions.no"],
        ["some", "onboarding.creator.teamBudgetOptions.some"],
        ["yes", "onboarding.creator.teamBudgetOptions.yes"],
      ] as const,
    [],
  );

  const platforms = ["tiktok", "instagram", "youtube"] as Platform[];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
        <div className="text-sm font-semibold">
          {t("onboarding.creator.title")}
        </div>
      </div>

      {/* Local Step 1: goals + outcomes */}
      {localStep === 1 ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm font-semibold">
              {t("onboarding.creator.goals")}
            </div>
            <Textarea
              value={value.goals}
              onChange={(e) => onChange({ ...value, goals: e.target.value })}
              placeholder={t("onboarding.creator.goalsPlaceholder")}
            />
          </div>

          <div className="space-y-2">
            <div className="text-sm font-semibold">
              {t("onboarding.creator.outcomes")}
            </div>
            <Textarea
              value={value.outcomes_3_6_months}
              onChange={(e) =>
                onChange({ ...value, outcomes_3_6_months: e.target.value })
              }
              placeholder={t("onboarding.creator.outcomesPlaceholder")}
            />
          </div>
        </div>
      ) : null}

      {/* Local Step 2: challenges */}
      {localStep === 2 ? (
        <div className="space-y-2">
          <div className="text-sm font-semibold">
            {t("onboarding.creator.challenges")}
          </div>
          <Textarea
            value={value.challenges}
            onChange={(e) => onChange({ ...value, challenges: e.target.value })}
            placeholder={t("onboarding.creator.challengesPlaceholder")}
          />
        </div>
      ) : null}

      {/* Local Step 3: audience */}
      {localStep === 3 ? (
        <div className="space-y-2">
          <div className="text-sm font-semibold">
            {t("onboarding.creator.audience")}
          </div>
          <Textarea
            value={value.audience_ideal}
            onChange={(e) =>
              onChange({ ...value, audience_ideal: e.target.value })
            }
            placeholder={t("onboarding.creator.audiencePlaceholder")}
          />
        </div>
      ) : null}

      {/* Local Step 4: voice + types + values */}
      {localStep === 4 ? (
        <div className="space-y-5">
          <div className="space-y-2">
            <div className="text-sm font-semibold">
              {t("onboarding.creator.voice")}
            </div>
            <Textarea
              value={value.voice_unique}
              onChange={(e) =>
                onChange({ ...value, voice_unique: e.target.value })
              }
              placeholder={t("onboarding.creator.voicePlaceholder")}
            />
          </div>

          <div className="space-y-3">
            <div className="text-sm font-semibold">
              {t("onboarding.creator.contentTypes")}
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {contentTypeOptions.map((opt) => {
                const checked = value.content_types.includes(opt.id);
                return (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() =>
                      onChange({
                        ...value,
                        content_types: toggleInArray(
                          value.content_types,
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

          <div className="space-y-2">
            <div className="text-sm font-semibold">
              {t("onboarding.creator.values")}
            </div>
            <Textarea
              value={value.values_themes}
              onChange={(e) =>
                onChange({ ...value, values_themes: e.target.value })
              }
              placeholder={t("onboarding.creator.valuesPlaceholder")}
            />
          </div>
        </div>
      ) : null}

      {/* Local Step 5: time + resources */}
      {localStep === 5 ? (
        <div className="space-y-5">
          <div className="space-y-3">
            <div className="text-sm font-semibold">
              {t("onboarding.creator.weeklyHours")}
            </div>
            <RadioGroup
              value={value.weekly_hours}
              onValueChange={(v) =>
                onChange({
                  ...value,
                  weekly_hours: v as CreatorOnboardingProfile["weekly_hours"],
                })
              }
            >
              {weeklyHoursOptions.map(([id, labelKey]) => (
                <div
                  key={id}
                  className="flex items-center gap-3 rounded-2xl bg-background/60 p-4 hover:bg-accent transition-colors"
                >
                  <RadioGroupItem value={id} id={`wh-${id}`} />
                  <Label htmlFor={`wh-${id}`}>{t(labelKey)}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-semibold">
              {t("onboarding.creator.teamBudget")}
            </div>
            <RadioGroup
              value={value.has_team_or_budget}
              onValueChange={(v) =>
                onChange({
                  ...value,
                  has_team_or_budget:
                    v as CreatorOnboardingProfile["has_team_or_budget"],
                })
              }
            >
              {teamBudgetOptions.map(([id, labelKey]) => (
                <div
                  key={id}
                  className="flex items-center gap-3 rounded-2xl bg-background/60 p-4 hover:bg-accent transition-colors"
                >
                  <RadioGroupItem value={id} id={`tb-${id}`} />
                  <Label htmlFor={`tb-${id}`}>{t(labelKey)}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      ) : null}

      {/* Local Step 6: platforms + primary + frequency + avoid */}
      {localStep === 6 ? (
        <div className="space-y-5">
          <div className="space-y-3">
            <div className="text-sm font-semibold">
              {t("onboarding.creator.platforms")}
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

                      let nextPrimary: CreatorOnboardingProfile["primary_platform"] =
                        value.primary_platform;

                      const removedPrimary =
                        checked && value.primary_platform === p;
                      if (removedPrimary) {
                        nextPrimary = (nextPlatforms[0] ??
                          "") as CreatorOnboardingProfile["primary_platform"];
                      }

                      const primaryNotSelected =
                        nextPrimary && !nextPlatforms.includes(nextPrimary);

                      if (primaryNotSelected) {
                        nextPrimary = (nextPlatforms[0] ??
                          "") as CreatorOnboardingProfile["primary_platform"];
                      }

                      const shouldAutoselectPrimary =
                        !value.primary_platform &&
                        !checked &&
                        nextPlatforms.length > 0;

                      if (shouldAutoselectPrimary) {
                        nextPrimary = p;
                      }

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
                {t("onboarding.creator.selectPlatform")}
              </div>
            ) : null}
          </div>

          <div className="space-y-3">
            <div className="text-sm font-semibold">
              {t("onboarding.creator.primaryPlatform")}
            </div>
            <RadioGroup
              value={value.primary_platform}
              onValueChange={(v) =>
                onChange({
                  ...value,
                  primary_platform:
                    v as CreatorOnboardingProfile["primary_platform"],
                })
              }
            >
              {value.platforms.map((p) => (
                <div
                  key={p}
                  className="flex items-center gap-3 rounded-2xl bg-background/60 p-4 hover:bg-accent transition-colors"
                >
                  <RadioGroupItem value={p} id={`pp-${p}`} />
                  <Label htmlFor={`pp-${p}`}>{t(`dashboard.platforms.${p}`)}</Label>
                </div>
              ))}
            </RadioGroup>
            {value.platforms.length > 0 && !value.primary_platform ? (
              <div className="text-xs text-destructive">
                {t("onboarding.creator.choosePrimary")}
              </div>
            ) : null}
          </div>

          <div className="space-y-2">
            <div className="text-sm font-semibold">
              {t("onboarding.creator.postingFrequency")}
            </div>
            <Textarea
              value={value.posting_frequency}
              onChange={(e) =>
                onChange({ ...value, posting_frequency: e.target.value })
              }
              placeholder={t("onboarding.creator.postingFrequencyPlaceholder")}
            />
          </div>

          <div className="space-y-2">
            <div className="text-sm font-semibold">
              {t("onboarding.creator.avoidContent")}
            </div>
            <Textarea
              value={value.avoid_content}
              onChange={(e) =>
                onChange({ ...value, avoid_content: e.target.value })
              }
              placeholder={t("onboarding.creator.avoidContentPlaceholder")}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
