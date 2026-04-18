import { useTranslation } from "react-i18next";
import { usePlatformStatus } from "@/features/platform/hooks/use-platform-status";
import type { Platform } from "@/types/platform.types";

type Props = {
  platform: Platform;
  onSync?: () => void;
};

export function PlatformStatusBar({ platform, onSync }: Props) {
  const { t } = useTranslation();
  const { loading, connected, accountName, syncing, connecting, connect, sync } =
    usePlatformStatus(platform, onSync);

  if (loading) return null;

  const platformLabelKey = `dashboard.platforms.${platform}`;
  const connectedKey = `dashboard.${platform}.connected`;
  const notConnectedHintKey = `dashboard.${platform}.notConnectedHint`;
  const connectKey = `dashboard.${platform}.connect`;
  const syncingKey = `dashboard.${platform}.syncing`;
  const syncNowKey = `dashboard.${platform}.syncNow`;

  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="text-lg font-semibold">{t(platformLabelKey)}</div>

        {connected ? (
          <div className="text-sm text-muted-foreground">
            {t(connectedKey)}
            {accountName ? ` · ${accountName}` : ""}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            {t(notConnectedHintKey)}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {!connected && (
          <button
            onClick={connect}
            disabled={connecting}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
          >
            {connecting ? t("common.loading") : t(connectKey)}
          </button>
        )}

        {connected && (
          <button
            onClick={sync}
            disabled={syncing}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
          >
            {syncing ? t(syncingKey) : t(syncNowKey)}
          </button>
        )}
      </div>
    </div>
  );
}
