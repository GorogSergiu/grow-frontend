import { createContext, useContext, useEffect, useState } from "react";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { fetchSubscription } from "@/api/billing.api";
import type { Subscription } from "@/api/billing.api";

type SubscriptionContextValue = {
  subscription: Subscription | null;
  plan: "starter" | "pro";
  isPro: boolean;
  loading: boolean;
  refresh: () => Promise<void>;
};

const SubscriptionContext = createContext<SubscriptionContextValue>({
  subscription: null,
  plan: "starter",
  isPro: false,
  loading: true,
  refresh: async () => {},
});

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { getAccessToken } = useAuthFetch();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const token = await getAccessToken();
      if (!token) return;
      const sub = await fetchSubscription(token);
      setSubscription(sub);
    } catch {
      // No subscription = starter
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const plan = subscription?.plan === "pro" ? "pro" : "starter";
  const isPro = plan === "pro";

  return (
    <SubscriptionContext.Provider value={{ subscription, plan, isPro, loading, refresh: load }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  return useContext(SubscriptionContext);
}
