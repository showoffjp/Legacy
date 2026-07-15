"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { EMPTY_PLAN, type ServicePlan } from "@/lib/types";

const STORAGE_KEY = "legacy-service-plan-v1";

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

interface PlanContextValue {
  plan: ServicePlan;
  /** True once the plan has been loaded from localStorage. */
  ready: boolean;
  update: (patch: DeepPartial<ServicePlan>) => void;
  reset: () => void;
}

const PlanContext = createContext<PlanContextValue | null>(null);

function mergePlan(base: ServicePlan, patch: DeepPartial<ServicePlan>): ServicePlan {
  const next: ServicePlan = {
    ...base,
    ...(patch as Partial<ServicePlan>),
    deceased: { ...base.deceased, ...patch.deceased },
    service: {
      ...base.service,
      ...patch.service,
      location: { ...base.service.location, ...patch.service?.location },
    },
    program: { ...base.program, ...patch.program },
  };
  next.updatedAt = new Date().toISOString();
  return next;
}

export function PlanProvider({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState<ServicePlan>(EMPTY_PLAN);
  const [ready, setReady] = useState(false);
  const persistTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingPlan = useRef<ServicePlan | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as DeepPartial<ServicePlan>;
        setPlan(mergePlan(EMPTY_PLAN, parsed));
      }
    } catch {
      // Corrupt or unavailable storage — begin with a fresh plan.
    }
    setReady(true);
  }, []);

  // If the tab closes or is backgrounded before the debounce fires, flush
  // the latest plan synchronously so no choice is ever lost.
  useEffect(() => {
    const flush = () => {
      if (pendingPlan.current === null) return;
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(pendingPlan.current));
        pendingPlan.current = null;
      } catch {
        // Storage full or blocked — nothing more we can do here.
      }
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") flush();
    };
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const persist = useCallback((next: ServicePlan) => {
    pendingPlan.current = next;
    if (persistTimer.current) clearTimeout(persistTimer.current);
    persistTimer.current = setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        if (pendingPlan.current === next) pendingPlan.current = null;
      } catch {
        // Storage may be full (e.g. large portrait) or blocked; keep in memory.
      }
    }, 250);
  }, []);

  const update = useCallback(
    (patch: DeepPartial<ServicePlan>) => {
      setPlan((prev) => {
        const next = mergePlan(prev, patch);
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const reset = useCallback(() => {
    setPlan(EMPTY_PLAN);
    pendingPlan.current = null;
    if (persistTimer.current) clearTimeout(persistTimer.current);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return (
    <PlanContext.Provider value={{ plan, ready, update, reset }}>
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan(): PlanContextValue {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error("usePlan must be used within a PlanProvider");
  return ctx;
}
