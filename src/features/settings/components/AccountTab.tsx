import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { fetchFullProfile, updateProfile } from "@/api/billing.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LogoutSection } from "@/features/auth/components/LogoutSection";

type ProfileData = {
  creator_name: string;
  entity_type: "creator" | "business";
  onboarding_profile: Record<string, unknown>;
  onboarding_completed: boolean;
};

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function TagsDisplay({ items }: { items: string[] }) {
  if (!items.length) return <span className="text-sm text-muted-foreground">—</span>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <Badge key={item} variant="secondary" className="rounded-full text-xs">
          {item}
        </Badge>
      ))}
    </div>
  );
}

function weeklyHoursLabel(val: string): string {
  const map: Record<string, string> = {
    "0_2": "0–2 hours",
    "3_5": "3–5 hours",
    "6_10": "6–10 hours",
    "10_plus": "10+ hours",
  };
  return map[val] ?? (val || "—");
}

function budgetLabel(val: string): string {
  const map: Record<string, string> = {
    no: "No",
    some: "Some",
    yes: "Yes",
  };
  return map[val] ?? (val || "—");
}

export function AccountTab() {
  const { t } = useTranslation();
  const { getAccessToken } = useAuthFetch();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Editable fields
  const [creatorName, setCreatorName] = useState("");
  const [rawOnboarding, setRawOnboarding] = useState<Record<string, unknown>>({});
  const [fields, setFields] = useState<Record<string, unknown>>({});

  useEffect(() => {
    (async () => {
      try {
        const token = await getAccessToken();
        if (!token) return;
        const data = await fetchFullProfile(token);
        setProfile(data);
        setCreatorName(data.creator_name ?? "");

        // onboarding_profile is { entityType, creator: {...} } or { entityType, business: {...} }
        const raw = (data.onboarding_profile ?? {}) as Record<string, unknown>;
        setRawOnboarding(raw);

        const nested =
          data.entity_type === "creator"
            ? (raw.creator as Record<string, unknown>) ?? {}
            : (raw.business as Record<string, unknown>) ?? {};
        setFields(nested);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updateField(key: string, value: unknown) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const token = await getAccessToken();
      if (!token) return;

      const subKey = profile?.entity_type === "creator" ? "creator" : "business";
      const updatedOnboarding = {
        ...rawOnboarding,
        [subKey]: fields,
      };

      await updateProfile(token, {
        creator_name: creatorName,
        onboarding_profile: updatedOnboarding,
      });
      setRawOnboarding(updatedOnboarding);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="py-10 text-sm text-muted-foreground">
        {t("common.loading", { defaultValue: "Loading…" })}
      </div>
    );
  }

  if (!profile) return null;

  const isCreator = profile.entity_type === "creator";

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h3 className="text-base font-semibold">
          {t("settings.account.title", { defaultValue: "Account & profile" })}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t("settings.account.subtitle", { defaultValue: "Edit your profile and onboarding data. Changes affect future AI generation." })}
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>
      )}
      {success && (
        <div className="rounded-md bg-green-500/10 px-3 py-2 text-sm text-green-600">
          {t("settings.account.saved", { defaultValue: "Profile saved successfully." })}
        </div>
      )}

      {/* Basic info */}
      <Card className="border-0 surface-solid">
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="rounded-full capitalize">
              {profile.entity_type}
            </Badge>
          </div>

          <FieldRow label={t("settings.account.name", { defaultValue: "Display name" })}>
            <Input
              value={creatorName}
              onChange={(e) => setCreatorName(e.target.value)}
            />
          </FieldRow>
        </CardContent>
      </Card>

      {/* Goals & Strategy */}
      <Card className="border-0 surface-solid">
        <CardContent className="space-y-4 pt-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {isCreator
              ? t("settings.account.goalsSection", { defaultValue: "Goals & outcomes" })
              : t("settings.account.businessSection", { defaultValue: "Business info" })}
          </p>

          {isCreator ? (
            <>
              <FieldRow label={t("settings.account.goals", { defaultValue: "Goals" })}>
                <Textarea
                  value={(fields.goals as string) ?? ""}
                  onChange={(e) => updateField("goals", e.target.value)}
                  rows={2}
                />
              </FieldRow>
              <FieldRow label={t("settings.account.challenges", { defaultValue: "Challenges" })}>
                <Textarea
                  value={(fields.challenges as string) ?? ""}
                  onChange={(e) => updateField("challenges", e.target.value)}
                  rows={2}
                />
              </FieldRow>
              <FieldRow label={t("settings.account.outcomes", { defaultValue: "3–6 month outcomes" })}>
                <Textarea
                  value={(fields.outcomes_3_6_months as string) ?? ""}
                  onChange={(e) => updateField("outcomes_3_6_months", e.target.value)}
                  rows={2}
                />
              </FieldRow>
            </>
          ) : (
            <>
              <FieldRow label={t("settings.account.industry", { defaultValue: "Industry" })}>
                <Input
                  value={(fields.industry as string) ?? ""}
                  onChange={(e) => updateField("industry", e.target.value)}
                />
              </FieldRow>
              <FieldRow label={t("settings.account.products", { defaultValue: "Products / services" })}>
                <Textarea
                  value={(fields.products_services as string) ?? ""}
                  onChange={(e) => updateField("products_services", e.target.value)}
                  rows={2}
                />
              </FieldRow>
              <FieldRow label={t("settings.account.kpiTargets", { defaultValue: "KPI targets" })}>
                <Textarea
                  value={(fields.kpi_targets as string) ?? ""}
                  onChange={(e) => updateField("kpi_targets", e.target.value)}
                  rows={2}
                />
              </FieldRow>
              <FieldRow label={t("settings.account.idealCustomer", { defaultValue: "Ideal customer" })}>
                <Textarea
                  value={(fields.ideal_customer as string) ?? ""}
                  onChange={(e) => updateField("ideal_customer", e.target.value)}
                  rows={2}
                />
              </FieldRow>
            </>
          )}
        </CardContent>
      </Card>

      {/* Audience (creator only) */}
      {isCreator && (
        <Card className="border-0 surface-solid">
          <CardContent className="space-y-4 pt-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {t("settings.account.audienceSection", { defaultValue: "Audience" })}
            </p>
            <FieldRow label={t("settings.account.ageRanges", { defaultValue: "Age ranges" })}>
              <TagsDisplay items={(fields.audience_age_ranges as string[]) ?? []} />
            </FieldRow>
            <FieldRow label={t("settings.account.genders", { defaultValue: "Genders" })}>
              <TagsDisplay items={(fields.audience_genders as string[]) ?? []} />
            </FieldRow>
            <FieldRow label={t("settings.account.locations", { defaultValue: "Locations" })}>
              <TagsDisplay items={(fields.audience_locations as string[]) ?? []} />
            </FieldRow>
            <FieldRow label={t("settings.account.interests", { defaultValue: "Interests" })}>
              <Textarea
                value={(fields.audience_interests as string) ?? ""}
                onChange={(e) => updateField("audience_interests", e.target.value)}
                rows={2}
              />
            </FieldRow>
            <FieldRow label={t("settings.account.problems", { defaultValue: "Problems they face" })}>
              <Textarea
                value={(fields.audience_problems as string) ?? ""}
                onChange={(e) => updateField("audience_problems", e.target.value)}
                rows={2}
              />
            </FieldRow>
          </CardContent>
        </Card>
      )}

      {/* Content style */}
      <Card className="border-0 surface-solid">
        <CardContent className="space-y-4 pt-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {t("settings.account.contentSection", { defaultValue: "Content & style" })}
          </p>

          {isCreator ? (
            <>
              <FieldRow label={t("settings.account.voiceStyles", { defaultValue: "Voice styles" })}>
                <TagsDisplay items={(fields.voice_styles as string[]) ?? []} />
              </FieldRow>
              <FieldRow label={t("settings.account.contentTypes", { defaultValue: "Content types" })}>
                <TagsDisplay items={(fields.content_types as string[]) ?? []} />
              </FieldRow>
              <FieldRow label={t("settings.account.valuesThemes", { defaultValue: "Values & themes" })}>
                <TagsDisplay items={(fields.values_themes as string[]) ?? []} />
              </FieldRow>
            </>
          ) : (
            <FieldRow label={t("settings.account.preferredContentTypes", { defaultValue: "Preferred content types" })}>
              <TagsDisplay items={(fields.preferred_content_types as string[]) ?? []} />
            </FieldRow>
          )}

          <FieldRow label={t("settings.account.avoidContent", { defaultValue: "Content to avoid" })}>
            <Textarea
              value={(fields.avoid_content as string) ?? ""}
              onChange={(e) => updateField("avoid_content", e.target.value)}
              rows={2}
            />
          </FieldRow>
        </CardContent>
      </Card>

      {/* Resources & platforms */}
      <Card className="border-0 surface-solid">
        <CardContent className="space-y-4 pt-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {t("settings.account.resourcesSection", { defaultValue: "Resources & platforms" })}
          </p>

          <FieldRow label={t("settings.account.weeklyHours", { defaultValue: "Weekly hours" })}>
            <p className="text-sm">{weeklyHoursLabel((fields.weekly_hours as string) ?? "")}</p>
          </FieldRow>

          <FieldRow
            label={isCreator
              ? t("settings.account.teamBudget", { defaultValue: "Team / budget" })
              : t("settings.account.adsBudget", { defaultValue: "Ads budget" })}
          >
            <p className="text-sm">
              {budgetLabel(
                (isCreator
                  ? (fields.has_team_or_budget as string)
                  : (fields.has_ads_budget as string)) ?? "",
              )}
            </p>
          </FieldRow>

          <FieldRow label={t("settings.account.platforms", { defaultValue: "Platforms" })}>
            <TagsDisplay items={(fields.platforms as string[]) ?? []} />
          </FieldRow>

          <FieldRow label={t("settings.account.primaryPlatform", { defaultValue: "Primary platform" })}>
            <p className="text-sm capitalize">{(fields.primary_platform as string) || "—"}</p>
          </FieldRow>

          {isCreator && (
            <FieldRow label={t("settings.account.postingFrequency", { defaultValue: "Posting frequency" })}>
              <Input
                value={(fields.posting_frequency as string) ?? ""}
                onChange={(e) => updateField("posting_frequency", e.target.value)}
              />
            </FieldRow>
          )}
        </CardContent>
      </Card>

      {/* Save button */}
      <div className="flex items-center gap-3">
        <Button
          className="rounded-full bg-brand-warm text-brand-warm-foreground hover:opacity-90"
          onClick={handleSave}
          disabled={saving}
        >
          {saving
            ? t("common.saving", { defaultValue: "Saving…" })
            : t("common.save", { defaultValue: "Save changes" })}
        </Button>
      </div>

      {/* Logout */}
      <div className="pt-4">
        <LogoutSection />
      </div>
    </div>
  );
}
