import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";

const API_URL = import.meta.env.VITE_API_URL;

type Props = {
  onSync?: () => void;
};

export function TikTokStatusBar({ onSync }: Props) {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [accountName, setAccountName] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  async function getToken() {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  }

  async function loadStatus() {
    const token = await getToken();
    if (!token) return;

    const res = await fetch(`${API_URL}/api/integrations/tiktok/status`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const body = await res.json();

    if (res.ok) {
      setConnected(body.connected);
      setAccountName(body.account_name ?? null);
    }

    setLoading(false);
  }

  async function connect() {
    const token = await getToken();
    if (!token) return;

    const res = await fetch(`${API_URL}/api/integrations/tiktok/url`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const body = await res.json();
    if (body.url) window.location.href = body.url;
  }

  async function sync() {
    setSyncing(true);

    const token = await getToken();
    if (!token) return;

    await fetch(`${API_URL}/api/integrations/tiktok/sync`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    setSyncing(false);

    if (onSync) onSync();
  }

  useEffect(() => {
    loadStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return null;

  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="text-lg font-semibold">
          {t("dashboard.platforms.tiktok")}
        </div>

        {connected ? (
          <div className="text-sm text-muted-foreground">
            {t("dashboard.tiktok.connected")} · {accountName}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            {t("dashboard.tiktok.notConnectedHint")}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {!connected && (
          <button
            onClick={connect}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            {t("dashboard.tiktok.connect")}
          </button>
        )}

        {connected && (
          <button
            onClick={sync}
            disabled={syncing}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            {syncing
              ? t("dashboard.tiktok.syncing")
              : t("dashboard.tiktok.syncNow")}
          </button>
        )}
      </div>
    </div>
  );
}
