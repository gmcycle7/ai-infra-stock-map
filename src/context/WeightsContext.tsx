import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  DEFAULT_WEIGHTS,
  WeightsContext,
  type KpiWeights,
} from "./weightsContextValue";

const KEY = "ai-infra-kpi-weights";

function load(): KpiWeights {
  if (typeof window === "undefined") return DEFAULT_WEIGHTS;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT_WEIGHTS;
    const parsed = JSON.parse(raw);
    return {
      shortTerm: typeof parsed.shortTerm === "number" ? parsed.shortTerm : DEFAULT_WEIGHTS.shortTerm,
      threeYear: typeof parsed.threeYear === "number" ? parsed.threeYear : DEFAULT_WEIGHTS.threeYear,
      fiveYear: typeof parsed.fiveYear === "number" ? parsed.fiveYear : DEFAULT_WEIGHTS.fiveYear,
      tenYear: typeof parsed.tenYear === "number" ? parsed.tenYear : DEFAULT_WEIGHTS.tenYear,
      riskDiscount: typeof parsed.riskDiscount === "number" ? parsed.riskDiscount : DEFAULT_WEIGHTS.riskDiscount,
    };
  } catch {
    return DEFAULT_WEIGHTS;
  }
}

function isDefault(w: KpiWeights): boolean {
  return (
    w.shortTerm === DEFAULT_WEIGHTS.shortTerm &&
    w.threeYear === DEFAULT_WEIGHTS.threeYear &&
    w.fiveYear === DEFAULT_WEIGHTS.fiveYear &&
    w.tenYear === DEFAULT_WEIGHTS.tenYear &&
    w.riskDiscount === DEFAULT_WEIGHTS.riskDiscount
  );
}

export function WeightsProvider({ children }: { children: ReactNode }) {
  const [weights, setWeights] = useState<KpiWeights>(load);

  useEffect(() => {
    window.localStorage.setItem(KEY, JSON.stringify(weights));
  }, [weights]);

  const value = useMemo(
    () => ({
      weights,
      setWeights,
      reset: () => setWeights(DEFAULT_WEIGHTS),
      isCustom: !isDefault(weights),
    }),
    [weights],
  );

  return <WeightsContext.Provider value={value}>{children}</WeightsContext.Provider>;
}
