import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";

const DemoAccessContext = createContext({ signedIn: false, signIn: () => {}, signOut: () => {} });

/** Presentation-only access state. This is not authentication or a security boundary. */
export function DemoAccessProvider({ children }: { children: ReactNode }) {
  const [signedIn, setSignedIn] = useState(false);
  return <DemoAccessContext.Provider value={{ signedIn, signIn: () => setSignedIn(true), signOut: () => setSignedIn(false) }}>{children}</DemoAccessContext.Provider>;
}

export const useDemoAccess = () => useContext(DemoAccessContext);

export function DemoGate({ children }: { children: ReactNode }) {
  const { signedIn } = useDemoAccess();
  const navigate = useNavigate();
  useEffect(() => { if (!signedIn) void navigate({ to: "/login", replace: true }); }, [signedIn, navigate]);
  return signedIn ? children : null;
}