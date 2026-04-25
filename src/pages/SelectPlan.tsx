import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { CheckCircle } from "iconoir-react";
import { Button } from "@/components/ui/button";

export default function SelectPlanPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const starterFeatures: string[] = [
    t("plansPage.starter.f1", { defaultValue: "AI strategy generation" }),
    t("plansPage.starter.f2", { defaultValue: "Content calendar — manual planning" }),
    t("plansPage.starter.f3", { defaultValue: "AI content generation — 1 or 3 months" }),
    t("plansPage.starter.f4", { defaultValue: "Social media insights — Instagram, TikTok, YouTube" }),
    t("plansPage.starter.f5", { defaultValue: "Inspo board — links and images" }),
  ];

  const proFeatures: string[] = [
    t("plansPage.pro.f1", { defaultValue: "Unlimited AI strategy generation" }),
    t("plansPage.pro.f2", { defaultValue: "AI content generation — all periods + custom ranges" }),
    t("plansPage.pro.f3", { defaultValue: "Quick Idea — AI-generated content ideas" }),
    t("plansPage.pro.f4", { defaultValue: "AI video performance analysis" }),
    t("plansPage.pro.f5", { defaultValue: "Social media insights — Instagram, TikTok, YouTube" }),
    t("plansPage.pro.f6", { defaultValue: "Full workflow — strategy to execution" }),
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-16 md:py-24">
      {/* Background glows */}
      <div className="pointer-events-none fixed -left-40 -top-24 h-[400px] w-[400px] rounded-full bg-brand-warm/8 blur-[120px] animate-[pulse_6s_ease-in-out_infinite]" />
      <div className="pointer-events-none fixed -right-20 top-10 h-[300px] w-[300px] rounded-full bg-brand-sky/6 blur-[100px] animate-[pulse_8s_ease-in-out_infinite_1s]" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mb-12 text-center"
      >
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          {t("selectPlan.title", { defaultValue: "Choose your plan" })}
        </h1>
        <p className="mt-4 text-base text-muted-foreground md:text-lg max-w-xl mx-auto leading-relaxed">
          {t("selectPlan.subtitle", {
            defaultValue:
              "You'll get 7 days of Pro access free, then your selected plan starts.",
          })}
        </p>
      </motion.div>

      {/* Plan cards */}
      <div className="grid w-full max-w-4xl gap-6 lg:grid-cols-2">
        {/* STARTER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
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
            {starterFeatures.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.3 + i * 0.06 }}
                className="flex items-start gap-3"
              >
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-sky/10 text-brand-sky">
                  <CheckCircle width={13} height={13} />
                </div>
                <p className="text-sm leading-6 text-muted-foreground">{item}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-auto pt-8">
            <Button
              variant="outline"
              className="w-full rounded-full"
              onClick={() => navigate("/signup?plan=starter")}
            >
              {t("selectPlan.select", { defaultValue: "Select" })}
            </Button>
          </div>
        </motion.div>

        {/* PRO */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
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
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
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
            {proFeatures.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.45 + i * 0.06 }}
                className="flex items-start gap-3"
              >
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-warm/10 text-brand-warm">
                  <CheckCircle width={13} height={13} />
                </div>
                <p className="text-sm leading-6 text-muted-foreground">{item}</p>
              </motion.div>
            ))}
          </div>

          <div className="relative mt-auto pt-8">
            <Button
              className="w-full rounded-full bg-brand-warm text-brand-warm-foreground hover:opacity-90 shadow-lg shadow-brand-warm/20 transition-shadow hover:shadow-xl hover:shadow-brand-warm/30"
              onClick={() => navigate("/signup?plan=pro")}
            >
              {t("selectPlan.select", { defaultValue: "Select" })}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
