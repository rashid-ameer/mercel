import avatarPlaceholder from "@/assets/avatar-placeholder.png";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface UserAvatarProps {
  className?: string;
  size?: number;
  avatarUrl?: string | null;
}

function UserAvatar({ className, size = 48, avatarUrl }: UserAvatarProps) {
  return (
    <Image
      src={avatarUrl || avatarPlaceholder}
      alt="User avatar"
      width={size}
      height={size}
      className={cn(
        "aspect-square rounded-full bg-secondary object-cover",
        className,
      )}
    />
  );
}
export default UserAvatar;
