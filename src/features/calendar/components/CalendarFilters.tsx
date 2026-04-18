import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import type { ViewMode } from "@/types/calendar.types";
import type { Platform } from "@/types/platform.types";

type Props = {
  platform: Platform | "all";
  onPlatformChange: (p: Platform | "all") => void;
  viewMode: ViewMode;
  onViewModeChange: (v: ViewMode) => void;
  generating: boolean;
  onGenerate: () => void;
};

export function CalendarFilters({
  platform,
  onPlatformChange,
  viewMode,
  onViewModeChange,
  generating,
  onGenerate,
}: Props) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        className="h-10 rounded-full border border-border bg-background/60 px-4 text-sm"
        value={platform}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          onPlatformChange(e.target.value as Platform | "all")
        }
      >
        <option value="all">
          {t("dashboard.calendar.all", { defaultValue: "All" })}
        </option>
        <option value="instagram">
          {t("dashboard.platforms.instagram")}
        </option>
        <option value="youtube">{t("dashboard.platforms.youtube")}</option>
        <option value="tiktok">{t("dashboard.platforms.tiktok")}</option>
      </select>

      <div className="flex overflow-hidden rounded-full border border-border bg-background/60">
        <button
          className={`h-10 px-4 text-sm ${
            viewMode === "month" ? "bg-background" : "opacity-70"
          }`}
          onClick={() => onViewModeChange("month")}
        >
          {t("dashboard.calendar.month", { defaultValue: "Month" })}
        </button>
        <button
          className={`h-10 px-4 text-sm ${
            viewMode === "week" ? "bg-background" : "opacity-70"
          }`}
          onClick={() => onViewModeChange("week")}
        >
          {t("dashboard.calendar.week", { defaultValue: "Week" })}
        </button>
      </div>

      <Button
        className="rounded-full bg-brand-warm text-brand-warm-foreground hover:opacity-90"
        onClick={onGenerate}
        disabled={generating}
      >
        {generating
          ? t("dashboard.strategy.generating")
          : t("dashboard.calendar.generateAi")}
      </Button>
    </div>
  );
}
