import { Check } from "iconoir-react";
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
      price: 199 + "euro",
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
    },
  ];

  return (
    <section>
      <div className="max-w-2xl">
        <div className="text-sm font-medium text-brand-sky">
          {t("plans.heading")}
        </div>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
          {t("plans.title")}
        </h2>
        <p className="mt-4 text-base text-muted-foreground md:text-lg">
          {t("plans.subtitle")}
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={[
              "rounded-[32px] border p-8",
              plan.highlighted
                ? "border-brand-warm/40 bg-card shadow-sm"
                : "border-border bg-card/70",
            ].join(" ")}
          >
            {plan.highlighted ? (
              <div className="mb-4 inline-flex rounded-full bg-brand-warm/10 px-3 py-1 text-xs text-brand-warm">
                Most complete
              </div>
            ) : null}

            <div className="text-2xl font-semibold">{plan.name}</div>
            <div className="mt-3 text-3xl font-semibold tracking-tight">
              {plan.price}
            </div>

            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              {plan.description}
            </p>

            <div className="mt-6 space-y-3">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-sky/10">
                    <Check width={14} height={14} />
                  </div>
                  <div className="text-sm text-muted-foreground">{feature}</div>
                </div>
              ))}
            </div>

            <Button
              className={[
                "mt-8 w-full rounded-full",
                plan.highlighted
                  ? "bg-brand-warm text-brand-warm-foreground hover:opacity-90"
                  : "",
              ].join(" ")}
              variant={plan.highlighted ? "default" : "outline"}
            >
              {plan.cta}
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
