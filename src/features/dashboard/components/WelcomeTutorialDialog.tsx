import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onDismiss: () => void;
};

const steps = [
  {
    icon: "👋",
    titleKey: "tutorial.step0.title",
    titleDefault: "Welcome to Grow!",
    descKey: "tutorial.step0.desc",
    descDefault:
      "Grow is your all-in-one content strategy platform. It helps you plan, create, and track content across Instagram, TikTok, and YouTube — powered by AI that understands your goals and audience.\n\nThis short guide will walk you through the 4 main things you can do. It only takes a minute.",
  },
  {
    icon: "🔗",
    titleKey: "tutorial.step1.title",
    titleDefault: "Connect your platforms",
    descKey: "tutorial.step1.desc",
    descDefault:
      "Start by heading to Settings and connecting your social accounts. Grow supports Instagram, TikTok, and YouTube.\n\nOnce connected, Grow can pull your real analytics — views, likes, comments, and your top-performing content — directly into your Dashboard. You can connect multiple platforms and switch between them at any time.",
  },
  {
    icon: "🧠",
    titleKey: "tutorial.step2.title",
    titleDefault: "Generate your content strategy",
    descKey: "tutorial.step2.desc",
    descDefault:
      "Go to the Strategy tab and click Generate. You choose a period — 1, 3, or 6 months, or a custom date range — and the AI builds a full content strategy based on your onboarding profile.\n\nYour strategy includes content pillars, recommended formats, a platform-specific approach, growth moves, and a 30-day focus plan. You can regenerate it whenever your goals change.",
  },
  {
    icon: "📅",
    titleKey: "tutorial.step3.title",
    titleDefault: "Plan your content in the Calendar",
    descKey: "tutorial.step3.desc",
    descDefault:
      "The Calendar is where your ideas become a schedule. You can manually add posts, set a platform, status, and date — or use the Generate AI button to automatically populate your calendar with content ideas pulled from your strategy.\n\nSwitch between month and week view, filter by platform, and search across all your ideas. Everything stays organized in one place.",
  },
  {
    icon: "📈",
    titleKey: "tutorial.step4.title",
    titleDefault: "Track your performance",
    descKey: "tutorial.step4.desc",
    descDefault:
      "Once your platforms are connected, your Dashboard becomes your analytics hub. Select a platform from the top-right dropdown to see key metrics: views, likes, comments, and engagement.\n\nThe Top Content widget shows your best-performing posts, and the Upcoming Calendar widget gives you a quick look at what's scheduled next. Everything updates automatically when you sync your accounts.",
  },
];

export function WelcomeTutorialDialog({ open, onDismiss }: Props) {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);

  const step = steps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;

  function handleNext() {
    if (isLast) {
      onDismiss();
    } else {
      setCurrentStep((s) => s + 1);
    }
  }

  function handlePrev() {
    setCurrentStep((s) => s - 1);
  }

  function handleOpenChange(v: boolean) {
    if (!v) onDismiss();
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="surface-solid border-0 sm:max-w-lg">
        {/* Step indicator */}
        <div className="flex items-center gap-1.5 pb-1">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === currentStep
                  ? "w-6 bg-brand-warm"
                  : i < currentStep
                    ? "w-3 bg-brand-warm/40"
                    : "w-3 bg-border"
              }`}
            />
          ))}
          <span className="ml-auto text-xs text-muted-foreground">
            {currentStep + 1} / {steps.length}
          </span>
        </div>

        <DialogHeader>
          <div className="text-4xl mb-2">
            {t(`tutorial.step${currentStep}.icon`, { defaultValue: step.icon })}
          </div>
          <DialogTitle className="text-xl leading-snug">
            {t(step.titleKey, { defaultValue: step.titleDefault })}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-2 min-h-[140px]">
          {t(step.descKey, { defaultValue: step.descDefault })
            .split("\n\n")
            .map((paragraph, i) => (
              <p key={i} className="text-sm text-muted-foreground leading-relaxed">
                {paragraph}
              </p>
            ))}
        </div>

        <div className="flex items-center justify-between pt-2">
          <Button
            variant="ghost"
            className="rounded-full"
            onClick={handlePrev}
            disabled={isFirst}
          >
            ← Back
          </Button>

          <Button
            className="rounded-full bg-brand-warm text-brand-warm-foreground hover:opacity-90"
            onClick={handleNext}
          >
            {isLast ? "Got it, let's go! 🚀" : "Next →"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
