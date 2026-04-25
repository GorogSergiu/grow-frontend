import { useEffect, useState } from "react";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { fetchLatestStrategy, generateStrategy } from "@/api/strategy.api";
import type { StrategyResponse } from "@/types/strategy.types";

export function useStrategy() {
  const { getAccessToken } = useAuthFetch();

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [strategy, setStrategy] = useState<StrategyResponse["strategy"]>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const loadStrategy = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = await getAccessToken();
      if (!token) return;

      const body = await fetchLatestStrategy(token);
      setStrategy(body.strategy);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load strategy");
    } finally {
      setLoading(false);
    }
  };

  const runGenerate = async () => {
    setGenerating(true);
    setError(null);
    setConfirmOpen(false);

    try {
      const token = await getAccessToken();
      if (!token) return;

      await generateStrategy(token);
      await loadStrategy();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to generate strategy");
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    loadStrategy();
  }, []);

  return {
    loading,
    generating,
    error,
    strategy,
    strategyJson: strategy?.strategy_json ?? null,
    hasStrategy: !!strategy?.strategy_json,
    confirmOpen,
    setConfirmOpen,
    runGenerate,
  };
}
