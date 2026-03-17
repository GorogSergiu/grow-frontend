import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Spark,
  StatsReport,
  Calendar,
  MediaImageList,
  UserBadgeCheck,
  CheckCircle,
} from "iconoir-react";

import { Button } from "@/components/ui/button";
import PlansSection from "@/components/PlansSelection";
import FAQSection from "@/components/FAQSection";

export default function Landing() {
  const { t } = useTranslation();

  const features = [
    {
      icon: Spark,
      title: t("features.aiStrategy_title"),
      description: t("features.aiStrategy_desc"),
    },
    {
      icon: StatsReport,
      title: t("features.insights_title"),
      description: t("features.insights_desc"),
    },
    {
      icon: Calendar,
      title: t("features.calendar_title"),
      description: t("features.calendar_desc"),
    },
    {
      icon: MediaImageList,
      title: t("features.inspo_title"),
      description: t("features.inspo_desc"),
    },
    {
      icon: UserBadgeCheck,
      title: t("features.creatorBusiness_title"),
      description: t("features.creatorBusiness_desc"),
    },
    {
      icon: CheckCircle,
      title: t("features.workflow_title"),
      description: t("features.workflow_desc"),
    },
  ];

  const steps = [
    {
      number: "01",
      title: t("howItWorks.step1_title"),
      description: t("howItWorks.step1_desc"),
    },
    {
      number: "02",
      title: t("howItWorks.step2_title"),
      description: t("howItWorks.step2_desc"),
    },
    {
      number: "03",
      title: t("howItWorks.step3_title"),
      description: t("howItWorks.step3_desc"),
    },
    {
      number: "04",
      title: t("howItWorks.step4_title"),
      description: t("howItWorks.step4_desc"),
    },
  ];

  const benefits = [
    t("benefits.list.1"),
    t("benefits.list.2"),
    t("benefits.list.3"),
    t("benefits.list.4"),
    t("benefits.list.5"),
    t("benefits.list.6"),
  ];

  return (
    <div className="space-y-28 py-24 md:space-y-36 md:py-32">
      {/* HERO */}
      <section>
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs">
              <span className="h-2 w-2 rounded-full bg-brand-sky" />
              <span className="text-muted-foreground">{t("hero.badge")}</span>
            </div>

            <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
              {t("hero.title_line_1")}
              <br />
              {t("hero.title_line_2")}
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {t("hero.subtitle")}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
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
                asChild
              >
                <Link to="/login">{t("hero.cta_secondary")}</Link>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <div className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
                {t("hero.tags.aiStrategy")}
              </div>
              <div className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
                {t("hero.tags.socialInsights")}
              </div>
              <div className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
                {t("hero.tags.contentCalendar")}
              </div>
              <div className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
                {t("hero.tags.inspoBoard")}
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-border bg-card/70 p-5 shadow-sm">
            <div className="rounded-[24px] border border-border bg-background p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">
                    {t("hero.preview.title")}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("hero.preview.subtitle")}
                  </div>
                </div>

                <div className="rounded-full bg-brand-sky/10 px-3 py-1 text-xs text-brand-sky">
                  {t("hero.preview.badge")}
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="rounded-2xl border border-border bg-card p-4">
                  <div className="text-sm font-medium">
                    {t("hero.preview.cards.insights.title")}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {t("hero.preview.cards.insights.description")}
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-4">
                  <div className="text-sm font-medium">
                    {t("hero.preview.cards.strategy.title")}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {t("hero.preview.cards.strategy.description")}
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-4">
                  <div className="text-sm font-medium">
                    {t("hero.preview.cards.calendar.title")}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {t("hero.preview.cards.calendar.description")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section>
        <div className="max-w-2xl">
          <div className="text-sm font-medium text-brand-sky">
            {t("nav.features")}
          </div>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            {t("features.title")}
          </h2>
          <p className="mt-4 text-base text-muted-foreground md:text-lg">
            {t("features.subtitle")}
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-[28px] border border-border bg-card p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-sky/10">
                  <Icon width={22} height={22} />
                </div>

                <h3 className="mt-5 text-xl font-semibold tracking-tight">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section>
        <div className="max-w-2xl">
          <div className="text-sm font-medium text-brand-sky">
            {t("nav.how")}
          </div>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            {t("howItWorks.title")}
          </h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-[28px] border border-border bg-card p-6"
            >
              <div className="text-sm font-semibold text-brand-sky">
                {step.number}
              </div>
              <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* BENEFITS */}
      <section>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <div className="text-sm font-medium text-brand-sky">
              {t("benefits.heading")}
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              {t("benefits.title")}
            </h2>
            <p className="mt-4 text-base text-muted-foreground md:text-lg">
              {t("benefits.subtitle")}
            </p>
          </div>

          <div className="grid gap-4">
            {benefits.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-[24px] border border-border bg-card px-5 py-4"
              >
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-warm/10">
                  <CheckCircle width={14} height={14} />
                </div>
                <div className="text-sm leading-6 text-muted-foreground">
                  {item}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLANS */}
      <PlansSection />

      {/* FAQ */}
      <FAQSection />

      {/* FINAL CTA */}
      <section>
        <div className="rounded-[32px] border border-border bg-card px-8 py-12 text-center md:px-12 md:py-16">
          <div className="text-sm font-medium text-brand-sky">
            Ready to start?
          </div>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
            {t("cta.title")}
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">
            {t("cta.subtitle")}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              asChild
              className="rounded-full bg-brand-warm text-brand-warm-foreground hover:opacity-90"
            >
              <Link to="/signup">{t("cta.primary")}</Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-border"
              asChild
            >
              <Link to="/login">{t("cta.secondary")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
