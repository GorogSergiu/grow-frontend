import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const API_URL = import.meta.env.VITE_API_URL;

type Item = {
  content_id: string;
  url: string;
  title: string | null;
  views: number | null;
  likes: number | null;
  comments: number | null;
  provider: string;
};

function fmt(n?: number | null) {
  if (n === null || n === undefined) return "—";
  if (n <= 0) return "0";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return `${Math.round(n)}`;
}

export function TopContentWidget({
  platform,
}: {
  platform: "youtube" | "tiktok" | "instagram";
}) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Item[]>([]);

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
          `${API_URL}/api/content/top?provider=${platform}&limit=4`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const body = await res.json();
        if (!res.ok) throw new Error(body?.error ?? "Failed to load");

        if (mounted) setItems(body.items ?? []);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [platform]);

  const empty = useMemo(() => !loading && items.length === 0, [loading, items]);

  return (
    <Card className="border-0 surface-solid">
      <CardHeader>
        <CardTitle>{t("dashboard.topContent.title")}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-14 w-full rounded-2xl" />
            <Skeleton className="h-14 w-full rounded-2xl" />
            <Skeleton className="h-14 w-full rounded-2xl" />
            <Skeleton className="h-14 w-full rounded-2xl" />
          </div>
        ) : empty ? (
          <div className="text-sm text-muted-foreground">
            {t("dashboard.topContent.empty")}
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((it, idx) => (
              <a
                key={it.content_id}
                href={it.url}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between rounded-2xl bg-background/60 p-4 transition-colors hover:bg-accent"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      #{idx + 1}
                    </span>
                    <div className="truncate font-medium">
                      {it.title ?? t("dashboard.topContent.untitled")}
                    </div>
                  </div>

                  <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                    <span>▶ {fmt(it.views)}</span>
                    <span>♡ {fmt(it.likes)}</span>
                    <span>💬 {fmt(it.comments)}</span>
                  </div>
                </div>

                <Badge variant="secondary" className="rounded-full">
                  {it.provider}
                </Badge>
              </a>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
