import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

import type { CreatorOnboardingProfile } from "@/features/onboarding/types/creator.types";
import type { Platform } from "@/types/platform.types";

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

  const localStep = useMemo(() => Math.max(1, step - 1), [step]);

  const voiceStyleOptions = useMemo(
    () => [
      { id: "educational",    label: "Educational" },
      { id: "entertaining",   label: "Entertaining" },
      { id: "inspirational",  label: "Inspirational" },
      { id: "humorous",       label: "Humorous" },
      { id: "authentic",      label: "Authentic & raw" },
      { id: "storytelling",   label: "Storytelling" },
      { id: "motivational",   label: "Motivational" },
      { id: "opinionated",    label: "Opinionated" },
      { id: "calm",           label: "Calm & mindful" },
      { id: "professional",   label: "Professional" },
    ],
    [],
  );

  const contentTypeOptions = useMemo(
    () => [
      { id: "how_to",        label: "How-to & tutorials" },
      { id: "day_in_life",   label: "Day in my life" },
      { id: "bts",           label: "Behind the scenes" },
      { id: "tips_tricks",   label: "Tips & tricks" },
      { id: "storytelling",  label: "Storytelling" },
      { id: "reviews",       label: "Product reviews" },
      { id: "opinion",       label: "Opinion & hot takes" },
      { id: "qa",            label: "Q&A" },
      { id: "challenges",    label: "Challenges & trends" },
      { id: "motivation",    label: "Motivation & inspiration" },
      { id: "reactions",     label: "Reactions" },
      { id: "series",        label: "Series & episodic" },
    ],
    [],
  );

  const valuesThemesOptions = useMemo(
    () => [
      { id: "health",         label: "Health & wellness" },
      { id: "growth",         label: "Personal growth" },
      { id: "relationships",  label: "Relationships & community" },
      { id: "creativity",     label: "Creativity & art" },
      { id: "finance",        label: "Finance & money" },
      { id: "travel",         label: "Travel & adventure" },
      { id: "food",           label: "Food & lifestyle" },
      { id: "fashion",        label: "Fashion & beauty" },
      { id: "tech",           label: "Tech & innovation" },
      { id: "business",       label: "Business & entrepreneurship" },
      { id: "sustainability", label: "Sustainability" },
      { id: "sports",         label: "Sports & fitness" },
      { id: "parenting",      label: "Parenting & family" },
      { id: "entertainment",  label: "Entertainment & pop culture" },
      { id: "education",      label: "Education & learning" },
    ],
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

      {localStep === 3 ? (
        <div className="space-y-6">
          {/* Age range — mandatory */}
          <div className="space-y-3">
            <div className="space-y-0.5">
              <div className="text-sm font-semibold">
                {t("onboarding.creator.audienceAge", { defaultValue: "Age range" })}
              </div>
              <div className="text-xs text-muted-foreground">
                {t("onboarding.creator.audienceAgeHint", { defaultValue: "Select all that apply" })}
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              {(["13–17", "18–24", "25–34", "35–44", "45–54", "55+"] as const).map((range) => {
                const checked = value.audience_age_ranges.includes(range);
                return (
                  <button
                    type="button"
                    key={range}
                    onClick={() =>
                      onChange({
                        ...value,
                        audience_age_ranges: toggleInArray(value.audience_age_ranges, range),
                      })
                    }
                    className="flex items-center justify-between rounded-2xl border border-border bg-background p-3 text-left hover:bg-accent"
                  >
                    <span className="text-sm">{range}</span>
                    <Checkbox checked={checked} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Gender — mandatory */}
          <div className="space-y-3">
            <div className="space-y-0.5">
              <div className="text-sm font-semibold">
                {t("onboarding.creator.audienceGender", { defaultValue: "Gender" })}
              </div>
              <div className="text-xs text-muted-foreground">
                {t("onboarding.creator.audienceGenderHint", { defaultValue: "Select all that apply" })}
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {(["Male", "Female", "Non-binary", "All genders"] as const).map((gender) => {
                const checked = value.audience_genders.includes(gender);
                return (
                  <button
                    type="button"
                    key={gender}
                    onClick={() =>
                      onChange({
                        ...value,
                        audience_genders: toggleInArray(value.audience_genders, gender),
                      })
                    }
                    className="flex items-center justify-between rounded-2xl border border-border bg-background p-3 text-left hover:bg-accent"
                  >
                    <span className="text-sm">{gender}</span>
                    <Checkbox checked={checked} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location — mandatory */}
          <div className="space-y-3">
            <div className="space-y-0.5">
              <div className="text-sm font-semibold">
                {t("onboarding.creator.audienceLocation", { defaultValue: "Location" })}
              </div>
              <div className="text-xs text-muted-foreground">
                {t("onboarding.creator.audienceLocationHint", { defaultValue: "Where is your audience based?" })}
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              {(["Local", "National", "Global"] as const).map((loc) => {
                const checked = value.audience_locations.includes(loc);
                return (
                  <button
                    type="button"
                    key={loc}
                    onClick={() =>
                      onChange({
                        ...value,
                        audience_locations: toggleInArray(value.audience_locations, loc),
                      })
                    }
                    className="flex items-center justify-between rounded-2xl border border-border bg-background p-3 text-left hover:bg-accent"
                  >
                    <span className="text-sm">{loc}</span>
                    <Checkbox checked={checked} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interests — optional */}
          <div className="space-y-2">
            <div className="space-y-0.5">
              <div className="text-sm font-semibold">
                {t("onboarding.creator.audienceInterests", { defaultValue: "Interests" })}
                <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                  {t("common.optional", { defaultValue: "optional" })}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                {t("onboarding.creator.audienceInterestsHint", { defaultValue: "What topics, hobbies, or passions does your audience have?" })}
              </div>
            </div>
            <Input
              value={value.audience_interests}
              onChange={(e) => onChange({ ...value, audience_interests: e.target.value })}
              placeholder={t("onboarding.creator.audienceInterestsPlaceholder", { defaultValue: "e.g. fitness, travel, personal finance…" })}
            />
          </div>

          {/* Problems — optional */}
          <div className="space-y-2">
            <div className="space-y-0.5">
              <div className="text-sm font-semibold">
                {t("onboarding.creator.audienceProblems", { defaultValue: "Pain points & problems" })}
                <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                  {t("common.optional", { defaultValue: "optional" })}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                {t("onboarding.creator.audienceProblemsHint", { defaultValue: "What struggles or frustrations does your audience face?" })}
              </div>
            </div>
            <Input
              value={value.audience_problems}
              onChange={(e) => onChange({ ...value, audience_problems: e.target.value })}
              placeholder={t("onboarding.creator.audienceProblemsPlaceholder", { defaultValue: "e.g. lack of time, overwhelmed by information…" })}
            />
          </div>
        </div>
      ) : null}

      {localStep === 4 ? (
        <div className="space-y-8">

          {/* Voice styles */}
          <div className="space-y-3">
            <div className="space-y-0.5">
              <div className="text-sm font-semibold">
                {t("onboarding.creator.voice", { defaultValue: "Your content style" })}
              </div>
              <div className="text-xs text-muted-foreground">
                {t("onboarding.creator.voiceHint", { defaultValue: "How would you describe the way you communicate? Pick all that feel right." })}
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {voiceStyleOptions.map((opt) => {
                const checked = value.voice_styles.includes(opt.id);
                return (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() =>
                      onChange({
                        ...value,
                        voice_styles: toggleInArray(value.voice_styles, opt.id),
                      })
                    }
                    className="flex items-center justify-between rounded-2xl border border-border bg-background p-3 text-left hover:bg-accent"
                  >
                    <span className="text-sm">{opt.label}</span>
                    <Checkbox checked={checked} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content types */}
          <div className="space-y-3">
            <div className="space-y-0.5">
              <div className="text-sm font-semibold">
                {t("onboarding.creator.contentTypes", { defaultValue: "Content types that represent you" })}
              </div>
              <div className="text-xs text-muted-foreground">
                {t("onboarding.creator.contentTypesHint", { defaultValue: "What formats do you use or want to create?" })}
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {contentTypeOptions.map((opt) => {
                const checked = value.content_types.includes(opt.id);
                return (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() =>
                      onChange({
                        ...value,
                        content_types: toggleInArray(value.content_types, opt.id),
                      })
                    }
                    className="flex items-center justify-between rounded-2xl border border-border bg-background p-3 text-left hover:bg-accent"
                  >
                    <span className="text-sm">{opt.label}</span>
                    <Checkbox checked={checked} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Values / recurring themes */}
          <div className="space-y-3">
            <div className="space-y-0.5">
              <div className="text-sm font-semibold">
                {t("onboarding.creator.values", { defaultValue: "Recurring themes" })}
              </div>
              <div className="text-xs text-muted-foreground">
                {t("onboarding.creator.valuesHint", { defaultValue: "What topics do you keep coming back to in your content?" })}
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {valuesThemesOptions.map((opt) => {
                const checked = value.values_themes.includes(opt.id);
                return (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() =>
                      onChange({
                        ...value,
                        values_themes: toggleInArray(value.values_themes, opt.id),
                      })
                    }
                    className="flex items-center justify-between rounded-2xl border border-border bg-background p-3 text-left hover:bg-accent"
                  >
                    <span className="text-sm">{opt.label}</span>
                    <Checkbox checked={checked} />
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      ) : null}

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
