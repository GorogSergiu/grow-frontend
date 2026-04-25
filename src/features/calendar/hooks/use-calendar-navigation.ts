import { useState } from "react";
import type { ViewMode } from "@/types/calendar.types";
import type { Platform } from "@/types/platform.types";

export function useCalendarNavigation() {
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [platform, setPlatform] = useState<Platform | "all">("all");
  const [query, setQuery] = useState("");
  const [cursorDate, setCursorDate] = useState(() => new Date());

  function prevMonth() {
    setCursorDate((d) => {
      const n = new Date(d);
      n.setMonth(n.getMonth() - 1);
      return n;
    });
  }

  function nextMonth() {
    setCursorDate((d) => {
      const n = new Date(d);
      n.setMonth(n.getMonth() + 1);
      return n;
    });
  }

  function prevWeek() {
    setCursorDate((d) => {
      const n = new Date(d);
      n.setDate(n.getDate() - 7);
      return n;
    });
  }

  function nextWeek() {
    setCursorDate((d) => {
      const n = new Date(d);
      n.setDate(n.getDate() + 7);
      return n;
    });
  }

  return {
    viewMode,
    setViewMode,
    platform,
    setPlatform,
    query,
    setQuery,
    cursorDate,
    prevMonth,
    nextMonth,
    prevWeek,
    nextWeek,
  };
}
