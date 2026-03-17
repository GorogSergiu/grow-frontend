import { useTranslation } from "react-i18next";

export default function FAQSection() {
  const { t } = useTranslation();

  const faqs = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
    { q: t("faq.q4"), a: t("faq.a4") },
    { q: t("faq.q5"), a: t("faq.a5") },
  ];

  return (
    <section id="faq">
      <div className="max-w-2xl">
        <div className="text-sm font-medium text-brand-sky">FAQ</div>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
          Frequently asked questions
        </h2>
      </div>

      <div className="mt-10 grid gap-4">
        {faqs.map((f) => (
          <div
            key={f.q}
            className="rounded-[24px] border border-border bg-card px-6 py-5"
          >
            <div className="font-medium">{f.q}</div>
            <div className="mt-2 text-sm text-muted-foreground">{f.a}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
