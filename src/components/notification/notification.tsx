import { NotificationData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { NotificationType } from "@prisma/client";
import { Heart, MessageCircle, User2 } from "lucide-react";
import Link from "next/link";
import UserAvatar from "../user-avatar";

interface NotificationProps {
  notification: NotificationData;
}

function Notification({ notification }: NotificationProps) {
  const notificationTypeMap: Record<
    NotificationType,
    { message: string; icon: JSX.Element; href: string }
  > = {
    COMMENT: {
      message: `${notification.issuer.displayName} commented on your post`,
      icon: <MessageCircle className="size-7 fill-primary text-primary" />,
      href: `/posts/${notification.postId}`,
    },
    FOLLOW: {
      message: `${notification.issuer.displayName} followed you`,
      icon: <User2 className="size-7 text-primary" />,
      href: `/users/${notification.issuer.username}`,
    },
    LIKE: {
      message: `${notification.issuer.displayName} liked your post`,
      icon: <Heart className="size-7 fill-red-500 text-red-500" />,
      href: `/posts/${notification.postId}`,
    },
  };

  const { message, icon, href } = notificationTypeMap[notification.type];

  return (
    <article>
      <Link
        href={href}
        className={cn(
          "flex-start flex gap-3 rounded-2xl bg-card p-5 shadow-sm transition-colors hover:bg-card/70",
          { "bg-primary/10": !notification.read },
        )}
      >
        {icon}

        <div className="space-y-3">
          <UserAvatar avatarUrl={notification.issuer.avatarUrl} size={36} />
          <div className="flex gap-1">
            <h2 className="font-bold">{notification.issuer.displayName}</h2>
            <p>{message}</p>
          </div>

          {notification.post && (
            <p className="line-clamp-2 whitespace-pre-line text-muted-foreground">
              {notification.post.content}
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}
export default Notification;
