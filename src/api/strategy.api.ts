import type {
  StrategyResponse,
  StrategyGeneratePayload,
} from "@/types/strategy.types";

const API_URL = import.meta.env.VITE_API_URL;

export async function fetchLatestStrategy(
  token: string,
): Promise<StrategyResponse> {
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

  return body;
}

export async function generateStrategy(
  token: string,
  payload: StrategyGeneratePayload,
): Promise<void> {
  const res = await fetch(`${API_URL}/api/strategy/generate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const body: { ok?: boolean; error?: string } = await res.json();

  if (!res.ok) {
    throw new Error(body.error ?? "Failed to generate strategy");
  }
}

export async function checkStrategyOverlap(
  token: string,
  payload: StrategyGeneratePayload,
): Promise<{
  hasOverlap: boolean;
  overlapStart: string | null;
  overlapEnd: string | null;
}> {
  const res = await fetch(`${API_URL}/api/strategy/check-overlap`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const body: {
    hasOverlap?: boolean;
    overlapStart?: string | null;
    overlapEnd?: string | null;
    error?: string;
  } = await res.json();

  if (!res.ok) {
    throw new Error(body.error ?? "Failed to check overlap");
  }

  return {
    hasOverlap: body.hasOverlap ?? false,
    overlapStart: body.overlapStart ?? null,
    overlapEnd: body.overlapEnd ?? null,
  };
}
