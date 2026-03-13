import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export default function Landing() {
  const { t } = useTranslation();

  return (
    <section className="py-24 md:py-32">
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs">
          <span className="h-2 w-2 rounded-full bg-brand-sky" />
          <span className="text-muted-foreground">{t("hero.badge")}</span>
        </div>

        <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
          {t("hero.title_line_1")}
          <br />
          {t("hero.title_line_2")}
        </h1>

        <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
          {t("hero.subtitle")}
        </p>

        <div className="mt-8 flex items-center gap-3">
          <Button
            size="lg"
            asChild
            className="rounded-full bg-brand-warm text-brand-warm-foreground hover:opacity-90"
          >
            <Link to="/signup">{t("hero.cta_primary")}</Link>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="rounded-full border-border"
          >
            {t("hero.cta_secondary")}
          </Button>
        </div>
      </div>
    </section>
  );
}
