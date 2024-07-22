import { SessionContext } from "@/contexts/session-provider-context";
import { useContext } from "react";

export default function useSessionProvider() {
  const session = useContext(SessionContext);

  if (!session) {
    throw new Error(
      "useSessionProvider must be used within a SessionProviderContext",
    );
  }

  return session;
}
