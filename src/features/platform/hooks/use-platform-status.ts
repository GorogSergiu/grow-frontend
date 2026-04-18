import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  fetchPlatformStatus,
  fetchPlatformConnectUrl,
  syncPlatform,
} from "@/api/integrations.api";
import type { Platform } from "@/types/platform.types";

type PlatformStatusState = {
  loading: boolean;
  connected: boolean;
  accountName: string | null;
  error: string | null;
  syncing: boolean;
  connecting: boolean;
};

export function usePlatformStatus(platform: Platform, onSync?: () => void) {
  const [state, setState] = useState<PlatformStatusState>({
    loading: true,
    connected: false,
    accountName: null,
    error: null,
    syncing: false,
    connecting: false,
  });

  async function getToken(): Promise<string | null> {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  }

  async function loadStatus() {
    setState((s) => ({ ...s, loading: true, error: null }));

    try {
      const token = await getToken();
      if (!token) return;

      const status = await fetchPlatformStatus(token, platform);

      setState((s) => ({
        ...s,
        connected: status.connected === true,
        accountName: status.account_name ?? null,
        error: status.error ?? null,
        loading: false,
      }));
    } catch {
      setState((s) => ({ ...s, loading: false }));
    }
  }

  async function connect() {
    setState((s) => ({ ...s, connecting: true }));

    try {
      const token = await getToken();
      if (!token) return;

      const url = await fetchPlatformConnectUrl(token, platform);
      if (url) window.location.href = url;
    } finally {
      setState((s) => ({ ...s, connecting: false }));
    }
  }

  async function sync() {
    setState((s) => ({ ...s, syncing: true }));

    try {
      const token = await getToken();
      if (!token) return;

      await syncPlatform(token, platform);
      await loadStatus();
      onSync?.();
    } finally {
      setState((s) => ({ ...s, syncing: false }));
    }
  }

  useEffect(() => {
    loadStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [platform]);

  return {
    ...state,
    connect,
    sync,
    loadStatus,
  };
}
