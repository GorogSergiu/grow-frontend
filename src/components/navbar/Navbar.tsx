import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/mode-toggle";
import { LanguageToggle } from "@/components/language-toggle";

export function Navbar() {
  const { t } = useTranslation();

  return (
    <header className="pt-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-border bg-card px-4 py-3">
        {/* LEFT */}
        <div className="flex items-center gap-10">
          <Button variant="ghost" asChild>
            <Link className="text-sm font-semibold tracking-wide" to="/">
              GROW
            </Link>
          </Button>

          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <span className="cursor-pointer hover:text-foreground">
              {t("nav.features")}
            </span>
            <span className="cursor-pointer hover:text-foreground">
              {t("nav.how")}
            </span>
          </nav>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link to="/login">{t("nav.login")}</Link>
          </Button>

          <Button
            asChild
            className="bg-brand-warm text-brand-warm-foreground hover:opacity-90 rounded-full"
          >
            <Link to="/signup">{t("nav.start")}</Link>
          </Button>

          <Separator orientation="vertical" className="mx-1 h-6!" />

          <ModeToggle />
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}
