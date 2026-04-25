import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { fetchInvoices } from "@/api/billing.api";
import type { Invoice } from "@/api/billing.api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function invoiceStatusColor(status: string | null): string {
  switch (status) {
    case "paid":
      return "bg-green-500/10 text-green-600";
    case "open":
      return "bg-amber-500/10 text-amber-600";
    case "void":
    case "uncollectible":
      return "bg-destructive/10 text-destructive";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function formatAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(amount / 100);
}

export function BillingTab() {
  const { t } = useTranslation();
  const { getAccessToken } = useAuthFetch();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const token = await getAccessToken();
        if (!token) return;
        const data = await fetchInvoices(token);
        setInvoices(data);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to load invoices");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="py-10 text-sm text-muted-foreground">
        {t("common.loading", { defaultValue: "Loading…" })}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h3 className="text-base font-semibold">
          {t("settings.billing.title", { defaultValue: "Billing history" })}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t("settings.billing.subtitle", { defaultValue: "View past invoices and download receipts." })}
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>
      )}

      {invoices.length === 0 ? (
        <Card className="border-0 surface-solid">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            {t("settings.billing.empty", { defaultValue: "No invoices yet." })}
          </CardContent>
        </Card>
      ) : (
        <Card className="border-0 surface-solid overflow-hidden">
          <CardContent className="p-0">
            {/* Header */}
            <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 border-b border-border px-6 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              <span>{t("settings.billing.date", { defaultValue: "Date" })}</span>
              <span>{t("settings.billing.amount", { defaultValue: "Amount" })}</span>
              <span>{t("settings.billing.status", { defaultValue: "Status" })}</span>
              <span>{t("settings.billing.invoice", { defaultValue: "Invoice" })}</span>
            </div>

            {/* Rows */}
            {invoices.map((inv) => (
              <div
                key={inv.id}
                className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 border-b border-border/50 px-6 py-4 last:border-0"
              >
                <span className="text-sm">
                  {new Date(inv.created * 1000).toLocaleDateString()}
                  {inv.number && (
                    <span className="ml-2 text-xs text-muted-foreground">#{inv.number}</span>
                  )}
                </span>

                <span className="text-sm font-medium">
                  {formatAmount(inv.amount, inv.currency)}
                </span>

                <Badge className={`rounded-full text-xs capitalize ${invoiceStatusColor(inv.status)}`}>
                  {inv.status ?? "—"}
                </Badge>

                <div className="flex gap-2">
                  {inv.hostedUrl && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 rounded-full text-xs"
                      asChild
                    >
                      <a href={inv.hostedUrl} target="_blank" rel="noopener noreferrer">
                        {t("settings.billing.view", { defaultValue: "View" })}
                      </a>
                    </Button>
                  )}
                  {inv.pdfUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 rounded-full text-xs"
                      asChild
                    >
                      <a href={inv.pdfUrl} target="_blank" rel="noopener noreferrer">
                        PDF
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
