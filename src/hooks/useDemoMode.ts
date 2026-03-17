import { useEcosystemAccess } from "@/hooks/useEcosystemAccess";

export function useDemoMode() {
  const access = useEcosystemAccess();

  return {
    isDemo: !access.isLoading && !access.hasAccess,
    isTrial: !access.isLoading && access.accessType === "trial",
    isLoading: access.isLoading,
  };
}
