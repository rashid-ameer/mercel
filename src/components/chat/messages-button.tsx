"use client";
import { Button } from "@/components/ui/button";
import { useMessagesCountQuery } from "@/lib/react-query-utils";
import { MessagesCountInfo } from "@/lib/types";
import Link from "next/link";

interface NotificationButtonProps {
  label: string;
  link: string;
  icon: JSX.Element;
  initialData: MessagesCountInfo;
}

function MessagesButton({
  label,
  link,
  icon,
  initialData,
}: NotificationButtonProps) {
  const { data } = useMessagesCountQuery(initialData);

  return (
    <Button
      variant="ghost"
      className="flex items-center justify-start gap-3"
      title={label}
      asChild
    >
      <Link href={link}>
        <div className="relative">
          {icon}
          {data.unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1 text-xs font-medium tabular-nums text-primary-foreground">
              {data.unreadCount}
            </span>
          )}
        </div>
        <span className="hidden lg:inline">{label}</span>
      </Link>
    </Button>
  );
}
export default MessagesButton;
