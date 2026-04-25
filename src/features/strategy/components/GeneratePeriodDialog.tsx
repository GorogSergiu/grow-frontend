import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import type { StrategyPeriodPreset, StrategyPeriodType } from "@/types/strategy.types";
import type { DateRange } from "react-day-picker";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  periodType: StrategyPeriodType;
  preset: StrategyPeriodPreset;
  customRange: DateRange | undefined;
  canContinue: boolean;
  generating: boolean;
  isPro: boolean;
  onPeriodTypeChange: (type: StrategyPeriodType, preset?: StrategyPeriodPreset) => void;
  onCustomRangeChange: (range: DateRange | undefined) => void;
  onContinue: () => void;
};

export function GeneratePeriodDialog({
  open,
  onOpenChange,
  periodType,
  preset,
  customRange,
  canContinue,
  generating,
  isPro,
  onPeriodTypeChange,
  onCustomRangeChange,
  onContinue,
}: Props) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="surface-solid border-0 sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {t("generatePeriod.title", { defaultValue: "Select content period" })}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {t("generatePeriod.desc", { defaultValue: "Choose how far ahead you want to generate content." })}
            </p>

            <RadioGroup
              value={periodType === "preset" ? preset : "custom"}
              onValueChange={(value) => {
                if (value === "custom") {
                  onPeriodTypeChange("custom");
                  return;
                }

                onPeriodTypeChange("preset", value as StrategyPeriodPreset);
              }}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-2xl border border-border bg-background/60 p-4">
                  <RadioGroupItem value="1_month" id="period-1m" />
                  <Label htmlFor="period-1m">
                    {t("generatePeriod.1month", { defaultValue: "1 month" })}
                  </Label>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-border bg-background/60 p-4">
                  <RadioGroupItem value="3_months" id="period-3m" />
                  <Label htmlFor="period-3m">
                    {t("generatePeriod.3months", { defaultValue: "3 months" })}
                  </Label>
                </div>

                {isPro && (
                  <div className="flex items-center gap-3 rounded-2xl border border-border bg-background/60 p-4">
                    <RadioGroupItem value="6_months" id="period-6m" />
                    <Label htmlFor="period-6m">
                      {t("generatePeriod.6months", { defaultValue: "6 months" })}
                    </Label>
                  </div>
                )}

                {isPro && (
                  <div className="flex items-center gap-3 rounded-2xl border border-border bg-background/60 p-4">
                    <RadioGroupItem value="custom" id="period-custom" />
                    <Label htmlFor="period-custom">
                      {t("generatePeriod.custom", { defaultValue: "Custom range" })}
                    </Label>
                  </div>
                )}
              </div>
            </RadioGroup>
          </div>

          <div className="rounded-2xl border border-border bg-background/40 p-4 text-sm text-muted-foreground">
            {periodType === "preset" ? (
              <>
                {t("generatePeriod.selected", { defaultValue: "Selected period:" })}{" "}
                <span className="font-medium text-foreground">
                  {preset === "1_month"
                    ? t("generatePeriod.1month", { defaultValue: "1 month" })
                    : preset === "3_months"
                      ? t("generatePeriod.3months", { defaultValue: "3 months" })
                      : t("generatePeriod.6months", { defaultValue: "6 months" })}
                </span>
              </>
            ) : (
              <>
                {t("generatePeriod.selected", { defaultValue: "Selected period:" })}{" "}
                <span className="font-medium text-foreground">
                  {customRange?.from && customRange?.to
                    ? `${customRange.from.toLocaleDateString()} - ${customRange.to.toLocaleDateString()}`
                    : t("generatePeriod.customIncomplete", { defaultValue: "Custom range not complete" })}
                </span>
              </>
            )}
          </div>

          {periodType === "custom" ? (
            <div className="space-y-3">
              <div className="text-sm font-medium">
                {t("generatePeriod.selectCustom", { defaultValue: "Select a custom range" })}
              </div>

              <div className="rounded-2xl border border-border bg-background/40 p-4">
                <Calendar
                  mode="range"
                  selected={customRange}
                  onSelect={onCustomRangeChange}
                  numberOfMonths={2}
                  className="rounded-md"
                />
              </div>

              {customRange?.from && customRange?.to ? (
                <div className="text-sm text-muted-foreground">
                  {t("generatePeriod.selectedRange", { defaultValue: "Selected range:" })}{" "}
                  {customRange.from.toLocaleDateString()} -{" "}
                  {customRange.to.toLocaleDateString()}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  {t("generatePeriod.selectBothDates", { defaultValue: "Please select both a start and end date." })}
                </div>
              )}
            </div>
          ) : null}

          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              {t("common.cancel", { defaultValue: "Cancel" })}
            </Button>

            <Button
              className="rounded-full bg-brand-warm text-brand-warm-foreground hover:opacity-90"
              disabled={!canContinue || generating}
              onClick={onContinue}
            >
              {generating
                ? t("calendar.generating", { defaultValue: "Generating…" })
                : t("generatePeriod.continue", { defaultValue: "Continue" })}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
