import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

export default function StrategyPage() {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [strategy, setStrategy] = useState<StrategyResponse["strategy"]>(null);

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

  const generateStrategy = async () => {
    setGenerating(true);
    setError(null);

    try {
      const token = await getAccessToken();
      if (!token) return;

      const res = await fetch(`${API_URL}/api/strategy/generate`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const body: {
        ok?: boolean;
        error?: string;
      } = await res.json();

      if (!res.ok) {
        throw new Error(body.error ?? "Failed to generate strategy");
      }

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

  if (generating) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">
            {t("dashboard.strategy.title", { defaultValue: "Strategy" })}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("dashboard.strategy.subtitle", {
              defaultValue:
                "Your AI-generated social media strategy based on onboarding and connected platform insights.",
            })}
          </p>
        </div>

        <Button
          className="rounded-full bg-brand-warm text-brand-warm-foreground hover:opacity-90"
          onClick={generateStrategy}
          disabled={generating}
        >
          {generating
            ? t("dashboard.strategy.generating", {
                defaultValue: "Generating…",
              })
            : t("dashboard.strategy.generate", {
                defaultValue: "Generate strategy",
              })}
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
            {t("dashboard.strategy.empty", {
              defaultValue:
                "You don’t have a generated strategy yet. Connect your socials and generate one.",
            })}
          </CardContent>
        </Card>
      ) : null}

      {!loading && strategyJson ? (
        <>
          <Card className="border-0 surface-solid">
            <CardHeader>
              <CardTitle>
                {t("dashboard.strategy.summary", { defaultValue: "Summary" })}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium">
                  {t("dashboard.strategy.positioning", {
                    defaultValue: "Positioning",
                  })}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {strategyJson.positioning}
                </p>
              </div>

              <div>
                <div className="text-sm font-medium">
                  {t("dashboard.strategy.overview", {
                    defaultValue: "Overview",
                  })}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {strategyJson.summary}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 surface-solid">
            <CardHeader>
              <CardTitle>
                {t("dashboard.strategy.objectives", {
                  defaultValue: "Core objectives",
                })}
              </CardTitle>
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
              <CardTitle>
                {t("dashboard.strategy.pillars", {
                  defaultValue: "Content pillars",
                })}
              </CardTitle>
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
                      {t("dashboard.strategy.whyItMatters", {
                        defaultValue: "Why it matters:",
                      })}
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
              <CardTitle>
                {t("dashboard.strategy.platformStrategy", {
                  defaultValue: "Platform strategy",
                })}
              </CardTitle>
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
                      {t("dashboard.strategy.frequency", {
                        defaultValue: "Posting frequency:",
                      })}
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
                <CardTitle>
                  {t("dashboard.strategy.growthMoves", {
                    defaultValue: "Growth moves",
                  })}
                </CardTitle>
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
                <CardTitle>
                  {t("dashboard.strategy.next30Days", {
                    defaultValue: "Next 30 days focus",
                  })}
                </CardTitle>
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
    </div>
  );
}
