import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Instagram, Youtube, Tiktok } from "iconoir-react";
import { supabase } from "@/lib/supabase";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const API_URL = import.meta.env.VITE_API_URL;

type Platform = "youtube" | "instagram" | "tiktok";
type ItemStatus = "idea" | "scheduled" | "posted";

type CalendarItem = {
  id: string;
  title: string;
  platform: Platform;
  pillar?: string | null;
  hook?: string | null;
  description?: string | null;
  status: ItemStatus;
  scheduledAt?: string | null;
  source?: string | null;
  strategyId?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

type ViewMode = "month" | "week";

type CalendarItemsResponse = {
  items: CalendarItem[];
};

type CalendarItemMutationResponse = {
  item?: CalendarItem;
  error?: string;
};

type StrategyGenerateResponse = {
  ok?: boolean;
  error?: string;
};

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

function startOfWeekMonday(d: Date) {
  const day = d.getDay();
  const diff = (day + 6) % 7;
  const res = new Date(d);
  res.setDate(d.getDate() - diff);
  res.setHours(0, 0, 0, 0);
  return res;
}

function addDays(d: Date, n: number) {
  const res = new Date(d);
  res.setDate(d.getDate() + n);
  return res;
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isoDateOnly(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function fmtMonthTitle(d: Date) {
  return d.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

function fmtWeekdayShort(d: Date) {
  return d.toLocaleDateString(undefined, { weekday: "short" });
}

function timeHHMM(iso: string) {
  const dt = new Date(iso);
  const hh = String(dt.getHours()).padStart(2, "0");
  const mm = String(dt.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

function PlatformIcon({ platform }: { platform: Platform }) {
  const commonProps = {
    width: 16,
    height: 16,
    className: "shrink-0",
  };

  if (platform === "instagram") {
    return <Instagram {...commonProps} />;
  }

  if (platform === "youtube") {
    return <Youtube {...commonProps} />;
  }

  return <Tiktok {...commonProps} />;
}

export default function CalendarPage() {
  const { t } = useTranslation();

  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [platform, setPlatform] = useState<Platform | "all">("all");
  const [query, setQuery] = useState("");
  const [cursorDate, setCursorDate] = useState(() => new Date());
  const [items, setItems] = useState<CalendarItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CalendarItem | null>(null);

  const getAccessToken = async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  };

  const loadItems = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = await getAccessToken();
      if (!token) return;

      const url =
        platform === "all"
          ? `${API_URL}/api/calendar/items`
          : `${API_URL}/api/calendar/items?platform=${platform}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const body: CalendarItemsResponse | { error?: string } = await res.json();

      if (!res.ok) {
        const err = body as { error?: string };
        throw new Error(err.error ?? "Failed to load calendar items");
      }

      setItems((body as CalendarItemsResponse).items ?? []);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Failed to load calendar items");
      }
    } finally {
      setLoading(false);
    }
  };

  const generateStrategyAndRefresh = async () => {
    setGenerating(true);
    setError(null);

    try {
      const token = await getAccessToken();
      if (!token) return;

      const res = await fetch(`${API_URL}/api/strategy/generate`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const body: StrategyGenerateResponse = await res.json();

      if (!res.ok) {
        throw new Error(body.error ?? "Failed to generate strategy");
      }

      await loadItems();
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Failed to generate strategy");
      }
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [platform]);

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

  function openCreate(day?: Date) {
    const base: CalendarItem = {
      id: crypto.randomUUID(),
      title: "",
      platform: platform === "all" ? "instagram" : platform,
      pillar: null,
      hook: null,
      description: null,
      status: day ? "scheduled" : "idea",
      scheduledAt: day ? new Date(day).toISOString() : null,
    };

    setEditing(base);
    setOpen(true);
  }

  function openEdit(item: CalendarItem) {
    setEditing(item);
    setOpen(true);
  }

  async function saveItem(next: CalendarItem) {
    setSaving(true);
    setError(null);

    try {
      const token = await getAccessToken();
      if (!token) return;

      const payload = {
        title: next.title,
        platform: next.platform,
        pillar: next.pillar ?? null,
        hook: next.hook ?? null,
        description: next.description ?? null,
        status: next.status,
        scheduledAt: next.scheduledAt ?? null,
      };

      const isExisting = items.some((x) => x.id === next.id);

      const res = await fetch(
        isExisting
          ? `${API_URL}/api/calendar/items/${next.id}`
          : `${API_URL}/api/calendar/items`,
        {
          method: isExisting ? "PUT" : "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const body: CalendarItemMutationResponse = await res.json();

      if (!res.ok) {
        throw new Error(body.error ?? "Failed to save calendar item");
      }

      await loadItems();
      setOpen(false);
      setEditing(null);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Failed to save calendar item");
      }
    } finally {
      setSaving(false);
    }
  }

  async function removeItem(id: string) {
    setSaving(true);
    setError(null);

    try {
      const token = await getAccessToken();
      if (!token) return;

      const res = await fetch(`${API_URL}/api/calendar/items/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const body: { ok?: boolean; error?: string } = await res.json();

      if (!res.ok) {
        throw new Error(body.error ?? "Failed to delete calendar item");
      }

      await loadItems();
      setOpen(false);
      setEditing(null);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Failed to delete calendar item");
      }
    } finally {
      setSaving(false);
    }
  }

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

        <div className="flex flex-wrap items-center gap-2">
          <select
            className="h-10 rounded-full border border-border bg-background/60 px-4 text-sm"
            value={platform}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setPlatform(e.target.value as Platform | "all")
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
              onClick={() => setViewMode("month")}
            >
              {t("dashboard.calendar.month", { defaultValue: "Month" })}
            </button>
            <button
              className={`h-10 px-4 text-sm ${
                viewMode === "week" ? "bg-background" : "opacity-70"
              }`}
              onClick={() => setViewMode("week")}
            >
              {t("dashboard.calendar.week", { defaultValue: "Week" })}
            </button>
          </div>

          <Button
            className="rounded-full bg-brand-warm text-brand-warm-foreground hover:opacity-90"
            onClick={generateStrategyAndRefresh}
            disabled={generating}
          >
            {generating
              ? t("dashboard.strategy.generating")
              : t("dashboard.calendar.generateAi")}
          </Button>
        </div>
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
              {fmtMonthTitle(cursorDate)}
            </CardTitle>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                className="rounded-full"
                variant="ghost"
                onClick={prevMonth}
              >
                {t("common.prev", { defaultValue: "Prev" })}
              </Button>

              <Button
                className="rounded-full"
                variant="ghost"
                onClick={nextMonth}
              >
                {t("common.next", { defaultValue: "Next" })}
              </Button>

              <Button
                className="rounded-full"
                onClick={() => openCreate(new Date())}
              >
                {t("dashboard.calendar.schedule", { defaultValue: "Schedule" })}
              </Button>

              <Button
                className="rounded-full"
                variant="ghost"
                onClick={() => openCreate(new Date())}
              >
                {t("dashboard.calendar.add", { defaultValue: "Add" })}
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="py-10 text-sm text-muted-foreground">
                {t("common.loading", { defaultValue: "Loading…" })}
              </div>
            ) : viewMode === "month" ? (
              <div className="rounded-2xl border border-border/60 bg-background/40">
                <div className="grid grid-cols-7 border-b border-border/60">
                  {monthGrid.weekdays.map((w) => (
                    <div
                      key={w}
                      className="px-3 py-2 text-xs font-medium text-muted-foreground"
                    >
                      {w}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7">
                  {monthGrid.cells.map((day, idx) => {
                    if (!day) {
                      return (
                        <div
                          key={`empty-${idx}`}
                          className="min-h-[132px] border-b border-r border-border/60 bg-background/10"
                        />
                      );
                    }

                    const key = isoDateOnly(day);
                    const dayItems = itemsByDay.get(key) ?? [];
                    const isToday = sameDay(day, new Date());

                    const visible = dayItems.slice(0, 3);
                    const extra = dayItems.length - visible.length;

                    return (
                      <div
                        key={key}
                        className="relative min-h-[132px] border-b border-r border-border/60 p-2"
                      >
                        <button
                          onClick={() => openCreate(day)}
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
                                  openEdit(it);
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
                                  openEdit(dayItems[0]);
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
                  })}
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                {t("dashboard.calendar.weekViewPlaceholder")}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-0 surface-solid">
            <CardHeader>
              <CardTitle className="text-base">
                {t("dashboard.calendar.items", { defaultValue: "Items" })}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                placeholder={t("dashboard.calendar.search", {
                  defaultValue: "Search ideas…",
                })}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />

              <div className="grid grid-cols-2 gap-2">
                <Button
                  className="rounded-full"
                  variant="ghost"
                  onClick={() => openCreate()}
                >
                  {t("dashboard.calendar.addIdea", {
                    defaultValue: "Add idea",
                  })}
                </Button>
                <Button
                  className="rounded-full"
                  variant="ghost"
                  onClick={() => openCreate(new Date())}
                >
                  {t("dashboard.calendar.schedule", {
                    defaultValue: "Schedule",
                  })}
                </Button>
              </div>

              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">
                  {t("dashboard.calendar.scheduled", {
                    defaultValue: "Scheduled",
                  })}
                </div>

                {scheduled.length === 0 ? (
                  <div className="rounded-2xl border border-border/60 bg-background/40 p-4 text-sm text-muted-foreground">
                    {t("dashboard.calendar.emptyScheduled", {
                      defaultValue: "Nothing scheduled yet.",
                    })}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {scheduled.slice(0, 6).map((it) => (
                      <button
                        key={it.id}
                        onClick={() => openEdit(it)}
                        className="w-full rounded-2xl border border-border/60 bg-background/40 p-4 text-left hover:bg-background/60"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="truncate font-medium">
                              {it.title}
                            </div>
                            <div className="mt-1 text-xs text-muted-foreground">
                              {it.scheduledAt
                                ? new Date(it.scheduledAt).toLocaleString()
                                : ""}
                            </div>
                          </div>
                          <Badge variant="secondary" className="rounded-full">
                            {it.platform}
                          </Badge>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2 pt-2">
                <div className="text-xs text-muted-foreground">
                  {t("dashboard.calendar.ideas", { defaultValue: "Ideas" })}
                </div>

                {ideas.length === 0 ? (
                  <div className="rounded-2xl border border-border/60 bg-background/40 p-4 text-sm text-muted-foreground">
                    {t("dashboard.calendar.emptyIdeas", {
                      defaultValue: "No ideas yet.",
                    })}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {ideas.slice(0, 8).map((it) => (
                      <button
                        key={it.id}
                        onClick={() => openEdit(it)}
                        className="w-full rounded-2xl border border-border/60 bg-background/40 p-4 text-left hover:bg-background/60"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="truncate font-medium">
                              {it.title}
                            </div>
                            <div className="mt-1 text-xs text-muted-foreground">
                              {it.pillar ?? t("dashboard.topContent.untitled")}
                            </div>
                          </div>
                          <Badge variant="secondary" className="rounded-full">
                            {it.platform}
                          </Badge>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setEditing(null);
        }}
      >
        <DialogContent className="surface-solid border-0">
          <DialogHeader>
            <DialogTitle>
              {editing?.title
                ? t("dashboard.calendar.edit", { defaultValue: "Edit item" })
                : t("dashboard.calendar.create", {
                    defaultValue: "Create item",
                  })}
            </DialogTitle>
          </DialogHeader>

          {editing ? (
            <CalendarItemForm
              item={editing}
              saving={saving}
              onCancel={() => {
                setOpen(false);
                setEditing(null);
              }}
              onDelete={() => removeItem(editing.id)}
              onSave={(next) => saveItem(next)}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CalendarItemForm({
  item,
  saving,
  onSave,
  onCancel,
  onDelete,
}: {
  item: CalendarItem;
  saving: boolean;
  onSave: (it: CalendarItem) => void;
  onCancel: () => void;
  onDelete: () => void;
}) {
  const [draft, setDraft] = useState<CalendarItem>(item);
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="text-xs text-muted-foreground">
          {t("dashboard.calendar.form.title")}
        </div>
        <Input
          value={draft.title}
          onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
          placeholder={t("dashboard.calendar.form.titlePlaceholder")}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">
            {t("dashboard.calendar.form.platform")}
          </div>
          <select
            className="h-10 w-full rounded-xl border border-border bg-background/60 px-3 text-sm"
            value={draft.platform}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setDraft((d) => ({ ...d, platform: e.target.value as Platform }))
            }
          >
            <option value="instagram">
              {t("dashboard.platforms.instagram")}
            </option>
            <option value="tiktok">{t("dashboard.platforms.tiktok")}</option>
            <option value="youtube">{t("dashboard.platforms.youtube")}</option>
          </select>
        </div>

        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">
            {t("dashboard.calendar.form.status")}
          </div>
          <select
            className="h-10 w-full rounded-xl border border-border bg-background/60 px-3 text-sm"
            value={draft.status}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setDraft((d) => ({ ...d, status: e.target.value as ItemStatus }))
            }
          >
            <option value="idea">{t("dashboard.calendar.status.idea")}</option>
            <option value="scheduled">
              {t("dashboard.calendar.status.scheduled")}
            </option>
            <option value="posted">
              {t("dashboard.calendar.status.posted")}
            </option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">
            {t("dashboard.calendar.form.pillar")}
          </div>
          <Input
            value={draft.pillar ?? ""}
            onChange={(e) =>
              setDraft((d) => ({ ...d, pillar: e.target.value }))
            }
            placeholder={t("dashboard.calendar.form.pillarPlaceholder")}
          />
        </div>

        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">
            {t("dashboard.calendar.form.scheduledDate")}
          </div>
          <Input
            type="datetime-local"
            value={
              draft.scheduledAt
                ? new Date(draft.scheduledAt).toISOString().slice(0, 16)
                : ""
            }
            onChange={(e) => {
              const v = e.target.value;
              setDraft((d) => ({
                ...d,
                scheduledAt: v ? new Date(v).toISOString() : null,
              }));
            }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 pt-2">
        <Button
          variant="ghost"
          className="rounded-full"
          onClick={onCancel}
          disabled={saving}
        >
          {t("common.cancel")}
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="rounded-full text-destructive"
            onClick={onDelete}
            disabled={saving}
          >
            {t("common.delete")}
          </Button>

          <Button
            className="rounded-full"
            onClick={() => onSave(draft)}
            disabled={saving}
          >
            {saving
              ? t("common.loading", { defaultValue: "Loading…" })
              : t("common.save")}
          </Button>
        </div>
      </div>
    </div>
  );
}
