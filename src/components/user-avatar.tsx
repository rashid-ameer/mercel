import avatarPlaceholder from "@/assets/avatar-placeholder.png";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface UserAvatarProps {
  className?: string;
  size?: number;
  avatarUrl?: string | null;
  priority?: boolean;
}

function UserAvatar({
  className,
  size = 48,
  avatarUrl,
  priority = false,
}: UserAvatarProps) {
  return (
    <Image
      src={avatarUrl || avatarPlaceholder}
      alt="User avatar"
      width={size}
      height={size}
      priority={priority}
      className={cn(
        "aspect-square rounded-full bg-secondary object-cover",
        className,
      )}
    />
  );
}
export default UserAvatar;
