import { validateRequest } from "@/auth";
import { redirect, RedirectType } from "next/navigation";

async function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user } = await validateRequest();

  if (user) redirect("/", RedirectType.replace);

  return (
    <main className="flex h-screen items-center justify-center p-5">
      {children}
    </main>
  );
}
export default AuthLayout;
