import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/mode-toggle";
import { LanguageToggle } from "@/components/language-toggle";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AppNavbar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    navigate("/", { replace: true });
  }

  const linkBase =
    "text-sm text-muted-foreground hover:text-foreground transition-colors";
  const linkActive = "text-foreground";

  return (
    <header className="pt-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-border bg-card px-4 py-3">
        {/* LEFT */}
        <div className="flex items-center gap-10">
          <Link to="/dashboard" className="text-sm font-semibold tracking-wide">
            CreatorStrategy
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) =>
                [linkBase, isActive ? linkActive : ""].join(" ")
              }
            >
              {t("app.nav.overview")}
            </NavLink>

            <NavLink
              to="/dashboard/calendar"
              className={({ isActive }) =>
                [linkBase, isActive ? linkActive : ""].join(" ")
              }
            >
              {t("app.nav.calendar")}
            </NavLink>

            <NavLink
              to="/dashboard/strategy"
              className={({ isActive }) =>
                [linkBase, isActive ? linkActive : ""].join(" ")
              }
            >
              {t("app.nav.strategy")}
            </NavLink>
          </nav>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">
          <ModeToggle />
          <LanguageToggle />

          <Separator
            orientation="vertical"
            className="mx-1 h-6! bg-foreground/15"
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-full">
                {email ? email.split("@")[0] : t("app.nav.account")}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate("/dashboard/settings")}>
                {t("app.nav.settings")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout}>
                {t("app.nav.logout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
