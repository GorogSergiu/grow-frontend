import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { useCalendarItems } from "@/features/calendar/hooks/use-calendar-items";
import { useCalendarNavigation } from "@/features/calendar/hooks/use-calendar-navigation";
import { CalendarGrid } from "@/features/calendar/components/CalendarGrid";
import { WeekView } from "@/features/calendar/components/WeekView";
import { CalendarFilters } from "@/features/calendar/components/CalendarFilters";
import { ItemFormDialog } from "@/features/calendar/components/ItemFormDialog";
import { QuickIdeaPopover } from "@/features/calendar/components/QuickIdeaPopover";
import { IdeasDrawer } from "@/features/calendar/components/IdeasDrawer";
import { GeneratePeriodDialog } from "@/features/strategy/components/GeneratePeriodDialog";
import { OverlapWarningDialog } from "@/features/strategy/components/OverlapWarningDialog";

import { checkStrategyOverlap } from "@/api/strategy.api";
import { fetchLatestStrategy } from "@/api/strategy.api";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { useSubscription } from "@/contexts/SubscriptionContext";
import {
  startOfMonth,
  endOfMonth,
  startOfWeekMonday,
  addDays,
  isoDateOnly,
  fmtMonthTitle,
  fmtWeekTitle,
  fmtWeekdayShort,
  toIsoDateOnly,
  toLocalIso,
} from "@/lib/dates";

import type { CalendarItem } from "@/types/calendar.types";
import type { Platform } from "@/types/platform.types";
import type {
  StrategyPeriodPreset,
  StrategyPeriodType,
  StrategyGeneratePayload,
} from "@/types/strategy.types";
import type { DateRange } from "react-day-picker";

export default function CalendarPage() {
  const { t } = useTranslation();
  const { isPro } = useSubscription();

  const {
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
  } = useCalendarNavigation();

  const {
    items,
    loading,
    saving,
    generating,
    error,
    loadItems,
    saveItem,
    removeItem,
    generateContentAndRefresh,
  } = useCalendarItems(platform);

  const { getAccessToken } = useAuthFetch();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CalendarItem | null>(null);
  const [ideasOpen, setIdeasOpen] = useState(false);

  // Check if strategy exists
  const [hasStrategy, setHasStrategy] = useState(false);

  useEffect(() => {
    (async () => {
      const token = await getAccessToken();
      if (!token) return;
      try {
        const res = await fetchLatestStrategy(token);
        setHasStrategy(!!res.strategy?.strategy_json);
      } catch {
        setHasStrategy(false);
      }
    })();
  }, []);

  // Generate content dialog state
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [periodType, setPeriodType] = useState<StrategyPeriodType>("preset");
  const [preset, setPreset] = useState<StrategyPeriodPreset>("3_months");
  const [customRange, setCustomRange] = useState<DateRange | undefined>();
  const [overlapDialogOpen, setOverlapDialogOpen] = useState(false);
  const [overlapInfo, setOverlapInfo] = useState<{
    overlapStart: string | null;
    overlapEnd: string | null;
  } | null>(null);
  const [pendingPayload, setPendingPayload] =
    useState<StrategyGeneratePayload | null>(null);
  const [overlapError, setOverlapError] = useState<string | null>(null);

  const canContinueGenerate =
    periodType === "preset"
      ? true
      : Boolean(customRange?.from && customRange?.to);

  function buildPayload(): StrategyGeneratePayload {
    return periodType === "preset"
      ? { periodType: "preset", preset, startDate: null, endDate: null }
      : {
          periodType: "custom",
          preset: null,
          startDate: customRange?.from
            ? toIsoDateOnly(customRange.from)
            : null,
          endDate: customRange?.to ? toIsoDateOnly(customRange.to) : null,
        };
  }

  async function checkOverlapBeforeGenerate() {
    if (!canContinueGenerate) return;
    setOverlapError(null);

    try {
      const token = await getAccessToken();
      if (!token) return;

      const payload = buildPayload();
      const result = await checkStrategyOverlap(token, payload);

      if (result.hasOverlap) {
        setPendingPayload(payload);
        setOverlapInfo({
          overlapStart: result.overlapStart,
          overlapEnd: result.overlapEnd,
        });
        setOverlapDialogOpen(true);
        return;
      }

      setGenerateDialogOpen(false);
      await generateContentAndRefresh(payload);
    } catch (e: unknown) {
      setOverlapError(
        e instanceof Error ? e.message : "Failed to check overlap",
      );
    }
  }

  async function confirmOverlapGenerate() {
    if (!pendingPayload) return;
    setOverlapDialogOpen(false);
    setGenerateDialogOpen(false);
    await generateContentAndRefresh(pendingPayload);
    setPendingPayload(null);
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((it) => {
      const okPlatform = platform === "all" ? true : it.platform === platform;
      const okQuery = !q
        ? true
        : `${it.title} ${it.pillar ?? ""} ${it.hook ?? ""} ${it.description ?? ""}`
            .toLowerCase()
            .includes(q);

      return okPlatform && okQuery;
    });
  }, [items, platform, query]);

  const scheduled = useMemo(
    () => filtered.filter((i) => i.status !== "idea" && i.scheduledAt),
    [filtered],
  );

  const ideas = useMemo(
    () => filtered.filter((i) => i.status === "idea" || !i.scheduledAt),
    [filtered],
  );

  const monthGrid = useMemo(() => {
    const start = startOfMonth(cursorDate);
    const end = endOfMonth(cursorDate);

    const daysInMonth: Date[] = [];
    for (let d = new Date(start); d <= end; d = addDays(d, 1)) {
      daysInMonth.push(new Date(d));
    }

    const firstWeekday = (start.getDay() + 6) % 7;
    const leadingBlanks = Array.from({ length: firstWeekday }, () => null);

    const totalCells = leadingBlanks.length + daysInMonth.length;
    const trailingCount = (7 - (totalCells % 7)) % 7;
    const trailingBlanks = Array.from({ length: trailingCount }, () => null);

    const cells: Array<Date | null> = [
      ...leadingBlanks,
      ...daysInMonth,
      ...trailingBlanks,
    ];

    const weekdays = Array.from({ length: 7 }).map((_, i) =>
      fmtWeekdayShort(addDays(startOfWeekMonday(start), i)),
    );

    return { cells, weekdays };
  }, [cursorDate]);

  const itemsByDay = useMemo(() => {
    const map = new Map<string, CalendarItem[]>();

    for (const it of scheduled) {
      const d = new Date(it.scheduledAt!);
      const key = isoDateOnly(
        new Date(d.getFullYear(), d.getMonth(), d.getDate()),
      );
      const prev = map.get(key) ?? [];
      prev.push(it);
      map.set(key, prev);
    }

    for (const [k, arr] of map.entries()) {
      arr.sort((a, b) => {
        const aDate = a.scheduledAt ?? "";
        const bDate = b.scheduledAt ?? "";
        return aDate < bDate ? -1 : 1;
      });
      map.set(k, arr);
    }

    return map;
  }, [scheduled]);

  function openCreate(day?: Date, hour?: number) {
    let scheduledAt: string | null = null;

    if (day) {
      const d = new Date(day);
      d.setHours(hour ?? 10, 0, 0, 0);
      scheduledAt = toLocalIso(d);
    }

    const base: CalendarItem = {
      id: crypto.randomUUID(),
      title: "",
      platform: platform === "all" ? "instagram" : platform,
      pillar: null,
      hook: null,
      description: null,
      status: day ? "scheduled" : "idea",
      scheduledAt,
      inspo: [],
    };

    setEditing(base);
    setOpen(true);
  }

  function openEdit(item: CalendarItem) {
    setEditing(item);
    setOpen(true);
  }

  async function handleSave(next: CalendarItem) {
    const ok = await saveItem(next);
    if (ok) {
      setOpen(false);
      setEditing(null);
    }
  }

  async function handleDelete(id: string) {
    const ok = await removeItem(id);
    if (ok) {
      setOpen(false);
      setEditing(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="text-2xl font-semibold tracking-tight">
            {t("dashboard.calendar.title", { defaultValue: "Calendar" })}
          </div>
          <div className="text-sm text-muted-foreground">
            {t("dashboard.calendar.subtitle")}
          </div>
        </div>

        <CalendarFilters
          platform={platform}
          onPlatformChange={setPlatform}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          generating={generating}
          hasStrategy={hasStrategy}
          onGenerate={() => setGenerateDialogOpen(true)}
        />
      </div>

      {error ? (
        <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6">
        <Card className="border-0 surface-solid">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">
              {viewMode === "month"
                ? fmtMonthTitle(cursorDate)
                : fmtWeekTitle(cursorDate)}
            </CardTitle>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                className="rounded-full"
                variant="ghost"
                onClick={viewMode === "month" ? prevMonth : prevWeek}
              >
                {t("common.prev", { defaultValue: "Prev" })}
              </Button>

              <Button
                className="rounded-full"
                variant="ghost"
                onClick={viewMode === "month" ? nextMonth : nextWeek}
              >
                {t("common.next", { defaultValue: "Next" })}
              </Button>

              <Button
                className="rounded-full"
                onClick={() => openCreate(new Date())}
              >
                {t("dashboard.calendar.schedule", { defaultValue: "Schedule" })}
              </Button>

              {isPro && (
                <QuickIdeaPopover
                  platform={platform}
                  onGenerated={loadItems}
                />
              )}

              <Button
                variant="outline"
                className="rounded-full gap-1.5"
                onClick={() => setIdeasOpen(true)}
              >
                <span>💡</span>
                {t("dashboard.calendar.ideas", { defaultValue: "Ideas" })}
                {ideas.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-0.5 rounded-full px-1.5 text-[10px] tabular-nums"
                  >
                    {ideas.length}
                  </Badge>
                )}
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="py-10 text-sm text-muted-foreground">
                {t("common.loading", { defaultValue: "Loading…" })}
              </div>
            ) : viewMode === "month" ? (
              <CalendarGrid
                weekdays={monthGrid.weekdays}
                cells={monthGrid.cells}
                itemsByDay={itemsByDay}
                onDayClick={openCreate}
                onItemClick={openEdit}
              />
            ) : (
              <WeekView
                cursorDate={cursorDate}
                itemsByDay={itemsByDay}
                onDayClick={openCreate}
                onItemClick={openEdit}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <IdeasDrawer
        open={ideasOpen}
        onOpenChange={setIdeasOpen}
        ideas={ideas}
        onIdeaClick={openEdit}
        onAddIdea={() => openCreate()}
      />

      <ItemFormDialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setEditing(null);
        }}
        editing={editing}
        saving={saving}
        onSave={handleSave}
        onDelete={handleDelete}
      />

      <GeneratePeriodDialog
        open={generateDialogOpen}
        onOpenChange={setGenerateDialogOpen}
        periodType={periodType}
        preset={preset}
        customRange={customRange}
        canContinue={canContinueGenerate}
        generating={generating}
        isPro={isPro}
        onPeriodTypeChange={(
          type: StrategyPeriodType,
          newPreset?: StrategyPeriodPreset,
        ) => {
          setPeriodType(type);
          if (newPreset) setPreset(newPreset);
        }}
        onCustomRangeChange={setCustomRange}
        onContinue={checkOverlapBeforeGenerate}
      />

      <OverlapWarningDialog
        open={overlapDialogOpen}
        onOpenChange={setOverlapDialogOpen}
        overlapStart={overlapInfo?.overlapStart ?? null}
        overlapEnd={overlapInfo?.overlapEnd ?? null}
        generating={generating}
        onConfirm={confirmOverlapGenerate}
      />

      {overlapError ? (
        <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {overlapError}
        </div>
      ) : null}
    </div>
  );
}
