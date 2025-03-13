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
  FileText,
  Users,
  Calendar,
  BarChart,
  Leaf,
  HeartPulse,
  Shield,
  Construction,
  UserPlus
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavMain } from "../custom/custom-ui/nav-main"
import { NavProjects } from "../custom/custom-ui/nav-projects"
import { NavUser } from "../custom/custom-ui/nav-user"
import { TeamSwitcher } from "../custom/custom-ui/team-switcher"

// Committee sidebar that adapts based on committee prop
export function CommitteeSidebar({ 
  committee = "EDUCATION_COMMITTEE", // Default to Education
  ...props 
}: { 
  committee?: string 
} & React.ComponentProps<typeof Sidebar>) {
  
  // Committee info mapping
  const committeeInfoMap = {
    "EDUCATION_COMMITTEE": {
      id: 1,
      name: "Education",
      path: "/committee/education",
      icon: Bot,
      color: "text-blue-500"
    },
    "ENVIRONMENT_COMMITTEE": {
      id: 2,
      name: "Environment",
      path: "/committee/environment",
      icon: Leaf,
      color: "text-green-500"
    },
    "FINANCE_COMMITTEE": {
      id: 3,
      name: "Finance",
      path: "/committee/finance",
      icon: BarChart,
      color: "text-amber-500"
    },
    "HEALTH_COMMITTEE": {
      id: 4,
      name: "Health Services",
      path: "/committee/health-services",
      icon: HeartPulse,
      color: "text-red-500"
    },
    "PEACE_ORDER_COMMITTEE": {
      id: 5,
      name: "Peace Order",
      path: "/committee/peace-order",
      icon: Shield,
      color: "text-purple-500"
    },
    "PUBLIC_WORKS_COMMITTEE": {
      id: 6,
      name: "Public Works",
      path: "/committee/public-works",
      icon: Construction,
      color: "text-indigo-500"
    },
    "WOMEN_COMMITTEE": {
      id: 7,
      name: "Women",
      path: "/committee/women",
      icon: UserPlus,
      color: "text-pink-500"
    }
  };

  // Get committee info based on current committee
  const committeeInfo = committeeInfoMap[committee as keyof typeof committeeInfoMap];
  
  // Generate dynamic navigation items based on committee
  const navItems = [
    {
      title: "Dashboard",
      url: committeeInfo.path,
      icon: PieChart,
      isActive: true,
    },
    {
      title: "Project Proposals",
      url: "#",
      icon: FileText,
      isActive: true,
      items: [
        {
          title: "All Proposals",
          url: `${committeeInfo.path}/project-proposals`,
        },
        {
          title: "Pending Proposals",
          url: `${committeeInfo.path}/project-proposals?status=pending`,
        },
        {
          title: "Approved Proposals",
          url: `${committeeInfo.path}/project-proposals?status=approved`,
        },
        {
          title: "Rejected Proposals",
          url: `${committeeInfo.path}/project-proposals?status=rejected`,
        },
      ],
    },
  ];

  // This structure allows for future committee-specific menu items
  // For example, we could add unique items for specific committees:
  if (committee === "EDUCATION_COMMITTEE") {
    navItems.push({
      title: "Scholarship Programs",
      url: "/education/scholarships",
      icon: Frame,
      isActive: true,
    });
  } else if (committee === "ENVIRONMENT_COMMITTEE") {
    navItems.push({
      title: "Planting Activities",
      url: "/environment/planting",
      icon: Leaf,
      isActive: true,
    });
  }

  // Sample data for user and team
  const data = {
    user: {
      name: committeeInfo.name,
      email: `${committeeInfo.name.toLowerCase()}@barangay.gov`,
      avatar: "/avatars/user.jpg",
    },
    teams: [
      {
        name: "BCMIMS",
        logo: '/images/logo.png',
        plan: committeeInfo.name,
      }
    ],
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}