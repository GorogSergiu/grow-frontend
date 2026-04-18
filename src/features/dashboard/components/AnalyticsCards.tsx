import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthFetch } from "@/hooks/use-auth-fetch";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAnalyticsSummary } from "@/api/analytics.api";
import type { AnalyticsSummary } from "@/api/analytics.api";
import type { Platform } from "@/types/platform.types";

function fmt(n?: number | null) {
  if (!n) return "0";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return `${Math.round(n)}`;
}

function pct(n?: number | null) {
  if (!n) return "—";
  return `${n.toFixed(1)}%`;
}

export function AnalyticsCards({ platform }: { platform: Platform }) {
  const { t } = useTranslation();
  const { getAccessToken } = useAuthFetch();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnalyticsSummary | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);

      try {
        const token = await getAccessToken();
        if (!token) return;

        const summary = await fetchAnalyticsSummary(token, platform);

        if (mounted) {
          setData(summary);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [platform]);

  const cards = useMemo(() => {
    if (!data) return [];

    if (platform === "instagram") {
      return [
        {
          label: t("dashboard.analytics.totalLikes"),
          value: fmt(data.totalLikes),
        },
        {
          label: t("dashboard.analytics.totalComments"),
          value: fmt(data.totalComments),
        },
        {
          label: t("dashboard.analytics.avgEngagement"),
          value: fmt(data.avgEngagementPerVideo),
        },
        {
          label: t("dashboard.analytics.totalEngagement"),
          value: fmt((data.totalLikes ?? 0) + (data.totalComments ?? 0)),
        },
      ];
    }

    return [
      {
        label: t("dashboard.analytics.totalViews"),
        value: fmt(data.totalViews),
      },
      {
        label: t("dashboard.analytics.avgViews"),
        value: fmt(data.avgViews),
      },
      {
        label: t("dashboard.analytics.engagementRate"),
        value: pct(data.engagementRate),
      },
      {
        label: t("dashboard.analytics.avgEngagement"),
        value: fmt(data.avgEngagementPerVideo),
      },
    ];
  }, [data, platform, t]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Skeleton className="h-28 rounded-2xl" />
        <Skeleton className="h-28 rounded-2xl" />
        <Skeleton className="h-28 rounded-2xl" />
        <Skeleton className="h-28 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      {cards.map((c) => (
        <Card key={c.label} className="border-0 surface-solid">
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">{c.label}</div>

            <div className="mt-2 text-3xl font-semibold tracking-tight">
              {c.value}
            </div>

            <div className="mt-2 text-xs text-muted-foreground">
              {t(
                platform === "instagram"
                  ? "dashboard.analytics.sampleInstagram"
                  : "dashboard.analytics.sample",
                { n: data?.sampleSize ?? 0 },
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
