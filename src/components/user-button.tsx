"use client";

import useSessionProvider from "@/hooks/useSessionProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import UserAvatar from "./user-avatar";
import Link from "next/link";
import { LogOutIcon, UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/app/(auth)/action";

interface UserButtonProps {
  className?: string;
}

function UserButton({ className }: UserButtonProps) {
  const { user } = useSessionProvider();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={cn("flex-none rounded-full", className)}>
          <UserAvatar avatarUrl={user.avatarUrl} size={40} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Logged in as @{user.username}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/users/${user.username}`} className="cursor-pointer">
            <UserIcon className="mr-2 size-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <button
            className="w-full cursor-pointer"
            onClick={async () => await logout()}
          >
            <LogOutIcon className="mr-2 size-4" />
            Logout
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default UserButton;
