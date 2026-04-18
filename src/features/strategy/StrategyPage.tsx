import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Loader from "@/components/Loader";

import { useStrategy } from "@/features/strategy/hooks/use-strategy";
import { StrategyDisplay } from "@/features/strategy/components/StrategyDisplay";
import { GeneratePeriodDialog } from "@/features/strategy/components/GeneratePeriodDialog";
import { OverlapWarningDialog } from "@/features/strategy/components/OverlapWarningDialog";
import type { StrategyPeriodPreset, StrategyPeriodType } from "@/types/strategy.types";

export default function StrategyPage() {
  const { t } = useTranslation();

  const {
    loading,
    generating,
    error,
    strategyJson,
    generateDialogOpen,
    setGenerateDialogOpen,
    periodType,
    setPeriodType,
    preset,
    setPreset,
    customRange,
    setCustomRange,
    overlapDialogOpen,
    setOverlapDialogOpen,
    overlapInfo,
    canContinueGenerate,
    checkOverlapBeforeGenerate,
    confirmOverlapGenerate,
  } = useStrategy();

  if (generating) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">
            {t("dashboard.strategy.title")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("dashboard.strategy.subtitle")}
          </p>
        </div>

        <Button
          className="rounded-full bg-brand-warm text-brand-warm-foreground hover:opacity-90"
          onClick={() => setGenerateDialogOpen(true)}
          disabled={generating}
        >
          {generating
            ? t("dashboard.strategy.generating")
            : t("dashboard.strategy.generate")}
        </Button>
      </div>

      {error ? (
        <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {loading ? (
        <Card className="border-0 surface-solid">
          <CardContent className="py-10 text-sm text-muted-foreground">
            {t("common.loading", { defaultValue: "Loading…" })}
          </CardContent>
        </Card>
      ) : null}

      {!loading && !strategyJson ? (
        <Card className="border-0 surface-solid">
          <CardContent className="py-10 text-sm text-muted-foreground">
            {t("dashboard.strategy.empty")}
          </CardContent>
        </Card>
      ) : null}

      {!loading && strategyJson ? (
        <StrategyDisplay strategyJson={strategyJson} />
      ) : null}

      <GeneratePeriodDialog
        open={generateDialogOpen}
        onOpenChange={setGenerateDialogOpen}
        periodType={periodType}
        preset={preset}
        customRange={customRange}
        canContinue={canContinueGenerate}
        generating={generating}
        onPeriodTypeChange={(type: StrategyPeriodType, newPreset?: StrategyPeriodPreset) => {
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
    </div>
  );
}
