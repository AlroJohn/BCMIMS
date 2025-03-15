"use client";

import * as React from "react";
import {
  AudioWaveform,
  Bell,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  FileText, // Added for Project Proposal
  Users, // Added for Manage User
  LayoutDashboard, // Added for Committee Dashboards
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "BCMIMS",
      logo: "/images/logo.png",
      plan: "Name of user",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: PieChart,
      isActive: true,
    },
    {
      title: "Project Proposal",
      url: "/admin/project-proposals",
      icon: FileText,
      isActive: true,
    },
    {
      title: "Manage Users",
      url: "/admin/manage-user",
      icon: Users,
      isActive: true,
    },
    {
      title: "Manage Budget",
      url: "/admin/budget-management",
      icon: Users,
      isActive: true,
    },
    {
      title: "Committee Dashboards",
      url: "#",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: "Education",
          url: "/admin/dashboard/education",
        },
        {
          title: "Environment",
          url: "/admin/dashboard/environment",
        },
        {
          title: "Finance",
          url: "/admin/dashboard/finance",
        },
        {
          title: "Health Services",
          url: "/admin/dashboard/health-services",
        },
        {
          title: "Peace Order",
          url: "/admin/dashboard/peace-order",
        },
        {
          title: "Public Works",
          url: "/admin/dashboard/public-works",
        },
        {
          title: "Women",
          url: "/admin/dashboard/women",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter> */}
      <SidebarRail />
    </Sidebar>
  );
}
