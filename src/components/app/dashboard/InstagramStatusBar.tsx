import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";

const API_URL = import.meta.env.VITE_API_URL;

type Props = {
  onSync?: () => void;
};

export function InstagramStatusBar({ onSync }: Props) {
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

    const res = await fetch(`${API_URL}/api/integrations/instagram/status`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const body = await res.json();

    if (res.ok) {
      setConnected(body.connected);
      setAccountName(body.account_name);
    }

    setLoading(false);
  }

  async function connect() {
    const token = await getToken();
    if (!token) return;

    const res = await fetch(`${API_URL}/api/integrations/instagram/url`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const body = await res.json();
    if (body.url) window.location.href = body.url;
  }

  async function sync() {
    setSyncing(true);

    const token = await getToken();
    if (!token) return;

    await fetch(`${API_URL}/api/integrations/instagram/sync`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    setSyncing(false);

    if (onSync) onSync();
  }

  useEffect(() => {
    let mounted = true;

    async function init() {
      if (!mounted) return;
      await loadStatus();
    }

    init();

    return () => {
      mounted = false;
    };
  });

  if (loading) return null;

  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="text-lg font-semibold">
          {t("dashboard.platforms.instagram")}
        </div>

        {connected ? (
          <div className="text-sm text-muted-foreground">
            {t("dashboard.instagram.connected")} · {accountName}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            {t("dashboard.instagram.notConnectedHint")}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {!connected && (
          <button
            onClick={connect}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            {t("dashboard.instagram.connect")}
          </button>
        )}

        {connected && (
          <button
            onClick={sync}
            disabled={syncing}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            {syncing
              ? t("dashboard.instagram.syncing")
              : t("dashboard.instagram.syncNow")}
          </button>
        )}
      </div>
    </div>
  );
}
