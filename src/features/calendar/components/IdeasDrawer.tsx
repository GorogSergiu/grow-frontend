import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { PlatformIcon } from "@/components/PlatformIcon";
import type { CalendarItem } from "@/types/calendar.types";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  ideas: CalendarItem[];
  onIdeaClick: (item: CalendarItem) => void;
  onAddIdea: () => void;
};

export function IdeasDrawer({
  open,
  onOpenChange,
  ideas,
  onIdeaClick,
  onAddIdea,
}: Props) {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ideas;
    return ideas.filter((it) =>
      `${it.title} ${it.pillar ?? ""} ${it.hook ?? ""} ${it.description ?? ""}`
        .toLowerCase()
        .includes(q),
    );
  }, [ideas, search]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <SheetTitle className="text-lg">
              {t("dashboard.calendar.ideasBoard", {
                defaultValue: "Ideas",
              })}
            </SheetTitle>
            <Badge
              variant="secondary"
              className="rounded-full text-[10px] tabular-nums"
            >
              {ideas.length}
            </Badge>
          </div>
          <SheetDescription>
            {t("dashboard.calendar.ideasBoardDesc", {
              defaultValue:
                "Your content backlog. Jot down ideas and schedule them later.",
            })}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-3 px-4 pb-4">
          {/* Search + Add */}
          <div className="flex gap-2">
            <Input
              placeholder={t("dashboard.calendar.search", {
                defaultValue: "Search ideas…",
              })}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-sm"
            />
            <Button
              variant="outline"
              className="shrink-0 rounded-full"
              onClick={() => {
                onAddIdea();
                onOpenChange(false);
              }}
            >
              +
            </Button>
          </div>

          {/* Ideas list */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border/60 px-6 py-10 text-center">
              <div className="text-3xl">💡</div>
              <div className="text-sm text-muted-foreground">
                {search
                  ? t("dashboard.calendar.noSearchResults", {
                      defaultValue: "No ideas match your search.",
                    })
                  : t("dashboard.calendar.emptyIdeas", {
                      defaultValue: "No ideas yet.",
                    })}
              </div>
              {!search && (
                <Button
                  variant="outline"
                  className="rounded-full"
                  size="sm"
                  onClick={() => {
                    onAddIdea();
                    onOpenChange(false);
                  }}
                >
                  {t("dashboard.calendar.addFirstIdea", {
                    defaultValue: "Add your first idea",
                  })}
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((it) => (
                <button
                  key={it.id}
                  onClick={() => {
                    onIdeaClick(it);
                    onOpenChange(false);
                  }}
                  className="group w-full rounded-xl border border-border/60 bg-background/40 p-3.5 text-left transition-colors hover:border-border hover:bg-accent/40"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0 opacity-60 group-hover:opacity-100">
                      <PlatformIcon platform={it.platform} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">
                        {it.title || t("dashboard.topContent.untitled")}
                      </div>

                      {it.pillar && (
                        <Badge
                          variant="secondary"
                          className="mt-1.5 rounded-full text-[10px]"
                        >
                          {it.pillar}
                        </Badge>
                      )}

                      {it.hook && (
                        <div className="mt-1 truncate text-xs text-muted-foreground">
                          {it.hook}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
