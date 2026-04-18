import { CalendarDayCell } from "@/features/calendar/components/CalendarDayCell";
import type { CalendarItem } from "@/types/calendar.types";

type Props = {
  weekdays: string[];
  cells: Array<Date | null>;
  itemsByDay: Map<string, CalendarItem[]>;
  onDayClick: (day: Date) => void;
  onItemClick: (item: CalendarItem) => void;
};

export function CalendarGrid({
  weekdays,
  cells,
  itemsByDay,
  onDayClick,
  onItemClick,
}: Props) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background/40">
      <div className="grid grid-cols-7 border-b border-border/60">
        {weekdays.map((w) => (
          <div
            key={w}
            className="px-3 py-2 text-xs font-medium text-muted-foreground"
          >
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {cells.map((day, idx) => {
          if (!day) {
            return (
              <div
                key={`empty-${idx}`}
                className="min-h-[132px] border-b border-r border-border/60 bg-background/10"
              />
            );
          }

          return (
            <CalendarDayCell
              key={day.toISOString()}
              day={day}
              itemsByDay={itemsByDay}
              onDayClick={onDayClick}
              onItemClick={onItemClick}
            />
          );
        })}
      </div>
    </div>
  );
}
