import type {
  CalendarItem,
  CalendarItemsResponse,
  CalendarItemMutationResponse,
} from "@/types/calendar.types";
import type { Platform } from "@/types/platform.types";
import type { StrategyGeneratePayload } from "@/types/strategy.types";

const API_URL = import.meta.env.VITE_API_URL;

export async function fetchCalendarItems(
  token: string,
  platform: Platform | "all",
): Promise<CalendarItemsResponse> {
  const url =
    platform === "all"
      ? `${API_URL}/api/calendar/items`
      : `${API_URL}/api/calendar/items?platform=${platform}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const body: CalendarItemsResponse | { error?: string } = await res.json();

  if (!res.ok) {
    const err = body as { error?: string };
    throw new Error(err.error ?? "Failed to load calendar items");
  }

  return body as CalendarItemsResponse;
}

export async function fetchUpcomingCalendarItems(
  token: string,
): Promise<CalendarItem[]> {
  const res = await fetch(`${API_URL}/api/calendar/items`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const body: CalendarItemsResponse | { error?: string } = await res.json();

  if (!res.ok) {
    const err = body as { error?: string };
    throw new Error(err.error ?? "Failed to load calendar items");
  }

  const all = (body as CalendarItemsResponse).items ?? [];
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  return all
    .filter(
      (item) =>
        item.status !== "idea" &&
        item.scheduledAt &&
        new Date(item.scheduledAt) >= now,
    )
    .sort((a, b) => {
      const aDate = a.scheduledAt ?? "";
      const bDate = b.scheduledAt ?? "";
      return aDate < bDate ? -1 : 1;
    })
    .slice(0, 5);
}

export async function saveCalendarItem(
  token: string,
  item: CalendarItem,
  isExisting: boolean,
): Promise<CalendarItemMutationResponse> {
  const payload = {
    title: item.title,
    platform: item.platform,
    pillar: item.pillar ?? null,
    hook: item.hook ?? null,
    description: item.description ?? null,
    status: item.status,
    scheduledAt: item.scheduledAt ?? null,
    inspo: item.inspo ?? [],
  };

  const res = await fetch(
    isExisting
      ? `${API_URL}/api/calendar/items/${item.id}`
      : `${API_URL}/api/calendar/items`,
    {
      method: isExisting ? "PUT" : "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  const body: CalendarItemMutationResponse = await res.json();

  if (!res.ok) {
    throw new Error(body.error ?? "Failed to save calendar item");
  }

  return body;
}

export async function deleteCalendarItem(
  token: string,
  id: string,
): Promise<void> {
  const res = await fetch(`${API_URL}/api/calendar/items/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  const body: { ok?: boolean; error?: string } = await res.json();

  if (!res.ok) {
    throw new Error(body.error ?? "Failed to delete calendar item");
  }
}

export async function generateCalendarStrategy(
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
