import Link from "next/link";
import { Button } from "@/components/ui/button";

interface MenuItemProps {
  label: string;
  link: string;
  icon: JSX.Element;
}

function MenuItem({ label, link, icon }: MenuItemProps) {
  return (
    <Button
      variant="ghost"
      className="flex items-center justify-start gap-3"
      title={label}
      asChild
    >
      <Link href={link}>
        {icon}
        <span className="hidden lg:inline">{label}</span>
      </Link>
    </Button>
  );
}

export default MenuItem;
