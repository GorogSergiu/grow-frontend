import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { CheckCircle } from "iconoir-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { fetchAllIntegrations } from "@/api/integrations.api";
import { fetchLatestStrategy } from "@/api/strategy.api";
import { fetchUpcomingCalendarItems } from "@/api/calendar.api";
import { supabase } from "@/lib/supabase";

type Step = {
  id: string;
  icon: string;
  title: string;
  desc: string;
  done: boolean;
  href: string;
  cta: string;
};

export function WelcomeSection() {
  const { t } = useTranslation();
  const { getAccessToken } = useAuthFetch();

  const [creatorName, setCreatorName] = useState("");
  const [hasAnyPlatform, setHasAnyPlatform] = useState(false);
  const [hasStrategy, setHasStrategy] = useState(false);
  const [hasCalendarItems, setHasCalendarItems] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await getAccessToken();
        if (!token) return;

        // Fetch name
        const { data: userData } = await supabase.auth.getUser();
        if (userData.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("creator_name")
            .eq("id", userData.user.id)
            .single();
          setCreatorName(profile?.creator_name ?? "");
        }

        // Check platforms
        const integrations = await fetchAllIntegrations(token);
        setHasAnyPlatform(integrations.some((i) => i.status === "connected"));

        // Check strategy
        try {
          const res = await fetchLatestStrategy(token);
          setHasStrategy(!!res.strategy?.strategy_json);
        } catch {
          setHasStrategy(false);
        }

        // Check calendar
        try {
          const items = await fetchUpcomingCalendarItems(token);
          setHasCalendarItems(items.length > 0);
        } catch {
          setHasCalendarItems(false);
        }
      } catch {
        // Fail silently
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return null;

  const steps: Step[] = [
    {
      id: "platform",
      icon: "🔗",
      title: t("welcome.step1.title", { defaultValue: "Connect a platform" }),
      desc: t("welcome.step1.desc", { defaultValue: "Link Instagram, TikTok, or YouTube to pull in your real data." }),
      done: hasAnyPlatform,
      href: "/dashboard/settings",
      cta: t("welcome.step1.cta", { defaultValue: "Go to Settings" }),
    },
    {
      id: "strategy",
      icon: "🧠",
      title: t("welcome.step2.title", { defaultValue: "Generate your strategy" }),
      desc: t("welcome.step2.desc", { defaultValue: "AI builds a personalized content strategy from your profile." }),
      done: hasStrategy,
      href: "/dashboard/strategy",
      cta: t("welcome.step2.cta", { defaultValue: "Go to Strategy" }),
    },
    {
      id: "calendar",
      icon: "📅",
      title: t("welcome.step3.title", { defaultValue: "Plan your content" }),
      desc: t("welcome.step3.desc", { defaultValue: "Generate AI content or manually schedule posts on the calendar." }),
      done: hasCalendarItems,
      href: "/dashboard/calendar",
      cta: t("welcome.step3.cta", { defaultValue: "Go to Calendar" }),
    },
  ];

  const completedCount = steps.filter((s) => s.done).length;
  const allDone = completedCount === steps.length;

  // Don't show if everything is done
  if (allDone) return null;

  const progressPercent = (completedCount / steps.length) * 100;
  const greeting = creatorName
    ? t("welcome.greetingName", { name: creatorName, defaultValue: `Welcome, ${creatorName}!` })
    : t("welcome.greeting", { defaultValue: "Welcome to Sporly.ai!" });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className="relative overflow-hidden border-0 surface-solid">
        {/* Background decoration */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-[200px] w-[200px] rounded-full bg-brand-warm/6 blur-[80px]" />
        <div className="pointer-events-none absolute -left-10 bottom-0 h-[150px] w-[150px] rounded-full bg-brand-sky/5 blur-[60px]" />

        <CardContent className="relative pt-8 pb-8 space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="text-2xl font-bold tracking-tight"
            >
              {greeting}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-sm text-muted-foreground"
            >
              {t("welcome.subtitle", { defaultValue: "Complete these steps to get the most out of your experience." })}
            </motion.p>
          </div>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                {t("welcome.progress", {
                  done: completedCount,
                  total: steps.length,
                  defaultValue: `${completedCount} of ${steps.length} completed`,
                })}
              </span>
              <span className="font-medium text-brand-warm">{Math.round(progressPercent)}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-brand-warm to-brand-sky"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </motion.div>

          {/* Steps */}
          <div className="grid gap-3 sm:grid-cols-3">
            {steps.map((step, i) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
                className={[
                  "group rounded-2xl border p-5 transition-all duration-200",
                  step.done
                    ? "border-green-500/20 bg-green-500/5"
                    : "border-border bg-background/60 hover:border-brand-warm/30 hover:bg-background/80",
                ].join(" ")}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">{step.icon}</span>
                  {step.done && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, delay: 0.6 + i * 0.1 }}
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/10 text-green-500"
                    >
                      <CheckCircle width={16} height={16} />
                    </motion.div>
                  )}
                </div>

                <h3 className={[
                  "text-sm font-semibold mb-1",
                  step.done ? "text-green-600 dark:text-green-400" : "",
                ].join(" ")}>
                  {step.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  {step.desc}
                </p>

                {!step.done && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full text-xs h-8"
                    asChild
                  >
                    <Link to={step.href}>{step.cta}</Link>
                  </Button>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
