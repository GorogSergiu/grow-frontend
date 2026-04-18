import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import {
  Spark,
  StatsReport,
  Calendar,
  Settings,
  Group,
  CheckCircle,
  ArrowRight,
} from "iconoir-react";
import { Button } from "@/components/ui/button";

type FeatureDetail = {
  icon: React.ElementType;
  accent: string;
  accentBg: string;
  label: string;
  title: string;
  subtitle: string;
  bullets: string[];
  note?: string;
};

export default function FeaturesPage() {
  const { t } = useTranslation();
  const heroRef = useRef<HTMLElement>(null);
  const heroInView = useInView(heroRef, { once: true });

  const features: FeatureDetail[] = [
    {
      icon: Spark,
      accent: "bg-brand-warm/10 text-brand-warm",
      accentBg: "bg-brand-warm/5",
      label: t("featuresPage.strategy.label", { defaultValue: "AI Strategy" }),
      title: t("featuresPage.strategy.title", { defaultValue: "A full content strategy built around your profile" }),
      subtitle: t("featuresPage.strategy.subtitle", {
        defaultValue:
          "Grow doesn't give you a generic strategy. It generates one based on your specific goals, audience, challenges, platforms, and content style — all collected during onboarding.",
      }),
      bullets: [
        t("featuresPage.strategy.b1", { defaultValue: "Positioning statement — how to present yourself clearly online" }),
        t("featuresPage.strategy.b2", { defaultValue: "Core objectives — 3–5 specific goals aligned to your period" }),
        t("featuresPage.strategy.b3", { defaultValue: "Content pillars — recurring themes with recommended formats per pillar" }),
        t("featuresPage.strategy.b4", { defaultValue: "Platform strategy — a specific direction for each platform you use" }),
        t("featuresPage.strategy.b5", { defaultValue: "Growth moves — concrete actions to expand your reach" }),
        t("featuresPage.strategy.b6", { defaultValue: "30-day focus plan — an immediate action list to get started" }),
      ],
      note: t("featuresPage.strategy.note", {
        defaultValue:
          "You can generate strategies for 1, 3, or 6 months, or a custom date range. Regenerate whenever your goals evolve.",
      }),
    },
    {
      icon: StatsReport,
      accent: "bg-brand-sky/10 text-brand-sky",
      accentBg: "bg-brand-sky/5",
      label: t("featuresPage.analytics.label", { defaultValue: "Analytics" }),
      title: t("featuresPage.analytics.title", { defaultValue: "Real platform data in one place" }),
      subtitle: t("featuresPage.analytics.subtitle", {
        defaultValue:
          "Connect Instagram, TikTok, and YouTube to pull your actual performance data into Grow. No more switching between platform apps to understand what's working.",
      }),
      bullets: [
        t("featuresPage.analytics.b1", { defaultValue: "Total and average views per post" }),
        t("featuresPage.analytics.b2", { defaultValue: "Engagement rate and total engagement across posts" }),
        t("featuresPage.analytics.b3", { defaultValue: "Total likes and comments" }),
        t("featuresPage.analytics.b4", { defaultValue: "Top 4 best-performing posts with direct links to each" }),
        t("featuresPage.analytics.b5", { defaultValue: "Per-platform breakdown — switch between accounts in one click" }),
        t("featuresPage.analytics.b6", { defaultValue: "Manual sync — refresh data whenever you need the latest numbers" }),
      ],
      note: t("featuresPage.analytics.note", {
        defaultValue:
          "Analytics are based on your last 25 posts per platform. The more you sync, the more accurate your dashboard stays.",
      }),
    },
    {
      icon: Calendar,
      accent: "bg-purple-500/10 text-purple-500",
      accentBg: "bg-purple-500/5",
      label: t("featuresPage.calendar.label", { defaultValue: "Content Calendar" }),
      title: t("featuresPage.calendar.title", { defaultValue: "Plan and schedule your content, manually or with AI" }),
      subtitle: t("featuresPage.calendar.subtitle", {
        defaultValue:
          "The Calendar is where strategy becomes execution. You can plan posts by hand or let AI generate a full set of content ideas directly from your strategy.",
      }),
      bullets: [
        t("featuresPage.calendar.b1", { defaultValue: "Month and week views — choose the layout that fits your workflow" }),
        t("featuresPage.calendar.b2", { defaultValue: "Add posts manually — set title, platform, date, status, and content pillar" }),
        t("featuresPage.calendar.b3", { defaultValue: "AI-generated content — populate the calendar from your active strategy in one click" }),
        t("featuresPage.calendar.b4", { defaultValue: "Ideas bank — store unscheduled concepts until you're ready to plan them" }),
        t("featuresPage.calendar.b5", { defaultValue: "Search and filter — find any idea instantly by keyword or platform" }),
        t("featuresPage.calendar.b6", { defaultValue: "Status tracking — mark posts as Idea, Scheduled, or Posted to stay on track" }),
      ],
      note: t("featuresPage.calendar.note", {
        defaultValue:
          "AI-generated calendar content pulls directly from your strategy pillars and platform direction — not random topics.",
      }),
    },
    {
      icon: Group,
      accent: "bg-green-500/10 text-green-600",
      accentBg: "bg-green-500/5",
      label: t("featuresPage.onboarding.label", { defaultValue: "Onboarding" }),
      title: t("featuresPage.onboarding.title", { defaultValue: "Built for creators and businesses — two separate profiles" }),
      subtitle: t("featuresPage.onboarding.subtitle", {
        defaultValue:
          "Grow adapts to your profile type. Whether you're a content creator growing an audience or a business owner generating leads, the onboarding collects exactly what each profile needs.",
      }),
      bullets: [
        t("featuresPage.onboarding.b1", { defaultValue: "Creator profile — goals, challenges, audience, content style, voice, platforms, and posting habits" }),
        t("featuresPage.onboarding.b2", { defaultValue: "Business profile — industry, products, social goals, KPIs, ideal customer, and budget" }),
        t("featuresPage.onboarding.b3", { defaultValue: "Structured audience builder — age range, gender, location, interests, and pain points" }),
        t("featuresPage.onboarding.b4", { defaultValue: "Content style selector — pick from 10 communication styles that describe how you show up" }),
        t("featuresPage.onboarding.b5", { defaultValue: "Theme library — 15 recurring topics to anchor your content direction" }),
        t("featuresPage.onboarding.b6", { defaultValue: "Platform setup — choose your platforms and set a primary one for focused strategy" }),
      ],
      note: t("featuresPage.onboarding.note", {
        defaultValue:
          "Your onboarding data is used every time you generate a strategy or calendar content. A detailed profile means a better result.",
      }),
    },
    {
      icon: Settings,
      accent: "bg-orange-500/10 text-orange-500",
      accentBg: "bg-orange-500/5",
      label: t("featuresPage.integrations.label", { defaultValue: "Integrations" }),
      title: t("featuresPage.integrations.title", { defaultValue: "Connect Instagram, TikTok, and YouTube" }),
      subtitle: t("featuresPage.integrations.subtitle", {
        defaultValue:
          "Grow connects to your social platforms via official APIs. Authorization is secure, read-only, and takes less than a minute per platform.",
      }),
      bullets: [
        t("featuresPage.integrations.b1", { defaultValue: "Instagram — connect your business or creator account via Meta" }),
        t("featuresPage.integrations.b2", { defaultValue: "TikTok — authorize access to your TikTok content and stats" }),
        t("featuresPage.integrations.b3", { defaultValue: "YouTube — connect your channel via Google OAuth" }),
        t("featuresPage.integrations.b4", { defaultValue: "Read-only access — Grow never posts, edits, or deletes content on your behalf" }),
        t("featuresPage.integrations.b5", { defaultValue: "Multi-platform — all three can be connected simultaneously" }),
        t("featuresPage.integrations.b6", { defaultValue: "Manual sync — you decide when to refresh your data" }),
      ],
      note: t("featuresPage.integrations.note", {
        defaultValue:
          "You can use Grow without connecting any platforms — strategy and calendar work independently. But analytics and top content require at least one connection.",
      }),
    },
  ];

  return (
    <div className="space-y-28 py-24 md:space-y-36 md:py-32">

      {/* HERO */}
      <section ref={heroRef} className="relative max-w-3xl overflow-visible">
        {/* Background glow */}
        <div className="pointer-events-none absolute -left-40 -top-32 h-[450px] w-[450px] rounded-full bg-brand-sky/8 blur-[120px] animate-[pulse_7s_ease-in-out_infinite]" />
        <div className="pointer-events-none absolute -right-20 top-0 h-[300px] w-[300px] rounded-full bg-brand-warm/6 blur-[100px] animate-[pulse_8s_ease-in-out_infinite_2s]" />

        {/* Dot grid */}
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
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-sky opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-sky" />
          </span>
          <span className="text-muted-foreground">
            {t("featuresPage.badge", { defaultValue: "Everything Grow can do" })}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-[3.5rem]"
        >
          <span>{t("featuresPage.heroTitle", { defaultValue: "Every feature," })}</span>{" "}
          <span className="bg-gradient-to-r from-brand-warm to-brand-sky bg-clip-text text-transparent">
            {t("featuresPage.heroTitleAccent", { defaultValue: "explained" })}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg"
        >
          {t("featuresPage.heroSubtitle", {
            defaultValue:
              "Grow is a strategy and content system for creators and businesses. Here's a detailed look at each feature and what it actually does.",
          })}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 flex flex-wrap items-center gap-3"
        >
          <Button
            size="lg"
            asChild
            className="group rounded-full bg-brand-warm text-brand-warm-foreground hover:opacity-90 shadow-lg shadow-brand-warm/20 transition-shadow hover:shadow-xl hover:shadow-brand-warm/30"
          >
            <Link to="/signup" className="flex items-center gap-2">
              {t("featuresPage.heroCta", { defaultValue: "Get started for free" })}
              <ArrowRight width={16} height={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="rounded-full" asChild>
            <Link to="/login">
              {t("featuresPage.heroCtaSecondary", { defaultValue: "Sign in" })}
            </Link>
          </Button>
        </motion.div>

        {/* Quick nav pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={heroInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-10 flex flex-wrap gap-2"
        >
          {features.map((feature, i) => {
            const NavIcon = feature.icon;
            return (
              <motion.a
                key={feature.label}
                href={`#feature-${i}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={heroInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.35, delay: 0.85 + i * 0.07 }}
                className="flex items-center gap-1.5 rounded-full border border-border bg-card/80 backdrop-blur px-3 py-1.5 text-xs text-muted-foreground transition-all duration-200 hover:border-border/80 hover:bg-card hover:text-foreground hover:shadow-sm"
              >
                <NavIcon width={12} height={12} />
                {feature.label}
              </motion.a>
            );
          })}
        </motion.div>
      </section>

      {/* FEATURES */}
      <div className="space-y-28 md:space-y-36">
        {features.map((feature, i) => {
          const Icon = feature.icon;
          const isEven = i % 2 === 0;

          return (
            <motion.section
              key={feature.label}
              id={`feature-${i}`}
              className="relative scroll-mt-24"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.4 }}
            >
              {/* Section glow */}
              <div
                className={`pointer-events-none absolute top-0 h-[350px] w-[350px] rounded-full ${feature.accentBg} blur-[100px] ${
                  isEven ? "-left-32" : "-right-32"
                }`}
              />

              <div className={`grid items-start gap-12 lg:grid-cols-2 ${!isEven ? "lg:[&>*:first-child]:order-2" : ""}`}>
                {/* Text side */}
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <motion.div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl ${feature.accent} transition-transform duration-300`}
                        whileHover={{ scale: 1.1 }}
                      >
                        <Icon width={20} height={20} />
                      </motion.div>
                      <span className="text-sm font-medium text-muted-foreground">
                        {feature.label}
                      </span>
                    </div>

                    <h2 className="text-2xl font-bold leading-snug tracking-tight md:text-3xl">
                      {feature.title}
                    </h2>

                    <p className="text-base leading-relaxed text-muted-foreground">
                      {feature.subtitle}
                    </p>
                  </div>

                  {feature.note ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                      className="rounded-2xl border border-border bg-card/60 backdrop-blur px-4 py-3 text-sm text-muted-foreground leading-relaxed"
                    >
                      {feature.note}
                    </motion.div>
                  ) : null}
                </motion.div>

                {/* Bullets side */}
                <motion.div
                  initial={{ opacity: 0, x: isEven ? 30 : -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                  className="group rounded-[28px] border border-border bg-card/80 backdrop-blur p-6 space-y-3 transition-all duration-300 hover:shadow-lg hover:shadow-black/[0.03] dark:hover:shadow-black/20"
                >
                  {feature.bullets.map((bullet, bi) => (
                    <motion.div
                      key={bi}
                      initial={{ opacity: 0, x: 12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: 0.25 + bi * 0.06 }}
                      className="flex items-start gap-3"
                    >
                      <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${feature.accent} transition-transform duration-200 group-hover:scale-105`}>
                        <CheckCircle width={13} height={13} />
                      </div>
                      <p className="text-sm leading-6 text-muted-foreground">{bullet}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.section>
          );
        })}
      </div>

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
            {t("featuresPage.ctaLabel", { defaultValue: "Ready to start?" })}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-5 text-3xl font-bold tracking-tight md:text-4xl"
          >
            {t("featuresPage.ctaTitle", { defaultValue: "Build your strategy and start planning content today" })}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="mx-auto mt-5 max-w-xl text-base text-muted-foreground md:text-lg"
          >
            {t("featuresPage.ctaSubtitle", {
              defaultValue:
                "It takes a few minutes to complete onboarding and generate your first strategy. No credit card required.",
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
                {t("featuresPage.ctaButton", { defaultValue: "Create your account" })}
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
