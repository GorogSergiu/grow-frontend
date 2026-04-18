import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  generating: boolean;
  onGenerate: () => void;
};

export function GenerateDialog({
  open,
  onOpenChange,
  generating,
  onGenerate,
}: Props) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="surface-solid border-0 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {t("dashboard.calendar.generateAi")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {t("dashboard.strategy.subtitle")}
          </p>

          <div className="flex items-center justify-between gap-2">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={generating}
            >
              {t("common.cancel")}
            </Button>

            <Button
              className="rounded-full bg-brand-warm text-brand-warm-foreground hover:opacity-90"
              disabled={generating}
              onClick={onGenerate}
            >
              {generating
                ? t("dashboard.strategy.generating")
                : t("dashboard.calendar.generateAi")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
