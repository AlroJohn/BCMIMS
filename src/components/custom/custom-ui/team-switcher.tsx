"use client";

import * as React from "react";
import { ChevronsUpDown, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/components/providers/auth-provider";

export function TeamSwitcher({
  teams = [], // Provide default empty array
}: {
  teams: {
    name: string;
    logo: React.ElementType | string;
    plan: string;
  }[];
}) {
  const { user } = useAuth();
  const { isMobile } = useSidebar();
  const [activeTeam, setActiveTeam] = React.useState(
    teams.length > 0 ? teams[0] : null
  );

  // If there's no active team, return early with a placeholder or null
  if (!activeTeam) {
    return null;
  }

  // Make sure user exists and has name or email
  const nameOfUser = user?.name || user?.email || "User";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          {typeof activeTeam.logo === "string" ? (
            <img src={activeTeam.logo} className="w-10 h-10" alt="" />
          ) : (
            activeTeam.logo && <activeTeam.logo />
          )}
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{activeTeam.name}</span>
            <span className="truncate text-xs">{nameOfUser}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
