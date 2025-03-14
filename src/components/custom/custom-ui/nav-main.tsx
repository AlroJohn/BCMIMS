"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronRight, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
      isActive?: boolean;
    }[];
  }[];
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Extract status query param (pending, approved, rejected)
  const status = searchParams.get("status");

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) =>
          item.items ? (
            // Collapsible menu item with submenu
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={
                item.isActive ||
                item.items.some(
                  (subItem) =>
                    subItem.isActive || pathname.startsWith(subItem.url)
                )
              }
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={
                      item.url.includes("project-proposals")
                        ? "" // Do NOT gray out project-proposals
                        : pathname.startsWith(item.url)
                        ? "text-accent-foreground bg-gray-500/20 dark:bg-muted"
                        : ""
                    }
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => {
                      // Highlight "All Proposals" when no status is set
                      const isAllProposals =
                        subItem.url.endsWith("project-proposals") && !status;

                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            className={
                              isAllProposals
                                ? "text-accent-foreground bg-gray-500/20 dark:bg-muted"
                                : subItem.url.includes("status=pending") &&
                                  status === "pending"
                                ? "text-accent-foreground bg-gray-500/20 dark:bg-muted"
                                : subItem.url.includes("status=approved") &&
                                  status === "approved"
                                ? "text-accent-foreground bg-gray-500/20 dark:bg-muted"
                                : subItem.url.includes("status=rejected") &&
                                  status === "rejected"
                                ? "text-accent-foreground bg-gray-500/20 dark:bg-muted"
                                : ""
                            }
                          >
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            // Non-collapsible menu item (single route)
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                className={
                  item.url.includes("project-proposals") ||
                  item.url.includes("dashboard")
                    ? "" // Prevent graying out project-proposals and dashboard
                    : pathname.startsWith(item.url)
                    ? "text-accent-foreground bg-gray-500/20 dark:bg-muted"
                    : ""
                }
              >
                <Link href={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
