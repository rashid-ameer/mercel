import { SessionContext } from "@/contexts/session-provider";
import { useContext } from "react";

export default function useSession() {
  const session = useContext(SessionContext);

  if (!session) {
    throw new Error(
      "useSessionProvider must be used within a SessionProviderContext",
    );
  }

  return session;
}
