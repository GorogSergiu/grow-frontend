import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CheckCircle, XmarkCircle, ArrowRight, Spark } from "iconoir-react";
import { Button } from "@/components/ui/button";

type PlanFeature = {
  label: string;
  starter: boolean;
  pro: boolean;
};

export default function PlansPage() {
  const { t } = useTranslation();

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
    <div className="space-y-24 py-24 md:space-y-32 md:py-32">

      {/* HERO */}
      <section className="max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs">
          <span className="h-2 w-2 rounded-full bg-brand-warm" />
          <span className="text-muted-foreground">
            {t("plansPage.badge", { defaultValue: "Simple, transparent pricing" })}
          </span>
        </div>

        <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
          {t("plansPage.heroTitle", { defaultValue: "Pick the plan that fits where you are" })}
        </h1>

        <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
          {t("plansPage.heroSubtitle", {
            defaultValue:
              "Start with structure and planning, or go further with platform data and unlimited AI. Upgrade or downgrade anytime.",
          })}
        </p>
      </section>

      {/* TRIAL BANNER */}
      <section>
        <div className="rounded-[28px] border border-brand-warm/30 bg-brand-warm/5 px-6 py-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-warm/10 text-brand-warm">
              <Spark width={20} height={20} />
            </div>
            <div>
              <p className="text-sm font-semibold">
                {t("plansPage.trial.title", { defaultValue: "Start with 7 days of Pro — free" })}
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {t("plansPage.trial.subtitle", {
                  defaultValue:
                    "Every new account gets full Pro access for 7 days. No credit card required. After the trial, you move to Starter automatically.",
                })}
              </p>
            </div>
          </div>
          <Button
            asChild
            className="shrink-0 rounded-full bg-brand-warm text-brand-warm-foreground hover:opacity-90"
          >
            <Link to="/signup" className="flex items-center gap-2">
              {t("plansPage.trial.cta", { defaultValue: "Start free trial" })}
              <ArrowRight width={15} height={15} />
            </Link>
          </Button>
        </div>
      </section>

      {/* PLAN CARDS */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* STARTER */}
        <div className="rounded-[32px] border border-border bg-card/70 p-8 flex flex-col">
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
              <div key={i} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-sky/10 text-brand-sky">
                  <CheckCircle width={13} height={13} />
                </div>
                <p className="text-sm leading-6 text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-2.5">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {t("plansPage.notIncluded", { defaultValue: "Not included" })}
            </p>
            {starterLimits.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground/50">
                  <XmarkCircle width={13} height={13} />
                </div>
                <p className="text-sm leading-6 text-muted-foreground/70">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-8">
            <Button variant="outline" className="w-full rounded-full" asChild>
              <Link to="/signup">
                {t("plansPage.starter.cta", { defaultValue: "Get started" })}
              </Link>
            </Button>
          </div>
        </div>

        {/* PRO */}
        <div className="rounded-[32px] border border-brand-warm/40 bg-card p-8 flex flex-col shadow-sm">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                {t("plansPage.pro.label", { defaultValue: "Pro" })}
              </p>
              <span className="rounded-full bg-brand-warm/10 px-3 py-1 text-xs font-medium text-brand-warm">
                {t("plansPage.pro.badge", { defaultValue: "Most complete" })}
              </span>
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

          <div className="mt-8 space-y-2.5">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {t("plansPage.included", { defaultValue: "What's included" })}
            </p>
            {proIncludes.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-warm/10 text-brand-warm">
                  <CheckCircle width={13} height={13} />
                </div>
                <p className="text-sm leading-6 text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-border bg-card/60 px-4 py-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t("plansPage.pro.fairUsage", {
                defaultValue:
                  "Fair usage applies. No hard limits during early access — we'll communicate clearly before any limits change.",
              })}
            </p>
          </div>

          <div className="mt-auto pt-8">
            <Button
              className="w-full rounded-full bg-brand-warm text-brand-warm-foreground hover:opacity-90"
              asChild
            >
              <Link to="/signup" className="flex items-center justify-center gap-2">
                {t("plansPage.pro.cta", { defaultValue: "Start free trial" })}
                <ArrowRight width={15} height={15} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section>
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          {t("plansPage.compareTitle", { defaultValue: "Feature comparison" })}
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          {t("plansPage.compareSubtitle", { defaultValue: "A side-by-side view of what each plan includes." })}
        </p>

        <div className="mt-8 rounded-[28px] border border-border bg-card overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-3 border-b border-border bg-card/80 px-6 py-4">
            <div className="text-sm font-medium text-muted-foreground col-span-1">
              {t("plansPage.compareFeature", { defaultValue: "Feature" })}
            </div>
            <div className="text-sm font-semibold text-center">
              {t("plansPage.starter.label", { defaultValue: "Starter" })}
            </div>
            <div className="text-sm font-semibold text-center text-brand-warm">
              {t("plansPage.pro.label", { defaultValue: "Pro" })}
            </div>
          </div>

          {/* Rows */}
          {comparison.map((row, i) => (
            <div
              key={i}
              className={[
                "grid grid-cols-3 px-6 py-4",
                i < comparison.length - 1 ? "border-b border-border/60" : "",
              ].join(" ")}
            >
              <div className="text-sm text-muted-foreground col-span-1 flex items-center">
                {row.label}
              </div>
              <div className="flex items-center justify-center">
                {row.starter ? (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-sky/10 text-brand-sky">
                    <CheckCircle width={14} height={14} />
                  </div>
                ) : (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-muted-foreground/40">
                    <XmarkCircle width={14} height={14} />
                  </div>
                )}
              </div>
              <div className="flex items-center justify-center">
                {row.pro ? (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-warm/10 text-brand-warm">
                    <CheckCircle width={14} height={14} />
                  </div>
                ) : (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-muted-foreground/40">
                    <XmarkCircle width={14} height={14} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="rounded-[32px] border border-border bg-card px-8 py-12 text-center md:px-12 md:py-16">
          <div className="text-sm font-medium text-brand-sky">
            {t("plansPage.ctaLabel", { defaultValue: "Start today" })}
          </div>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            {t("plansPage.ctaTitle", { defaultValue: "7 days of Pro, then choose your plan" })}
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground md:text-lg">
            {t("plansPage.ctaSubtitle", {
              defaultValue:
                "Create your account and get full Pro access for a week. No card required. Upgrade, stay on Starter, or cancel — your call.",
            })}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              asChild
              className="rounded-full bg-brand-warm text-brand-warm-foreground hover:opacity-90"
            >
              <Link to="/signup" className="flex items-center gap-2">
                {t("plansPage.ctaButton", { defaultValue: "Create your account" })}
                <ArrowRight width={16} height={16} />
              </Link>
            </Button>

            <Button size="lg" variant="outline" className="rounded-full" asChild>
              <Link to="/login">{t("cta.secondary")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
