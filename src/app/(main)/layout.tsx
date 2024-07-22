import { validateRequest } from "@/auth";
import SessionProviderContext from "@/contexts/session-provider-context";
import { redirect, RedirectType } from "next/navigation";

async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await validateRequest();

  if (!session.user) {
    redirect("/login", RedirectType.replace);
  }

  return (
    <SessionProviderContext session={session}>
      {children}
    </SessionProviderContext>
  );
}
export default MainLayout;
