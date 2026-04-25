import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import {
  PlatformConnectionCard,
  type Provider,
} from "@/features/platform/components/PlatformConnectionCard";
import { fetchAllIntegrations, syncPlatform } from "@/api/integrations.api";
import type { IntegrationRow } from "@/api/integrations.api";

const VALID_PROVIDERS = new Set(["youtube", "instagram", "tiktok"]);

export function IntegrationsTab() {
  const { t } = useTranslation();
  const { getAccessToken } = useAuthFetch();
  const [searchParams, setSearchParams] = useSearchParams();

  const [integrations, setIntegrations] = useState<IntegrationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<string | null>(null);
  const autoSyncDone = useRef(false);

  const fetchIntegrations = async () => {
    setLoading(true);
    try {
      const token = await getAccessToken();
      if (!token) return;
      const data = await fetchAllIntegrations(token);
      setIntegrations(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-sync when redirected back from OAuth with ?connected=<provider>
  useEffect(() => {
    if (autoSyncDone.current) return;

    const justConnected = searchParams.get("connected");
    if (!justConnected || !VALID_PROVIDERS.has(justConnected)) return;

    autoSyncDone.current = true;

    // Clean URL params
    searchParams.delete("connected");
    searchParams.delete("status");
    searchParams.delete("message");
    setSearchParams(searchParams, { replace: true });

    // Trigger auto-sync
    (async () => {
      setSyncing(justConnected);
      try {
        const token = await getAccessToken();
        if (!token) return;
        await syncPlatform(token, justConnected as Provider);
        await fetchIntegrations();
      } finally {
        setSyncing(null);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const byProvider = useMemo(() => {
    const map = new Map<string, IntegrationRow>();
    for (const i of integrations) map.set(i.provider, i);
    return map;
  }, [integrations]);

  const renderRow = (provider: Provider) => {
    const row = byProvider.get(provider);
    return (
      <PlatformConnectionCard
        key={provider}
        provider={provider}
        connected={row?.status === "connected"}
        loading={loading || syncing === provider}
        accountName={row?.account_name ?? null}
        error={row?.error ?? null}
        onSynced={fetchIntegrations}
      />
    );
  };

  return (
    <div className="space-y-4">
      <div className="mb-2">
        <h3 className="text-base font-semibold">
          {t("settings.integrations.title", { defaultValue: "Connected platforms" })}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t("settings.integrations.subtitle", { defaultValue: "Connect your social media accounts to sync data." })}
        </p>
      </div>

      {syncing && (
        <div className="rounded-xl border border-brand-warm/20 bg-brand-warm/5 px-4 py-3 text-sm text-brand-warm">
          {t("settings.integrations.autoSyncing", {
            defaultValue: "Syncing your data… This may take a moment.",
          })}
        </div>
      )}

      {renderRow("youtube")}
      {renderRow("instagram")}
      {renderRow("tiktok")}
    </div>
  );
}
