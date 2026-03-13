import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PlatformConnectionCard,
  type Provider,
} from "@/components/app/PlatformConnectionCard";
import { LogoutSection } from "@/components/app/Logout";

const API_URL = import.meta.env.VITE_API_URL;

type IntegrationRow = {
  provider: string;
  status: string | null;
  account_name?: string | null;
  connected_at?: string | null;
  last_sync_at?: string | null;
  error?: string | null;
};

export default function SettingsPage() {
  const { t } = useTranslation();

  const [integrations, setIntegrations] = useState<IntegrationRow[]>([]);
  const [loadingIntegrations, setLoadingIntegrations] = useState(true);

  const getAccessToken = async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  };

  const fetchIntegrations = async () => {
    setLoadingIntegrations(true);
    try {
      const token = await getAccessToken();
      if (!token) return;

      const res = await fetch(`${API_URL}/api/integrations`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const body = await res.json();
      if (!res.ok) {
        throw new Error(body?.error ?? "Failed to load integrations");
      }

      setIntegrations(Array.isArray(body) ? body : []);
    } finally {
      setLoadingIntegrations(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const byProvider = useMemo(() => {
    const map = new Map<string, IntegrationRow>();
    for (const i of integrations) map.set(i.provider, i);
    return map;
  }, [integrations]);

  const renderRow = (provider: Provider) => {
    const row = byProvider.get(provider);
    const connected = row?.status === "connected";

    return (
      <PlatformConnectionCard
        key={provider}
        provider={provider}
        connected={connected}
        loading={loadingIntegrations}
        accountName={row?.account_name ?? null}
        error={row?.error ?? null}
        onSynced={fetchIntegrations}
      />
    );
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 surface-solid">
        <CardHeader>
          <CardTitle>{t("settings.integrations.title")}</CardTitle>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {renderRow("youtube")}
        {renderRow("instagram")}
        {renderRow("tiktok")}
      </div>

      <div className="pt-4">
        <LogoutSection />
      </div>
    </div>
  );
}
