import { useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const API_URL = import.meta.env.VITE_API_URL;

export type Provider = "youtube" | "instagram" | "tiktok";

type Props = {
  provider: Provider;
  accountName?: string | null;
  connected: boolean;
  loading?: boolean;
  error?: string | null;
  onSynced?: () => void;
};

export function PlatformConnectionCard({
  provider,
  accountName = null,
  connected,
  loading = false,
  error = null,
  onSynced,
}: Props) {
  const { t } = useTranslation();

  const [connecting, setConnecting] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const getAccessToken = async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  };

  const connect = async () => {
    setConnecting(true);
    try {
      const token = await getAccessToken();
      if (!token) return;

      const res = await fetch(`${API_URL}/api/integrations/${provider}/url`, {
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

      await fetch(`${API_URL}/api/integrations/${provider}/sync`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      onSynced?.();
    } finally {
      setSyncing(false);
    }
  };

  const connectKey =
    provider === "youtube"
      ? "dashboard.youtube.connect"
      : provider === "instagram"
        ? "dashboard.instagram.connect"
        : "dashboard.tiktok.connect";

  const syncingKey =
    provider === "youtube"
      ? "dashboard.youtube.syncing"
      : provider === "instagram"
        ? "dashboard.instagram.syncing"
        : "dashboard.tiktok.syncing";

  const syncNowKey =
    provider === "youtube"
      ? "dashboard.youtube.syncNow"
      : provider === "instagram"
        ? "dashboard.instagram.syncNow"
        : "dashboard.tiktok.syncNow";

  const connectedKey =
    provider === "youtube"
      ? "dashboard.youtube.connected"
      : provider === "instagram"
        ? "dashboard.instagram.connected"
        : "dashboard.tiktok.connected";

  const notConnectedHintKey =
    provider === "youtube"
      ? "dashboard.youtube.notConnectedHint"
      : provider === "instagram"
        ? "dashboard.instagram.notConnectedHint"
        : "dashboard.tiktok.notConnectedHint";

  const platformLabel =
    provider === "youtube"
      ? t("dashboard.platforms.youtube")
      : provider === "instagram"
        ? t("dashboard.platforms.instagram")
        : t("dashboard.platforms.tiktok");

  const connectedHintKey =
    provider === "youtube"
      ? "settings.integrations.youtubeConnectedHint"
      : provider === "instagram"
        ? "settings.integrations.instagramConnectedHint"
        : "settings.integrations.tiktokConnectedHint";

  return (
    <Card className="border-0 surface-solid">
      <CardContent className="flex items-center justify-between gap-4 py-6">
        <div className="space-y-1">
          <div className="font-medium">
            {platformLabel}{" "}
            {connected ? (
              <span className="text-muted-foreground">
                · {t(connectedKey)}
                {accountName ? ` · ${accountName}` : ""}
              </span>
            ) : (
              <span className="text-muted-foreground">
                ·{" "}
                {t("settings.integrations.notConnected", {
                  defaultValue: "Not connected",
                })}
              </span>
            )}
          </div>

          <div className="text-sm text-muted-foreground">
            {loading
              ? t("common.loading")
              : connected
                ? t(connectedHintKey)
                : t(notConnectedHintKey)}
          </div>

          {error ? (
            <div className="text-xs text-destructive">{error}</div>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          {connected ? (
            <>
              <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-500">
                {t("settings.integrations.connected", {
                  defaultValue: "Connected",
                })}
              </span>

              <Button
                onClick={sync}
                disabled={syncing}
                variant="ghost"
                className="rounded-full"
              >
                {syncing ? t(syncingKey) : t(syncNowKey)}
              </Button>
            </>
          ) : (
            <Button
              onClick={connect}
              disabled={connecting}
              className="rounded-full bg-brand-warm text-brand-warm-foreground hover:opacity-90"
            >
              {connecting ? t("common.loading") : t(connectKey)}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
