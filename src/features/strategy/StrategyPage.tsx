import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Loader from "@/components/Loader";

import { useStrategy } from "@/features/strategy/hooks/use-strategy";
import { StrategyDisplay } from "@/features/strategy/components/StrategyDisplay";

export default function StrategyPage() {
  const { t } = useTranslation();

  const {
    loading,
    generating,
    error,
    strategyJson,
    confirmOpen,
    setConfirmOpen,
    runGenerate,
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
          onClick={() => setConfirmOpen(true)}
          disabled={generating}
        >
          {strategyJson
            ? t("strategy.regenerate", {
                defaultValue: "Regenerate strategy",
              })
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

      {/* Confirm dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="surface-solid border-0 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {t("strategy.confirmTitle", {
                defaultValue: "Generate your strategy?",
              })}
            </DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            {strategyJson
              ? t("strategy.confirmDescRegenerate", {
                  defaultValue:
                    "This will create a new strategy based on your profile and connected platforms. Your current strategy will be replaced.",
                })
              : t("strategy.confirmDesc", {
                  defaultValue:
                    "We'll analyze your profile and connected platforms to build a personalized content strategy.",
                })}
          </p>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
              {t("common.cancel", { defaultValue: "Cancel" })}
            </Button>
            <Button
              className="rounded-full bg-brand-warm text-brand-warm-foreground hover:opacity-90"
              onClick={runGenerate}
            >
              {t("strategy.confirmButton", {
                defaultValue: "Yes, generate",
              })}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
