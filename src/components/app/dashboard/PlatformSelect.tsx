import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type Platform = "youtube" | "tiktok" | "instagram";

const platforms: { key: Platform; labelKey: string }[] = [
  { key: "youtube", labelKey: "dashboard.platforms.youtube" },
  { key: "tiktok", labelKey: "dashboard.platforms.tiktok" },
  { key: "instagram", labelKey: "dashboard.platforms.instagram" },
];

export function PlatformSelect({
  value,
  onChange,
  disabled,
}: {
  value: Platform;
  onChange: (p: Platform) => void;
  disabled?: boolean;
}) {
  const { t } = useTranslation();

  const currentLabel =
    platforms.find((p) => p.key === value)?.labelKey ?? "dashboard.platforms.youtube";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="rounded-full bg-background/60 hover:bg-accent"
          disabled={disabled}
        >
          {t(currentLabel)}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="rounded-2xl">
        {platforms.map((p) => (
          <DropdownMenuItem
            key={p.key}
            onClick={() => onChange(p.key)}
            className="rounded-xl"
          >
            {t(p.labelKey)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
