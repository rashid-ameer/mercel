import { Button } from "@/components/ui/button";
import Link from "next/link";

function NotFound() {
  return (
    <main className="space-y-5">
      <h1 className="text-4xl font-bold text-primary">
        Oops, <br /> Looks like we are still building it
      </h1>

      <p className="text-muted-foreground">
        While we work on it, feel free to visit homepage.
      </p>
      <Button asChild className="rounded-full">
        <Link href="/">Go to homepage</Link>
      </Button>
    </main>
  );
}
export default NotFound;
