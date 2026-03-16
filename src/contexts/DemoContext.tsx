import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { useDemoMode } from "@/hooks/useDemoMode";
import { DemoUpgradeModal } from "@/components/DemoUpgradeModal";

interface DemoContextValue {
  isDemo: boolean;
  isLoading: boolean;
  /** Call this to block a demo action and show the upgrade modal */
  requireUpgrade: (featureName?: string) => boolean;
}

const DemoContext = createContext<DemoContextValue>({
  isDemo: false,
  isLoading: true,
  requireUpgrade: () => false,
});

export function useDemoContext() {
  return useContext(DemoContext);
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const { isDemo, isLoading } = useDemoMode();
  const [modalOpen, setModalOpen] = useState(false);
  const [featureName, setFeatureName] = useState<string | undefined>();

  const requireUpgrade = useCallback(
    (feature?: string): boolean => {
      if (!isDemo) return false; // not demo, allow action
      setFeatureName(feature);
      setModalOpen(true);
      return true; // blocked
    },
    [isDemo]
  );

  return (
    <DemoContext.Provider value={{ isDemo, isLoading, requireUpgrade }}>
      {children}
      <DemoUpgradeModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        featureName={featureName}
      />
    </DemoContext.Provider>
  );
}
