"use client";
import { Session, User } from "lucia";
import { createContext } from "react";

// session context props
interface SessionContextProps {
  user: User;
  session: Session;
}
//session provider props
interface SessionProviderProps {
  children: React.ReactNode;
  session: SessionContextProps;
}

// creating a context
export const SessionContext = createContext<SessionContextProps | null>(null);

function SessionProviderContext({ children, session }: SessionProviderProps) {
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}
export default SessionProviderContext;
