import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContentPillarsSection } from "@/features/strategy/components/ContentPillarsSection";
import { PlatformStrategySection } from "@/features/strategy/components/PlatformStrategySection";
import type { StrategyResponse } from "@/types/strategy.types";

type Props = {
  strategyJson: NonNullable<StrategyResponse["strategy"]>["strategy_json"];
};

export function StrategyDisplay({ strategyJson }: Props) {
  const { t } = useTranslation();

  return (
    <>
      <Card className="border-0 surface-solid">
        <CardHeader>
          <CardTitle>{t("dashboard.strategy.summary")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-sm font-medium">
              {t("dashboard.strategy.positioning")}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {strategyJson.positioning}
            </p>
          </div>

          <div>
            <div className="text-sm font-medium">
              {t("dashboard.strategy.overview")}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {strategyJson.summary}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 surface-solid">
        <CardHeader>
          <CardTitle>{t("dashboard.strategy.objectives")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {strategyJson.core_objectives.map((item, index) => (
            <div
              key={index}
              className="rounded-2xl bg-background/40 px-4 py-3 text-sm"
            >
              {item}
            </div>
          ))}
        </CardContent>
      </Card>

      <ContentPillarsSection pillars={strategyJson.content_pillars} />

      <PlatformStrategySection platformStrategy={strategyJson.platform_strategy} />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-0 surface-solid">
          <CardHeader>
            <CardTitle>{t("dashboard.strategy.growthMoves")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {strategyJson.growth_moves.map((item, index) => (
              <div
                key={index}
                className="rounded-2xl bg-background/40 px-4 py-3 text-sm"
              >
                {item}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-0 surface-solid">
          <CardHeader>
            <CardTitle>{t("dashboard.strategy.next30Days")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {strategyJson.next_30_days_focus.map((item, index) => (
              <div
                key={index}
                className="rounded-2xl bg-background/40 px-4 py-3 text-sm"
              >
                {item}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
