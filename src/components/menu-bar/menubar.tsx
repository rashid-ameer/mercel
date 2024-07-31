import { MENUBAR_DATA } from "@/lib/constants";
import MenuItem from "./menu-item";
import { ICONS } from "./icons";
import { NotificationButton } from "@/components/notification";
import { getUnreadNotificationCount } from "@/lib/server-utils";
import { validateRequest } from "@/auth";

interface MenuBarProps {
  className?: string;
}

async function MenuBar({ className }: MenuBarProps) {
  const { user } = await validateRequest();

  // user will already be redirected if they are not logged in
  if (!user) {
    return null;
  }

  const unreadCount = await getUnreadNotificationCount(user.id);

  return (
    <ul className={className}>
      {MENUBAR_DATA.map(({ label, icon, link }) => {
        const Icon = ICONS[icon as keyof typeof ICONS];
        if (label === "Notifications") {
          return (
            <li key={label}>
              <NotificationButton
                key={label}
                label={label}
                link={link}
                icon={Icon}
                initialData={{ unreadCount }}
              />
            </li>
          );
        }

        return (
          <li key={label}>
            <MenuItem label={label} link={link} icon={Icon} />
          </li>
        );
      })}
    </ul>
  );
}

export default MenuBar;
