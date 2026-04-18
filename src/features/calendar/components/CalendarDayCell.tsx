import { useTranslation } from "react-i18next";
import { PlatformIcon } from "@/components/PlatformIcon";
import { isoDateOnly, sameDay, timeHHMM } from "@/lib/dates";
import type { CalendarItem } from "@/types/calendar.types";

type Props = {
  day: Date;
  itemsByDay: Map<string, CalendarItem[]>;
  onDayClick: (day: Date) => void;
  onItemClick: (item: CalendarItem) => void;
};

export function CalendarDayCell({
  day,
  itemsByDay,
  onDayClick,
  onItemClick,
}: Props) {
  const { t } = useTranslation();

  const key = isoDateOnly(day);
  const dayItems = itemsByDay.get(key) ?? [];
  const isToday = sameDay(day, new Date());

  const visible = dayItems.slice(0, 3);
  const extra = dayItems.length - visible.length;

  return (
    <div
      className="relative min-h-[132px] border-b border-r border-border/60 p-2"
    >
      <button
        onClick={() => onDayClick(day)}
        className="absolute inset-0 rounded-none"
        aria-label={`day-${key}`}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div
            className={[
              "flex h-6 w-6 items-center justify-center rounded-full text-xs",
              isToday
                ? "bg-foreground text-background"
                : "text-muted-foreground",
            ].join(" ")}
          >
            {day.getDate()}
          </div>

          {dayItems.length > 0 ? (
            <div className="text-[11px] text-muted-foreground">
              {dayItems.length}
            </div>
          ) : null}
        </div>

        <div className="mt-2 space-y-1">
          {visible.map((it) => (
            <button
              key={it.id}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onItemClick(it);
              }}
              className="group w-full rounded-md border border-border/60 bg-background/60 px-2 py-1 text-left text-[12px] hover:bg-background/80"
              title={it.title}
            >
              <div className="flex min-w-0 items-center gap-2">
                <PlatformIcon platform={it.platform} />
                <div className="min-w-0 truncate font-medium">
                  {it.title}
                </div>
              </div>

              {it.scheduledAt ? (
                <div className="mt-0.5 text-[11px] text-muted-foreground">
                  {timeHHMM(it.scheduledAt)}
                </div>
              ) : null}
            </button>
          ))}

          {extra > 0 ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onItemClick(dayItems[0]);
              }}
              className="w-full text-left text-[12px] text-muted-foreground hover:underline"
            >
              {t("dashboard.calendar.more", {
                defaultValue: "{{n}} more…",
                n: extra,
              })}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
