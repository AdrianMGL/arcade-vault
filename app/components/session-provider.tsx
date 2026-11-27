"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { clearSession, normalizeName, readSession, writeSession, type Session } from "@/app/lib/session";

interface SessionContextValue {
  session: Session | null;
  signIn: (name: string) => void;
  signOut: () => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  // El primer render es de invitado: localStorage no existe en el servidor.
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    setSession(readSession());
  }, []);

  const signIn = useCallback((name: string) => {
    const next: Session = { name: normalizeName(name) };
    writeSession(next);
    setSession(next);
  }, []);

  const signOut = useCallback(() => {
    clearSession();
    setSession(null);
  }, []);

  const value = useMemo(() => ({ session, signIn, signOut }), [session, signIn, signOut]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSession debe usarse dentro de <SessionProvider>.");
  }
  return ctx;
}
