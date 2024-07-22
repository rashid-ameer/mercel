import Link from "next/link";
import { ICONS } from "./icons";
import { Button } from "@/components/ui/button";

interface MenuItemProps {
  label: string;
  link: string;
  icon: string;
}

function MenuItem({ label, link, icon }: MenuItemProps) {
  return (
    <li>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title={label}
        asChild
      >
        <Link href={link}>
          {ICONS[icon as keyof typeof ICONS]}
          <span className="hidden lg:inline">{label}</span>
        </Link>
      </Button>
    </li>
  );
}

export default MenuItem;
