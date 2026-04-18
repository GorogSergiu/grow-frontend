import type { Platform } from "@/types/platform.types";

const API_URL = import.meta.env.VITE_API_URL;

export type PlatformStatus = {
  connected: boolean;
  account_name?: string | null;
  last_sync_at?: string | null;
  error?: string | null;
};

export type IntegrationRow = {
  provider: string;
  status: string | null;
  account_name?: string | null;
  connected_at?: string | null;
  last_sync_at?: string | null;
  error?: string | null;
};

export async function fetchPlatformStatus(
  token: string,
  platform: Platform,
): Promise<PlatformStatus> {
  const res = await fetch(`${API_URL}/api/integrations/${platform}/status`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const body: PlatformStatus = await res.json();

  if (!res.ok) {
    return {
      connected: false,
      account_name: null,
      error: body?.error ?? "Failed to load platform status",
    };
  }

  return body;
}

export async function fetchPlatformConnectUrl(
  token: string,
  platform: Platform,
): Promise<string | null> {
  const res = await fetch(`${API_URL}/api/integrations/${platform}/url`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const body = await res.json();
  return body?.url ?? null;
}

export async function syncPlatform(
  token: string,
  platform: Platform,
): Promise<void> {
  await fetch(`${API_URL}/api/integrations/${platform}/sync`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function fetchAllIntegrations(
  token: string,
): Promise<IntegrationRow[]> {
  const res = await fetch(`${API_URL}/api/integrations`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const body = await res.json();

  if (!res.ok) {
    throw new Error(body?.error ?? "Failed to load integrations");
  }

  return Array.isArray(body) ? body : [];
}
