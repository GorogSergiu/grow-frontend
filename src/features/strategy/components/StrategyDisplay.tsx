import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PlatformIcon } from "@/components/PlatformIcon";
import type { StrategyResponse } from "@/types/strategy.types";

type Props = {
  strategyJson: NonNullable<StrategyResponse["strategy"]>["strategy_json"];
};

const pillarColors = [
  "border-violet-500/30 bg-violet-500/5",
  "border-sky-500/30 bg-sky-500/5",
  "border-amber-500/30 bg-amber-500/5",
  "border-emerald-500/30 bg-emerald-500/5",
  "border-pink-500/30 bg-pink-500/5",
  "border-cyan-500/30 bg-cyan-500/5",
];

const pillarAccents = [
  "bg-violet-500",
  "bg-sky-500",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-pink-500",
  "bg-cyan-500",
];

const platformColors: Record<string, string> = {
  youtube: "border-red-500/30 bg-red-500/5",
  instagram: "border-pink-500/30 bg-pink-500/5",
  tiktok: "border-cyan-500/30 bg-cyan-500/5",
};

export function StrategyDisplay({ strategyJson }: Props) {
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      {/* ── Positioning & Summary ─────────────────── */}
      <Card className="border-0 surface-solid">
        <CardContent className="p-6">
          <p className="text-base font-medium leading-relaxed">
            {strategyJson.positioning}
          </p>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            {strategyJson.summary}
          </p>
        </CardContent>
      </Card>

      {/* ── Core Objectives ───────────────────────── */}
      <section>
        <SectionHeader
          title={t("dashboard.strategy.objectives")}
          icon="🎯"
        />
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {strategyJson.core_objectives.map((obj, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-xl border border-border/60 px-4 py-3"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-foreground text-[10px] font-bold text-background">
                {i + 1}
              </span>
              <span className="text-sm leading-snug">{obj}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Content Pillars ───────────────────────── */}
      <section>
        <SectionHeader
          title={t("dashboard.strategy.pillars")}
          icon="📐"
        />
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {strategyJson.content_pillars.map((pillar, i) => (
            <div
              key={i}
              className={`rounded-xl border p-4 ${pillarColors[i % pillarColors.length]}`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${pillarAccents[i % pillarAccents.length]}`}
                />
                <span className="text-sm font-semibold">{pillar.name}</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                {pillar.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {pillar.formats.map((format, fi) => (
                  <Badge
                    key={fi}
                    variant="outline"
                    className="rounded-md text-[10px] font-normal"
                  >
                    {format}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Platform Strategy ─────────────────────── */}
      <section>
        <SectionHeader
          title={t("dashboard.strategy.platformStrategy")}
          icon="📱"
        />
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {strategyJson.platform_strategy.map((ps, i) => (
            <div
              key={i}
              className={`rounded-xl border p-4 ${platformColors[ps.platform] ?? "border-border"}`}
            >
              <div className="flex items-center gap-2">
                <PlatformIcon platform={ps.platform} />
                <span className="text-sm font-semibold capitalize">
                  {ps.platform}
                </span>
              </div>

              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                {ps.role}
              </p>

              <Separator className="my-3" />

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">
                  {t("dashboard.strategy.frequency")}
                </span>
                <Badge variant="secondary" className="text-[10px]">
                  {ps.posting_frequency}
                </Badge>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {ps.content_focus.map((focus, fi) => (
                  <Badge
                    key={fi}
                    variant="outline"
                    className="rounded-md text-[10px] font-normal"
                  >
                    {focus}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Growth Moves & Next 30 Days ───────────── */}
      <div className="grid gap-6 md:grid-cols-2">
        <section>
          <SectionHeader
            title={t("dashboard.strategy.growthMoves")}
            icon="🚀"
          />
          <div className="mt-3 space-y-2">
            {strategyJson.growth_moves.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 rounded-xl border border-border/60 px-4 py-3"
              >
                <span className="mt-0.5 text-emerald-500">→</span>
                <span className="text-sm leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader
            title={t("dashboard.strategy.next30Days")}
            icon="📅"
          />
          <div className="mt-3 space-y-2">
            {strategyJson.next_30_days_focus.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 rounded-xl border border-border/60 px-4 py-3"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-amber-500/10 text-[10px] font-semibold text-amber-500">
                  {i + 1}
                </span>
                <span className="text-sm leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function SectionHeader({ title, icon }: { title: string; icon: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-base">{icon}</span>
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
    </div>
  );
}
