import { Instagram, Youtube, Tiktok } from "iconoir-react";
import type { Platform } from "@/types/platform.types";

export function PlatformIcon({ platform }: { platform: Platform }) {
  const commonProps = {
    width: 16,
    height: 16,
    className: "shrink-0",
  };

  if (platform === "instagram") {
    return <Instagram {...commonProps} />;
  }

  if (platform === "youtube") {
    return <Youtube {...commonProps} />;
  }

  return <Tiktok {...commonProps} />;
}
