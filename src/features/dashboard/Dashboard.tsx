import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthFetch } from "@/hooks/use-auth-fetch";

import { PlatformSelect } from "@/features/dashboard/components/PlatformSelect";
import { TopContentWidget } from "@/features/dashboard/components/TopContentWidget";
import UpcomingCalendarWidget from "@/features/dashboard/components/UpcomingCalendarWidget";
import { AnalyticsCards } from "@/features/dashboard/components/AnalyticsCards";
import { PlatformConnectionCard } from "@/features/platform/components/PlatformConnectionCard";
import { WelcomeSection } from "@/features/dashboard/components/WelcomeSection";
import { WelcomeTutorialDialog } from "@/features/dashboard/components/WelcomeTutorialDialog";
import { fetchPlatformStatus } from "@/api/integrations.api";
import { supabase } from "@/lib/supabase";
import type { Platform } from "@/types/platform.types";

export default function DashboardOverview() {
  const { t } = useTranslation();
  const { getAccessToken } = useAuthFetch();
  const [platform, setPlatform] = useState<Platform>("youtube");
  const [refreshKey, setRefreshKey] = useState(0);

  const [loadingStatus, setLoadingStatus] = useState(true);
  const [connected, setConnected] = useState(false);
  const [accountName, setAccountName] = useState<string | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);

  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    async function checkTutorial() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data } = await supabase
        .from("profiles")
        .select("tutorial_seen")
        .eq("id", session.user.id)
        .single();

      if (!data || !data.tutorial_seen) {
        setShowTutorial(true);
      }
    }

    checkTutorial();
  }, []);

  async function dismissTutorial() {
    setShowTutorial(false);

    try {
      const token = await getAccessToken();
      if (!token) {
        console.error("[tutorial] no access token");
        return;
      }

      const API_URL = import.meta.env.VITE_API_URL;
      const res = await fetch(`${API_URL}/api/profile/tutorial-seen`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        console.error("[tutorial] PATCH failed:", res.status, body);
      }
    } catch (err) {
      console.error("[tutorial] dismiss error:", err);
    }
  }

  const loadStatus = async () => {
    setLoadingStatus(true);
    setStatusError(null);

    try {
      const token = await getAccessToken();
      if (!token) return;

      const body = await fetchPlatformStatus(token, platform);

      setConnected(body.connected === true);
      setAccountName(body.account_name ?? null);
      setStatusError(body.error ?? null);
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
      <WelcomeTutorialDialog open={showTutorial} onDismiss={dismissTutorial} />
      <WelcomeSection />

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
