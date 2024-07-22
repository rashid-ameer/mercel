import { validateRequest } from "@/auth";
import Header from "@/components/header";
import { MenuBar } from "@/components/menu-bar";
import SessionProviderContext from "@/contexts/session-provider";
import { redirect, RedirectType } from "next/navigation";

async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await validateRequest();

  if (!session.user) {
    redirect("/login", RedirectType.replace);
  }

  return (
    <SessionProviderContext session={session}>
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="mx-auto flex w-full max-w-7xl grow gap-5 p-5">
          <MenuBar className="sticky top-[5.25rem] hidden h-fit flex-none space-y-3 rounded-2xl bg-card px-3 py-5 shadow-sm sm:block xl:w-80 xl:px-5" />
          {children}
        </div>
        <MenuBar className="sticky bottom-0 flex w-full justify-around gap-5 border-t bg-card p-3 sm:hidden" />
      </div>
    </SessionProviderContext>
  );
}
export default MainLayout;
