import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, useInView } from "motion/react";

type Section = {
  title: string;
  content: (string | string[])[];
};

export default function PrivacyPage() {
  const { t } = useTranslation();
  const heroRef = useRef<HTMLElement>(null);
  const heroInView = useInView(heroRef, { once: true });

  const sections: Section[] = [
    {
      title: t("privacyPage.s1.title", { defaultValue: "1. Introduction" }),
      content: [
        t("privacyPage.s1.p1", { defaultValue: 'Welcome to Sporly.ai ("we", "our", "the Platform").' }),
        t("privacyPage.s1.p2", { defaultValue: "This Privacy Policy explains how we collect, use, store, and protect your personal data when you use our application." }),
        t("privacyPage.s1.p3", { defaultValue: "By using Sporly.ai, you agree to the collection and use of information in accordance with this policy." }),
      ],
    },
    {
      title: t("privacyPage.s2.title", { defaultValue: "2. Data We Collect" }),
      content: [
        t("privacyPage.s2.p1", { defaultValue: "We collect the following types of data:" }),
        t("privacyPage.s2.h1", { defaultValue: "Account Data" }),
        [
          t("privacyPage.s2.l1", { defaultValue: "Email address" }),
          t("privacyPage.s2.l2", { defaultValue: "Authentication data (via Supabase or third-party login providers)" }),
        ],
        t("privacyPage.s2.h2", { defaultValue: "User Content" }),
        [
          t("privacyPage.s2.l3", { defaultValue: "Content ideas" }),
          t("privacyPage.s2.l4", { defaultValue: "Links and images added to your inspo board" }),
          t("privacyPage.s2.l5", { defaultValue: "Calendar items and strategies" }),
        ],
        t("privacyPage.s2.h3", { defaultValue: "Social Media Data (if connected)" }),
        [
          t("privacyPage.s2.l6", { defaultValue: "Public and performance data from Instagram, TikTok, and YouTube" }),
          t("privacyPage.s2.l7", { defaultValue: "Metrics such as views, likes, comments, engagement" }),
        ],
        t("privacyPage.s2.h4", { defaultValue: "Usage Data" }),
        [
          t("privacyPage.s2.l8", { defaultValue: "Interaction with the platform" }),
          t("privacyPage.s2.l9", { defaultValue: "Features used" }),
          t("privacyPage.s2.l10", { defaultValue: "Requests sent to AI" }),
        ],
      ],
    },
    {
      title: t("privacyPage.s3.title", { defaultValue: "3. How We Use Your Data" }),
      content: [
        t("privacyPage.s3.p1", { defaultValue: "We use your data to:" }),
        [
          t("privacyPage.s3.l1", { defaultValue: "Provide and operate the Platform" }),
          t("privacyPage.s3.l2", { defaultValue: "Generate AI-based strategies and content" }),
          t("privacyPage.s3.l3", { defaultValue: "Display analytics and insights" }),
          t("privacyPage.s3.l4", { defaultValue: "Improve our services and features" }),
          t("privacyPage.s3.l5", { defaultValue: "Ensure security and prevent abuse" }),
        ],
      ],
    },
    {
      title: t("privacyPage.s4.title", { defaultValue: "4. AI Processing" }),
      content: [
        t("privacyPage.s4.p1", { defaultValue: "Sporly.ai uses artificial intelligence to generate strategies and recommendations." }),
        t("privacyPage.s4.p2", { defaultValue: "This means:" }),
        [
          t("privacyPage.s4.l1", { defaultValue: "Your input (onboarding data, content, context) may be processed by AI systems" }),
          t("privacyPage.s4.l2", { defaultValue: "AI outputs are generated based on patterns and data provided" }),
        ],
        t("privacyPage.s4.p3", { defaultValue: "We do not guarantee accuracy, and users remain responsible for how they use AI-generated results." }),
      ],
    },
    {
      title: t("privacyPage.s5.title", { defaultValue: "5. Third-Party Services" }),
      content: [
        t("privacyPage.s5.p1", { defaultValue: "We use third-party services, including:" }),
        [
          t("privacyPage.s5.l1", { defaultValue: "Supabase (authentication, database, storage)" }),
          t("privacyPage.s5.l2", { defaultValue: "OpenAI (AI processing)" }),
          t("privacyPage.s5.l3", { defaultValue: "Social media APIs (Instagram, TikTok, YouTube)" }),
        ],
        t("privacyPage.s5.p2", { defaultValue: "These providers may process data on our behalf. We only use official APIs and follow platform policies." }),
      ],
    },
    {
      title: t("privacyPage.s6.title", { defaultValue: "6. Data Storage" }),
      content: [
        t("privacyPage.s6.p1", { defaultValue: "Your data is stored securely using trusted infrastructure providers." }),
        t("privacyPage.s6.p2", { defaultValue: "We implement:" }),
        [
          t("privacyPage.s6.l1", { defaultValue: "Access control" }),
          t("privacyPage.s6.l2", { defaultValue: "Secure authentication" }),
          t("privacyPage.s6.l3", { defaultValue: "Encrypted connections (HTTPS)" }),
        ],
        t("privacyPage.s6.p3", { defaultValue: "However, no system is completely secure." }),
      ],
    },
    {
      title: t("privacyPage.s7.title", { defaultValue: "7. Data Retention" }),
      content: [
        t("privacyPage.s7.p1", { defaultValue: "We retain your data:" }),
        [
          t("privacyPage.s7.l1", { defaultValue: "As long as your account is active" }),
          t("privacyPage.s7.l2", { defaultValue: "Or as necessary to provide services" }),
        ],
        t("privacyPage.s7.p2", { defaultValue: "You may request deletion of your data at any time." }),
      ],
    },
    {
      title: t("privacyPage.s8.title", { defaultValue: "8. Your Rights (GDPR)" }),
      content: [
        t("privacyPage.s8.p1", { defaultValue: "If you are in the EU, you have the right to:" }),
        [
          t("privacyPage.s8.l1", { defaultValue: "Access your data" }),
          t("privacyPage.s8.l2", { defaultValue: "Correct inaccurate data" }),
          t("privacyPage.s8.l3", { defaultValue: 'Request deletion ("right to be forgotten")' }),
          t("privacyPage.s8.l4", { defaultValue: "Restrict processing" }),
          t("privacyPage.s8.l5", { defaultValue: "Object to processing" }),
          t("privacyPage.s8.l6", { defaultValue: "Data portability" }),
        ],
        t("privacyPage.s8.p2", { defaultValue: "To exercise your rights, contact us at support@sporly.ai." }),
      ],
    },
    {
      title: t("privacyPage.s9.title", { defaultValue: "9. Cookies" }),
      content: [
        t("privacyPage.s9.p1", { defaultValue: "We may use cookies or similar technologies to maintain sessions and improve user experience." }),
        t("privacyPage.s9.p2", { defaultValue: "You can control cookies through your browser settings." }),
      ],
    },
    {
      title: t("privacyPage.s10.title", { defaultValue: "10. Social Media Integrations" }),
      content: [
        t("privacyPage.s10.p1", { defaultValue: "When you connect your accounts:" }),
        [
          t("privacyPage.s10.l1", { defaultValue: "We access only the data allowed by the platform APIs" }),
          t("privacyPage.s10.l2", { defaultValue: "We do not post or act on your behalf without permission" }),
        ],
        t("privacyPage.s10.p2", { defaultValue: "You can disconnect your accounts at any time." }),
      ],
    },
    {
      title: t("privacyPage.s11.title", { defaultValue: "11. Children's Privacy" }),
      content: [
        t("privacyPage.s11.p1", { defaultValue: "Sporly.ai is not intended for users under 18. We do not knowingly collect data from minors." }),
      ],
    },
    {
      title: t("privacyPage.s12.title", { defaultValue: "12. Changes to This Policy" }),
      content: [
        t("privacyPage.s12.p1", { defaultValue: "We may update this Privacy Policy from time to time. Changes will be posted on this page." }),
        t("privacyPage.s12.p2", { defaultValue: "Continued use of the Platform means you accept the updated policy." }),
      ],
    },
    {
      title: t("privacyPage.s13.title", { defaultValue: "13. Contact" }),
      content: [
        t("privacyPage.s13.p1", { defaultValue: "If you have any questions about this Privacy Policy, contact us at support@sporly.ai." }),
      ],
    },
  ];

  return (
    <div className="py-24 md:py-32">

      {/* HERO */}
      <section ref={heroRef} className="relative max-w-3xl overflow-visible">
        <div className="pointer-events-none absolute -left-40 -top-24 h-[400px] w-[400px] rounded-full bg-brand-warm/6 blur-[120px] animate-[pulse_7s_ease-in-out_infinite]" />

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
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-warm opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-warm" />
          </span>
          <span className="text-muted-foreground">
            {t("privacyPage.badge", { defaultValue: "Legal" })}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl"
        >
          {t("privacyPage.heroTitle", { defaultValue: "Privacy Policy" })}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg"
        >
          {t("privacyPage.heroSubtitle", {
            defaultValue: "Your privacy matters. This policy explains what data we collect, how we use it, and what rights you have.",
          })}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={heroInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-4 text-xs text-muted-foreground/60"
        >
          {t("privacyPage.lastUpdated", { defaultValue: "Last updated: April 2026" })}
        </motion.p>
      </section>

      {/* SECTIONS */}
      <div className="mt-20 max-w-3xl space-y-16">
        {sections.map((section, si) => (
          <motion.section
            key={si}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-bold tracking-tight md:text-2xl">
              {section.title}
            </h2>

            <div className="mt-4 space-y-3">
              {section.content.map((block, bi) =>
                Array.isArray(block) ? (
                  <ul key={bi} className="space-y-2 pl-1">
                    {block.map((item, li) => (
                      <motion.li
                        key={li}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: li * 0.04 }}
                        className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-warm/40" />
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <p
                    key={bi}
                    className={
                      block === section.content[0]
                        ? "text-sm leading-relaxed text-muted-foreground"
                        : /^(Account Data|User Content|Social Media|Usage Data)/.test(block)
                          ? "text-sm font-semibold text-foreground pt-2"
                          : "text-sm leading-relaxed text-muted-foreground"
                    }
                  >
                    {block}
                  </p>
                ),
              )}
            </div>
          </motion.section>
        ))}
      </div>
    </div>
  );
}
