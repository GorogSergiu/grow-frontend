import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const API_URL = import.meta.env.VITE_API_URL;

type Platform = "youtube" | "tiktok" | "instagram";

type Summary = {
  provider: Platform;
  sampleSize: number;

  totalViews: number;
  avgViews: number;

  totalLikes: number;
  totalComments: number;

  engagementRate: number | null;
  avgEngagementPerVideo: number;

  totalEngagement?: number;
};

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

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Summary | null>(null);

  const getAccessToken = async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  };

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);

      try {
        const token = await getAccessToken();
        if (!token) return;

        const res = await fetch(
          `${API_URL}/api/analytics/summary?provider=${platform}&limit=25`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const body = await res.json();

        if (!res.ok) {
          throw new Error(body?.error ?? "Failed to load analytics");
        }

        if (mounted) {
          setData(body);
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

    // IMPORTANT: diferit pentru Instagram
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

    // YouTube / TikTok
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
