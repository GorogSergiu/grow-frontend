const API_URL = import.meta.env.VITE_API_URL;

export type Subscription = {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  plan: "starter" | "pro";
  status: "trialing" | "active" | "past_due" | "canceled" | "incomplete";
  trial_ends_at: string | null;
  current_period_end: string | null;
  created_at: string;
};

export type Invoice = {
  id: string;
  number: string | null;
  status: string | null;
  amount: number;
  currency: string;
  created: number;
  hostedUrl: string | null;
  pdfUrl: string | null;
};

export async function fetchSubscription(token: string): Promise<Subscription | null> {
  const res = await fetch(`${API_URL}/api/billing/subscription`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error ?? "Failed to fetch subscription");
  return body.subscription ?? null;
}

export async function fetchInvoices(token: string): Promise<Invoice[]> {
  const res = await fetch(`${API_URL}/api/billing/invoices`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error ?? "Failed to fetch invoices");
  return body.invoices ?? [];
}

export async function createPortalSession(token: string): Promise<string> {
  const res = await fetch(`${API_URL}/api/billing/portal`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error ?? "Failed to create portal session");
  return body.url;
}

export async function fetchFullProfile(token: string): Promise<{
  creator_name: string;
  entity_type: "creator" | "business";
  onboarding_profile: Record<string, unknown>;
  onboarding_completed: boolean;
}> {
  const res = await fetch(`${API_URL}/api/profile/full`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error ?? "Failed to fetch profile");
  return body.profile;
}

export async function updateProfile(
  token: string,
  data: { creator_name?: string; onboarding_profile?: Record<string, unknown> },
): Promise<void> {
  const res = await fetch(`${API_URL}/api/profile/update`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error ?? "Failed to update profile");
}
