import { validateRequest } from "@/auth";
import Header from "@/components/header";
import SessionProviderContext from "@/contexts/session-provider-context";
import { redirect, RedirectType } from "next/navigation";

async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await validateRequest();

  if (!session.user) {
    redirect("/login", RedirectType.replace);
  }

  return (
    <SessionProviderContext session={session}>
      <div className="min-h-screen">
        <Header />
        <div className="mx-auto max-w-7xl">{children}</div>
      </div>
    </SessionProviderContext>
  );
}
export default MainLayout;
