import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StrategyResponse } from "@/types/strategy.types";

type Props = {
  pillars: NonNullable<StrategyResponse["strategy"]>["strategy_json"]["content_pillars"];
};

export function ContentPillarsSection({ pillars }: Props) {
  const { t } = useTranslation();

  return (
    <Card className="border-0 surface-solid">
      <CardHeader>
        <CardTitle>{t("dashboard.strategy.pillars")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {pillars.map((pillar, index) => (
          <div
            key={index}
            className="rounded-2xl border border-border/60 bg-background/40 p-4"
          >
            <div className="font-medium">{pillar.name}</div>
            <div className="mt-1 text-sm text-muted-foreground">
              {pillar.description}
            </div>
            <div className="mt-3 text-sm">
              <span className="font-medium">
                {t("dashboard.strategy.whyItMatters")}
              </span>{" "}
              <span className="text-muted-foreground">
                {pillar.why_it_matters}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {pillar.formats.map((format, i) => (
                <span
                  key={i}
                  className="rounded-full bg-background px-3 py-1 text-xs text-muted-foreground"
                >
                  {format}
                </span>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
