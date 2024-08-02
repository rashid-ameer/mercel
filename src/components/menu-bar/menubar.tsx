import { MENUBAR_DATA } from "@/lib/constants";
import MenuItem from "./menu-item";
import { ICONS } from "./icons";
import { NotificationButton } from "@/components/notification";
import {
  getUnreadMessagesCount,
  getUnreadNotificationCount,
} from "@/lib/server-utils";
import { validateRequest } from "@/auth";
import { Bell, Bookmark, Home, Mail } from "lucide-react";
import { MessagesButton } from "../chat";

interface MenuBarProps {
  className?: string;
}

async function MenuBar({ className }: MenuBarProps) {
  const { user } = await validateRequest();

  // user will already be redirected if they are not logged in
  if (!user) {
    return null;
  }

  const [notificationUnreadCount, messagesUnreadCount] = await Promise.all([
    getUnreadNotificationCount(user.id),
    getUnreadMessagesCount(user.id),
  ]);

  return (
    <ul className={className}>
      <li>
        <MenuItem icon={<Home />} label="Home" link="/" />
      </li>
      <li>
        <NotificationButton
          icon={<Bell />}
          label="Notifcations"
          link="/notifications"
          initialData={{ unreadCount: notificationUnreadCount }}
        />
      </li>

      <li>
        <MessagesButton
          icon={<Mail />}
          label="Messages"
          link="/messages"
          initialData={{ unreadCount: messagesUnreadCount }}
        />
      </li>

      <li>
        <MenuItem icon={<Bookmark />} label="Bookmarks" link="/bookmarks" />
      </li>
    </ul>
  );
}

export default MenuBar;
