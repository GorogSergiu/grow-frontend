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
  overlapStart: string | null;
  overlapEnd: string | null;
  generating: boolean;
  onConfirm: () => void;
};

export function OverlapWarningDialog({
  open,
  onOpenChange,
  overlapStart,
  overlapEnd,
  generating,
  onConfirm,
}: Props) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="surface-solid border-0 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {t("overlap.title", { defaultValue: "Overlapping content period" })}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {t("overlap.desc", { defaultValue: "Part of this period overlaps with content that was already generated." })}
          </p>

          {overlapStart && overlapEnd ? (
            <div className="rounded-2xl border border-border bg-background/40 p-4 text-sm text-muted-foreground">
              {t("overlap.range", {
                defaultValue: "The generated content from {{start}} to {{end}} will be replaced.",
                start: overlapStart,
                end: overlapEnd,
              })}
            </div>
          ) : null}

          <div className="flex items-center justify-between gap-2">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={generating}
            >
              {t("common.cancel", { defaultValue: "Cancel" })}
            </Button>

            <Button
              className="rounded-full bg-brand-warm text-brand-warm-foreground hover:opacity-90"
              disabled={generating}
              onClick={onConfirm}
            >
              {generating
                ? t("calendar.generating", { defaultValue: "Generating…" })
                : t("overlap.confirm", { defaultValue: "Continue anyway" })}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
