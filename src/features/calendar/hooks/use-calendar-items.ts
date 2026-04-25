import { useEffect, useState } from "react";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import {
  fetchCalendarItems,
  saveCalendarItem,
  deleteCalendarItem,
  generateCalendarContent,
} from "@/api/calendar.api";
import type { CalendarItem } from "@/types/calendar.types";
import type { Platform } from "@/types/platform.types";
import type { StrategyGeneratePayload } from "@/types/strategy.types";

export function useCalendarItems(platform: Platform | "all") {
  const { getAccessToken } = useAuthFetch();

  const [items, setItems] = useState<CalendarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadItems = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = await getAccessToken();
      if (!token) return;

      const body = await fetchCalendarItems(token, platform);
      setItems(body.items ?? []);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Failed to load calendar items");
      }
    } finally {
      setLoading(false);
    }
  };

  const generateContentAndRefresh = async (
    payload: StrategyGeneratePayload,
  ) => {
    setGenerating(true);
    setError(null);

    try {
      const token = await getAccessToken();
      if (!token) return;

      await generateCalendarContent(token, payload);
      await loadItems();
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Failed to generate content");
      }
    } finally {
      setGenerating(false);
    }
  };

  const saveItem = async (next: CalendarItem) => {
    setSaving(true);
    setError(null);

    try {
      const token = await getAccessToken();
      if (!token) return false;

      const isExisting = items.some((x) => x.id === next.id);
      await saveCalendarItem(token, next, isExisting);
      await loadItems();
      return true;
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Failed to save calendar item");
      }
      return false;
    } finally {
      setSaving(false);
    }
  };

  const removeItem = async (id: string) => {
    setSaving(true);
    setError(null);

    try {
      const token = await getAccessToken();
      if (!token) return false;

      await deleteCalendarItem(token, id);
      await loadItems();
      return true;
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Failed to delete calendar item");
      }
      return false;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [platform]);

  return {
    items,
    loading,
    saving,
    generating,
    error,
    loadItems,
    saveItem,
    removeItem,
    generateContentAndRefresh,
  };
}
