import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Platform = "youtube" | "tiktok" | "instagram";

type UpcomingItem = {
  dateISO: string; // "2026-02-10"
  time: string; // "08:00"
  title: string;
  platform: Platform;
  tag: string;
};

function dayLabel(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function UpcomingCalendarWidget() {
  const { t } = useTranslation();

  // MVP mock – în viitor îl luăm din DB (calendar_items) sau API
  const upcoming: UpcomingItem[] = useMemo(
    () => [
      {
        dateISO: "2026-02-10",
        time: "08:00",
        platform: "instagram",
        title: "Productivity tips",
        tag: "Tips & How-Tos",
      },
      {
        dateISO: "2026-02-11",
        time: "12:00",
        platform: "youtube",
        title: "Weekly vlog",
        tag: "Day in my Life",
      },
      {
        dateISO: "2026-02-12",
        time: "10:00",
        platform: "instagram",
        title: "Q&A session",
        tag: "Personal Stories",
      },
      {
        dateISO: "2026-02-13",
        time: "14:00",
        platform: "tiktok",
        title: "Quick tip video",
        tag: "Tips & How-Tos",
      },
    ],
    [],
  );

  const empty = upcoming.length === 0;

  return (
    <Card className="border-0 surface-solid">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t("dashboard.calendarPreview.title")}</CardTitle>

        <Button asChild variant="ghost" className="rounded-full">
          <Link to="/calendar">
            {t("dashboard.calendarPreview.viewCalendar")}
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="space-y-3">
        {empty ? (
          <div className="text-sm text-muted-foreground">
            {t("dashboard.calendarPreview.empty")}
          </div>
        ) : (
          <div className="space-y-2">
            {upcoming.map((it) => (
              <div
                key={`${it.dateISO}-${it.time}-${it.title}`}
                className="flex items-center justify-between rounded-2xl bg-background/60 p-4"
              >
                <div className="min-w-0">
                  <div className="text-sm text-muted-foreground">
                    {dayLabel(it.dateISO)} · {it.time}
                  </div>
                  <div className="truncate font-medium">{it.title}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {it.tag}
                  </div>
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
