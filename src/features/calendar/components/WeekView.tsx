import { useTranslation } from "react-i18next";

export function WeekView() {
  const { t } = useTranslation();

  return (
    <div className="text-sm text-muted-foreground">
      {t("dashboard.calendar.weekViewPlaceholder")}
    </div>
  );
}
