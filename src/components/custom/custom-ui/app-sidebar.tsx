"use client"

import * as React from "react"
import {
  AudioWaveform,
  Bell,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  FileText,  // Added for Project Proposal
  Users,     // Added for Manage User
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavMain } from "./nav-main"
import { NavProjects } from "./nav-projects"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"

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
      logo: '/images/logo.png',
      plan: "Name of user",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
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
      url: "#",
      icon: FileText,
      isActive: true,
      items: [
        {
          title: "All Proposals",
          url: "/admin/project-proposals",
        },
        {
          title: "Pending Proposals",
          url: "#",
        },
        {
          title: "Approved Proposals",
          url: "#",
        },
        {
          title: "Rejected Proposals",
          url: "#",
        },
      ],
    },
    {
      title: "Manage User",
      url: "#",
      icon: Users,
      isActive: true,
      items: [
        {
          title: "All Users",
          url: "/admin/manage-user",
        },
        {
          title: "Admin",
          url: "/admin/manage-user/admin",
        },
        {
          title: "Education",
          url: "/admin/manage-user/education",
        },
        {
          title: "Environment",
          url: "/admin/manage-user/environment",
        },
        {
          title: "Finance",
          url: "/admin/manage-user/finance",
        },
        {
          title: "Health Services",
          url: "/admin/manage-user/health-services",
        },
        {
          title: "Peace Order",
          url: "/admin/manage-user/peace-order",
        },
        {
          title: "Public Works",
          url: "/admin/manage-user/public-works",
        },
        {
          title: "Women",
          url: "/admin/manage-user/public-works",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}