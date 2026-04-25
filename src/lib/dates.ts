export function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function endOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

export function startOfWeekMonday(d: Date): Date {
  const day = d.getDay();
  const diff = (day + 6) % 7;
  const res = new Date(d);
  res.setDate(d.getDate() - diff);
  res.setHours(0, 0, 0, 0);
  return res;
}

export function addDays(d: Date, n: number): Date {
  const res = new Date(d);
  res.setDate(d.getDate() + n);
  return res;
}

export function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isoDateOnly(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function fmtMonthTitle(d: Date): string {
  return d.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

export function fmtWeekdayShort(d: Date): string {
  return d.toLocaleDateString(undefined, { weekday: "short" });
}

export function timeHHMM(iso: string): string {
  const dt = new Date(iso);
  const hh = String(dt.getHours()).padStart(2, "0");
  const mm = String(dt.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

export function fmtWeekTitle(d: Date): string {
  const start = startOfWeekMonday(d);
  const end = addDays(start, 6);

  const sameMonth =
    start.getMonth() === end.getMonth() &&
    start.getFullYear() === end.getFullYear();

  if (sameMonth) {
    return `${start.getDate()} – ${end.getDate()} ${end.toLocaleDateString(undefined, { month: "long", year: "numeric" })}`;
  }

  const fmt = (dt: Date) =>
    dt.toLocaleDateString(undefined, { day: "numeric", month: "short" });

  return `${fmt(start)} – ${fmt(end)}, ${end.getFullYear()}`;
}

export function toIsoDateOnly(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Returns an ISO-like string in **local** time: `YYYY-MM-DDTHH:mm` (no Z). */
export function toLocalIso(d: Date): string {
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  const hh = `${d.getHours()}`.padStart(2, "0");
  const mm = `${d.getMinutes()}`.padStart(2, "0");
  return `${year}-${month}-${day}T${hh}:${mm}`;
}
