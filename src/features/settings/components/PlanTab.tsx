import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { fetchSubscription, createPortalSession } from "@/api/billing.api";
import type { Subscription } from "@/api/billing.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function statusColor(status: string): string {
  switch (status) {
    case "active":
      return "bg-green-500/10 text-green-600";
    case "trialing":
      return "bg-brand-sky/10 text-brand-sky";
    case "past_due":
      return "bg-amber-500/10 text-amber-600";
    case "canceled":
      return "bg-destructive/10 text-destructive";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function statusLabel(status: string, t: (key: string, opts?: Record<string, string>) => string): string {
  switch (status) {
    case "active":
      return t("settings.plan.active", { defaultValue: "Active" });
    case "trialing":
      return t("settings.plan.trialing", { defaultValue: "Trial" });
    case "past_due":
      return t("settings.plan.pastDue", { defaultValue: "Past due" });
    case "canceled":
      return t("settings.plan.canceled", { defaultValue: "Canceled" });
    default:
      return status;
  }
}

export function PlanTab() {
  const { t } = useTranslation();
  const { getAccessToken } = useAuthFetch();

  const [sub, setSub] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const token = await getAccessToken();
        if (!token) return;
        const data = await fetchSubscription(token);
        setSub(data);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to load subscription");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function openPortal() {
    setPortalLoading(true);
    try {
      const token = await getAccessToken();
      if (!token) return;
      const url = await createPortalSession(token);
      window.location.href = url;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to open billing portal");
      setPortalLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="py-10 text-sm text-muted-foreground">
        {t("common.loading", { defaultValue: "Loading…" })}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h3 className="text-base font-semibold">
          {t("settings.plan.title", { defaultValue: "Your plan" })}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t("settings.plan.subtitle", { defaultValue: "View and manage your subscription." })}
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>
      )}

      {!sub ? (
        <Card className="border-0 surface-solid">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            {t("settings.plan.noSubscription", { defaultValue: "No active subscription found." })}
          </CardContent>
        </Card>
      ) : (
        <Card className="border-0 surface-solid">
          <CardContent className="pt-6 space-y-6">
            {/* Plan name + status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold capitalize">{sub.plan}</span>
                <Badge className={`rounded-full ${statusColor(sub.status)}`}>
                  {statusLabel(sub.status, t)}
                </Badge>
              </div>
              <span className="text-2xl font-bold">
                {sub.plan === "pro" ? "€39" : "€15"}
                <span className="text-sm font-normal text-muted-foreground">
                  {t("plansPage.perMonth", { defaultValue: "/ month" })}
                </span>
              </span>
            </div>

            {/* Trial info */}
            {sub.status === "trialing" && sub.trial_ends_at && (
              <div className="rounded-2xl border border-brand-sky/20 bg-brand-sky/5 p-4">
                <p className="text-sm text-muted-foreground">
                  {t("settings.plan.trialEnds", { defaultValue: "Your free trial ends on" })}{" "}
                  <span className="font-medium text-foreground">
                    {new Date(sub.trial_ends_at).toLocaleDateString()}
                  </span>
                </p>
              </div>
            )}

            {/* Current period */}
            {sub.current_period_end && sub.status !== "trialing" && (
              <div className="rounded-2xl border border-border bg-background/40 p-4">
                <p className="text-sm text-muted-foreground">
                  {t("settings.plan.nextBilling", { defaultValue: "Next billing date:" })}{" "}
                  <span className="font-medium text-foreground">
                    {new Date(sub.current_period_end).toLocaleDateString()}
                  </span>
                </p>
              </div>
            )}

            {/* Features */}
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {t("plansPage.included", { defaultValue: "What's included" })}
              </p>
              {sub.plan === "pro" ? (
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li>• {t("plansPage.pro.f1", { defaultValue: "Unlimited AI strategy generation" })}</li>
                  <li>• {t("plansPage.pro.f2", { defaultValue: "AI content generation — all periods + custom ranges" })}</li>
                  <li>• {t("plansPage.pro.f3", { defaultValue: "Quick Idea — AI-generated content ideas" })}</li>
                  <li>• {t("plansPage.pro.f4", { defaultValue: "AI video performance analysis" })}</li>
                  <li>• {t("plansPage.pro.f5", { defaultValue: "Social media insights" })}</li>
                </ul>
              ) : (
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li>• {t("plansPage.starter.f1", { defaultValue: "AI strategy generation" })}</li>
                  <li>• {t("plansPage.starter.f2", { defaultValue: "Content calendar — manual planning" })}</li>
                  <li>• {t("plansPage.starter.f3", { defaultValue: "AI content generation — 1 or 3 months" })}</li>
                  <li>• {t("plansPage.starter.f4", { defaultValue: "Social media insights" })}</li>
                  <li>• {t("plansPage.starter.f5", { defaultValue: "Inspo board" })}</li>
                </ul>
              )}
            </div>

            {/* Manage button */}
            <Button
              className="rounded-full bg-brand-warm text-brand-warm-foreground hover:opacity-90"
              onClick={openPortal}
              disabled={portalLoading}
            >
              {portalLoading
                ? t("common.loading", { defaultValue: "Loading…" })
                : t("settings.plan.manage", { defaultValue: "Manage subscription" })}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
