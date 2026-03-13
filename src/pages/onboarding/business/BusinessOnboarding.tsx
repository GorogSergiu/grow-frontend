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
  { id: "educational", label: "Educațional" },
  { id: "behind_the_scenes", label: "Behind the scenes" },
  { id: "testimonials", label: "Testimoniale" },
  { id: "product_showcase", label: "Prezentare produs" },
  { id: "offers_promos", label: "Oferte / promoții" },
  { id: "authority_content", label: "Authority / expertiză" },
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

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
        <div className="text-sm font-semibold">
          {t("onboarding.business.title", { defaultValue: "Business Owner" })}
        </div>
      </div>

      {/* Step 1: industry + products/services */}
      {localStep === 1 ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm font-semibold">Domeniu</div>
            <Textarea
              value={value.industry}
              onChange={(e) => onChange({ ...value, industry: e.target.value })}
              placeholder="Ex: beauty, fitness, e-commerce, servicii locale…"
            />
          </div>

          <div className="space-y-2">
            <div className="text-sm font-semibold">Produse / servicii</div>
            <Textarea
              value={value.products_services}
              onChange={(e) =>
                onChange({ ...value, products_services: e.target.value })
              }
              placeholder="Ce vinzi, pe scurt + ce te diferențiază."
            />
          </div>
        </div>
      ) : null}

      {/* Step 2: social goals + KPI */}
      {localStep === 2 ? (
        <div className="space-y-5">
          <div className="space-y-3">
            <div className="text-sm font-semibold">Scopuri social media</div>
            <div className="grid gap-3 md:grid-cols-2">
              {(
                [
                  ["leads", "Lead-uri"],
                  ["sales", "Vânzări directe"],
                  ["traffic", "Trafic website"],
                  ["awareness", "Awareness"],
                ] as const
              ).map(([id, label]) => {
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
                    <span className="text-sm">{label}</span>
                    <Checkbox checked={checked} />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-semibold">KPI targets</div>
            <Textarea
              value={value.kpi_targets}
              onChange={(e) =>
                onChange({ ...value, kpi_targets: e.target.value })
              }
              placeholder="Ex: 50 lead-uri/lună, 10 vânzări din IG, 3% CTR…"
            />
          </div>
        </div>
      ) : null}

      {/* Step 3: ideal customer */}
      {localStep === 3 ? (
        <div className="space-y-2">
          <div className="text-sm font-semibold">Clientul ideal</div>
          <Textarea
            value={value.ideal_customer}
            onChange={(e) =>
              onChange({ ...value, ideal_customer: e.target.value })
            }
            placeholder="Vârstă, locație, job, nevoi, obiceiuri online…"
          />
        </div>
      ) : null}

      {/* Step 4: time + ads budget */}
      {localStep === 4 ? (
        <div className="space-y-5">
          <div className="space-y-3">
            <div className="text-sm font-semibold">Câte ore / săptămână?</div>
            <RadioGroup
              value={value.weekly_hours}
              onValueChange={(v) =>
                onChange({
                  ...value,
                  weekly_hours: v as BusinessOnboardingProfile["weekly_hours"],
                })
              }
            >
              {(
                [
                  ["0_2", "0–2 ore"],
                  ["3_5", "3–5 ore"],
                  ["6_10", "6–10 ore"],
                  ["10_plus", "10+ ore"],
                ] as const
              ).map(([id, label]) => (
                <div
                  key={id}
                  className="flex items-center gap-3 rounded-2xl bg-background/60 p-4 hover:bg-accent transition-colors"
                >
                  <RadioGroupItem value={id} id={`bh-${id}`} />
                  <Label htmlFor={`bh-${id}`}>{label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-semibold">Buget ads / tool-uri?</div>
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
              {(
                [
                  ["no", "Nu"],
                  ["some", "Un pic (ocazional)"],
                  ["yes", "Da (constant)"],
                ] as const
              ).map(([id, label]) => (
                <div
                  key={id}
                  className="flex items-center gap-3 rounded-2xl bg-background/60 p-4 hover:bg-accent transition-colors"
                >
                  <RadioGroupItem value={id} id={`ab-${id}`} />
                  <Label htmlFor={`ab-${id}`}>{label}</Label>
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
            <div className="text-sm font-semibold">Platforme</div>
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
                    <span className="text-sm">{p}</span>
                    <Checkbox checked={checked} />
                  </button>
                );
              })}
            </div>
            {value.platforms.length === 0 ? (
              <div className="text-xs text-destructive">
                Selectează cel puțin o platformă.
              </div>
            ) : null}
          </div>

          <div className="space-y-3">
            <div className="text-sm font-semibold">Platforma principală</div>
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
                  <Label htmlFor={`bp-${p}`}>{p}</Label>
                </div>
              ))}
            </RadioGroup>

            {value.platforms.length > 0 && !value.primary_platform ? (
              <div className="text-xs text-destructive">
                Alege o platformă principală.
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* Step 6: preferred content types */}
      {localStep === 6 ? (
        <div className="space-y-3">
          <div className="text-sm font-semibold">
            Tipuri de conținut preferate
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
                  <span className="text-sm">{opt.label}</span>
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
          <div className="text-sm font-semibold">Ce conținut eviți?</div>
          <Textarea
            value={value.avoid_content}
            onChange={(e) =>
              onChange({ ...value, avoid_content: e.target.value })
            }
            placeholder="Ex: video lung, trenduri, ceva ce nu se potrivește brandului…"
          />
        </div>
      ) : null}
    </div>
  );
}
