import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";

const API_URL = import.meta.env.VITE_API_URL;

type Status = {
  connected: boolean;
  last_sync_at: string | null;
  account_name: string | null;
  error: string | null;
};

type Props = {
  onSynced?: () => void;
};

export function YouTubeStatusBar({ onSynced }: Props) {
  const { t } = useTranslation();

  const [status, setStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const getAccessToken = async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  };

  const loadStatus = async () => {
    setLoading(true);
    try {
      const token = await getAccessToken();
      if (!token) return;

      const res = await fetch(`${API_URL}/api/integrations/youtube/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const body = await res.json();
      if (res.ok) setStatus(body);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connect = async () => {
    setConnecting(true);
    try {
      const token = await getAccessToken();
      if (!token) return;

      const res = await fetch(`${API_URL}/api/integrations/youtube/url`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const body = await res.json();
      if (body?.url) window.location.href = body.url;
    } finally {
      setConnecting(false);
    }
  };

  const sync = async () => {
    setSyncing(true);
    try {
      const token = await getAccessToken();
      if (!token) return;

      await fetch(`${API_URL}/api/integrations/youtube/sync`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      await loadStatus();
      onSynced?.();
    } finally {
      setSyncing(false);
    }
  };

  if (loading) return null;

  const connected = status?.connected === true;
  const accountName = status?.account_name ?? null;

  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="text-lg font-semibold">
          {t("dashboard.platforms.youtube")}
        </div>

        {connected ? (
          <div className="text-sm text-muted-foreground">
            {t("dashboard.youtube.connected")}
            {accountName ? ` · ${accountName}` : ""}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            {t("dashboard.youtube.notConnectedHint")}
          </div>
        )}

        {status?.error ? (
          <div className="mt-1 text-xs text-destructive">{status.error}</div>
        ) : null}
      </div>

      <div className="flex gap-2">
        {!connected && (
          <button
            onClick={connect}
            disabled={connecting}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
          >
            {connecting ? t("common.loading") : t("dashboard.youtube.connect")}
          </button>
        )}

        {connected && (
          <button
            onClick={sync}
            disabled={syncing}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
          >
            {syncing
              ? t("dashboard.youtube.syncing")
              : t("dashboard.youtube.syncNow")}
          </button>
        )}
      </div>
    </div>
  );
}
