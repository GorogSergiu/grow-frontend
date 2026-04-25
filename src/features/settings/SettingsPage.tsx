import { useTranslation } from "react-i18next";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { IntegrationsTab } from "@/features/settings/components/IntegrationsTab";
import { AccountTab } from "@/features/settings/components/AccountTab";
import { PlanTab } from "@/features/settings/components/PlanTab";
import { BillingTab } from "@/features/settings/components/BillingTab";

export default function SettingsPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">
          {t("settings.title", { defaultValue: "Settings" })}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t("settings.subtitle", { defaultValue: "Manage your account, integrations, plan, and billing." })}
        </p>
      </div>

      <Tabs defaultValue="integrations">
        <TabsList className="w-full justify-start rounded-full border border-border bg-background/60 p-1">
          <TabsTrigger value="integrations" className="rounded-full px-4 text-sm">
            {t("settings.tabs.integrations", { defaultValue: "Integrations" })}
          </TabsTrigger>
          <TabsTrigger value="account" className="rounded-full px-4 text-sm">
            {t("settings.tabs.account", { defaultValue: "Account" })}
          </TabsTrigger>
          <TabsTrigger value="plan" className="rounded-full px-4 text-sm">
            {t("settings.tabs.plan", { defaultValue: "Plan" })}
          </TabsTrigger>
          <TabsTrigger value="billing" className="rounded-full px-4 text-sm">
            {t("settings.tabs.billing", { defaultValue: "Billing" })}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="pt-6">
          <IntegrationsTab />
        </TabsContent>

        <TabsContent value="account" className="pt-6">
          <AccountTab />
        </TabsContent>

        <TabsContent value="plan" className="pt-6">
          <PlanTab />
        </TabsContent>

        <TabsContent value="billing" className="pt-6">
          <BillingTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
