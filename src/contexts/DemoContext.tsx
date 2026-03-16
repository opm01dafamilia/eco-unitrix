import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { useEcosystemAccess, type EcosystemAccess } from "@/hooks/useEcosystemAccess";
import { DemoUpgradeModal } from "@/components/DemoUpgradeModal";

interface DemoContextValue {
  /** Whether the user is in demo/no-access mode */
  isDemo: boolean;
  isLoading: boolean;
  /** Full ecosystem access info */
  access: EcosystemAccess;
  /** Call this to block a demo action and show the upgrade modal */
  requireUpgrade: (featureName?: string) => boolean;
}

const DemoContext = createContext<DemoContextValue>({
  isDemo: false,
  isLoading: true,
  access: {
    hasAccess: false,
    accessType: "none",
    label: "",
    startedAt: null,
    expiresAt: null,
    daysRemaining: null,
    trialExpired: false,
    isLoading: true,
  },
  requireUpgrade: () => false,
});

export function useDemoContext() {
  return useContext(DemoContext);
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const access = useEcosystemAccess();
  const isDemo = !access.isLoading && !access.hasAccess;
  const [modalOpen, setModalOpen] = useState(false);
  const [featureName, setFeatureName] = useState<string | undefined>();

  const requireUpgrade = useCallback(
    (feature?: string): boolean => {
      if (!isDemo) return false;
      setFeatureName(feature);
      setModalOpen(true);
      return true;
    },
    [isDemo]
  );

  return (
    <DemoContext.Provider value={{ isDemo, isLoading: access.isLoading, access, requireUpgrade }}>
      {children}
      <DemoUpgradeModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        featureName={featureName}
      />
    </DemoContext.Provider>
  );
}
