import { Check, ArrowRight, Spark } from "iconoir-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function PlansSection() {
  const { t } = useTranslation();

  const plans = [
    {
      name: t("plans.simple.title"),
      description: t("plans.simple.description"),
      cta: t("plans.simple_cta"),
      highlighted: false,
      features: [
        t("plans.features.strategy"),
        t("plans.features.calendar"),
        t("plans.features.inspo"),
        t("plans.features.onboarding"),
        t("plans.features.organization"),
      ],
      price: "€15",
    },
    {
      name: t("plans.pro.title"),
      description: t("plans.pro.description"),
      cta: t("plans.pro.cta"),
      badge: t("plans.pro.badge"),
      highlighted: true,
      features: [
        t("plans.features.strategy"),
        t("plans.features.insights"),
        t("plans.features.topContent"),
        t("plans.features.dataStrategy"),
        t("plans.features.aiCalendar"),
        t("plans.features.workflow"),
      ],
      price: "€39",
    },
  ];

  return (
    <section className="relative">
      <div className="pointer-events-none absolute -left-20 top-1/3 h-[350px] w-[350px] rounded-full bg-brand-warm/5 blur-[100px]" />

      <motion.div
        className="max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 backdrop-blur px-3 py-1 text-xs">
          <Spark width={12} height={12} className="text-brand-sky" />
          <span className="text-muted-foreground">{t("plans.heading")}</span>
        </div>
        <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
          {t("plans.title")}
        </h2>
        <p className="mt-4 text-base text-muted-foreground md:text-lg">
          {t("plans.subtitle")}
        </p>
      </motion.div>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
            className={[
              "group relative rounded-[32px] border p-8 transition-all duration-300 hover:-translate-y-1",
              plan.highlighted
                ? "border-brand-warm/40 bg-card shadow-lg shadow-brand-warm/[0.04] dark:shadow-brand-warm/[0.08] hover:shadow-xl hover:shadow-brand-warm/[0.08]"
                : "border-border bg-card/80 backdrop-blur hover:shadow-lg hover:shadow-black/[0.03] dark:hover:shadow-black/20",
            ].join(" ")}
          >
            {/* Glow for highlighted */}
            {plan.highlighted && (
              <div className="pointer-events-none absolute -inset-px rounded-[32px] bg-gradient-to-br from-brand-warm/10 via-transparent to-brand-sky/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            )}

            <div className="relative">
              {plan.highlighted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-brand-warm/10 px-3 py-1 text-xs font-medium text-brand-warm"
                >
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-warm opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-warm" />
                  </span>
                  {plan.badge}
                </motion.div>
              )}

              <div className="text-2xl font-bold">{plan.name}</div>
              <div className="mt-3 flex items-end gap-1.5">
                <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                <span className="mb-1 text-sm text-muted-foreground">/ {t("plansPage.perMonth", { defaultValue: "month" })}</span>
              </div>

              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                {plan.description}
              </p>

              <div className="mt-6 space-y-3">
                {plan.features.map((feature, fi) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: 0.3 + fi * 0.06 }}
                    className="flex items-start gap-3"
                  >
                    <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${plan.highlighted ? "bg-brand-warm/10 text-brand-warm" : "bg-brand-sky/10 text-brand-sky"}`}>
                      <Check width={14} height={14} />
                    </div>
                    <div className="text-sm text-muted-foreground">{feature}</div>
                  </motion.div>
                ))}
              </div>

              <Button
                className={[
                  "mt-8 w-full rounded-full transition-shadow",
                  plan.highlighted
                    ? "bg-brand-warm text-brand-warm-foreground hover:opacity-90 shadow-lg shadow-brand-warm/20 hover:shadow-xl hover:shadow-brand-warm/30"
                    : "",
                ].join(" ")}
                variant={plan.highlighted ? "default" : "outline"}
                asChild
              >
                <Link to="/signup" className="flex items-center justify-center gap-2">
                  {plan.cta}
                  {plan.highlighted && <ArrowRight width={15} height={15} />}
                </Link>
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
