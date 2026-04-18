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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="surface-solid border-0 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Overlapping strategy period</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Part of this new strategy overlaps with content that was already
            generated.
          </p>

          {overlapStart && overlapEnd ? (
            <div className="rounded-2xl border border-border bg-background/40 p-4 text-sm text-muted-foreground">
              The generated content from{" "}
              <span className="font-medium text-foreground">
                {overlapStart}
              </span>{" "}
              to{" "}
              <span className="font-medium text-foreground">
                {overlapEnd}
              </span>{" "}
              will be replaced.
            </div>
          ) : null}

          <div className="flex items-center justify-between gap-2">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={generating}
            >
              Cancel
            </Button>

            <Button
              className="rounded-full bg-brand-warm text-brand-warm-foreground hover:opacity-90"
              disabled={generating}
              onClick={onConfirm}
            >
              {generating ? "Generating…" : "Continue anyway"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
