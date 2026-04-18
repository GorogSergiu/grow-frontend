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
  onPeriodTypeChange,
  onCustomRangeChange,
  onContinue,
}: Props) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="surface-solid border-0 sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select strategy period</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Choose how long you want your strategy to be.
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
                  <Label htmlFor="period-1m">1 month</Label>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-border bg-background/60 p-4">
                  <RadioGroupItem value="3_months" id="period-3m" />
                  <Label htmlFor="period-3m">3 months</Label>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-border bg-background/60 p-4">
                  <RadioGroupItem value="6_months" id="period-6m" />
                  <Label htmlFor="period-6m">6 months</Label>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-border bg-background/60 p-4">
                  <RadioGroupItem value="custom" id="period-custom" />
                  <Label htmlFor="period-custom">Custom range</Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="rounded-2xl border border-border bg-background/40 p-4 text-sm text-muted-foreground">
            {periodType === "preset" ? (
              <>
                Selected period:{" "}
                <span className="font-medium text-foreground">
                  {preset === "1_month"
                    ? "1 month"
                    : preset === "3_months"
                      ? "3 months"
                      : "6 months"}
                </span>
              </>
            ) : (
              <>
                Selected period:{" "}
                <span className="font-medium text-foreground">
                  {customRange?.from && customRange?.to
                    ? `${customRange.from.toLocaleDateString()} - ${customRange.to.toLocaleDateString()}`
                    : "Custom range not complete"}
                </span>
              </>
            )}
          </div>

          {periodType === "custom" ? (
            <div className="space-y-3">
              <div className="text-sm font-medium">Select a custom range</div>

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
                  Selected range: {customRange.from.toLocaleDateString()} -{" "}
                  {customRange.to.toLocaleDateString()}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Please select both a start and end date.
                </div>
              )}
            </div>
          ) : null}

          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button
              className="rounded-full bg-brand-warm text-brand-warm-foreground hover:opacity-90"
              disabled={!canContinue || generating}
              onClick={onContinue}
            >
              {generating ? "Generating…" : "Continue"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
