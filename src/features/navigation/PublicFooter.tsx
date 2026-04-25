import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";

export function PublicFooter() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  const navLinks = [
    { to: "/features", label: t("nav.features") },
    { to: "/plans", label: t("nav.plans", { defaultValue: "Plans" }) },
    { to: "/login", label: t("nav.login") },
    { to: "/signup", label: t("nav.start") },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      className="relative mt-20 border-t border-border"
    >
      {/* Subtle glow */}
      <div className="pointer-events-none absolute -top-20 left-1/2 h-[200px] w-[400px] -translate-x-1/2 rounded-full bg-brand-sky/4 blur-[100px]" />

      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-12 md:grid-cols-[1.2fr_1fr_1fr]">
          {/* Brand column */}
          <div>
            <Link to="/" className="text-xl font-semibold tracking-wide">
              Sporly.ai
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {t("footer.tagline", {
                defaultValue: "AI-powered content strategy for creators and businesses. Plan smarter, grow faster.",
              })}
            </p>
          </div>

          {/* Navigation column */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {t("footer.navigation", { defaultValue: "Navigation" })}
            </p>
            <nav className="mt-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Legal column */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {t("footer.legal", { defaultValue: "Legal" })}
            </p>
            <nav className="mt-4 flex flex-col gap-3">
              <Link
                to="/privacy"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {t("footer.privacy", { defaultValue: "Privacy Policy" })}
              </Link>
              <Link
                to="/terms"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {t("footer.terms", { defaultValue: "Terms of Service" })}
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {year} Sporly.ai. {t("footer.rights", { defaultValue: "All rights reserved." })}
          </p>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground/60">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
            </span>
            {t("footer.status", { defaultValue: "All systems operational" })}
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
