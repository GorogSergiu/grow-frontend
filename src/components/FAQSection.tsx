import { useTranslation } from "react-i18next";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { NavArrowDown } from "iconoir-react";

export default function FAQSection() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
    { q: t("faq.q4"), a: t("faq.a4") },
    { q: t("faq.q5"), a: t("faq.a5") },
  ];

  return (
    <section id="faq" className="relative">
      <div className="pointer-events-none absolute -right-32 top-0 h-[300px] w-[300px] rounded-full bg-brand-sky/5 blur-[90px]" />

      <motion.div
        className="max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 backdrop-blur px-3 py-1 text-xs">
          <span className="text-muted-foreground">FAQ</span>
        </div>
        <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
          {t("faq.title")}
        </h2>
      </motion.div>

      <div className="mt-12 grid gap-3">
        {faqs.map((f, i) => {
          const isOpen = openIndex === i;

          return (
            <motion.div
              key={f.q}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className={[
                  "w-full rounded-[20px] border px-6 py-5 text-left transition-all duration-300",
                  isOpen
                    ? "border-brand-sky/20 bg-card shadow-md shadow-brand-sky/[0.03]"
                    : "border-border bg-card/80 backdrop-blur hover:border-border/80 hover:shadow-sm",
                ].join(" ")}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="font-medium">{f.q}</div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="shrink-0 text-muted-foreground"
                  >
                    <NavArrowDown width={18} height={18} />
                  </motion.div>
                </div>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
