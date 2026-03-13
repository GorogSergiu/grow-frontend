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
        { id: "vlog", label: "Vlog / day in my life" },
        { id: "tutorial", label: "Tutoriale / how-to" },
        { id: "challenge", label: "Challenge-uri" },
        { id: "stories", label: "Stories personale" },
        { id: "bts", label: "Behind the scenes" },
        { id: "reviews", label: "Reviews / recomandări" },
      ] as const,
    [],
  );

  const platforms = ["tiktok", "instagram", "youtube"] as Platform[];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
        <div className="text-sm font-semibold">
          {t("onboarding.creator.title", { defaultValue: "Content Creator" })}
        </div>
      </div>

      {/* Local Step 1: goals + outcomes */}
      {localStep === 1 ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm font-semibold">
              Obiectivele tale principale (următoarea perioadă)
            </div>
            <Textarea
              value={value.goals}
              onChange={(e) => onChange({ ...value, goals: e.target.value })}
              placeholder="Ex: creștere +20% urmăritori, colaborări cu branduri, monetizare…"
            />
          </div>

          <div className="space-y-2">
            <div className="text-sm font-semibold">
              Rezultate concrete în 3–6 luni
            </div>
            <Textarea
              value={value.outcomes_3_6_months}
              onChange={(e) =>
                onChange({ ...value, outcomes_3_6_months: e.target.value })
              }
              placeholder="Ex: 500k views/lună, ER 6%, 2 colaborări/lună…"
            />
          </div>
        </div>
      ) : null}

      {/* Local Step 2: challenges */}
      {localStep === 2 ? (
        <div className="space-y-2">
          <div className="text-sm font-semibold">Provocări acum</div>
          <Textarea
            value={value.challenges}
            onChange={(e) => onChange({ ...value, challenges: e.target.value })}
            placeholder="Ex: lipsă idei, timp limitat, performanță slabă…"
          />
        </div>
      ) : null}

      {/* Local Step 3: audience */}
      {localStep === 3 ? (
        <div className="space-y-2">
          <div className="text-sm font-semibold">Publicul ideal</div>
          <Textarea
            value={value.audience_ideal}
            onChange={(e) =>
              onChange({ ...value, audience_ideal: e.target.value })
            }
            placeholder="Vârstă, gen, locație, interese, probleme…"
          />
        </div>
      ) : null}

      {/* Local Step 4: voice + types + values */}
      {localStep === 4 ? (
        <div className="space-y-5">
          <div className="space-y-2">
            <div className="text-sm font-semibold">Vocea ta unică</div>
            <Textarea
              value={value.voice_unique}
              onChange={(e) =>
                onChange({ ...value, voice_unique: e.target.value })
              }
              placeholder="Ex: educativă, fun, raw/authentică…"
            />
          </div>

          <div className="space-y-3">
            <div className="text-sm font-semibold">
              Tipuri de conținut care te reprezintă
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
                    <span className="text-sm">{opt.label}</span>
                    <Checkbox checked={checked} />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-semibold">
              Teme recurente / valori de bază
            </div>
            <Textarea
              value={value.values_themes}
              onChange={(e) =>
                onChange({ ...value, values_themes: e.target.value })
              }
              placeholder="Ex: sustenabilitate, self growth, minimalism…"
            />
          </div>
        </div>
      ) : null}

      {/* Local Step 5: time + resources */}
      {localStep === 5 ? (
        <div className="space-y-5">
          <div className="space-y-3">
            <div className="text-sm font-semibold">Câte ore / săptămână?</div>
            <RadioGroup
              value={value.weekly_hours}
              onValueChange={(v) =>
                onChange({
                  ...value,
                  weekly_hours: v as CreatorOnboardingProfile["weekly_hours"],
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
                  <RadioGroupItem value={id} id={`wh-${id}`} />
                  <Label htmlFor={`wh-${id}`}>{label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-semibold">Echipă / buget?</div>
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
              {(
                [
                  ["no", "Nu"],
                  ["some", "Un pic (tool-uri / editor ocazional)"],
                  ["yes", "Da (echipă / buget constant)"],
                ] as const
              ).map(([id, label]) => (
                <div
                  key={id}
                  className="flex items-center gap-3 rounded-2xl bg-background/60 p-4 hover:bg-accent transition-colors"
                >
                  <RadioGroupItem value={id} id={`tb-${id}`} />
                  <Label htmlFor={`tb-${id}`}>{label}</Label>
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

                      // Dacă user a debifat platforma care era primary -> mutăm primary pe prima rămasă.
                      // Dacă user a bifat prima platformă și primary e gol -> o setăm primary.
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
                  <Label htmlFor={`pp-${p}`}>{p}</Label>
                </div>
              ))}
            </RadioGroup>
            {value.platforms.length > 0 && !value.primary_platform ? (
              <div className="text-xs text-destructive">
                Alege o platformă principală.
              </div>
            ) : null}
          </div>

          <div className="space-y-2">
            <div className="text-sm font-semibold">
              Frecvență de postare preferată (pe platforme)
            </div>
            <Textarea
              value={value.posting_frequency}
              onChange={(e) =>
                onChange({ ...value, posting_frequency: e.target.value })
              }
              placeholder="Ex: TikTok zilnic, Instagram 3x/săpt, YouTube 1x/săpt…"
            />
          </div>

          <div className="space-y-2">
            <div className="text-sm font-semibold">
              Ce conținut vrei să eviți?
            </div>
            <Textarea
              value={value.avoid_content}
              onChange={(e) =>
                onChange({ ...value, avoid_content: e.target.value })
              }
              placeholder="Ex: politică, content foarte lung, trenduri…"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
