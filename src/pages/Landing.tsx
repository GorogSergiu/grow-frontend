import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import {
  Spark,
  StatsReport,
  Calendar,
  MediaImageList,
  UserBadgeCheck,
  CheckCircle,
  ArrowRight,
  GraphUp,
  Eye,
  ThumbsUp,
} from "iconoir-react";

import { Button } from "@/components/ui/button";
import PlansSection from "@/components/PlansSelection";
import FAQSection from "@/components/FAQSection";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1800;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

function SectionReveal({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
}

export default function Landing() {
  const { t } = useTranslation();
  const heroRef = useRef<HTMLElement>(null);
  const heroInView = useInView(heroRef, { once: true });

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
      <section ref={heroRef} className="relative overflow-hidden">
        {/* Background glow orbs */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-brand-warm/8 blur-[120px] animate-[pulse_6s_ease-in-out_infinite]" />
          <div className="absolute -right-32 top-12 h-[400px] w-[400px] rounded-full bg-brand-sky/10 blur-[100px] animate-[pulse_8s_ease-in-out_infinite_1s]" />
          <div className="absolute bottom-0 left-1/3 h-[300px] w-[300px] rounded-full bg-brand-warm/5 blur-[80px] animate-[pulse_7s_ease-in-out_infinite_2s]" />
        </div>

        {/* Subtle dot grid */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Text side */}
          <div className="max-w-3xl">
            {/* Badge */}
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
              <span className="text-muted-foreground">{t("hero.badge")}</span>
            </motion.div>

            {/* Title */}
            <motion.h1
              className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl lg:text-[4rem]"
              initial={{ opacity: 0 }}
              animate={heroInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <motion.span
                className="inline-block"
                initial={{ opacity: 0, y: 30 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                {t("hero.title_line_1")}
              </motion.span>
              <br />
              <motion.span
                className="inline-block bg-gradient-to-r from-brand-warm via-brand-warm to-brand-sky bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 30 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                {t("hero.title_line_2")}
              </motion.span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg"
              initial={{ opacity: 0, y: 16 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {t("hero.subtitle")}
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="mt-8 flex flex-wrap items-center gap-3"
              initial={{ opacity: 0, y: 16 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.75 }}
            >
              <Button
                size="lg"
                asChild
                className="group rounded-full bg-brand-warm text-brand-warm-foreground hover:opacity-90 shadow-lg shadow-brand-warm/20 transition-shadow hover:shadow-xl hover:shadow-brand-warm/30"
              >
                <Link to="/signup" className="flex items-center gap-2">
                  {t("hero.cta_primary")}
                  <ArrowRight width={16} height={16} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-border"
                asChild
              >
                <Link to="/login">{t("hero.cta_secondary")}</Link>
              </Button>
            </motion.div>

            {/* Tags */}
            <motion.div
              className="mt-8 flex flex-wrap gap-2"
              initial={{ opacity: 0 }}
              animate={heroInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              {[
                { key: "aiStrategy", icon: Spark },
                { key: "socialInsights", icon: StatsReport },
                { key: "contentCalendar", icon: Calendar },
                { key: "inspoBoard", icon: MediaImageList },
              ].map((tag, i) => {
                const TagIcon = tag.icon;
                return (
                  <motion.div
                    key={tag.key}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={heroInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.95 + i * 0.08 }}
                    className="flex items-center gap-1.5 rounded-full border border-border bg-card/80 backdrop-blur px-3 py-1.5 text-xs text-muted-foreground"
                  >
                    <TagIcon width={12} height={12} />
                    {t(`hero.tags.${tag.key}`)}
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Dashboard preview card */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 40, rotateX: 8 }}
            animate={heroInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ perspective: 1000 }}
          >
            {/* Glow behind card */}
            <div className="absolute -inset-4 rounded-[40px] bg-gradient-to-br from-brand-warm/10 via-transparent to-brand-sky/10 blur-2xl" />

            <div className="relative rounded-[28px] border border-border bg-card/90 backdrop-blur p-5 shadow-2xl shadow-black/5 dark:shadow-black/20">
              {/* Dashboard header */}
              <div className="flex items-center justify-between rounded-2xl border border-border bg-background px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-2.5 w-2.5 rounded-full bg-brand-warm" />
                  <span className="text-xs font-semibold tracking-wide">Sporly.ai</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-12 rounded-full bg-muted" />
                  <div className="h-2 w-12 rounded-full bg-muted" />
                  <div className="h-2 w-12 rounded-full bg-muted" />
                </div>
              </div>

              {/* Stats row */}
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  { icon: Eye, value: 24800, label: t("hero.preview.stats.views", { defaultValue: "Views" }), color: "text-brand-sky" },
                  { icon: ThumbsUp, value: 3420, label: t("hero.preview.stats.likes", { defaultValue: "Likes" }), color: "text-brand-warm" },
                  { icon: GraphUp, value: 12, label: t("hero.preview.stats.engagement", { defaultValue: "Eng. %" }), suffix: "%", color: "text-green-500" },
                ].map((stat, i) => {
                  const StatIcon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 12 }}
                      animate={heroInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: 1.0 + i * 0.12 }}
                      className="rounded-xl border border-border bg-background p-3"
                    >
                      <div className="flex items-center gap-1.5">
                        <StatIcon width={13} height={13} className={stat.color} />
                        <span className="text-[10px] text-muted-foreground">{stat.label}</span>
                      </div>
                      <div className="mt-1 text-lg font-bold tracking-tight">
                        <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Strategy preview */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 1.3 }}
                className="mt-3 rounded-xl border border-border bg-background p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-warm/10">
                      <Spark width={14} height={14} className="text-brand-warm" />
                    </div>
                    <span className="text-xs font-semibold">{t("hero.preview.cards.strategy.title")}</span>
                  </div>
                  <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-medium text-green-600 dark:text-green-400">
                    {t("hero.preview.active", { defaultValue: "Active" })}
                  </span>
                </div>

                {/* Content pillars mini-bars */}
                <div className="mt-3 space-y-2">
                  {[
                    { w: "w-[85%]", color: "bg-brand-warm" },
                    { w: "w-[65%]", color: "bg-brand-sky" },
                    { w: "w-[45%]", color: "bg-brand-warm/60" },
                  ].map((bar, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="h-1 w-8 rounded-full bg-muted" />
                      <motion.div
                        className={`h-1.5 rounded-full ${bar.color}`}
                        initial={{ width: 0 }}
                        animate={heroInView ? { width: "100%" } : {}}
                        transition={{ duration: 0.8, delay: 1.5 + i * 0.15, ease: "easeOut" }}
                        style={{ maxWidth: bar.w === "w-[85%]" ? "85%" : bar.w === "w-[65%]" ? "65%" : "45%" }}
                      />
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Calendar preview */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 1.5 }}
                className="mt-3 rounded-xl border border-border bg-background p-4"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-sky/10">
                    <Calendar width={14} height={14} className="text-brand-sky" />
                  </div>
                  <span className="text-xs font-semibold">{t("hero.preview.cards.calendar.title")}</span>
                </div>

                <div className="mt-3 grid grid-cols-7 gap-1">
                  {Array.from({ length: 14 }).map((_, i) => {
                    const hasContent = [2, 4, 5, 8, 10, 12].includes(i);
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={heroInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.3, delay: 1.7 + i * 0.03 }}
                        className={[
                          "aspect-square rounded-md border text-center text-[9px] flex items-center justify-center",
                          hasContent
                            ? "border-brand-warm/30 bg-brand-warm/5 text-brand-warm font-medium"
                            : "border-border/60 text-muted-foreground/40",
                        ].join(" ")}
                      >
                        {i + 1}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <SectionReveal>
        <section className="relative">
          {/* Subtle glow */}
          <div className="pointer-events-none absolute -right-40 -top-20 h-[350px] w-[350px] rounded-full bg-brand-sky/6 blur-[100px]" />

          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 backdrop-blur px-3 py-1 text-xs">
              <Spark width={12} height={12} className="text-brand-sky" />
              <span className="text-muted-foreground">{t("nav.features")}</span>
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
              {t("features.title")}
            </h2>
            <p className="mt-4 text-base text-muted-foreground md:text-lg">
              {t("features.subtitle")}
            </p>
          </motion.div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              const accents = [
                "bg-brand-warm/10 text-brand-warm",
                "bg-brand-sky/10 text-brand-sky",
                "bg-purple-500/10 text-purple-500",
                "bg-green-500/10 text-green-600 dark:text-green-400",
                "bg-orange-500/10 text-orange-500",
                "bg-brand-sky/10 text-brand-sky",
              ];

              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="group rounded-[28px] border border-border bg-card/80 backdrop-blur p-6 transition-all duration-300 hover:border-border/80 hover:shadow-lg hover:shadow-black/[0.03] dark:hover:shadow-black/20 hover:-translate-y-1"
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 ${accents[i]}`}>
                    <Icon width={22} height={22} />
                  </div>

                  <h3 className="mt-5 text-xl font-semibold tracking-tight">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </section>
      </SectionReveal>

      {/* HOW IT WORKS */}
      <SectionReveal>
        <section className="relative">
          <div className="pointer-events-none absolute -left-32 top-0 h-[300px] w-[300px] rounded-full bg-brand-warm/5 blur-[90px]" />

          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 backdrop-blur px-3 py-1 text-xs">
              <CheckCircle width={12} height={12} className="text-brand-sky" />
              <span className="text-muted-foreground">{t("nav.how", { defaultValue: "How it works" })}</span>
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
              {t("howItWorks.title")}
            </h2>
          </motion.div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="group relative rounded-[28px] border border-border bg-card/80 backdrop-blur p-6 transition-all duration-300 hover:border-border/80 hover:shadow-lg hover:shadow-black/[0.03] dark:hover:shadow-black/20 hover:-translate-y-1"
              >
                {/* Step number */}
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-sky/15 to-brand-sky/5 text-sm font-bold text-brand-sky transition-transform duration-300 group-hover:scale-110">
                  {step.number}
                </div>

                {/* Connecting line (except last) */}
                {i < steps.length - 1 && (
                  <div className="pointer-events-none absolute right-0 top-1/2 hidden h-px w-5 -translate-y-1/2 translate-x-full bg-gradient-to-r from-border to-transparent xl:block" />
                )}

                <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      </SectionReveal>

      {/* BENEFITS */}
      <SectionReveal>
        <section className="relative">
          <div className="pointer-events-none absolute right-0 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-brand-sky/5 blur-[100px]" />

          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 backdrop-blur px-3 py-1 text-xs">
                <GraphUp width={12} height={12} className="text-brand-sky" />
                <span className="text-muted-foreground">{t("benefits.heading")}</span>
              </div>
              <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
                {t("benefits.title")}
              </h2>
              <p className="mt-4 text-base text-muted-foreground md:text-lg">
                {t("benefits.subtitle")}
              </p>
            </motion.div>

            <div className="grid gap-3">
              {benefits.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="group flex items-start gap-3 rounded-[20px] border border-border bg-card/80 backdrop-blur px-5 py-4 transition-all duration-300 hover:border-brand-warm/20 hover:shadow-md hover:shadow-brand-warm/[0.03]"
                >
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-warm/10 text-brand-warm transition-transform duration-300 group-hover:scale-110">
                    <CheckCircle width={14} height={14} />
                  </div>
                  <div className="text-sm leading-6 text-muted-foreground">
                    {item}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* PLANS */}
      <SectionReveal>
        <PlansSection />
      </SectionReveal>

      {/* FAQ */}
      <SectionReveal>
        <FAQSection />
      </SectionReveal>

      {/* FINAL CTA */}
      <SectionReveal>
        <section className="relative">
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
              Ready to start?
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-5 text-3xl font-bold tracking-tight md:text-5xl"
            >
              <span>{t("cta.title")}</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground md:text-lg"
            >
              {t("cta.subtitle")}
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
                  {t("cta.primary")}
                  <ArrowRight width={16} height={16} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-border"
                asChild
              >
                <Link to="/login">{t("cta.secondary")}</Link>
              </Button>
            </motion.div>
          </motion.div>
        </section>
      </SectionReveal>
    </div>
  );
}
