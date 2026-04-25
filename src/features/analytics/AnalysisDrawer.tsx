import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PlatformIcon } from "@/components/PlatformIcon";

import type { ContentItem, VideoAnalysis } from "@/api/analytics.api";
import {
  requestAnalysis,
  fetchJobStatus,
  fetchVideoAnalysis,
  fetchTranscript,
  uploadAudio,
} from "@/api/analytics.api";
import { useAuthFetch } from "@/hooks/use-auth-fetch";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: ContentItem | null;
};

type Step = "idle" | "upload" | "transcript" | "analyzing" | "done" | "failed";

export function AnalysisDrawer({ open, onOpenChange, item }: Props) {
  const { t } = useTranslation();
  const { getAccessToken } = useAuthFetch();

  const [step, setStep] = useState<Step>("idle");
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<VideoAnalysis | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Only TikTok needs manual upload — YouTube has captions, Instagram has media_url
  const needsUpload = item?.provider === "tiktok";

  // Reset on item change
  useEffect(() => {
    if (!open || !item) {
      setStep("idle");
      setError(null);
      setAnalysis(null);
      setAudioFile(null);
      return;
    }

    // Check if analysis already exists
    (async () => {
      const token = await getAccessToken();
      if (!token) return;
      const existing = await fetchVideoAnalysis(token, item.id);
      if (existing) {
        setAnalysis(existing);
        setStep("done");
      }
    })();
  }, [open, item?.id]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  async function startAnalysis() {
    if (!item) return;
    setError(null);

    const token = await getAccessToken();
    if (!token) return;

    try {
      // Step 1a: upload audio for TikTok
      if (needsUpload && audioFile) {
        setStep("upload");
        try {
          await uploadAudio(token, item.id, audioFile);
        } catch {
          // Non-blocking — analysis can proceed without transcript
        }
      }

      // Step 1b: fetch transcript for YouTube (captions)
      if (item.provider === "youtube") {
        setStep("transcript");
        try {
          await fetchTranscript(token, item.id);
        } catch {
          // Non-blocking — analysis can proceed without transcript
        }
      }

      // Step 2: request analysis (Instagram auto-transcribes via media_url on backend)
      setStep("analyzing");
      const { jobId } = await requestAnalysis(token, item.id, i18n.language);

      // Poll for completion
      pollRef.current = setInterval(async () => {
        try {
          const job = await fetchJobStatus(token, jobId);
          if (job.status === "done") {
            if (pollRef.current) clearInterval(pollRef.current);
            const result = await fetchVideoAnalysis(token, item.id);
            setAnalysis(result);
            setStep("done");
          } else if (job.status === "failed") {
            if (pollRef.current) clearInterval(pollRef.current);
            setError(job.error || "Analysis failed");
            setStep("failed");
          }
        } catch {
          // ignore transient errors
        }
      }, 2000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to start analysis");
      setStep("failed");
    }
  }

  const stepIndex: Record<Step, number> = {
    idle: 0,
    upload: 1,
    transcript: 1,
    analyzing: 2,
    done: 3,
    failed: -1,
  };

  const steps = needsUpload
    ? [
        t("analysis.stepUpload", { defaultValue: "Upload" }),
        t("analysis.stepAnalyzing", { defaultValue: "Analyzing" }),
        t("analysis.stepDone", { defaultValue: "Done" }),
      ]
    : item?.provider === "youtube"
      ? [
          t("analysis.stepTranscript", { defaultValue: "Transcript" }),
          t("analysis.stepAnalyzing", { defaultValue: "Analyzing" }),
          t("analysis.stepDone", { defaultValue: "Done" }),
        ]
      : [
          t("analysis.stepAnalyzing", { defaultValue: "Analyzing" }),
          t("analysis.stepDone", { defaultValue: "Done" }),
        ];

  const platformColor: Record<string, string> = {
    youtube: "border-red-500/30 bg-red-500/5",
    instagram: "border-pink-500/30 bg-pink-500/5",
    tiktok: "border-cyan-500/30 bg-cyan-500/5",
  };

  const platformAccent: Record<string, string> = {
    youtube: "text-red-500",
    instagram: "text-pink-500",
    tiktok: "text-cyan-500",
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex flex-col gap-0 overflow-y-auto p-0 sm:max-w-lg"
      >
        {/* ── Header ──────────────────────────────────── */}
        <div className="space-y-4 px-6 pt-6 pb-4">
          <SheetHeader className="space-y-1 p-0">
            <SheetTitle className="text-lg font-semibold">
              {t("analysis.title", { defaultValue: "Performance Analysis" })}
            </SheetTitle>
            <SheetDescription className="sr-only">
              {t("analysis.description", {
                defaultValue: "AI-powered video performance analysis",
              })}
            </SheetDescription>
          </SheetHeader>

          {/* Video card */}
          {item && (
            <div
              className={`rounded-xl border p-4 ${platformColor[item.provider] ?? "border-border"}`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-background ${platformAccent[item.provider] ?? ""}`}
                >
                  <PlatformIcon platform={item.provider as any} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {item.title ||
                      t("analytics.untitled", { defaultValue: "Untitled" })}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground capitalize">
                    {item.provider}
                    {item.published_at &&
                      ` • ${new Date(item.published_at).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}`}
                  </p>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-3">
                <MetricPill label="Views" value={fmt(item.views)} />
                <MetricPill label="Likes" value={fmt(item.likes)} />
                <MetricPill label="Comments" value={fmt(item.comments)} />
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* ── Body ────────────────────────────────────── */}
        <div className="flex-1 px-6 py-5">
          {/* Progress stepper */}
          {step !== "idle" && step !== "done" && step !== "failed" && (
            <div className="mb-6">
              <div className="flex items-center gap-2">
                {steps.map((label, i) => {
                  const active = i <= stepIndex[step];
                  const current = i === stepIndex[step];
                  return (
                    <div key={label} className="flex flex-1 items-center gap-2">
                      <div className="flex flex-1 flex-col items-center gap-1.5">
                        <div
                          className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                            current
                              ? "bg-foreground text-background"
                              : active
                                ? "bg-foreground/20 text-foreground"
                                : "bg-accent text-muted-foreground"
                          }`}
                        >
                          {i + 1}
                        </div>
                        <span
                          className={`text-[11px] ${current ? "font-medium text-foreground" : "text-muted-foreground"}`}
                        >
                          {label}
                        </span>
                      </div>
                      {i < steps.length - 1 && (
                        <div
                          className={`h-px flex-1 ${active ? "bg-foreground/30" : "bg-border"}`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center gap-3">
                <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-accent">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-foreground transition-all duration-700"
                    style={{
                      width: `${step === "analyzing" ? 60 : step === "upload" || step === "transcript" ? 25 : 0}%`,
                    }}
                  />
                </div>
                <span className="text-[11px] tabular-nums text-muted-foreground">
                  {step === "upload" || step === "transcript"
                    ? "25%"
                    : step === "analyzing"
                      ? "60%"
                      : ""}
                </span>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              <p className="font-medium">
                {t("analysis.stepFailed", { defaultValue: "Analysis failed" })}
              </p>
              <p className="mt-0.5 text-xs opacity-80">{error}</p>
            </div>
          )}

          {/* ── Idle state ────────────────────────────── */}
          {step === "idle" && (
            <div className="flex flex-col items-center gap-5 py-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent">
                <span className="text-2xl">🔍</span>
              </div>

              <div className="max-w-xs space-y-2 text-center">
                <p className="text-sm font-medium">
                  {t("analysis.idleTitle", {
                    defaultValue: "Ready to analyze",
                  })}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t("analysis.description", {
                    defaultValue:
                      "AI will analyze this video's performance, identify strengths and weaknesses, and suggest improvements.",
                  })}
                </p>
              </div>

              {/* Transcript source info */}
              <div className="w-full rounded-xl border border-border/60 px-4 py-3">
                <p className="text-xs font-medium text-muted-foreground">
                  {t("analysis.transcriptSource", {
                    defaultValue: "Transcript source",
                  })}
                </p>
                {item?.provider === "youtube" && (
                  <p className="mt-1 text-sm">
                    {t("analysis.youtubeNote", {
                      defaultValue:
                        "YouTube captions will be used for deeper analysis.",
                    })}
                  </p>
                )}
                {item?.provider === "instagram" && (
                  <p className="mt-1 text-sm">
                    {t("analysis.instagramNote", {
                      defaultValue:
                        "Audio will be automatically extracted and transcribed.",
                    })}
                  </p>
                )}
                {item?.provider === "tiktok" && (
                  <p className="mt-1 text-sm">
                    {t("analysis.tiktokNote", {
                      defaultValue:
                        "Upload the video or audio file for transcript-based analysis, or analyze without transcript.",
                    })}
                  </p>
                )}
              </div>

              {/* Upload zone — TikTok only */}
              {needsUpload && (
                <div className="w-full">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*,video/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) setAudioFile(f);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-border/60 px-4 py-5 text-sm text-muted-foreground transition-colors hover:border-foreground/30 hover:bg-accent/30"
                  >
                    {audioFile ? (
                      <>
                        <span className="text-lg">✅</span>
                        <span className="font-medium text-foreground">
                          {audioFile.name}
                        </span>
                        <span className="text-xs">
                          {(audioFile.size / 1024 / 1024).toFixed(1)} MB —{" "}
                          {t("analysis.tapToChange", {
                            defaultValue: "tap to change",
                          })}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-lg">🎵</span>
                        <span>
                          {t("analysis.uploadFile", {
                            defaultValue: "Upload audio or video file",
                          })}
                        </span>
                        <span className="text-xs">
                          {t("analysis.uploadHint", {
                            defaultValue: "Max 50 MB • optional",
                          })}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              )}

              <Button
                onClick={startAnalysis}
                size="lg"
                className="w-full rounded-xl"
              >
                {t("analysis.start", {
                  defaultValue: "Analyze performance",
                })}
              </Button>
            </div>
          )}

          {/* ── Failed — retry ────────────────────────── */}
          {step === "failed" && (
            <div className="flex flex-col items-center gap-3 py-6">
              <Button
                onClick={() => {
                  setStep("idle");
                  setError(null);
                }}
                variant="outline"
                className="rounded-xl"
              >
                {t("analysis.retry", { defaultValue: "Try again" })}
              </Button>
            </div>
          )}

          {/* ── Results ───────────────────────────────── */}
          {step === "done" && analysis && (
            <div className="space-y-6">
              {/* Scores */}
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("analysis.scores", { defaultValue: "Scores" })}
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <ScoreCard
                    label={t("analysis.hookScore", { defaultValue: "Hook" })}
                    value={analysis.hook_score}
                    color="amber"
                  />
                  <ScoreCard
                    label={t("analysis.retentionScore", {
                      defaultValue: "Retention",
                    })}
                    value={analysis.retention_score}
                    color="sky"
                  />
                  <ScoreCard
                    label={t("analysis.engagementScore", {
                      defaultValue: "Engagement",
                    })}
                    value={analysis.engagement_score}
                    color="emerald"
                  />
                </div>
              </div>

              <Separator />

              {/* Summary */}
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("analysis.summary", { defaultValue: "Summary" })}
                </h3>
                <p className="text-sm leading-relaxed">{analysis.summary}</p>
              </div>

              <Separator />

              {/* Strengths & Weaknesses side by side on wider screens */}
              <div className="grid gap-5 sm:grid-cols-2">
                {/* Strengths */}
                <div>
                  <h3 className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-500">
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-500/10 text-[10px]">
                      ✓
                    </span>
                    {t("analysis.strengths", { defaultValue: "Strengths" })}
                  </h3>
                  <ul className="space-y-2">
                    {analysis.strengths.map((s, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm leading-snug"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                        <span className="text-muted-foreground">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses */}
                <div>
                  <h3 className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-red-500">
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-red-500/10 text-[10px]">
                      ✕
                    </span>
                    {t("analysis.weaknesses", { defaultValue: "Weaknesses" })}
                  </h3>
                  <ul className="space-y-2">
                    {analysis.weaknesses.map((w, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm leading-snug"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                        <span className="text-muted-foreground">{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Separator />

              {/* Suggestions */}
              <div>
                <h3 className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-sky-500">
                  <span className="flex h-5 w-5 items-center justify-center rounded-md bg-sky-500/10 text-[10px]">
                    →
                  </span>
                  {t("analysis.suggestions", { defaultValue: "Suggestions" })}
                </h3>
                <ul className="space-y-3">
                  {analysis.suggestions.map((s, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm">
                      <Badge
                        variant="outline"
                        className="mt-0.5 h-5 w-5 shrink-0 items-center justify-center rounded-md px-0 text-[10px] font-semibold"
                      >
                        {i + 1}
                      </Badge>
                      <span className="leading-snug text-muted-foreground">
                        {s}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Re-analyze footer */}
              <Separator />
              <div className="flex justify-center pb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setAnalysis(null);
                    setStep("idle");
                  }}
                  className="text-xs text-muted-foreground"
                >
                  {t("analysis.reanalyze", {
                    defaultValue: "Run new analysis",
                  })}
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ── Sub-components ────────────────────────────────────────

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return `${Math.round(n)}`;
}

function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-background px-3 py-1.5 text-center">
      <div className="text-sm font-semibold tabular-nums">{value}</div>
      <div className="text-[10px] text-muted-foreground">{label}</div>
    </div>
  );
}

function ScoreCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "amber" | "sky" | "emerald";
}) {
  const colorMap = {
    amber: {
      text: "text-amber-500",
      bg: "bg-amber-500",
      ring: "border-amber-500/20 bg-amber-500/5",
    },
    sky: {
      text: "text-sky-500",
      bg: "bg-sky-500",
      ring: "border-sky-500/20 bg-sky-500/5",
    },
    emerald: {
      text: "text-emerald-500",
      bg: "bg-emerald-500",
      ring: "border-emerald-500/20 bg-emerald-500/5",
    },
  };

  const c = colorMap[color];
  const quality =
    value >= 70 ? "Good" : value >= 40 ? "Average" : "Needs work";

  return (
    <div className={`rounded-xl border p-3 text-center ${c.ring}`}>
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div className={`mt-1 text-2xl font-bold tabular-nums ${c.text}`}>
        {value}
      </div>
      <div className="mx-auto mt-2 h-1.5 w-full overflow-hidden rounded-full bg-accent">
        <div
          className={`h-full rounded-full ${c.bg} transition-all duration-500`}
          style={{ width: `${value}%` }}
        />
      </div>
      <div className="mt-1 text-[10px] text-muted-foreground">{quality}</div>
    </div>
  );
}
