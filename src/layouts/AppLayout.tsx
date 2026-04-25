import { Link, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AppNavbar } from "@/features/navigation/AppNavbar";

export default function AppLayout() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <AppNavbar />

      <div className="mx-auto flex w-full max-w-6xl flex-1 gap-6 px-4 py-6">
        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {year} Sporly.ai. {t("footer.rights", { defaultValue: "All rights reserved." })}
          </p>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link to="/dashboard/privacy" className="transition-colors hover:text-foreground">
              {t("footer.privacy", { defaultValue: "Privacy Policy" })}
            </Link>
            <Link to="/dashboard/terms" className="transition-colors hover:text-foreground">
              {t("footer.terms", { defaultValue: "Terms of Service" })}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
