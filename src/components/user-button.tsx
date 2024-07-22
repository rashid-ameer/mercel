"use client";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import UserAvatar from "./user-avatar";
import Link from "next/link";
import { LogOutIcon, Monitor, Moon, Sun, UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/app/(auth)/action";
import useSession from "@/hooks/useSessionProvider";
import { useTheme } from "next-themes";

interface UserButtonProps {
  className?: string;
}

function UserButton({ className }: UserButtonProps) {
  const { user } = useSession();
  const { theme, setTheme } = useTheme();

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
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="cursor-pointer">
            <Monitor className="mr-2 size-4" />
            <span>Theme</span>
          </DropdownMenuSubTrigger>

          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setTheme("system")}
              >
                <Monitor className="mr-2 size-4" />
                <span>System</span>
                <DropdownMenuCheckboxItem checked={theme === "system"} />
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setTheme("light")}
              >
                <Sun className="mr-2 size-4" />
                <span>Light</span>
                <DropdownMenuCheckboxItem checked={theme === "light"} />
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setTheme("dark")}
              >
                <Moon className="mr-2 size-4" />
                <span>Dark</span>
                <DropdownMenuCheckboxItem checked={theme === "dark"} />
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

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
