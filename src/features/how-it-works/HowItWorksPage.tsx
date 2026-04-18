import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

type Step = { title: string; desc: string };

type Section = {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  steps: Step[];
  tip?: string;
  cta?: { label: string; to: string };
};

export default function HowItWorksPage() {
  const { t } = useTranslation();

  const sections: Section[] = [
    {
      id: "connect",
      icon: "🔗",
      title: t("howItWorksPage.connect.title", { defaultValue: "Connect your platforms" }),
      subtitle: t("howItWorksPage.connect.subtitle", {
        defaultValue:
          "Connecting your social accounts is the first step. It unlocks real analytics and makes your strategy much more accurate.",
      }),
      steps: [
        {
          title: t("howItWorksPage.connect.step1.title", { defaultValue: "Go to Settings" }),
          desc: t("howItWorksPage.connect.step1.desc", {
            defaultValue:
              "Click on your account name in the top-right corner and select Settings. You'll find the integrations section there.",
          }),
        },
        {
          title: t("howItWorksPage.connect.step2.title", { defaultValue: "Choose a platform" }),
          desc: t("howItWorksPage.connect.step2.desc", {
            defaultValue:
              "Select Instagram, TikTok, or YouTube and click Connect. You'll be redirected to the platform's authorization page.",
          }),
        },
        {
          title: t("howItWorksPage.connect.step3.title", { defaultValue: "Authorize access" }),
          desc: t("howItWorksPage.connect.step3.desc", {
            defaultValue:
              "Log in with your account and grant the required permissions. Grow only reads your public content and analytics — it never posts on your behalf.",
          }),
        },
        {
          title: t("howItWorksPage.connect.step4.title", { defaultValue: "Sync your data" }),
          desc: t("howItWorksPage.connect.step4.desc", {
            defaultValue:
              "After connecting, click Sync Now to pull in your latest posts and metrics. You can sync again at any time to refresh the data.",
          }),
        },
      ],
      tip: t("howItWorksPage.connect.tip", {
        defaultValue:
          "You can connect all three platforms at once. The Dashboard lets you switch between them to compare performance.",
      }),
      cta: { label: t("howItWorksPage.connect.cta", { defaultValue: "Go to Settings" }), to: "/dashboard/settings" },
    },
    {
      id: "strategy",
      icon: "🧠",
      title: t("howItWorksPage.strategy.title", { defaultValue: "Generate your strategy" }),
      subtitle: t("howItWorksPage.strategy.subtitle", {
        defaultValue:
          "Your strategy is built by AI using the profile you filled in during onboarding. The more detailed your profile, the more tailored the output.",
      }),
      steps: [
        {
          title: t("howItWorksPage.strategy.step1.title", { defaultValue: "Open the Strategy tab" }),
          desc: t("howItWorksPage.strategy.step1.desc", {
            defaultValue:
              "Click on Strategy in the navigation bar. If you haven't generated one yet, the page will be empty with a Generate button.",
          }),
        },
        {
          title: t("howItWorksPage.strategy.step2.title", { defaultValue: "Choose a period" }),
          desc: t("howItWorksPage.strategy.step2.desc", {
            defaultValue:
              "Select 1, 3, or 6 months as a preset, or pick a custom date range. The period defines how far ahead your strategy will plan.",
          }),
        },
        {
          title: t("howItWorksPage.strategy.step3.title", { defaultValue: "Handle overlaps" }),
          desc: t("howItWorksPage.strategy.step3.desc", {
            defaultValue:
              "If you already have a strategy for a period that overlaps, Grow will warn you and ask if you want to overwrite it. You can always keep the existing one.",
          }),
        },
        {
          title: t("howItWorksPage.strategy.step4.title", { defaultValue: "Read your strategy" }),
          desc: t("howItWorksPage.strategy.step4.desc", {
            defaultValue:
              "Your strategy includes a summary, positioning statement, core objectives, content pillars with formats, platform-specific direction, growth moves, and a 30-day focus plan.",
          }),
        },
        {
          title: t("howItWorksPage.strategy.step5.title", { defaultValue: "Regenerate when needed" }),
          desc: t("howItWorksPage.strategy.step5.desc", {
            defaultValue:
              "Goals change. Regenerate your strategy at any time — for a new period or to refresh your direction. Each generation uses your latest onboarding data.",
          }),
        },
      ],
      tip: t("howItWorksPage.strategy.tip", {
        defaultValue:
          "For the best results, make sure your onboarding profile is detailed and up to date. Strategy quality is directly tied to the quality of your profile.",
      }),
      cta: { label: t("howItWorksPage.strategy.cta", { defaultValue: "Go to Strategy" }), to: "/dashboard/strategy" },
    },
    {
      id: "calendar",
      icon: "📅",
      title: t("howItWorksPage.calendar.title", { defaultValue: "Plan content in the Calendar" }),
      subtitle: t("howItWorksPage.calendar.subtitle", {
        defaultValue:
          "The Calendar is your execution layer. This is where your strategy becomes real posts, scheduled on actual dates.",
      }),
      steps: [
        {
          title: t("howItWorksPage.calendar.step1.title", { defaultValue: "Switch views" }),
          desc: t("howItWorksPage.calendar.step1.desc", {
            defaultValue:
              "Use the Month and Week toggle at the top to switch between views. Month view gives you a bird's-eye overview; Week view shows more detail.",
          }),
        },
        {
          title: t("howItWorksPage.calendar.step2.title", { defaultValue: "Add a post manually" }),
          desc: t("howItWorksPage.calendar.step2.desc", {
            defaultValue:
              "Click on any day in the calendar or use the Add button. Fill in the title, platform, status (idea, scheduled, posted), content pillar, and date.",
          }),
        },
        {
          title: t("howItWorksPage.calendar.step3.title", { defaultValue: "Generate content with AI" }),
          desc: t("howItWorksPage.calendar.step3.desc", {
            defaultValue:
              "Click Generate with AI to automatically create a set of content ideas based on your strategy. Choose the period, confirm any overlaps, and the calendar fills up with planned posts.",
          }),
        },
        {
          title: t("howItWorksPage.calendar.step4.title", { defaultValue: "Manage your ideas" }),
          desc: t("howItWorksPage.calendar.step4.desc", {
            defaultValue:
              "Use the Ideas section below the calendar to store unscheduled post concepts. Search and filter by platform to find what you need quickly.",
          }),
        },
        {
          title: t("howItWorksPage.calendar.step5.title", { defaultValue: "Update post status" }),
          desc: t("howItWorksPage.calendar.step5.desc", {
            defaultValue:
              "Click any item to edit it. Update the status to Posted once you publish — this keeps your calendar accurate and helps track execution.",
          }),
        },
      ],
      tip: t("howItWorksPage.calendar.tip", {
        defaultValue:
          "Generate your strategy first, then use Generate with AI in the Calendar. The AI will read your strategy to create content that fits your pillars and platform approach.",
      }),
      cta: { label: t("howItWorksPage.calendar.cta", { defaultValue: "Go to Calendar" }), to: "/dashboard/calendar" },
    },
    {
      id: "dashboard",
      icon: "📊",
      title: t("howItWorksPage.dashboard.title", { defaultValue: "Track performance on the Dashboard" }),
      subtitle: t("howItWorksPage.dashboard.subtitle", {
        defaultValue:
          "The Dashboard gives you a real-time view of how your content is performing — for any connected platform.",
      }),
      steps: [
        {
          title: t("howItWorksPage.dashboard.step1.title", { defaultValue: "Select a platform" }),
          desc: t("howItWorksPage.dashboard.step1.desc", {
            defaultValue:
              "Use the dropdown at the top right to switch between Instagram, TikTok, and YouTube. Each platform shows its own metrics.",
          }),
        },
        {
          title: t("howItWorksPage.dashboard.step2.title", { defaultValue: "Read your analytics" }),
          desc: t("howItWorksPage.dashboard.step2.desc", {
            defaultValue:
              "The Analytics Cards show total views, average views per post, engagement rate, and total likes or comments — based on your last 25 posts.",
          }),
        },
        {
          title: t("howItWorksPage.dashboard.step3.title", { defaultValue: "See your top content" }),
          desc: t("howItWorksPage.dashboard.step3.desc", {
            defaultValue:
              "The Top Performing Content widget shows your 4 best posts with views, likes, and comments. Click any post to open it directly on the platform.",
          }),
        },
        {
          title: t("howItWorksPage.dashboard.step4.title", { defaultValue: "Check upcoming posts" }),
          desc: t("howItWorksPage.dashboard.step4.desc", {
            defaultValue:
              "The Upcoming Schedule widget pulls the next few scheduled items from your Calendar so you always know what's coming up next.",
          }),
        },
        {
          title: t("howItWorksPage.dashboard.step5.title", { defaultValue: "Sync to refresh" }),
          desc: t("howItWorksPage.dashboard.step5.desc", {
            defaultValue:
              "Data doesn't update in real time. Click Sync Now on the platform connection card to pull in the latest posts and metrics from that platform.",
          }),
        },
      ],
      tip: t("howItWorksPage.dashboard.tip", {
        defaultValue:
          "Connect at least one platform before visiting the Dashboard. Without a connected account, the analytics cards and top content widget will be empty.",
      }),
      cta: { label: t("howItWorksPage.dashboard.cta", { defaultValue: "Go to Dashboard" }), to: "/dashboard" },
    },
  ];

  return (
    <div className="space-y-10 pb-16">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("howItWorksPage.title", { defaultValue: "How it works" })}
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          {t("howItWorksPage.subtitle", {
            defaultValue:
              "A detailed guide to every feature in Grow — from connecting your platforms to reading your analytics.",
          })}
        </p>
      </div>

      {/* Quick nav */}
      <div className="flex flex-wrap gap-2">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <span>{s.icon}</span>
            <span>{s.title}</span>
          </a>
        ))}
      </div>

      <Separator />

      {/* Sections */}
      <div className="space-y-16">
        {sections.map((section, si) => (
          <section key={section.id} id={section.id} className="scroll-mt-24 space-y-6">
            {/* Section header */}
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-border bg-background/60 text-2xl">
                {section.icon}
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">{section.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                  {section.subtitle}
                </p>
              </div>
            </div>

            {/* Steps */}
            <div className="grid gap-3 md:grid-cols-2">
              {section.steps.map((step, i) => (
                <Card key={i} className="border-0 surface-solid">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-3 text-sm font-semibold">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-warm/15 text-xs font-bold text-brand-warm">
                        {i + 1}
                      </span>
                      {step.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.desc}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Tip */}
            {section.tip ? (
              <div className="flex gap-3 rounded-2xl border border-border bg-background/40 px-4 py-3">
                <span className="text-base">💡</span>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <span className="font-medium text-foreground">
                    {t("howItWorksPage.tip", { defaultValue: "Tip:" })}
                  </span>{" "}
                  {section.tip}
                </p>
              </div>
            ) : null}

            {/* CTA */}
            {section.cta ? (
              <div>
                <Button asChild className="rounded-full bg-brand-warm text-brand-warm-foreground hover:opacity-90">
                  <Link to={section.cta.to}>{section.cta.label}</Link>
                </Button>
              </div>
            ) : null}

            {si < sections.length - 1 && <Separator />}
          </section>
        ))}
      </div>
    </div>
  );
}
