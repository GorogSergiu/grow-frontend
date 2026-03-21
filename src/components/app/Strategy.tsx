import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import Loader from "@/components/Loader";

const API_URL = import.meta.env.VITE_API_URL;

type StrategyResponse = {
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
        platform: "instagram" | "tiktok" | "youtube";
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

type StrategyPeriodPreset = "1_month" | "3_months" | "6_months";
type StrategyPeriodType = "preset" | "custom";

function toIsoDateOnly(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function StrategyPage() {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [strategy, setStrategy] = useState<StrategyResponse["strategy"]>(null);
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [periodType, setPeriodType] = useState<StrategyPeriodType>("preset");
  const [preset, setPreset] = useState<StrategyPeriodPreset>("3_months");
  const [customRange, setCustomRange] = useState<DateRange | undefined>();
  const [overlapDialogOpen, setOverlapDialogOpen] = useState(false);
  const [pendingGeneratePayload, setPendingGeneratePayload] = useState<{
    periodType: "preset" | "custom";
    preset: "1_month" | "3_months" | "6_months" | null;
    startDate: string | null;
    endDate: string | null;
  } | null>(null);

  const [overlapInfo, setOverlapInfo] = useState<{
    overlapStart: string | null;
    overlapEnd: string | null;
  } | null>(null);

  const canContinueGenerate = useMemo(() => {
    if (periodType === "preset") return true;
    return Boolean(customRange?.from && customRange?.to);
  }, [periodType, customRange]);

  const getAccessToken = async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  };

  const loadStrategy = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = await getAccessToken();
      if (!token) return;

      const res = await fetch(`${API_URL}/api/strategy/latest`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const body: StrategyResponse = await res.json();

      if (!res.ok) {
        throw new Error(
          "strategy" in body
            ? "Failed to load strategy"
            : ((body as { error?: string }).error ?? "Failed to load strategy"),
        );
      }

      setStrategy(body.strategy);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Failed to load strategy");
      }
    } finally {
      setLoading(false);
    }
  };

  const generateStrategy = async (payloadArg?: {
    periodType: "preset" | "custom";
    preset: "1_month" | "3_months" | "6_months" | null;
    startDate: string | null;
    endDate: string | null;
  }) => {
    setGenerating(true);
    setError(null);

    try {
      const token = await getAccessToken();
      if (!token) return;

      const payload = payloadArg ?? buildStrategyPayload();

      const res = await fetch(`${API_URL}/api/strategy/generate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const body: {
        ok?: boolean;
        error?: string;
      } = await res.json();

      if (!res.ok) {
        throw new Error(body.error ?? "Failed to generate strategy");
      }

      setGenerateDialogOpen(false);

      await loadStrategy();
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Failed to generate strategy");
      }
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    loadStrategy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const strategyJson = strategy?.strategy_json;

  function buildStrategyPayload() {
    return periodType === "preset"
      ? {
          periodType: "preset" as const,
          preset,
          startDate: null,
          endDate: null,
        }
      : {
          periodType: "custom" as const,
          preset: null,
          startDate: customRange?.from ? toIsoDateOnly(customRange.from) : null,
          endDate: customRange?.to ? toIsoDateOnly(customRange.to) : null,
        };
  }

  const checkOverlapBeforeGenerate = async () => {
    if (!canContinueGenerate) return;

    setError(null);

    try {
      const token = await getAccessToken();
      if (!token) return;

      const payload = buildStrategyPayload();

      const res = await fetch(`${API_URL}/api/strategy/check-overlap`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const body: {
        hasOverlap?: boolean;
        overlapStart?: string | null;
        overlapEnd?: string | null;
        error?: string;
      } = await res.json();

      if (!res.ok) {
        throw new Error(body.error ?? "Failed to check overlap");
      }

      if (body.hasOverlap) {
        setPendingGeneratePayload(payload);
        setOverlapInfo({
          overlapStart: body.overlapStart ?? null,
          overlapEnd: body.overlapEnd ?? null,
        });
        setOverlapDialogOpen(true);
        return;
      }

      await generateStrategy(payload);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Failed to check overlap");
      }
    }
  };

  if (generating) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">
            {t("dashboard.strategy.title")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("dashboard.strategy.subtitle")}
          </p>
        </div>

        <Button
          className="rounded-full bg-brand-warm text-brand-warm-foreground hover:opacity-90"
          onClick={() => setGenerateDialogOpen(true)}
          disabled={generating}
        >
          {generating
            ? t("dashboard.strategy.generating")
            : t("dashboard.strategy.generate")}
        </Button>
      </div>

      {error ? (
        <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {loading ? (
        <Card className="border-0 surface-solid">
          <CardContent className="py-10 text-sm text-muted-foreground">
            {t("common.loading", { defaultValue: "Loading…" })}
          </CardContent>
        </Card>
      ) : null}

      {!loading && !strategyJson ? (
        <Card className="border-0 surface-solid">
          <CardContent className="py-10 text-sm text-muted-foreground">
            {t("dashboard.strategy.empty")}
          </CardContent>
        </Card>
      ) : null}

      {!loading && strategyJson ? (
        <>
          <Card className="border-0 surface-solid">
            <CardHeader>
              <CardTitle>{t("dashboard.strategy.summary")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium">
                  {t("dashboard.strategy.positioning")}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {strategyJson.positioning}
                </p>
              </div>

              <div>
                <div className="text-sm font-medium">
                  {t("dashboard.strategy.overview")}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {strategyJson.summary}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 surface-solid">
            <CardHeader>
              <CardTitle>{t("dashboard.strategy.objectives")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {strategyJson.core_objectives.map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl bg-background/40 px-4 py-3 text-sm"
                >
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-0 surface-solid">
            <CardHeader>
              <CardTitle>{t("dashboard.strategy.pillars")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {strategyJson.content_pillars.map((pillar, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-border/60 bg-background/40 p-4"
                >
                  <div className="font-medium">{pillar.name}</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {pillar.description}
                  </div>
                  <div className="mt-3 text-sm">
                    <span className="font-medium">
                      {t("dashboard.strategy.whyItMatters")}
                    </span>{" "}
                    <span className="text-muted-foreground">
                      {pillar.why_it_matters}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {pillar.formats.map((format, i) => (
                      <span
                        key={i}
                        className="rounded-full bg-background px-3 py-1 text-xs text-muted-foreground"
                      >
                        {format}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-0 surface-solid">
            <CardHeader>
              <CardTitle>{t("dashboard.strategy.platformStrategy")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {strategyJson.platform_strategy.map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-border/60 bg-background/40 p-4"
                >
                  <div className="font-medium capitalize">{item.platform}</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {item.role}
                  </div>
                  <div className="mt-3 text-sm">
                    <span className="font-medium">
                      {t("dashboard.strategy.frequency")}
                    </span>{" "}
                    <span className="text-muted-foreground">
                      {item.posting_frequency}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.content_focus.map((focus, i) => (
                      <span
                        key={i}
                        className="rounded-full bg-background px-3 py-1 text-xs text-muted-foreground"
                      >
                        {focus}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-0 surface-solid">
              <CardHeader>
                <CardTitle>{t("dashboard.strategy.growthMoves")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {strategyJson.growth_moves.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-2xl bg-background/40 px-4 py-3 text-sm"
                  >
                    {item}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-0 surface-solid">
              <CardHeader>
                <CardTitle>{t("dashboard.strategy.next30Days")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {strategyJson.next_30_days_focus.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-2xl bg-background/40 px-4 py-3 text-sm"
                  >
                    {item}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </>
      ) : null}
      <Dialog open={generateDialogOpen} onOpenChange={setGenerateDialogOpen}>
        <DialogContent className="surface-solid border-0 sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Select strategy period</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Choose how long you want your strategy to be.
              </p>

              <RadioGroup
                value={periodType === "preset" ? preset : "custom"}
                onValueChange={(value) => {
                  if (value === "custom") {
                    setPeriodType("custom");
                    return;
                  }

                  setPeriodType("preset");
                  setPreset(value as StrategyPeriodPreset);
                }}
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3 rounded-2xl border border-border bg-background/60 p-4">
                    <RadioGroupItem value="1_month" id="period-1m" />
                    <Label htmlFor="period-1m">1 month</Label>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl border border-border bg-background/60 p-4">
                    <RadioGroupItem value="3_months" id="period-3m" />
                    <Label htmlFor="period-3m">3 months</Label>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl border border-border bg-background/60 p-4">
                    <RadioGroupItem value="6_months" id="period-6m" />
                    <Label htmlFor="period-6m">6 months</Label>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl border border-border bg-background/60 p-4">
                    <RadioGroupItem value="custom" id="period-custom" />
                    <Label htmlFor="period-custom">Custom range</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div className="rounded-2xl border border-border bg-background/40 p-4 text-sm text-muted-foreground">
              {periodType === "preset" ? (
                <>
                  Selected period:{" "}
                  <span className="font-medium text-foreground">
                    {preset === "1_month"
                      ? "1 month"
                      : preset === "3_months"
                        ? "3 months"
                        : "6 months"}
                  </span>
                </>
              ) : (
                <>
                  Selected period:{" "}
                  <span className="font-medium text-foreground">
                    {customRange?.from && customRange?.to
                      ? `${customRange.from.toLocaleDateString()} - ${customRange.to.toLocaleDateString()}`
                      : "Custom range not complete"}
                  </span>
                </>
              )}
            </div>

            {periodType === "custom" ? (
              <div className="space-y-3">
                <div className="text-sm font-medium">Select a custom range</div>

                <div className="rounded-2xl border border-border bg-background/40 p-4">
                  <Calendar
                    mode="range"
                    selected={customRange}
                    onSelect={setCustomRange}
                    numberOfMonths={2}
                    className="rounded-md"
                  />
                </div>

                {customRange?.from && customRange?.to ? (
                  <div className="text-sm text-muted-foreground">
                    Selected range: {customRange.from.toLocaleDateString()} -{" "}
                    {customRange.to.toLocaleDateString()}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Please select both a start and end date.
                  </div>
                )}
              </div>
            ) : null}

            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => setGenerateDialogOpen(false)}
              >
                Cancel
              </Button>

              <Button
                className="rounded-full bg-brand-warm text-brand-warm-foreground hover:opacity-90"
                disabled={!canContinueGenerate || generating}
                onClick={checkOverlapBeforeGenerate}
              >
                {generating ? "Generating…" : "Continue"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={overlapDialogOpen} onOpenChange={setOverlapDialogOpen}>
        <DialogContent className="surface-solid border-0 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Overlapping strategy period</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Part of this new strategy overlaps with content that was already
              generated.
            </p>

            {overlapInfo?.overlapStart && overlapInfo?.overlapEnd ? (
              <div className="rounded-2xl border border-border bg-background/40 p-4 text-sm text-muted-foreground">
                The generated content from{" "}
                <span className="font-medium text-foreground">
                  {overlapInfo.overlapStart}
                </span>{" "}
                to{" "}
                <span className="font-medium text-foreground">
                  {overlapInfo.overlapEnd}
                </span>{" "}
                will be replaced.
              </div>
            ) : null}

            <div className="flex items-center justify-between gap-2">
              <Button
                variant="ghost"
                onClick={() => setOverlapDialogOpen(false)}
                disabled={generating}
              >
                Cancel
              </Button>

              <Button
                className="rounded-full bg-brand-warm text-brand-warm-foreground hover:opacity-90"
                disabled={!pendingGeneratePayload || generating}
                onClick={async () => {
                  if (!pendingGeneratePayload) return;

                  setOverlapDialogOpen(false);
                  setGenerateDialogOpen(false);
                  await generateStrategy(pendingGeneratePayload);
                  setPendingGeneratePayload(null);
                }}
              >
                {generating ? "Generating…" : "Continue anyway"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
