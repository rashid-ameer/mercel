import { Button } from "@/components/ui/button";
import Link from "next/link";

function NotFound() {
  return (
    <main className="space-y-5">
      <h1 className="text-4xl font-bold text-primary">
        Oops, <br /> Looks like there is no such user
      </h1>

      <p className="text-muted-foreground">
        You can find more users on the homepage.
      </p>
      <Button asChild className="rounded-full">
        <Link href="/">Go to homepage</Link>
      </Button>
    </main>
  );
}
export default NotFound;
