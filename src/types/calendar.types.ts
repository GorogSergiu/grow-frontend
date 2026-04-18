import type { Platform } from "@/types/platform.types";

export type ItemStatus = "idea" | "scheduled" | "posted";

export type ViewMode = "month" | "week";

export type InspoItem = {
  id: string;
  type: "link" | "image";
  url: string;
  title?: string | null;
};

export type CalendarItem = {
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
  inspo?: InspoItem[];
};

export type CalendarItemsResponse = {
  items: CalendarItem[];
};

export type CalendarItemMutationResponse = {
  item?: CalendarItem;
  error?: string;
};
