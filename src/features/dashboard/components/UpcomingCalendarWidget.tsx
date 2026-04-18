import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAuthFetch } from "@/hooks/use-auth-fetch";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchUpcomingCalendarItems } from "@/api/calendar.api";
import type { CalendarItem } from "@/types/calendar.types";

function dayLabel(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function timeHHMM(iso: string) {
  const dt = new Date(iso);
  const hh = String(dt.getHours()).padStart(2, "0");
  const mm = String(dt.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

export default function UpcomingCalendarWidget() {
  const { t } = useTranslation();
  const { getAccessToken } = useAuthFetch();
  const [items, setItems] = useState<CalendarItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      try {
        const token = await getAccessToken();
        if (!token) return;

        const upcoming = await fetchUpcomingCalendarItems(token);
        if (mounted) setItems(upcoming);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const empty = !loading && items.length === 0;

  return (
    <Card className="border-0 surface-solid">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t("dashboard.calendarPreview.title")}</CardTitle>

        <Button asChild variant="ghost" className="rounded-full">
          <Link to="/dashboard/calendar">
            {t("dashboard.calendarPreview.viewCalendar")}
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="space-y-3">
        {loading ? (
          <div className="text-sm text-muted-foreground">
            {t("common.loading", { defaultValue: "Loading…" })}
          </div>
        ) : empty ? (
          <div className="text-sm text-muted-foreground">
            {t("dashboard.calendarPreview.empty")}
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((it) => (
              <div
                key={it.id}
                className="flex items-center justify-between rounded-2xl bg-background/60 p-4"
              >
                <div className="min-w-0">
                  <div className="text-sm text-muted-foreground">
                    {it.scheduledAt
                      ? `${dayLabel(it.scheduledAt)} · ${timeHHMM(it.scheduledAt)}`
                      : ""}
                  </div>
                  <div className="truncate font-medium">{it.title}</div>
                  {it.pillar ? (
                    <div className="mt-1 text-xs text-muted-foreground">
                      {it.pillar}
                    </div>
                  ) : null}
                </div>

                <Badge variant="secondary" className="rounded-full">
                  {it.platform}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
