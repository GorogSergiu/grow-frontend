import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthFetch } from "@/hooks/use-auth-fetch";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { fetchTopContent } from "@/api/analytics.api";
import type { TopContentItem, TopContentSortBy } from "@/api/analytics.api";
import type { Platform } from "@/types/platform.types";

function fmt(n?: number | null) {
  if (n === null || n === undefined) return "—";
  if (n <= 0) return "0";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return `${Math.round(n)}`;
}

const SORT_OPTIONS: { value: TopContentSortBy; icon: string }[] = [
  { value: "views", icon: "▶" },
  { value: "likes", icon: "♡" },
  { value: "comments", icon: "💬" },
];

export function TopContentWidget({
  platform,
}: {
  platform: Platform;
}) {
  const { t } = useTranslation();
  const { getAccessToken } = useAuthFetch();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<TopContentItem[]>([]);
  const [sortBy, setSortBy] = useState<TopContentSortBy>("views");

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      try {
        const token = await getAccessToken();
        if (!token) return;

        const data = await fetchTopContent(token, platform, 4, sortBy);
        if (mounted) setItems(data);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [platform, sortBy]);

  const empty = useMemo(() => !loading && items.length === 0, [loading, items]);

  const currentSort = SORT_OPTIONS.find((o) => o.value === sortBy)!;

  return (
    <Card className="border-0 surface-solid">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>{t("dashboard.topContent.title")}</CardTitle>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-1.5 rounded-full text-xs">
              <span>{currentSort.icon}</span>
              {t(`dashboard.topContent.sortBy.${sortBy}`, { defaultValue: sortBy })}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {SORT_OPTIONS.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => setSortBy(option.value)}
                className={sortBy === option.value ? "font-medium" : ""}
              >
                <span className="mr-2">{option.icon}</span>
                {t(`dashboard.topContent.sortBy.${option.value}`, { defaultValue: option.value })}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
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
                    <span className={sortBy === "views" ? "font-medium text-foreground" : ""}>
                      ▶ {fmt(it.views)}
                    </span>
                    <span className={sortBy === "likes" ? "font-medium text-foreground" : ""}>
                      ♡ {fmt(it.likes)}
                    </span>
                    <span className={sortBy === "comments" ? "font-medium text-foreground" : ""}>
                      💬 {fmt(it.comments)}
                    </span>
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
