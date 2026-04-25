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

export type ContentItem = {
  id: string;
  content_id: string;
  url: string;
  title: string | null;
  description: string | null;
  views: number;
  likes: number;
  comments: number;
  published_at: string | null;
  provider: string;
};

export type PlatformOverviewEntry = {
  provider: string;
  contentCount: number;
  totalViews: number;
  avgViews: number;
  totalLikes: number;
  totalComments: number;
  totalEngagement: number;
  avgEngagement: number;
  engagementRate: number;
};

export type AnalyticsOverview = {
  platforms: Record<string, PlatformOverviewEntry>;
};

export async function fetchAnalyticsOverview(
  token: string,
): Promise<AnalyticsOverview> {
  const res = await fetch(`${API_URL}/api/analytics/overview`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body?.error ?? "Failed to load overview");
  return body as AnalyticsOverview;
}

export async function fetchAllContent(
  token: string,
  platform?: string,
): Promise<ContentItem[]> {
  const url = platform
    ? `${API_URL}/api/analytics/content?provider=${platform}`
    : `${API_URL}/api/analytics/content`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body?.error ?? "Failed to load content");
  return (body.items ?? []) as ContentItem[];
}

// ── Video Analysis ────────────────────────────────────────

export type AnalysisJob = {
  id: string;
  status: "queued" | "processing" | "done" | "failed";
  error?: string | null;
  created_at: string;
  updated_at: string;
};

export type VideoAnalysis = {
  id: string;
  content_item_id: string;
  transcript_id: string | null;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  hook_score: number;
  retention_score: number;
  engagement_score: number;
  created_at: string;
};

export async function requestAnalysis(
  token: string,
  contentItemId: string,
  lang?: string,
): Promise<{ jobId: string; status: string }> {
  const res = await fetch(`${API_URL}/api/videos/${contentItemId}/analyze`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Accept-Language": lang || "en",
    },
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body?.error ?? "Failed to start analysis");
  return body;
}

export async function fetchJobStatus(
  token: string,
  jobId: string,
): Promise<AnalysisJob> {
  const res = await fetch(`${API_URL}/api/jobs/${jobId}/status`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body?.error ?? "Failed to fetch job status");
  return body as AnalysisJob;
}

export async function fetchVideoAnalysis(
  token: string,
  contentItemId: string,
): Promise<VideoAnalysis | null> {
  const res = await fetch(
    `${API_URL}/api/videos/${contentItemId}/analysis`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  if (res.status === 404) return null;
  const body = await res.json();
  if (!res.ok) throw new Error(body?.error ?? "Failed to fetch analysis");
  return body as VideoAnalysis;
}

export async function fetchTranscript(
  token: string,
  contentItemId: string,
): Promise<{ ok: boolean; transcriptId: string; cached: boolean }> {
  const res = await fetch(
    `${API_URL}/api/videos/${contentItemId}/transcript`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  const body = await res.json();
  if (!res.ok) throw new Error(body?.error ?? "Failed to fetch transcript");
  return body;
}

export async function uploadAudio(
  token: string,
  contentItemId: string,
  file: File,
): Promise<{ ok: boolean; transcriptId: string; cached: boolean }> {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(
    `${API_URL}/api/videos/${contentItemId}/upload-audio`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    },
  );
  const body = await res.json();
  if (!res.ok) throw new Error(body?.error ?? "Failed to upload audio");
  return body;
}

export type TopContentSortBy = "views" | "likes" | "comments";

export async function fetchTopContent(
  token: string,
  platform: Platform,
  limit = 4,
  sortBy: TopContentSortBy = "views",
): Promise<TopContentItem[]> {
  const res = await fetch(
    `${API_URL}/api/content/top?provider=${platform}&limit=${limit}&sortBy=${sortBy}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );

  const body = await res.json();

  if (!res.ok) {
    throw new Error(body?.error ?? "Failed to load top content");
  }

  return (body.items ?? []) as TopContentItem[];
}
