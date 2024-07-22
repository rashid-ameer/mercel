import { MENUBAR_DATA } from "@/lib/constants";
import MenuItem from "./menu-item";

interface MenuBarProps {
  className?: string;
}

function MenuBar({ className }: MenuBarProps) {
  return (
    <ul className={className}>
      {MENUBAR_DATA.map((item) => (
        <MenuItem
          key={item.link}
          label={item.label}
          link={item.link}
          icon={item.icon}
        />
      ))}
    </ul>
  );
}

export default MenuBar;
