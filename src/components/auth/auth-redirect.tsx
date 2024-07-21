import { cn } from "@/lib/utils";
import Link from "next/link";

type AuthRedirectProps = {
  link: string;
  className?: string;
  title: string;
  content: string;
};

function AuthRedirect({ link, className, title, content }: AuthRedirectProps) {
  return (
    <p className="mt-4 text-center">
      {content}{" "}
      <Link href={link} className={cn("ml-2 hover:underline", className)}>
        {title}
      </Link>
    </p>
  );
}
export default AuthRedirect;
