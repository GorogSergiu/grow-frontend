import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Separator } from "@/components/ui/separator";

export function Sidebar() {
  const { t } = useTranslation();

  const base =
    "flex items-center rounded-xl px-3 py-2 text-sm transition-colors";
  const inactive =
    "text-muted-foreground hover:text-foreground hover:bg-accent";
  const active = "bg-accent text-foreground";

  return (
    <aside className="w-64 shrink-0">
      <div className="border-0 surface-solid p-4">
        <div className="text-sm font-semibold tracking-wide">
          CreatorStrategy
        </div>
        <div className="mt-1 text-xs text-muted-foreground">
          {t("app.nav.workspace")}
        </div>

        <Separator className="my-4" />

        <nav className="space-y-1">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              [base, isActive ? active : inactive].join(" ")
            }
            end
          >
            {t("app.nav.overview")}
          </NavLink>

          <NavLink
            to="/dashboard/strategy"
            className={({ isActive }) =>
              [base, isActive ? active : inactive].join(" ")
            }
          >
            {t("app.nav.strategy")}
          </NavLink>

          <NavLink
            to="/dashboard/settings"
            className={({ isActive }) =>
              [base, isActive ? active : inactive].join(" ")
            }
          >
            {t("app.nav.settings")}
          </NavLink>
        </nav>
      </div>
    </aside>
  );
}
