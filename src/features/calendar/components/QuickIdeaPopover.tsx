import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { generateQuickIdea } from "@/api/calendar.api";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { toIsoDateOnly } from "@/lib/dates";
import type { Platform } from "@/types/platform.types";

type Props = {
  platform: Platform | "all";
  onGenerated: () => void;
};

export function QuickIdeaPopover({ platform, onGenerated }: Props) {
  const { t } = useTranslation();
  const { getAccessToken } = useAuthFetch();

  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | "all">(
    platform,
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleOpen(nextOpen: boolean) {
    setOpen(nextOpen);
    if (nextOpen) {
      setSelectedPlatform(platform);
      setSelectedDate(undefined);
      setPrompt("");
      setError(null);
    }
  }

  async function handleGenerate() {
    setLoading(true);
    setError(null);

    try {
      const token = await getAccessToken();
      if (!token) return;

      await generateQuickIdea(
        token,
        selectedPlatform === "all" ? null : selectedPlatform,
        prompt,
        selectedDate ? toIsoDateOnly(selectedDate) : null,
      );

      setOpen(false);
      setPrompt("");
      onGenerated();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to generate idea");
    } finally {
      setLoading(false);
    }
  }

  const platforms: Array<{ value: Platform | "all"; label: string }> = [
    { value: "all", label: t("dashboard.calendar.all", { defaultValue: "Any" }) },
    { value: "instagram", label: "Instagram" },
    { value: "youtube", label: "YouTube" },
    { value: "tiktok", label: "TikTok" },
  ];

  return (
    <Popover open={open} onOpenChange={handleOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="rounded-full gap-1.5"
          disabled={loading}
        >
          <span>✨</span>
          {t("dashboard.calendar.quickIdea", { defaultValue: "Quick Idea" })}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-[340px] space-y-3 p-4">
        <div className="space-y-1">
          <div className="text-sm font-medium">
            {t("dashboard.calendar.quickIdeaTitle", {
              defaultValue: "Generate a video idea",
            })}
          </div>
          <div className="text-xs text-muted-foreground">
            {t("dashboard.calendar.quickIdeaDesc", {
              defaultValue:
                "Describe what you want or leave empty for a surprise.",
            })}
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {platforms.map((p) => (
            <button
              key={p.value}
              onClick={() => setSelectedPlatform(p.value)}
              className={[
                "rounded-full border px-3 py-1 text-xs transition-colors",
                selectedPlatform === p.value
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background/60 text-muted-foreground hover:bg-accent",
              ].join(" ")}
            >
              {p.label}
            </button>
          ))}
        </div>

        <Textarea
          placeholder={t("dashboard.calendar.quickIdeaPlaceholder", {
            defaultValue:
              'e.g. "morning routine vlog", "trending recipe", "tutorial about..."',
          })}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={2}
          className="resize-none text-sm"
        />

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="text-xs font-medium text-muted-foreground">
              {t("dashboard.calendar.quickIdeaDate", {
                defaultValue: "Schedule for",
              })}
            </div>
            {selectedDate && (
              <button
                onClick={() => setSelectedDate(undefined)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                {t("common.clear", { defaultValue: "Clear" })}
              </button>
            )}
          </div>
          <div className="flex justify-center rounded-xl border border-border/60 p-1">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
            />
          </div>
          {!selectedDate && (
            <div className="text-[11px] text-muted-foreground">
              {t("dashboard.calendar.quickIdeaNoDate", {
                defaultValue: "No date selected — will be saved as an idea.",
              })}
            </div>
          )}
        </div>

        {error && (
          <div className="text-xs text-destructive">{error}</div>
        )}

        <Button
          className="w-full rounded-full bg-brand-warm text-brand-warm-foreground hover:opacity-90"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading
            ? t("dashboard.strategy.generating", {
                defaultValue: "Generating…",
              })
            : t("dashboard.calendar.generateIdea", {
                defaultValue: "Generate ✨",
              })}
        </Button>
      </PopoverContent>
    </Popover>
  );
}
