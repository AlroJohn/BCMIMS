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

  // Extract status query param (e.g. pending, approved, rejected)
  const status = searchParams.get("status");

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) =>
          // If this item has sub-items, we render a collapsible group
          item.items ? (
            <Collapsible
              key={item.title}
              asChild
              // We open the collapsible if:
              // - The item itself is active, OR
              // - Any sub-item is active
              defaultOpen={
                item.isActive ||
                item.items.some((subItem) => pathname.startsWith(subItem.url))
              }
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    // Highlight the top-level button if `pathname` starts with `item.url`
                    className={
                      pathname.startsWith(item.url)
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
                      // Extra logic to highlight "All Proposals" when no status is set
                      const isAllProposals =
                        subItem.url.includes("status=pending");

                      // Instead of ignoring, we’ll check if the current path starts
                      // with the subItem’s URL (and also handle the `status` param for proposals)
                      const isSubActive =
                        isAllProposals ||
                        pathname.startsWith(subItem.url) ||
                        (subItem.url.includes("status=pending") &&
                          status === "pending") ||
                        (subItem.url.includes("status=approved") &&
                          status === "approved") ||
                        (subItem.url.includes("status=rejected") &&
                          status === "rejected");

                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            // Highlight sub-item if `pathname` matches
                            className={
                              isSubActive
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
            // For single-route items (no children)
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                // Remove any exceptions and simply highlight if `pathname` starts with the item’s URL
                className={
                  pathname.startsWith(item.url)
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
