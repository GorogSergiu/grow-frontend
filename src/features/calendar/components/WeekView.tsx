import { useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { PlatformIcon } from "@/components/PlatformIcon";
import {
  startOfWeekMonday,
  addDays,
  isoDateOnly,
  sameDay,
  fmtWeekdayShort,
  timeHHMM,
} from "@/lib/dates";
import type { CalendarItem } from "@/types/calendar.types";

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const HOUR_HEIGHT = 60; // px per hour

type Props = {
  cursorDate: Date;
  itemsByDay: Map<string, CalendarItem[]>;
  onDayClick: (day: Date, hour?: number) => void;
  onItemClick: (item: CalendarItem) => void;
};

function hourLabel(h: number): string {
  return `${String(h).padStart(2, "0")}:00`;
}

function getHourFromItem(item: CalendarItem): number {
  if (!item.scheduledAt) return 0;
  return new Date(item.scheduledAt).getHours();
}

function getMinuteFromItem(item: CalendarItem): number {
  if (!item.scheduledAt) return 0;
  return new Date(item.scheduledAt).getMinutes();
}

export function WeekView({
  cursorDate,
  itemsByDay,
  onDayClick,
  onItemClick,
}: Props) {
  const { t } = useTranslation();
  const gridRef = useRef<HTMLDivElement>(null);

  const weekStart = useMemo(() => startOfWeekMonday(cursorDate), [cursorDate]);

  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart],
  );

  const today = new Date();

  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-background/40">
      {/* Header row with day names + dates */}
      <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-border/60">
        <div className="border-r border-border/60" />
        {days.map((day) => {
          const isToday = sameDay(day, today);
          return (
            <button
              key={day.toISOString()}
              onClick={() => onDayClick(day)}
              className="border-r border-border/60 px-2 py-3 text-center last:border-r-0 hover:bg-accent/40"
            >
              <div className="text-xs text-muted-foreground">
                {fmtWeekdayShort(day)}
              </div>
              <div
                className={[
                  "mx-auto mt-1 flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
                  isToday
                    ? "bg-foreground text-background"
                    : "text-foreground",
                ].join(" ")}
              >
                {day.getDate()}
              </div>
            </button>
          );
        })}
      </div>

      {/* Time grid */}
      <div className="max-h-[600px] overflow-y-auto" ref={gridRef}>
        <div
          className="relative grid grid-cols-[60px_repeat(7,1fr)]"
          style={{ height: HOURS.length * HOUR_HEIGHT }}
        >
          {/* Hour labels column */}
          <div className="relative border-r border-border/60">
            {HOURS.map((h) => (
              <div
                key={h}
                className="absolute right-2 -translate-y-1/2 text-[11px] text-muted-foreground"
                style={{ top: h * HOUR_HEIGHT }}
              >
                {h > 0 ? hourLabel(h) : ""}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {days.map((day, dayIdx) => {
            const key = isoDateOnly(day);
            const dayItems = itemsByDay.get(key) ?? [];
            const isToday = sameDay(day, today);

            return (
              <div
                key={key}
                className={[
                  "relative cursor-pointer border-r border-border/60 last:border-r-0",
                  isToday ? "bg-accent/10" : "",
                ].join(" ")}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const y = e.clientY - rect.top;
                  const hour = Math.min(23, Math.max(0, Math.floor(y / HOUR_HEIGHT)));
                  onDayClick(day, hour);
                }}
              >
                {/* Hour grid lines */}
                {HOURS.map((h) => (
                  <div
                    key={h}
                    className="absolute inset-x-0 border-t border-border/40"
                    style={{ top: h * HOUR_HEIGHT }}
                  />
                ))}

                {/* Items */}
                {dayItems.map((item) => {
                  const hour = getHourFromItem(item);
                  const minute = getMinuteFromItem(item);
                  const topPx = hour * HOUR_HEIGHT + (minute / 60) * HOUR_HEIGHT;

                  return (
                    <button
                      key={item.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onItemClick(item);
                      }}
                      className="absolute inset-x-1 z-10 overflow-hidden rounded-lg border border-border/60 bg-background/90 px-2 py-1.5 text-left shadow-sm transition-colors hover:bg-accent/60"
                      style={{
                        top: topPx,
                        minHeight: 44,
                      }}
                      title={item.title}
                    >
                      <div className="flex items-center gap-1.5">
                        <PlatformIcon platform={item.platform} />
                        <span className="truncate text-xs font-medium">
                          {item.title}
                        </span>
                      </div>
                      {item.scheduledAt && (
                        <div className="mt-0.5 text-[10px] text-muted-foreground">
                          {timeHHMM(item.scheduledAt)}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}

          {/* Current time indicator */}
          {days.some((d) => sameDay(d, today)) && (
            <CurrentTimeIndicator
              days={days}
              today={today}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function CurrentTimeIndicator({
  days,
  today,
}: {
  days: Date[];
  today: Date;
}) {
  const now = new Date();
  const todayIdx = days.findIndex((d) => sameDay(d, today));
  if (todayIdx < 0) return null;

  const topPx =
    now.getHours() * HOUR_HEIGHT + (now.getMinutes() / 60) * HOUR_HEIGHT;

  // Column offset: 60px gutter + todayIdx * (100% / 7)
  const leftPercent = ((todayIdx) / 7) * 100;
  const widthPercent = 100 / 7;

  return (
    <div
      className="pointer-events-none absolute z-20"
      style={{
        top: topPx,
        left: `calc(60px + ${leftPercent}%)`,
        width: `${widthPercent}%`,
      }}
    >
      <div className="flex items-center">
        <div className="h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-red-500" />
        <div className="h-[2px] flex-1 bg-red-500" />
      </div>
    </div>
  );
}
