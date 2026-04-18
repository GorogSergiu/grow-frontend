import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { CheckCircle, XmarkCircle, ArrowRight, Spark } from "iconoir-react";
import { Button } from "@/components/ui/button";

type PlanFeature = {
  label: string;
  starter: boolean;
  pro: boolean;
};

export default function PlansPage() {
  const { t } = useTranslation();
  const heroRef = useRef<HTMLElement>(null);
  const heroInView = useInView(heroRef, { once: true });

  const starterIncludes: string[] = [
    t("plansPage.starter.f1", { defaultValue: "1 AI strategy per month" }),
    t("plansPage.starter.f2", { defaultValue: "Content calendar — manual + basic AI" }),
    t("plansPage.starter.f3", { defaultValue: "Inspo board — links and images" }),
    t("plansPage.starter.f4", { defaultValue: "Creator and business onboarding" }),
    t("plansPage.starter.f5", { defaultValue: "Content organization" }),
  ];

  const starterLimits: string[] = [
    t("plansPage.starter.l1", { defaultValue: "No social media insights" }),
    t("plansPage.starter.l2", { defaultValue: "No top content analysis" }),
    t("plansPage.starter.l3", { defaultValue: "No advanced AI regeneration" }),
    t("plansPage.starter.l4", { defaultValue: "Max ~30 AI-generated calendar items / month" }),
  ];

  const proIncludes: string[] = [
    t("plansPage.pro.f1", { defaultValue: "Unlimited AI strategy generation" }),
    t("plansPage.pro.f2", { defaultValue: "Social media insights — Instagram, TikTok, YouTube" }),
    t("plansPage.pro.f3", { defaultValue: "Top performing content analysis" }),
    t("plansPage.pro.f4", { defaultValue: "Advanced AI calendar generation" }),
    t("plansPage.pro.f5", { defaultValue: "Regenerate strategy with custom periods" }),
    t("plansPage.pro.f6", { defaultValue: "Full workflow — strategy to execution" }),
  ];

  const comparison: PlanFeature[] = [
    { label: t("plansPage.compare.strategy", { defaultValue: "AI strategy generation" }), starter: true, pro: true },
    { label: t("plansPage.compare.calendar", { defaultValue: "Content calendar" }), starter: true, pro: true },
    { label: t("plansPage.compare.inspo", { defaultValue: "Inspo board" }), starter: true, pro: true },
    { label: t("plansPage.compare.onboarding", { defaultValue: "Creator & business onboarding" }), starter: true, pro: true },
    { label: t("plansPage.compare.insights", { defaultValue: "Social media insights" }), starter: false, pro: true },
    { label: t("plansPage.compare.topContent", { defaultValue: "Top content analysis" }), starter: false, pro: true },
    { label: t("plansPage.compare.advancedAI", { defaultValue: "Advanced AI calendar generation" }), starter: false, pro: true },
    { label: t("plansPage.compare.customPeriods", { defaultValue: "Custom strategy periods" }), starter: false, pro: true },
    { label: t("plansPage.compare.unlimited", { defaultValue: "Unlimited AI strategies" }), starter: false, pro: true },
  ];

  return (
    <div className="space-y-28 py-24 md:space-y-36 md:py-32">

      {/* HERO */}
      <section ref={heroRef} className="relative max-w-3xl overflow-visible">
        {/* Background glow */}
        <div className="pointer-events-none absolute -left-40 -top-24 h-[400px] w-[400px] rounded-full bg-brand-warm/8 blur-[120px] animate-[pulse_6s_ease-in-out_infinite]" />
        <div className="pointer-events-none absolute -right-20 top-10 h-[300px] w-[300px] rounded-full bg-brand-sky/6 blur-[100px] animate-[pulse_8s_ease-in-out_infinite_1s]" />

        <div
          className="pointer-events-none absolute -inset-20 -z-10 opacity-[0.03] dark:opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 backdrop-blur px-3 py-1.5 text-xs"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-warm opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-warm" />
          </span>
          <span className="text-muted-foreground">
            {t("plansPage.badge", { defaultValue: "Simple, transparent pricing" })}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-[3.5rem]"
        >
          <span>{t("plansPage.heroTitleStart", { defaultValue: "Pick the plan that fits" })}</span>{" "}
          <span className="bg-gradient-to-r from-brand-warm to-brand-sky bg-clip-text text-transparent">
            {t("plansPage.heroTitleAccent", { defaultValue: "where you are" })}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg"
        >
          {t("plansPage.heroSubtitle", {
            defaultValue:
              "Start with structure and planning, or go further with platform data and unlimited AI. Upgrade or downgrade anytime.",
          })}
        </motion.p>
      </section>

      {/* TRIAL BANNER */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="relative overflow-hidden rounded-[28px] border border-brand-warm/30 bg-brand-warm/5 px-6 py-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Background shimmer */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-[200px] w-[200px] rounded-full bg-brand-warm/8 blur-[80px]" />

          <div className="relative flex items-start gap-4">
            <motion.div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-warm/10 text-brand-warm"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Spark width={20} height={20} />
            </motion.div>
            <div>
              <p className="text-sm font-semibold">
                {t("plansPage.trial.title", { defaultValue: "Start with 7 days of Pro — free" })}
              </p>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                {t("plansPage.trial.subtitle", {
                  defaultValue:
                    "Every new account gets full Pro access for 7 days. No credit card required. After the trial, you move to Starter automatically.",
                })}
              </p>
            </div>
          </div>
          <Button
            asChild
            className="group shrink-0 rounded-full bg-brand-warm text-brand-warm-foreground hover:opacity-90 shadow-lg shadow-brand-warm/20 transition-shadow hover:shadow-xl hover:shadow-brand-warm/30"
          >
            <Link to="/signup" className="flex items-center gap-2">
              {t("plansPage.trial.cta", { defaultValue: "Start free trial" })}
              <ArrowRight width={15} height={15} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>
      </motion.section>

      {/* PLAN CARDS */}
      <section className="relative">
        <div className="pointer-events-none absolute -left-32 top-1/3 h-[400px] w-[400px] rounded-full bg-brand-sky/5 blur-[100px]" />
        <div className="pointer-events-none absolute -right-32 top-0 h-[350px] w-[350px] rounded-full bg-brand-warm/5 blur-[100px]" />

        <div className="grid gap-6 lg:grid-cols-2">
          {/* STARTER */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="group rounded-[32px] border border-border bg-card/80 backdrop-blur p-8 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/[0.03] dark:hover:shadow-black/20"
          >
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                {t("plansPage.starter.label", { defaultValue: "Starter" })}
              </p>
              <div className="mt-3 flex items-end gap-1.5">
                <span className="text-4xl font-bold tracking-tight">€15</span>
                <span className="mb-1 text-sm text-muted-foreground">
                  {t("plansPage.perMonth", { defaultValue: "/ month" })}
                </span>
              </div>
              <p className="mt-2 text-sm font-medium text-muted-foreground">
                {t("plansPage.starter.positioning", { defaultValue: "Structure your content" })}
              </p>
            </div>

            <div className="mt-8 space-y-2.5">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {t("plansPage.included", { defaultValue: "What's included" })}
              </p>
              {starterIncludes.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: 0.15 + i * 0.06 }}
                  className="flex items-start gap-3"
                >
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-sky/10 text-brand-sky">
                    <CheckCircle width={13} height={13} />
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">{item}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 space-y-2.5">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {t("plansPage.notIncluded", { defaultValue: "Not included" })}
              </p>
              {starterLimits.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: 0.45 + i * 0.06 }}
                  className="flex items-start gap-3"
                >
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground/50">
                    <XmarkCircle width={13} height={13} />
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground/70">{item}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-auto pt-8">
              <Button variant="outline" className="w-full rounded-full" asChild>
                <Link to="/signup">
                  {t("plansPage.starter.cta", { defaultValue: "Get started" })}
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* PRO */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="group relative rounded-[32px] border border-brand-warm/40 bg-card p-8 flex flex-col transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-brand-warm/[0.04] dark:shadow-brand-warm/[0.08] hover:shadow-xl hover:shadow-brand-warm/[0.08]"
          >
            {/* Hover glow */}
            <div className="pointer-events-none absolute -inset-px rounded-[32px] bg-gradient-to-br from-brand-warm/10 via-transparent to-brand-sky/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <div className="relative">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  {t("plansPage.pro.label", { defaultValue: "Pro" })}
                </p>
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="inline-flex items-center gap-1.5 rounded-full bg-brand-warm/10 px-3 py-1 text-xs font-medium text-brand-warm"
                >
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-warm opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-warm" />
                  </span>
                  {t("plansPage.pro.badge", { defaultValue: "Most complete" })}
                </motion.span>
              </div>
              <div className="mt-3 flex items-end gap-1.5">
                <span className="text-4xl font-bold tracking-tight">€39</span>
                <span className="mb-1 text-sm text-muted-foreground">
                  {t("plansPage.perMonth", { defaultValue: "/ month" })}
                </span>
              </div>
              <p className="mt-2 text-sm font-medium text-muted-foreground">
                {t("plansPage.pro.positioning", { defaultValue: "Grow using data" })}
              </p>
            </div>

            <div className="relative mt-8 space-y-2.5">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {t("plansPage.included", { defaultValue: "What's included" })}
              </p>
              {proIncludes.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: 0.2 + i * 0.06 }}
                  className="flex items-start gap-3"
                >
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-warm/10 text-brand-warm">
                    <CheckCircle width={13} height={13} />
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">{item}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.55 }}
              className="relative mt-6 rounded-2xl border border-border bg-card/60 backdrop-blur px-4 py-3"
            >
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("plansPage.pro.fairUsage", {
                  defaultValue:
                    "Fair usage applies. No hard limits during early access — we'll communicate clearly before any limits change.",
                })}
              </p>
            </motion.div>

            <div className="relative mt-auto pt-8">
              <Button
                className="group w-full rounded-full bg-brand-warm text-brand-warm-foreground hover:opacity-90 shadow-lg shadow-brand-warm/20 transition-shadow hover:shadow-xl hover:shadow-brand-warm/30"
                asChild
              >
                <Link to="/signup" className="flex items-center justify-center gap-2">
                  {t("plansPage.pro.cta", { defaultValue: "Start free trial" })}
                  <ArrowRight width={15} height={15} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        <div className="pointer-events-none absolute -right-32 top-0 h-[300px] w-[300px] rounded-full bg-brand-sky/5 blur-[90px]" />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 backdrop-blur px-3 py-1 text-xs mb-4">
            <CheckCircle width={12} height={12} className="text-brand-sky" />
            <span className="text-muted-foreground">{t("plansPage.compareFeature", { defaultValue: "Feature" })}</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            {t("plansPage.compareTitle", { defaultValue: "Feature comparison" })}
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            {t("plansPage.compareSubtitle", { defaultValue: "A side-by-side view of what each plan includes." })}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-8 rounded-[28px] border border-border bg-card/80 backdrop-blur overflow-hidden shadow-lg shadow-black/[0.02] dark:shadow-black/15"
        >
          {/* Table header */}
          <div className="grid grid-cols-3 border-b border-border bg-card/90 px-6 py-4">
            <div className="text-sm font-medium text-muted-foreground col-span-1">
              {t("plansPage.compareFeature", { defaultValue: "Feature" })}
            </div>
            <div className="text-sm font-bold text-center">
              {t("plansPage.starter.label", { defaultValue: "Starter" })}
            </div>
            <div className="text-sm font-bold text-center text-brand-warm">
              {t("plansPage.pro.label", { defaultValue: "Pro" })}
            </div>
          </div>

          {/* Rows */}
          {comparison.map((row, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.2 + i * 0.04 }}
              className={[
                "grid grid-cols-3 px-6 py-4 transition-colors duration-200 hover:bg-accent/30",
                i < comparison.length - 1 ? "border-b border-border/50" : "",
              ].join(" ")}
            >
              <div className="text-sm text-muted-foreground col-span-1 flex items-center">
                {row.label}
              </div>
              <div className="flex items-center justify-center">
                {row.starter ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 400, delay: 0.3 + i * 0.04 }}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-sky/10 text-brand-sky"
                  >
                    <CheckCircle width={14} height={14} />
                  </motion.div>
                ) : (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-muted-foreground/40">
                    <XmarkCircle width={14} height={14} />
                  </div>
                )}
              </div>
              <div className="flex items-center justify-center">
                {row.pro ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 400, delay: 0.3 + i * 0.04 }}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-warm/10 text-brand-warm"
                  >
                    <CheckCircle width={14} height={14} />
                  </motion.div>
                ) : (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-muted-foreground/40">
                    <XmarkCircle width={14} height={14} />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* CTA */}
      <motion.section
        className="relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.4 }}
      >
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-0 h-[300px] w-[300px] rounded-full bg-brand-warm/6 blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 h-[250px] w-[250px] rounded-full bg-brand-sky/8 blur-[80px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-[32px] border border-border bg-card/90 backdrop-blur px-8 py-14 text-center md:px-12 md:py-20 shadow-xl shadow-black/[0.02] dark:shadow-black/20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 rounded-full border border-brand-sky/20 bg-brand-sky/5 px-3 py-1 text-xs font-medium text-brand-sky"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-sky opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-sky" />
            </span>
            {t("plansPage.ctaLabel", { defaultValue: "Start today" })}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-5 text-3xl font-bold tracking-tight md:text-4xl"
          >
            {t("plansPage.ctaTitle", { defaultValue: "7 days of Pro, then choose your plan" })}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="mx-auto mt-5 max-w-xl text-base text-muted-foreground md:text-lg"
          >
            {t("plansPage.ctaSubtitle", {
              defaultValue:
                "Create your account and get full Pro access for a week. No card required. Upgrade, stay on Starter, or cancel — your call.",
            })}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Button
              size="lg"
              asChild
              className="group rounded-full bg-brand-warm text-brand-warm-foreground hover:opacity-90 shadow-lg shadow-brand-warm/20 transition-shadow hover:shadow-xl hover:shadow-brand-warm/30"
            >
              <Link to="/signup" className="flex items-center gap-2">
                {t("plansPage.ctaButton", { defaultValue: "Create your account" })}
                <ArrowRight width={16} height={16} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>

            <Button size="lg" variant="outline" className="rounded-full" asChild>
              <Link to="/login">{t("cta.secondary")}</Link>
            </Button>
          </motion.div>
        </motion.div>
      </motion.section>
    </div>
  );
}
