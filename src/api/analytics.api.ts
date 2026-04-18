import type { Platform } from "@/types/platform.types";

const API_URL = import.meta.env.VITE_API_URL;

export type AnalyticsSummary = {
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

export type TopContentItem = {
  content_id: string;
  url: string;
  title: string | null;
  views: number | null;
  likes: number | null;
  comments: number | null;
  provider: string;
};

export async function fetchAnalyticsSummary(
  token: string,
  platform: Platform,
): Promise<AnalyticsSummary> {
  const res = await fetch(
    `${API_URL}/api/analytics/summary?provider=${platform}&limit=25`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  const body = await res.json();

  if (!res.ok) {
    throw new Error(body?.error ?? "Failed to load analytics");
  }

  return body as AnalyticsSummary;
}

export async function fetchTopContent(
  token: string,
  platform: Platform,
  limit = 4,
): Promise<TopContentItem[]> {
  const res = await fetch(
    `${API_URL}/api/content/top?provider=${platform}&limit=${limit}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );

  const body = await res.json();

  if (!res.ok) {
    throw new Error(body?.error ?? "Failed to load top content");
  }

  return (body.items ?? []) as TopContentItem[];
}
