import { useEffect, useState, useMemo } from "react";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import {
  fetchLatestStrategy,
  generateStrategy,
  checkStrategyOverlap,
} from "@/api/strategy.api";
import { toIsoDateOnly } from "@/lib/dates";
import type {
  StrategyResponse,
  StrategyPeriodPreset,
  StrategyPeriodType,
  StrategyGeneratePayload,
} from "@/types/strategy.types";
import type { DateRange } from "react-day-picker";

export function useStrategy() {
  const { getAccessToken } = useAuthFetch();

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [strategy, setStrategy] = useState<StrategyResponse["strategy"]>(null);

  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [periodType, setPeriodType] = useState<StrategyPeriodType>("preset");
  const [preset, setPreset] = useState<StrategyPeriodPreset>("3_months");
  const [customRange, setCustomRange] = useState<DateRange | undefined>();
  const [overlapDialogOpen, setOverlapDialogOpen] = useState(false);
  const [pendingGeneratePayload, setPendingGeneratePayload] =
    useState<StrategyGeneratePayload | null>(null);
  const [overlapInfo, setOverlapInfo] = useState<{
    overlapStart: string | null;
    overlapEnd: string | null;
  } | null>(null);

  const canContinueGenerate = useMemo(() => {
    if (periodType === "preset") return true;
    return Boolean(customRange?.from && customRange?.to);
  }, [periodType, customRange]);

  function buildStrategyPayload(): StrategyGeneratePayload {
    return periodType === "preset"
      ? {
          periodType: "preset" as const,
          preset,
          startDate: null,
          endDate: null,
        }
      : {
          periodType: "custom" as const,
          preset: null,
          startDate: customRange?.from ? toIsoDateOnly(customRange.from) : null,
          endDate: customRange?.to ? toIsoDateOnly(customRange.to) : null,
        };
  }

  const loadStrategy = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = await getAccessToken();
      if (!token) return;

      const body = await fetchLatestStrategy(token);
      setStrategy(body.strategy);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Failed to load strategy");
      }
    } finally {
      setLoading(false);
    }
  };

  const runGenerateStrategy = async (payloadArg?: StrategyGeneratePayload) => {
    setGenerating(true);
    setError(null);

    try {
      const token = await getAccessToken();
      if (!token) return;

      const payload = payloadArg ?? buildStrategyPayload();
      await generateStrategy(token, payload);

      setGenerateDialogOpen(false);
      await loadStrategy();
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Failed to generate strategy");
      }
    } finally {
      setGenerating(false);
    }
  };

  const checkOverlapBeforeGenerate = async () => {
    if (!canContinueGenerate) return;

    setError(null);

    try {
      const token = await getAccessToken();
      if (!token) return;

      const payload = buildStrategyPayload();
      const result = await checkStrategyOverlap(token, payload);

      if (result.hasOverlap) {
        setPendingGeneratePayload(payload);
        setOverlapInfo({
          overlapStart: result.overlapStart,
          overlapEnd: result.overlapEnd,
        });
        setOverlapDialogOpen(true);
        return;
      }

      await runGenerateStrategy(payload);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Failed to check overlap");
      }
    }
  };

  const confirmOverlapGenerate = async () => {
    if (!pendingGeneratePayload) return;

    setOverlapDialogOpen(false);
    setGenerateDialogOpen(false);
    await runGenerateStrategy(pendingGeneratePayload);
    setPendingGeneratePayload(null);
  };

  useEffect(() => {
    loadStrategy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    loading,
    generating,
    error,
    strategy,
    strategyJson: strategy?.strategy_json ?? null,
    generateDialogOpen,
    setGenerateDialogOpen,
    periodType,
    setPeriodType,
    preset,
    setPreset,
    customRange,
    setCustomRange,
    overlapDialogOpen,
    setOverlapDialogOpen,
    overlapInfo,
    pendingGeneratePayload,
    canContinueGenerate,
    checkOverlapBeforeGenerate,
    confirmOverlapGenerate,
  };
}
