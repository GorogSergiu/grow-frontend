import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StrategyResponse } from "@/types/strategy.types";

type Props = {
  platformStrategy: NonNullable<StrategyResponse["strategy"]>["strategy_json"]["platform_strategy"];
};

export function PlatformStrategySection({ platformStrategy }: Props) {
  const { t } = useTranslation();

  return (
    <Card className="border-0 surface-solid">
      <CardHeader>
        <CardTitle>{t("dashboard.strategy.platformStrategy")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {platformStrategy.map((item, index) => (
          <div
            key={index}
            className="rounded-2xl border border-border/60 bg-background/40 p-4"
          >
            <div className="font-medium capitalize">{item.platform}</div>
            <div className="mt-1 text-sm text-muted-foreground">
              {item.role}
            </div>
            <div className="mt-3 text-sm">
              <span className="font-medium">
                {t("dashboard.strategy.frequency")}
              </span>{" "}
              <span className="text-muted-foreground">
                {item.posting_frequency}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {item.content_focus.map((focus, i) => (
                <span
                  key={i}
                  className="rounded-full bg-background px-3 py-1 text-xs text-muted-foreground"
                >
                  {focus}
                </span>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
