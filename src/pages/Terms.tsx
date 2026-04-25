import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, useInView } from "motion/react";

type Section = {
  title: string;
  content: (string | string[])[];
};

export default function TermsPage() {
  const { t } = useTranslation();
  const heroRef = useRef<HTMLElement>(null);
  const heroInView = useInView(heroRef, { once: true });

  const sections: Section[] = [
    {
      title: t("termsPage.s1.title", { defaultValue: "1. Introduction" }),
      content: [
        t("termsPage.s1.p1", { defaultValue: 'Welcome to Sporly.ai ("we", "our", "the Platform").' }),
        t("termsPage.s1.p2", { defaultValue: "These Terms & Conditions govern your access to and use of our application, which provides AI-powered tools for content strategy, social media insights, and content planning." }),
        t("termsPage.s1.p3", { defaultValue: "By creating an account or using the Platform, you agree to these Terms. If you do not agree, you must not use the Platform." }),
      ],
    },
    {
      title: t("termsPage.s2.title", { defaultValue: "2. Eligibility" }),
      content: [
        t("termsPage.s2.p1", { defaultValue: "To use this Platform, you must:" }),
        [
          t("termsPage.s2.l1", { defaultValue: "Be at least 18 years old" }),
          t("termsPage.s2.l2", { defaultValue: "Have the legal capacity to enter into a binding agreement" }),
          t("termsPage.s2.l3", { defaultValue: "Provide accurate and complete information during registration" }),
        ],
        t("termsPage.s2.p2", { defaultValue: "You are responsible for maintaining the confidentiality of your account credentials." }),
      ],
    },
    {
      title: t("termsPage.s3.title", { defaultValue: "3. Description of Services" }),
      content: [
        t("termsPage.s3.p1", { defaultValue: "The Platform provides:" }),
        [
          t("termsPage.s3.l1", { defaultValue: "AI-generated content strategies" }),
          t("termsPage.s3.l2", { defaultValue: "Content calendar planning tools" }),
          t("termsPage.s3.l3", { defaultValue: "Social media insights (via third-party integrations)" }),
          t("termsPage.s3.l4", { defaultValue: "Inspiration board functionality (links and uploaded media)" }),
        ],
        t("termsPage.s3.p2", { defaultValue: "We reserve the right to modify, suspend, or discontinue any part of the service at any time." }),
      ],
    },
    {
      title: t("termsPage.s4.title", { defaultValue: "4. AI-Generated Content Disclaimer" }),
      content: [
        t("termsPage.s4.p1", { defaultValue: "The Platform uses artificial intelligence to generate recommendations and content." }),
        t("termsPage.s4.p2", { defaultValue: "You acknowledge that:" }),
        [
          t("termsPage.s4.l1", { defaultValue: "AI outputs are informational and advisory only" }),
          t("termsPage.s4.l2", { defaultValue: "We do not guarantee accuracy, performance, or results" }),
          t("termsPage.s4.l3", { defaultValue: "You are fully responsible for how you use the generated content" }),
        ],
        t("termsPage.s4.p3", { defaultValue: "We are not liable for any business, financial, or reputational outcomes resulting from AI-generated suggestions." }),
      ],
    },
    {
      title: t("termsPage.s5.title", { defaultValue: "5. User Content" }),
      content: [
        t("termsPage.s5.p1", { defaultValue: "You may upload links, images, content ideas, and other materials (\"User Content\")." }),
        t("termsPage.s5.p2", { defaultValue: "You retain ownership of your content, but you grant us a limited license to store, process, display, and use it to provide and improve the service." }),
        t("termsPage.s5.p3", { defaultValue: "You agree not to upload content that:" }),
        [
          t("termsPage.s5.l1", { defaultValue: "Is illegal, harmful, or abusive" }),
          t("termsPage.s5.l2", { defaultValue: "Infringes intellectual property rights" }),
          t("termsPage.s5.l3", { defaultValue: "Violates third-party terms (e.g., social platforms)" }),
        ],
      ],
    },
    {
      title: t("termsPage.s6.title", { defaultValue: "6. Social Media Integrations" }),
      content: [
        t("termsPage.s6.p1", { defaultValue: "The Platform may connect to third-party services such as Instagram, TikTok, and YouTube." }),
        t("termsPage.s6.p2", { defaultValue: "By connecting your accounts, you authorize us to access your data via official APIs and agree to comply with those platforms' terms." }),
        t("termsPage.s6.p3", { defaultValue: "We are not responsible for changes in third-party APIs, data inaccuracies from those platforms, or service interruptions caused by them." }),
      ],
    },
    {
      title: t("termsPage.s7.title", { defaultValue: "7. Payments and Subscription" }),
      content: [
        t("termsPage.s7.p1", { defaultValue: "The Platform operates on a subscription basis." }),
        [
          t("termsPage.s7.l1", { defaultValue: "Pricing is displayed before purchase" }),
          t("termsPage.s7.l2", { defaultValue: "Subscriptions renew automatically unless canceled" }),
          t("termsPage.s7.l3", { defaultValue: "You can cancel at any time from your account" }),
        ],
        t("termsPage.s7.p2", { defaultValue: "We may change pricing with prior notice or offer free trials and promotional plans. Refunds are not guaranteed unless required by law." }),
      ],
    },
    {
      title: t("termsPage.s8.title", { defaultValue: "8. Acceptable Use" }),
      content: [
        t("termsPage.s8.p1", { defaultValue: "You agree NOT to:" }),
        [
          t("termsPage.s8.l1", { defaultValue: "Use the Platform for unlawful purposes" }),
          t("termsPage.s8.l2", { defaultValue: "Attempt to reverse engineer or exploit the system" }),
          t("termsPage.s8.l3", { defaultValue: "Abuse AI generation (e.g., spam, automation misuse)" }),
          t("termsPage.s8.l4", { defaultValue: "Circumvent usage limits" }),
        ],
        t("termsPage.s8.p2", { defaultValue: "We reserve the right to suspend or terminate accounts that violate these rules." }),
      ],
    },
    {
      title: t("termsPage.s9.title", { defaultValue: "9. Data Processing" }),
      content: [
        t("termsPage.s9.p1", { defaultValue: "Your data is processed in accordance with our Privacy Policy. This includes account information, content data, social media insights, and AI interaction data." }),
        t("termsPage.s9.p2", { defaultValue: "We implement reasonable technical and organizational measures to protect your data, but no system is 100% secure." }),
      ],
    },
    {
      title: t("termsPage.s10.title", { defaultValue: "10. Intellectual Property" }),
      content: [
        t("termsPage.s10.p1", { defaultValue: "All Platform content — including software, UI/UX, branding, and AI systems — is owned by Sporly.ai or its licensors." }),
        t("termsPage.s10.p2", { defaultValue: "You may not copy, distribute, resell, or modify any part of the Platform without permission." }),
      ],
    },
    {
      title: t("termsPage.s11.title", { defaultValue: "11. Service Availability" }),
      content: [
        t("termsPage.s11.p1", { defaultValue: "We aim to provide continuous access but do not guarantee uninterrupted or error-free operation." }),
        t("termsPage.s11.p2", { defaultValue: "We may perform maintenance, update features, or temporarily restrict access." }),
      ],
    },
    {
      title: t("termsPage.s12.title", { defaultValue: "12. Limitation of Liability" }),
      content: [
        t("termsPage.s12.p1", { defaultValue: "To the maximum extent permitted by law, we are NOT liable for:" }),
        [
          t("termsPage.s12.l1", { defaultValue: "Loss of profits" }),
          t("termsPage.s12.l2", { defaultValue: "Loss of data" }),
          t("termsPage.s12.l3", { defaultValue: "Business interruption" }),
          t("termsPage.s12.l4", { defaultValue: "Decisions made based on AI outputs" }),
        ],
        t("termsPage.s12.p2", { defaultValue: "Your use of the Platform is at your own risk." }),
      ],
    },
    {
      title: t("termsPage.s13.title", { defaultValue: "13. Termination" }),
      content: [
        t("termsPage.s13.p1", { defaultValue: "We may suspend or terminate your account if you violate these Terms or misuse the Platform." }),
        t("termsPage.s13.p2", { defaultValue: "You may delete your account at any time." }),
      ],
    },
    {
      title: t("termsPage.s14.title", { defaultValue: "14. Changes to Terms" }),
      content: [
        t("termsPage.s14.p1", { defaultValue: "We may update these Terms from time to time. Changes will be posted on this page." }),
        t("termsPage.s14.p2", { defaultValue: "Continued use of the Platform constitutes acceptance of updated Terms." }),
      ],
    },
    {
      title: t("termsPage.s15.title", { defaultValue: "15. Governing Law" }),
      content: [
        t("termsPage.s15.p1", { defaultValue: "These Terms are governed by the applicable laws of your jurisdiction." }),
      ],
    },
    {
      title: t("termsPage.s16.title", { defaultValue: "16. Contact" }),
      content: [
        t("termsPage.s16.p1", { defaultValue: "For questions regarding these Terms, contact us at support@sporly.ai." }),
      ],
    },
  ];

  return (
    <div className="py-24 md:py-32">

      {/* HERO */}
      <section ref={heroRef} className="relative max-w-3xl overflow-visible">
        <div className="pointer-events-none absolute -left-40 -top-24 h-[400px] w-[400px] rounded-full bg-brand-sky/6 blur-[120px] animate-[pulse_7s_ease-in-out_infinite]" />

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
            {t("termsPage.badge", { defaultValue: "Legal" })}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl"
        >
          {t("termsPage.heroTitle", { defaultValue: "Terms & Conditions" })}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg"
        >
          {t("termsPage.heroSubtitle", {
            defaultValue: "Please read these terms carefully before using Sporly.ai. They outline your rights and responsibilities as a user.",
          })}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={heroInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-4 text-xs text-muted-foreground/60"
        >
          {t("termsPage.lastUpdated", { defaultValue: "Last updated: April 2026" })}
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
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-sky/40" />
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <p key={bi} className="text-sm leading-relaxed text-muted-foreground">
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
