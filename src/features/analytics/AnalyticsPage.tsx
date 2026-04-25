import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { useSubscription } from "@/contexts/SubscriptionContext";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { PlatformIcon } from "@/components/PlatformIcon";

import {
  fetchAnalyticsOverview,
  fetchAllContent,
} from "@/api/analytics.api";
import type {
  AnalyticsOverview,
  PlatformOverviewEntry,
  ContentItem,
} from "@/api/analytics.api";

import { AnalysisDrawer } from "./AnalysisDrawer";

// ── helpers ─────────────────────────────────────────────
function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return `${Math.round(n)}`;
}

function pct(n: number) {
  return `${n.toFixed(2)}%`;
}

function fmtDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

type SortKey = "views" | "likes" | "comments" | "published_at";
type SortDir = "asc" | "desc";

const PLATFORMS_ALL = ["youtube", "instagram", "tiktok"] as const;

// ── page ────────────────────────────────────────────────
export default function AnalyticsPage() {
  const { t } = useTranslation();
  const { getAccessToken } = useAuthFetch();
  const { isPro } = useSubscription();

  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // filters
  const [activePlatform, setActivePlatform] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("views");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  // analysis drawer
  const [analysisItem, setAnalysisItem] = useState<ContentItem | null>(null);
  const [analysisOpen, setAnalysisOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const token = await getAccessToken();
        if (!token) return;

        const [ov, ct] = await Promise.all([
          fetchAnalyticsOverview(token),
          fetchAllContent(token),
        ]);

        if (mounted) {
          setOverview(ov);
          setContent(ct);
        }
      } catch (e: unknown) {
        if (mounted)
          setError(e instanceof Error ? e.message : "Failed to load analytics");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  // ── derived data ──────────────────────────────────────
  const connectedPlatforms = useMemo(() => {
    if (!overview) return [];
    return PLATFORMS_ALL.filter((p) => overview.platforms[p]);
  }, [overview]);

  const totals = useMemo(() => {
    if (!overview) return null;
    let views = 0,
      likes = 0,
      comments = 0,
      engagement = 0,
      count = 0,
      engagementRate = 0;

    const entries =
      activePlatform === "all"
        ? Object.values(overview.platforms)
        : overview.platforms[activePlatform]
          ? [overview.platforms[activePlatform]]
          : [];

    for (const p of entries) {
      views += p.totalViews;
      likes += p.totalLikes;
      comments += p.totalComments;
      engagement += p.totalEngagement;
      count += p.contentCount;
    }

    engagementRate = views > 0 ? (engagement / views) * 100 : 0;

    return { views, likes, comments, engagement, count, engagementRate };
  }, [overview, activePlatform]);

  const filteredContent = useMemo(() => {
    let items = content;

    if (activePlatform !== "all") {
      items = items.filter((it) => it.provider === activePlatform);
    }

    const q = search.trim().toLowerCase();
    if (q) {
      items = items.filter(
        (it) =>
          (it.title ?? "").toLowerCase().includes(q) ||
          (it.description ?? "").toLowerCase().includes(q),
      );
    }

    items = [...items].sort((a, b) => {
      let av: number | string = 0;
      let bv: number | string = 0;

      if (sortKey === "published_at") {
        av = a.published_at ?? "";
        bv = b.published_at ?? "";
        return sortDir === "asc"
          ? String(av).localeCompare(String(bv))
          : String(bv).localeCompare(String(av));
      }

      av = a[sortKey];
      bv = b[sortKey];
      return sortDir === "asc"
        ? (av as number) - (bv as number)
        : (bv as number) - (av as number);
    });

    return items;
  }, [content, activePlatform, search, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function sortIndicator(key: SortKey) {
    if (sortKey !== key) return "";
    return sortDir === "desc" ? " ↓" : " ↑";
  }

  // ── loading state ─────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("analytics.title", { defaultValue: "Analytics" })}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("analytics.subtitle", {
              defaultValue:
                "Deep dive into your content performance across all platforms.",
            })}
          </p>
        </div>

        {connectedPlatforms.length > 0 && (
          <div className="flex overflow-hidden rounded-full border border-border bg-background/60">
            {["all", ...connectedPlatforms].map((p) => (
              <button
                key={p}
                onClick={() => setActivePlatform(p)}
                className={[
                  "px-4 py-2 text-sm font-medium transition-colors",
                  activePlatform === p
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-accent",
                ].join(" ")}
              >
                {p === "all"
                  ? t("analytics.all", { defaultValue: "All" })
                  : p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* ── Global KPI cards ─────────────────────────── */}
      {totals && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          <KpiCard
            label={t("analytics.totalContent", {
              defaultValue: "Total content",
            })}
            value={String(totals.count)}
            accent="text-foreground"
          />
          <KpiCard
            label={t("analytics.totalViews", { defaultValue: "Total views" })}
            value={fmt(totals.views)}
            accent="text-sky-500"
          />
          <KpiCard
            label={t("analytics.totalLikes", { defaultValue: "Total likes" })}
            value={fmt(totals.likes)}
            accent="text-pink-500"
          />
          <KpiCard
            label={t("analytics.totalComments", {
              defaultValue: "Total comments",
            })}
            value={fmt(totals.comments)}
            accent="text-amber-500"
          />
          <KpiCard
            label={t("analytics.engagementRate", {
              defaultValue: "Engagement rate",
            })}
            value={pct(totals.engagementRate)}
            accent="text-emerald-500"
          />
        </div>
      )}

      {/* ── Platform comparison ──────────────────────── */}
      {connectedPlatforms.length > 0 && overview && (
        <Card className="border-0 surface-solid">
          <CardHeader>
            <CardTitle className="text-base">
              {activePlatform === "all"
                ? t("analytics.platformComparison", {
                    defaultValue: "Platform comparison",
                  })
                : t("analytics.platformBreakdown", {
                    defaultValue: "Platform breakdown",
                  })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={
                activePlatform === "all"
                  ? "grid gap-4 md:grid-cols-3"
                  : "grid gap-4"
              }
            >
              {(activePlatform === "all"
                ? connectedPlatforms
                : connectedPlatforms.filter((p) => p === activePlatform)
              ).map((p) => {
                const d = overview.platforms[p] as PlatformOverviewEntry;
                return (
                  <PlatformCard
                    key={p}
                    data={d}
                    wide={activePlatform !== "all"}
                  />
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Content performance table ────────────────── */}
      <Card className="border-0 surface-solid">
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle className="text-base">
            {t("analytics.contentPerformance", {
              defaultValue: "Content performance",
            })}
          </CardTitle>

          <Input
            placeholder={t("analytics.searchContent", {
              defaultValue: "Search content…",
            })}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 w-48 rounded-full text-xs"
          />
        </CardHeader>

        <CardContent>
          {filteredContent.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              {t("analytics.noContent", {
                defaultValue: "No content found.",
              })}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60 text-left text-xs text-muted-foreground">
                    <th className="pb-3 pr-4 font-medium">
                      {t("analytics.table.content", {
                        defaultValue: "Content",
                      })}
                    </th>
                    <th className="pb-3 pr-4 font-medium">
                      {t("analytics.table.platform", {
                        defaultValue: "Platform",
                      })}
                    </th>
                    <th
                      className="cursor-pointer pb-3 pr-4 font-medium hover:text-foreground"
                      onClick={() => toggleSort("published_at")}
                    >
                      {t("analytics.table.date", { defaultValue: "Date" })}
                      {sortIndicator("published_at")}
                    </th>
                    <th
                      className="cursor-pointer pb-3 pr-4 text-right font-medium hover:text-foreground"
                      onClick={() => toggleSort("views")}
                    >
                      {t("analytics.table.views", { defaultValue: "Views" })}
                      {sortIndicator("views")}
                    </th>
                    <th
                      className="cursor-pointer pb-3 pr-4 text-right font-medium hover:text-foreground"
                      onClick={() => toggleSort("likes")}
                    >
                      {t("analytics.table.likes", { defaultValue: "Likes" })}
                      {sortIndicator("likes")}
                    </th>
                    <th
                      className="cursor-pointer pb-3 pr-4 text-right font-medium hover:text-foreground"
                      onClick={() => toggleSort("comments")}
                    >
                      {t("analytics.table.comments", {
                        defaultValue: "Comments",
                      })}
                      {sortIndicator("comments")}
                    </th>
                    {isPro && <th className="pb-3 text-right font-medium" />}
                  </tr>
                </thead>
                <tbody>
                  {filteredContent.map((item) => (
                    <tr
                      key={`${item.provider}-${item.content_id}`}
                      className="border-b border-border/30 transition-colors hover:bg-accent/30"
                    >
                      <td className="max-w-[300px] py-3 pr-4">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="group block"
                        >
                          <div className="truncate font-medium group-hover:underline">
                            {item.title || t("analytics.untitled", { defaultValue: "Untitled" })}
                          </div>
                          {item.description && (
                            <div className="mt-0.5 truncate text-xs text-muted-foreground">
                              {item.description.slice(0, 80)}
                              {item.description.length > 80 ? "…" : ""}
                            </div>
                          )}
                        </a>
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-1.5">
                          <PlatformIcon platform={item.provider as any} />
                          <span className="text-xs text-muted-foreground capitalize">
                            {item.provider}
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap py-3 pr-4 text-xs text-muted-foreground">
                        {fmtDate(item.published_at)}
                      </td>
                      <td className="py-3 pr-4 text-right tabular-nums">
                        {fmt(item.views)}
                      </td>
                      <td className="py-3 pr-4 text-right tabular-nums">
                        {fmt(item.likes)}
                      </td>
                      <td className="py-3 pr-4 text-right tabular-nums">
                        {fmt(item.comments)}
                      </td>
                      {isPro && (
                        <td className="py-3 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 rounded-full text-xs"
                            onClick={() => {
                              setAnalysisItem(item);
                              setAnalysisOpen(true);
                            }}
                          >
                            {t("analysis.analyze", { defaultValue: "Analyze" })}
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filteredContent.length > 0 && (
            <div className="mt-3 text-xs text-muted-foreground">
              {t("analytics.showingCount", {
                defaultValue: "Showing {{count}} items",
                count: filteredContent.length,
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Best performers ──────────────────────────── */}
      {filteredContent.length > 0 && <BestPerformers content={filteredContent} />}

      {/* ── Analysis drawer ────────────────────────── */}
      <AnalysisDrawer
        open={analysisOpen}
        onOpenChange={setAnalysisOpen}
        item={analysisItem}
      />
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────

function KpiCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <Card className="border-0 surface-solid">
      <CardContent className="p-5">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className={`mt-1.5 text-2xl font-semibold tracking-tight ${accent}`}>
          {value}
        </div>
      </CardContent>
    </Card>
  );
}

function PlatformCard({ data, wide }: { data: PlatformOverviewEntry; wide?: boolean }) {
  const { t } = useTranslation();

  const platformColors: Record<string, string> = {
    youtube: "border-red-500/30 bg-red-500/5",
    instagram: "border-pink-500/30 bg-pink-500/5",
    tiktok: "border-cyan-500/30 bg-cyan-500/5",
  };

  const metrics = [
    {
      label: t("analytics.content", { defaultValue: "Content" }),
      value: String(data.contentCount),
    },
    {
      label: t("analytics.totalViews", { defaultValue: "Views" }),
      value: fmt(data.totalViews),
    },
    {
      label: t("analytics.totalLikes", { defaultValue: "Likes" }),
      value: fmt(data.totalLikes),
    },
    {
      label: t("analytics.totalComments", { defaultValue: "Comments" }),
      value: fmt(data.totalComments),
    },
    {
      label: t("analytics.avgViews", { defaultValue: "Avg views" }),
      value: fmt(data.avgViews),
    },
    {
      label: t("analytics.engagementRate", {
        defaultValue: "Engagement rate",
      }),
      value: pct(data.engagementRate),
    },
  ];

  return (
    <div
      className={`rounded-2xl border p-5 ${platformColors[data.provider] ?? ""}`}
    >
      <div className="flex items-center gap-2">
        <PlatformIcon platform={data.provider as any} />
        <span className="text-sm font-semibold capitalize">
          {data.provider}
        </span>
      </div>

      <div className={`mt-4 grid gap-x-6 gap-y-3 ${wide ? "grid-cols-3 md:grid-cols-6" : "grid-cols-2"}`}>
        {metrics.map((m) => (
          <div key={m.label}>
            <div className="text-[11px] text-muted-foreground">{m.label}</div>
            <div className="text-sm font-semibold tabular-nums">{m.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BestPerformers({ content }: { content: ContentItem[] }) {
  const { t } = useTranslation();

  const topByViews = useMemo(
    () => [...content].sort((a, b) => b.views - a.views).slice(0, 3),
    [content],
  );

  const topByEngagement = useMemo(
    () =>
      [...content]
        .sort((a, b) => b.likes + b.comments - (a.likes + a.comments))
        .slice(0, 3),
    [content],
  );

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="border-0 surface-solid">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <span>👁</span>
            {t("analytics.topByViews", {
              defaultValue: "Top by views",
            })}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {topByViews.map((item, idx) => (
            <TopContentRow key={item.content_id} item={item} rank={idx + 1} metric="views" />
          ))}
        </CardContent>
      </Card>

      <Card className="border-0 surface-solid">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <span>🔥</span>
            {t("analytics.topByEngagement", {
              defaultValue: "Top by engagement",
            })}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {topByEngagement.map((item, idx) => (
            <TopContentRow
              key={item.content_id}
              item={item}
              rank={idx + 1}
              metric="engagement"
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function TopContentRow({
  item,
  rank,
  metric,
}: {
  item: ContentItem;
  rank: number;
  metric: "views" | "engagement";
}) {
  const engagement = item.likes + item.comments;

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-accent/40"
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold">
        {rank}
      </span>

      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">
          {item.title || "Untitled"}
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <PlatformIcon platform={item.provider as any} />
            <span className="capitalize">{item.provider}</span>
          </span>
          <span>{fmtDate(item.published_at)}</span>
        </div>
      </div>

      <div className="text-right">
        <div className="text-sm font-semibold tabular-nums">
          {metric === "views" ? fmt(item.views) : fmt(engagement)}
        </div>
        <div className="text-[10px] text-muted-foreground">
          {metric === "views" ? "views" : "engagement"}
        </div>
      </div>
    </a>
  );
}
