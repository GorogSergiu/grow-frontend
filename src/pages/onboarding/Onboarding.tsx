import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

import CreatorOnboarding from "./creator/CreatorOnboarding";
import BusinessOnboarding from "./business/BusinessOnboarding";

import type { CreatorOnboardingProfile } from "./creator/CreatorOnboarding";
import type { BusinessOnboardingProfile } from "@/pages/onboarding/business/types/business.types";
import { getDefaultBusinessProfile } from "@/pages/onboarding/business/types/business.types";

type EntityType = "creator" | "business";

type OnboardingProfile =
  | { entityType: "creator"; creator: CreatorOnboardingProfile }
  | { entityType: "business"; business: BusinessOnboardingProfile };

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function getTotalSteps(entityType: EntityType | "") {
  if (!entityType) return 1;
  return entityType === "creator" ? 7 : 8;
}

function getDefaultCreatorProfile(): CreatorOnboardingProfile {
  return {
    goals: "",
    challenges: "",
    outcomes_3_6_months: "",
    audience_ideal: "",
    voice_unique: "",
    content_types: [],
    values_themes: "",
    weekly_hours: "",
    has_team_or_budget: "",
    primary_platform: "",
    platforms: ["tiktok", "instagram"],
    posting_frequency: "",
    avoid_content: "",
  };
}

export default function OnboardingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [checking, setChecking] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [entityType, setEntityType] = useState<EntityType | "">("");
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<OnboardingProfile | null>(null);

  const totalSteps = useMemo(() => getTotalSteps(entityType), [entityType]);

  const safeStep = useMemo(
    () => clamp(step, 1, totalSteps),
    [step, totalSteps],
  );

  const progress = useMemo(
    () => (safeStep / totalSteps) * 100,
    [safeStep, totalSteps],
  );

  useEffect(() => {
    let cancelled = false;

    async function init() {
      setError(null);

      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;

      if (!userId) {
        navigate("/login", { replace: true });
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("onboarding_completed, entity_type, onboarding_profile")
        .eq("id", userId)
        .single();

      if (cancelled) return;

      if (error) {
        setError(error.message);
        setChecking(false);
        return;
      }

      if (data?.onboarding_completed) {
        navigate("/dashboard", { replace: true });
        return;
      }

      const et = (data?.entity_type as EntityType) ?? "";
      const p = (data?.onboarding_profile ?? null) as OnboardingProfile | null;

      // dacă onboardingul nu e complet, pornim mereu din pasul 1
      setStep(1);

      // preîncărcăm doar dacă există date coerente
      if (et === "creator") {
        setEntityType("creator");

        if (p?.entityType === "creator") {
          setProfile(p);
        } else {
          setProfile({
            entityType: "creator",
            creator: getDefaultCreatorProfile(),
          });
        }
      } else if (et === "business") {
        setEntityType("business");

        if (p?.entityType === "business") {
          setProfile(p);
        } else {
          setProfile({
            entityType: "business",
            business: getDefaultBusinessProfile(),
          });
        }
      } else {
        setEntityType("");
        setProfile(null);
      }

      setChecking(false);
    }

    init();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  function canContinueCurrentStep() {
    if (safeStep === 1) return Boolean(entityType);

    if (entityType === "creator") {
      const creator =
        profile?.entityType === "creator" ? profile.creator : null;
      if (!creator) return false;

      if (safeStep === 2) {
        return (
          creator.goals.trim().length > 0 &&
          creator.outcomes_3_6_months.trim().length > 0
        );
      }

      if (safeStep === 3) {
        return creator.challenges.trim().length > 0;
      }

      if (safeStep === 4) {
        return creator.audience_ideal.trim().length > 0;
      }

      if (safeStep === 5) {
        return (
          creator.voice_unique.trim().length > 0 &&
          creator.content_types.length > 0
        );
      }

      if (safeStep === 6) {
        return creator.weekly_hours !== "" && creator.has_team_or_budget !== "";
      }

      if (safeStep === 7) {
        return creator.platforms.length > 0 && creator.primary_platform !== "";
      }

      return false;
    }

    if (entityType === "business") {
      const business =
        profile?.entityType === "business" ? profile.business : null;
      if (!business) return false;

      if (safeStep === 2) {
        return (
          business.industry.trim().length > 0 &&
          business.products_services.trim().length > 0
        );
      }

      if (safeStep === 3) {
        return (
          business.social_goals.length > 0 &&
          business.kpi_targets.trim().length > 0
        );
      }

      if (safeStep === 4) {
        return business.ideal_customer.trim().length > 0;
      }

      if (safeStep === 5) {
        return business.weekly_hours !== "" && business.has_ads_budget !== "";
      }

      if (safeStep === 6) {
        return (
          business.platforms.length > 0 && business.primary_platform !== ""
        );
      }

      if (safeStep === 7) {
        return business.preferred_content_types.length > 0;
      }

      if (safeStep === 8) {
        return true;
      }

      return false;
    }

    return false;
  }

  async function savePartial(finalize: boolean) {
    setError(null);
    setSaving(true);

    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;

    if (!userId) {
      setSaving(false);
      navigate("/login", { replace: true });
      return false;
    }

    const payload = {
      entity_type: entityType || null,
      onboarding_profile: profile,
      onboarding_completed: finalize ? true : false,
    };

    const { error } = await supabase
      .from("profiles")
      .update(payload)
      .eq("id", userId);

    setSaving(false);

    if (error) {
      setError(error.message);
      return false;
    }

    return true;
  }

  async function onContinue() {
    if (!canContinueCurrentStep()) return;

    const ok = await savePartial(false);
    if (!ok) return;

    const ts = getTotalSteps(entityType);
    setStep((s) => clamp(s + 1, 1, ts));
  }

  function onBack() {
    const ts = getTotalSteps(entityType);
    setStep((s) => clamp(s - 1, 1, ts));
  }

  async function onFinish() {
    if (!canContinueCurrentStep()) return;

    const ok = await savePartial(true);
    if (!ok) return;

    navigate("/dashboard", { replace: true });
  }

  if (checking) {
    return (
      <div className="py-20 text-center text-muted-foreground">Loading…</div>
    );
  }

  return (
    <div className="py-20">
      <Card className="mx-auto w-full max-w-3xl border-0 surface">
        <CardHeader>
          <CardTitle>
            {t("onboarding.title", {
              defaultValue: "Let’s set up your strategy",
            })}
          </CardTitle>
          <CardDescription>
            {t("onboarding.subtitle", {
              defaultValue:
                "Answer a few questions so the AI can build a stronger social media strategy.",
            })}
          </CardDescription>

          <div className="mt-4 space-y-2">
            <div className="text-xs text-muted-foreground">
              {t("onboarding.step", {
                current: safeStep,
                total: totalSteps,
                defaultValue: `Step ${safeStep} / ${totalSteps}`,
              })}
            </div>
            <Progress value={progress} />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {safeStep === 1 ? (
            <div className="space-y-3">
              <div className="text-sm font-semibold">
                {t("onboarding.entityType.title", {
                  defaultValue: "Choose your profile type",
                })}
              </div>

              <RadioGroup
                value={entityType}
                onValueChange={(v) => {
                  const next = v as EntityType;
                  setEntityType(next);

                  if (next === "creator") {
                    setProfile({
                      entityType: "creator",
                      creator: getDefaultCreatorProfile(),
                    });
                    return;
                  }

                  setProfile({
                    entityType: "business",
                    business: getDefaultBusinessProfile(),
                  });
                }}
              >
                {(["creator", "business"] as EntityType[]).map((v) => {
                  const selected = entityType === v;
                  return (
                    <div
                      key={v}
                      className={[
                        "flex items-center gap-3 rounded-2xl p-4 transition-colors",
                        selected
                          ? "bg-accent"
                          : "bg-background/60 hover:bg-accent",
                      ].join(" ")}
                    >
                      <RadioGroupItem value={v} id={`entity-${v}`} />
                      <Label htmlFor={`entity-${v}`}>
                        {v === "creator"
                          ? t("onboarding.entityType.creator", {
                              defaultValue: "Content Creator",
                            })
                          : t("onboarding.entityType.business", {
                              defaultValue: "Business Owner",
                            })}
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
            </div>
          ) : null}

          {safeStep > 1 && entityType === "creator" ? (
            <CreatorOnboarding
              step={safeStep}
              totalSteps={totalSteps}
              value={
                profile?.entityType === "creator"
                  ? profile.creator
                  : getDefaultCreatorProfile()
              }
              onChange={(next) => {
                setProfile({
                  entityType: "creator",
                  creator: next,
                });
              }}
            />
          ) : null}

          {safeStep > 1 && entityType === "business" ? (
            <BusinessOnboarding
              step={safeStep}
              totalSteps={totalSteps}
              value={
                profile?.entityType === "business"
                  ? profile.business
                  : getDefaultBusinessProfile()
              }
              onChange={(next) => {
                setProfile({
                  entityType: "business",
                  business: next,
                });
              }}
            />
          ) : null}

          {error ? (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          ) : null}

          <div className="flex items-center justify-between pt-2">
            <Button
              variant="ghost"
              className="rounded-full"
              onClick={onBack}
              disabled={safeStep === 1 || saving}
            >
              {t("onboarding.back", { defaultValue: "Back" })}
            </Button>

            {safeStep < totalSteps ? (
              <Button
                className="rounded-full bg-brand-warm text-brand-warm-foreground hover:opacity-90"
                onClick={onContinue}
                disabled={!canContinueCurrentStep() || saving}
              >
                {saving
                  ? t("onboarding.saving", { defaultValue: "Saving…" })
                  : t("onboarding.continue", { defaultValue: "Continue" })}
              </Button>
            ) : (
              <Button
                className="rounded-full bg-brand-warm text-brand-warm-foreground hover:opacity-90"
                onClick={onFinish}
                disabled={!canContinueCurrentStep() || saving}
              >
                {saving
                  ? t("onboarding.saving", { defaultValue: "Saving…" })
                  : t("onboarding.finish", { defaultValue: "Finish" })}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
