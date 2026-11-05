"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@orchestra/ui/components/dropdown-menu/dropdown-menu";
import { cn } from "@orchestra/ui/lib/utils";
import {
  LayoutDashboardIcon,
  LogOutIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";

export interface ProfileDropdownLabels {
  dashboard: string;
  logOut: string;
  profile: string;
  settings: string;
  trigger: string;
}

export interface ProfileDropdownUser {
  image?: string | null;
  name: string;
}

export interface ProfileDropdownProps {
  className?: string;
  dashboardHref?: string;
  labels: ProfileDropdownLabels;
  onLogOut: () => void;
  profileHref: string;
  settingsHref: string;
  user: ProfileDropdownUser;
}

const WHITESPACE_PATTERN = /\s+/u;

function getInitials(name: string): string {
  const [first, second] = name.trim().split(WHITESPACE_PATTERN);
  return `${first?.[0] ?? ""}${second?.[0] ?? ""}`.toUpperCase();
}

export function ProfileDropdown({
  className,
  dashboardHref,
  labels,
  onLogOut,
  profileHref,
  settingsHref,
  user,
}: ProfileDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label={labels.trigger}
          className={cn(
            "border-border bg-muted text-foreground hover:bg-border focus-visible:outline-ring size-9.5 shrink-0 cursor-pointer overflow-hidden rounded-full border focus-visible:outline-2 focus-visible:outline-offset-2",
            className
          )}
          type="button"
        >
          {user.image ? (
            <img
              alt=""
              className="size-full object-cover"
              height={38}
              src={user.image}
              width={38}
            />
          ) : (
            <span className="flex size-full items-center justify-center text-sm/5 font-medium">
              {getInitials(user.name)}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        {dashboardHref ? (
          <DropdownMenuItem asChild>
            <a href={dashboardHref}>
              <LayoutDashboardIcon aria-hidden="true" className="size-4" />
              {labels.dashboard}
            </a>
          </DropdownMenuItem>
        ) : null}

        <DropdownMenuItem asChild>
          <a href={profileHref}>
            <UserIcon aria-hidden="true" className="size-4" />
            {labels.profile}
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <a href={settingsHref}>
            <SettingsIcon aria-hidden="true" className="size-4" />
            {labels.settings}
          </a>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="text-destructive focus:bg-destructive/10"
          onSelect={onLogOut}
        >
          <LogOutIcon aria-hidden="true" className="size-4" />
          {labels.logOut}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
