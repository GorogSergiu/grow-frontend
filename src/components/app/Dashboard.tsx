import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";

import { PlatformSelect } from "@/components/app/dashboard/PlatformSelect";
import type { Platform } from "@/components/app/dashboard/PlatformSelect";
import { TopContentWidget } from "@/components/app/dashboard/TopContentWidget";
import UpcomingCalendarWidget from "@/components/app/dashboard/UpcomingCalendarWidget";
import { AnalyticsCards } from "@/components/app/dashboard/AnalyticsCards";
import { PlatformConnectionCard } from "@/components/app/PlatformConnectionCard";

const API_URL = import.meta.env.VITE_API_URL;

type StatusResponse = {
  connected: boolean;
  account_name?: string | null;
  last_sync_at?: string | null;
  error?: string | null;
};

export default function DashboardOverview() {
  const { t } = useTranslation();
  const [platform, setPlatform] = useState<Platform>("youtube");
  const [refreshKey, setRefreshKey] = useState(0);

  const [loadingStatus, setLoadingStatus] = useState(true);
  const [connected, setConnected] = useState(false);
  const [accountName, setAccountName] = useState<string | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);

  const getAccessToken = async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  };

  const loadStatus = async () => {
    setLoadingStatus(true);
    setStatusError(null);

    try {
      const token = await getAccessToken();
      if (!token) return;

      const res = await fetch(
        `${API_URL}/api/integrations/${platform}/status`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const body: StatusResponse = await res.json();

      if (res.ok) {
        setConnected(body.connected === true);
        setAccountName(body.account_name ?? null);
        setStatusError(body.error ?? null);
      } else {
        setConnected(false);
        setAccountName(null);
        setStatusError(body?.error ?? "Failed to load platform status");
      }
    } finally {
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    loadStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [platform, refreshKey]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {t("dashboard.overview.title")}
        </h2>
        <PlatformSelect value={platform} onChange={setPlatform} />
      </div>

      {!connected ? (
        <PlatformConnectionCard
          provider={platform}
          connected={false}
          loading={loadingStatus}
          error={statusError}
          onSynced={() => setRefreshKey((k) => k + 1)}
        />
      ) : (
        <>
          <PlatformConnectionCard
            provider={platform}
            connected={true}
            loading={loadingStatus}
            accountName={accountName}
            error={statusError}
            onSynced={() => setRefreshKey((k) => k + 1)}
          />

          <AnalyticsCards
            key={`a-${platform}-${refreshKey}`}
            platform={platform}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <TopContentWidget
              key={`t-${platform}-${refreshKey}`}
              platform={platform}
            />
            <UpcomingCalendarWidget />
          </div>
        </>
      )}
    </div>
  );
}
