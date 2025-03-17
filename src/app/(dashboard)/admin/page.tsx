"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bargraph } from "@/components/custom/dashboard/ui-components/Bargraph";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  FileText,
  Filter,
  Search,
  XCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SessionGuard from "@/components/custom/guard/session-guard";
import ProjectProposals from "@/components/custom/dashboard/ui-components/ProjectProposals";

// Create simple Badge component since it's missing
const Badge = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <span
    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${className}`}
  >
    {children}
  </span>
);

// Create simple Progress component since it's missing
const Progress = ({
  value = 0,
  className = "",
}: {
  value?: number;
  className?: string;
}) => (
  <div
    className={`h-2 w-full overflow-hidden rounded-full bg-gray-200 ${className}`}
  >
    <div
      className="h-full bg-blue-500 transition-all"
      style={{ width: `${Math.min(Math.max(0, value), 100)}%` }}
    />
  </div>
);

export default function AdminDashboard() {
  const [date, setDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCommittee, setFilterCommittee] = useState("all");
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [committeeApprovals, setCommitteeApprovals] = useState<{
    [key: number]: boolean;
  }>({});
  const [rejectionReason, setRejectionReason] = useState("");
  const [viewFilter, setViewFilter] = useState("calendar"); // "calendar" or "list"

  // Committee data - now with one person per committee
  const committees: Array<{
    id: number;
    name: string;
    path: string;
    person: string; // Person in charge of the committee
  }> = [
    {
      id: 1,
      name: "Education",
      path: "/committee/education",
      person: "Maria Santos",
    },
    {
      id: 2,
      name: "Environment",
      path: "/committee/environment",
      person: "Juan Cruz",
    },
    {
      id: 3,
      name: "Finance",
      path: "/committee/finance",
      person: "Pedro Reyes",
    },
    {
      id: 4,
      name: "Health Services",
      path: "/committee/health-services",
      person: "Ana Garcia",
    },
    {
      id: 5,
      name: "Peace Order",
      path: "/committee/peace-order",
      person: "Ramon Diaz",
    },
    {
      id: 6,
      name: "Public Works",
      path: "/committee/public-works",
      person: "Elena Lim",
    },
    { id: 7, name: "Women", path: "/committee/women", person: "Sofia Mendoza" },
  ];

  // Project proposals with committee approvals, due dates, and budget
  const [projectProposals, setProjectProposals] = useState<
    Array<{
      id: number;
      name: string;
      description: string;
      committee: string;
      budget: number;
      documentTitle: string;
      documentUrl: string;
      dueDate: Date;
      dateProposed: Date;
      status: string;
      rejectionReason?: string;
      approvals: Array<{ committeeId: number; approved: boolean }>;
      implementation: {
        startDate: Date;
        endDate: Date;
        status: string;
        completion: number;
      } | null;
    }>
  >([
    {
      id: 1,
      name: "School Supply Drive",
      description: "Distribute school supplies to underprivileged children",
      committee: "Education",
      budget: 15000,
      documentTitle: "School Supply Drive Proposal.pdf",
      documentUrl: "/documents/school-supply-drive.pdf",
      dueDate: new Date(2025, 3, 15), // April 15, 2025
      dateProposed: new Date(2025, 2, 1), // March 1, 2025
      status: "Approved",
      approvals: [
        { committeeId: 1, approved: true },
        { committeeId: 3, approved: true },
        { committeeId: 4, approved: true },
        { committeeId: 7, approved: true },
      ],
      implementation: {
        startDate: new Date(2025, 3, 5), // April 5, 2025
        endDate: new Date(2025, 3, 15), // April 15, 2025
        status: "In Progress",
        completion: 65,
      },
    },
    {
      id: 2,
      name: "Tree Planting Activity",
      description: "Plant 500 tree seedlings in barangay areas",
      committee: "Environment",
      budget: 12000,
      documentTitle: "Tree Planting Proposal.pdf",
      documentUrl: "/documents/tree-planting.pdf",
      dueDate: new Date(2025, 5, 5), // June 5, 2025
      dateProposed: new Date(2025, 2, 5), // March 5, 2025
      status: "Approved",
      approvals: [
        { committeeId: 2, approved: true },
        { committeeId: 5, approved: true },
        { committeeId: 6, approved: true },
        { committeeId: 7, approved: true },
        { committeeId: 1, approved: true },
      ],
      implementation: {
        startDate: new Date(2025, 2, 18), // March 18, 2025
        endDate: new Date(2025, 5, 1), // June 1, 2025
        status: "In Progress",
        completion: 45,
      },
    },
    {
      id: 3,
      name: "Budget Transparency Portal",
      description: "Create an online portal for barangay budget transparency",
      committee: "Finance",
      budget: 5000,
      documentTitle: "Budget Portal Proposal.pdf",
      documentUrl: "/documents/budget-portal.pdf",
      dueDate: new Date(2025, 6, 30), // July 30, 2025
      dateProposed: new Date(2025, 2, 10), // March 10, 2025
      status: "Approved",
      approvals: [
        { committeeId: 3, approved: true },
        { committeeId: 5, approved: true },
        { committeeId: 1, approved: false },
      ],
      implementation: {
        startDate: new Date(2025, 3, 1), // April 1, 2025
        endDate: new Date(2025, 6, 30), // July 30, 2025
        status: "In Progress",
        completion: 80,
      },
    },
    {
      id: 4,
      name: "Free Medical Checkup",
      description: "Provide free medical checkups for senior citizens",
      committee: "Health Services",
      budget: 35000,
      documentTitle: "Medical Checkup Proposal.pdf",
      documentUrl: "/documents/medical-checkup.pdf",
      dueDate: new Date(2025, 2, 25), // March 25, 2025
      dateProposed: new Date(2025, 1, 15), // February 15, 2025
      status: "Approved",
      approvals: [
        { committeeId: 4, approved: true },
        { committeeId: 3, approved: true },
        { committeeId: 7, approved: true },
        { committeeId: 1, approved: true },
      ],
      implementation: {
        startDate: new Date(2025, 2, 22), // March 22, 2025
        endDate: new Date(2025, 2, 25), // March 25, 2025
        status: "Scheduled",
        completion: 20,
      },
    },
    {
      id: 5,
      name: "CCTV Installation",
      description: "Install CCTV cameras in strategic locations",
      committee: "Peace Order",
      budget: 80000,
      documentTitle: "CCTV Installation Proposal.pdf",
      documentUrl: "/documents/cctv-installation.pdf",
      dueDate: new Date(2025, 8, 30), // September 30, 2025
      dateProposed: new Date(2025, 2, 15), // March 15, 2025
      status: "Approved",
      approvals: [
        { committeeId: 5, approved: true },
        { committeeId: 3, approved: true },
        { committeeId: 6, approved: true },
      ],
      implementation: {
        startDate: new Date(2025, 4, 1), // May 1, 2025
        endDate: new Date(2025, 8, 30), // September 30, 2025
        status: "In Progress",
        completion: 50,
      },
    },
    {
      id: 6,
      name: "Road Repair Project",
      description: "Repair damaged roads in the barangay",
      committee: "Public Works",
      budget: 120000,
      documentTitle: "Road Repair Proposal.pdf",
      documentUrl: "/documents/road-repair.pdf",
      dueDate: new Date(2025, 3, 20), // April 20, 2025
      dateProposed: new Date(2025, 1, 10), // February 10, 2025
      status: "Approved",
      approvals: [
        { committeeId: 6, approved: true },
        { committeeId: 3, approved: true },
        { committeeId: 5, approved: true },
      ],
      implementation: {
        startDate: new Date(2025, 2, 25), // March 25, 2025
        endDate: new Date(2025, 3, 20), // April 20, 2025
        status: "In Progress",
        completion: 35,
      },
    },
    {
      id: 7,
      name: "Women's Livelihood Program",
      description: "Implement livelihood programs for women",
      committee: "Women",
      budget: 60000,
      documentTitle: "Women's Livelihood Proposal.pdf",
      documentUrl: "/documents/womens-livelihood.pdf",
      dueDate: new Date(2025, 5, 15), // June 15, 2025
      dateProposed: new Date(2025, 2, 8), // March 8, 2025
      status: "Approved",
      approvals: [
        { committeeId: 7, approved: true },
        { committeeId: 3, approved: true },
        { committeeId: 1, approved: true },
        { committeeId: 4, approved: true },
      ],
      implementation: {
        startDate: new Date(2025, 2, 28), // March 28, 2025
        endDate: new Date(2025, 5, 15), // June 15, 2025
        status: "In Progress",
        completion: 40,
      },
    },
    {
      id: 8,
      name: "Reading Center Renovation",
      description: "Renovate the community reading center",
      committee: "Education",
      budget: 50000,
      documentTitle: "Reading Center Renovation Proposal.pdf",
      documentUrl: "/documents/reading-center.pdf",
      dueDate: new Date(2025, 3, 10), // April 10, 2025
      dateProposed: new Date(2025, 2, 12), // March 12, 2025
      status: "Pending Approval",
      approvals: [
        { committeeId: 1, approved: true },
        { committeeId: 3, approved: false },
        { committeeId: 6, approved: false },
      ],
      implementation: null,
    },
    {
      id: 9,
      name: "Drainage System Upgrade",
      description: "Upgrade barangay drainage system",
      committee: "Public Works",
      budget: 200000,
      documentTitle: "Drainage System Proposal.pdf",
      documentUrl: "/documents/drainage-system.pdf",
      dueDate: new Date(2025, 7, 30), // August 30, 2025
      dateProposed: new Date(2025, 2, 20), // March 20, 2025
      status: "Pending Approval",
      approvals: [
        { committeeId: 6, approved: true },
        { committeeId: 2, approved: true },
        { committeeId: 3, approved: false },
      ],
      implementation: null,
    },
    {
      id: 10,
      name: "Street Lighting Improvement",
      description: "Install solar-powered street lights",
      committee: "Public Works",
      budget: 75000,
      documentTitle: "Street Lighting Proposal.pdf",
      documentUrl: "/documents/street-lighting.pdf",
      dueDate: new Date(2025, 2, 28), // March 28, 2025
      dateProposed: new Date(2025, 1, 25), // February 25, 2025
      status: "Approved",
      approvals: [
        { committeeId: 6, approved: true },
        { committeeId: 3, approved: true },
        { committeeId: 5, approved: true },
        { committeeId: 2, approved: true },
      ],
      implementation: {
        startDate: new Date(2025, 2, 15), // March 15, 2025
        endDate: new Date(2025, 2, 28), // March 28, 2025
        status: "In Progress",
        completion: 60,
      },
    },
    {
      id: 11,
      name: "Community WiFi Project",
      description:
        "Install public WiFi hotspots in strategic barangay locations",
      committee: "Public Works",
      budget: 90000,
      documentTitle: "Community WiFi Proposal.pdf",
      documentUrl: "/documents/community-wifi.pdf",
      dueDate: new Date(2025, 4, 15), // May 15, 2025
      dateProposed: new Date(2025, 2, 22), // March 22, 2025
      status: "Pending Approval",
      approvals: [
        { committeeId: 6, approved: true },
        { committeeId: 3, approved: false },
      ],
      implementation: null,
    },
    {
      id: 12,
      name: "Senior Citizen Database",
      description: "Create a digital database for senior residents",
      committee: "Health Services",
      budget: 25000,
      documentTitle: "Senior Database Proposal.pdf",
      documentUrl: "/documents/senior-database.pdf",
      dueDate: new Date(2025, 5, 10), // June 10, 2025
      dateProposed: new Date(2025, 2, 18), // March 18, 2025
      status: "Pending Approval",
      approvals: [
        { committeeId: 4, approved: true },
        { committeeId: 3, approved: false },
        { committeeId: 7, approved: true },
      ],
      implementation: null,
    },
  ]);

  // Function to determine priority level based on approvals and due date
  const determinePriority = (project: any) => {
    const now = new Date();
    const daysUntilDue = Math.ceil(
      (project.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    const approvalCount = project.approvals.filter(
      (a: { approved: boolean }) => a.approved
    ).length;
    const majorityApproval = approvalCount >= 4; // Majority means at least 4 out of 7 committees
    const nearDueDate = daysUntilDue <= 30; // Within 30 days is considered near

    if (majorityApproval && nearDueDate)
      return {
        level: "Urgent & Important",
        color: "bg-red-100 text-red-800",
        badge: "bg-red-100 border-red-200 text-red-800",
      };
    if (!majorityApproval && nearDueDate)
      return {
        level: "Urgent but Not Important",
        color: "bg-yellow-100 text-yellow-800",
        badge: "bg-yellow-100 border-yellow-200 text-yellow-800",
      };
    if (majorityApproval && !nearDueDate)
      return {
        level: "Important but Not Urgent",
        color: "bg-blue-100 text-blue-800",
        badge: "bg-blue-100 border-blue-200 text-blue-800",
      };
    return {
      level: "Not Urgent",
      color: "bg-gray-100 text-gray-800",
      badge: "bg-gray-100 border-gray-200 text-gray-800",
    };
  };

  // Add priority level to each project
  const projectsWithPriority = projectProposals.map((project) => ({
    ...project,
    priority: determinePriority(project),
  }));

  // Filter for pending projects with search and committee filter
  const pendingProjects = projectsWithPriority
    .filter((project) => project.status === "Pending Approval")
    .filter(
      (project) =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(
      (project) =>
        filterCommittee === "all" || project.committee === filterCommittee
    );

  // Create calendar activities from approved projects that have implementation dates
  const calendarActivities = projectProposals
    .filter(
      (project) =>
        project.status === "Approved" && project.implementation !== null
    )
    .flatMap((project) => {
      // Create an activity for both start and end dates if they exist
      const activities: Array<{
        date: Date;
        title: string;
        committee: string;
        project: typeof project;
      }> = [];

      if (project.implementation && project.implementation.startDate) {
        activities.push({
          date: project.implementation.startDate,
          title: `Start: ${project.name}`,
          committee: project.committee,
          project: project,
        });
      }

      if (project.implementation && project.implementation.endDate) {
        activities.push({
          date: project.implementation.endDate,
          title: `Due: ${project.name}`,
          committee: project.committee,
          project: project,
        });
      }

      return activities;
    });

  // Filter activities for the selected date
  const selectedDateActivities = calendarActivities.filter(
    (activity) => activity.date.toDateString() === date.toDateString()
  );

  // Dashboard statistics
  const totalApprovedProjects = projectProposals.filter(
    (p) => p.status === "Approved"
  ).length;
  const totalPendingProjects = projectProposals.filter(
    (p) => p.status === "Pending Approval"
  ).length;
  const totalRejectedProjects = projectProposals.filter(
    (p) => p.status === "Rejected"
  ).length;
  const totalBudget = projectProposals
    .filter((p) => p.status === "Approved")
    .reduce((sum, project) => sum + project.budget, 0);

  const thisMonthActivities = calendarActivities.filter(
    (activity) =>
      activity.date.getMonth() === new Date().getMonth() &&
      activity.date.getFullYear() === new Date().getFullYear()
  ).length;

  // Count projects by priority level
  const priorityCounts = projectsWithPriority.reduce((counts: any, project) => {
    const level = project.priority.level;
    counts[level] = (counts[level] || 0) + 1;
    return counts;
  }, {});

  // Get all upcoming activities sorted by date
  const upcomingActivities = [...calendarActivities]
    .filter((activity) => activity.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  // Calculate distribution of projects by committee for pie chart
  const committeeProjectCounts = committees.map((committee) => {
    const count = projectProposals.filter(
      (project) =>
        project.committee === committee.name && project.status === "Approved"
    ).length;

    return {
      name: committee.name,
      value: count,
    };
  });

  // Calculate monthly budget allocation for bar graph
  const getMonthName = (monthIndex: number) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months[monthIndex];
  };

  const monthlyBudgets = Array.from({ length: 12 }, (_, monthIndex) => {
    const monthlyTotal = projectProposals
      .filter(
        (project) =>
          project.status === "Approved" &&
          project.implementation?.startDate.getMonth() === monthIndex &&
          project.implementation?.startDate.getFullYear() === 2025
      )
      .reduce((sum, project) => sum + project.budget, 0);

    return {
      name: getMonthName(monthIndex),
      value: monthlyTotal,
    };
  });

  // Handler for approving a project
  const openApprovalDialog = (project: any) => {
    setSelectedProject(project);

    // Initialize committee approvals with current values
    const initialApprovals: { [key: number]: boolean } = {};
    project.approvals.forEach(
      (approval: { committeeId: number; approved: boolean }) => {
        initialApprovals[approval.committeeId] = approval.approved;
      }
    );

    // Add any missing committees
    committees.forEach((committee) => {
      if (initialApprovals[committee.id] === undefined) {
        initialApprovals[committee.id] = false;
      }
    });

    setCommitteeApprovals(initialApprovals);
    setShowApprovalDialog(true);
  };

  // Handler for rejecting a project
  const openRejectionDialog = (project: any) => {
    setSelectedProject(project);
    setRejectionReason("");
    setShowRejectionDialog(true);
  };

  // Handle approval submission
  const handleApprove = () => {
    if (!selectedProject) return;

    const updatedProjects = projectProposals.map((project) => {
      if (project.id === selectedProject.id) {
        // Convert committee approvals object to array format
        const newApprovals = Object.entries(committeeApprovals).map(
          ([committeeId, approved]) => ({
            committeeId: parseInt(committeeId),
            approved,
          })
        );

        // Check if majority approved (at least 4 committees)
        const approvalCount =
          Object.values(committeeApprovals).filter(Boolean).length;
        const hasEnoughApprovals = approvalCount >= 4;

        // If approved, create implementation details using a ternary operator
        const newImplementation = hasEnoughApprovals
          ? {
              startDate: new Date(
                new Date().getTime() + 7 * 24 * 60 * 60 * 1000
              ), // Start in a week
              endDate: new Date(project.dueDate),
              status: "Scheduled",
              completion: 0,
            }
          : null;

        return {
          ...project,
          status: hasEnoughApprovals ? "Approved" : "Pending Approval",
          approvals: newApprovals,
          implementation: hasEnoughApprovals ? newImplementation : null,
        };
      }
      return project;
    });

    setProjectProposals(updatedProjects);
    setShowApprovalDialog(false);
  };

  // Handle rejection submission
  const handleReject = () => {
    if (!selectedProject) return;

    const updatedProjects = projectProposals.map((project) => {
      if (project.id === selectedProject.id) {
        return {
          ...project,
          status: "Rejected",
          rejectionReason,
        };
      }
      return project;
    });

    setProjectProposals(updatedProjects);
    setShowRejectionDialog(false);
  };

  // Function to get appropriate status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 border-green-200 text-green-800";
      case "Pending Approval":
        return "bg-blue-100 border-blue-200 text-blue-800";
      case "Rejected":
        return "bg-red-100 border-red-200 text-red-800";
      case "In Progress":
        return "bg-purple-100 border-purple-200 text-purple-800";
      case "Scheduled":
        return "bg-orange-100 border-orange-200 text-orange-800";
      default:
        return "bg-gray-100 border-gray-200 text-gray-800";
    }
  };

  return (
    <SessionGuard requiredRoles={["Admin"]}>
      <div className="min-h-screen w-full p-6 bg-gray-50">
        <div className="flex flex-col gap-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Barangay Community Management Dashboard
          </h1>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Total Committees
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{committees.length}</div>
                <p className="text-xs text-gray-500 mt-1">
                  Each with a designated person in charge
                </p>
              </CardContent>
            </Card> */}

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Project Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {totalApprovedProjects} Approved
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-gray-500">
                    {totalPendingProjects} pending
                  </p>
                  <p className="text-xs text-gray-500">
                    {totalRejectedProjects} rejected
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Total Budget
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₱{totalBudget.toLocaleString()}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Allocated for approved projects
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  This Month&apos;s Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{thisMonthActivities}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {priorityCounts["Urgent & Important"] || 0} urgent priority
                  items
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Chart Dashboard */}
          <Card>
            <CardHeader>
              <CardTitle>Project Overview</CardTitle>
              <CardDescription>
                Budget allocation by month and committee distribution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Budget Allocation by Month
                  </h3>
                  <Bargraph data={monthlyBudgets} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Project Distribution by Committee
                  </h3>
                  {/* <Piegraph data={committeeProjectCounts} /> */}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="w-full">
            {/* Pending Projects Table Section with Search and Filter */}

            <ProjectProposals />
          </div>

          {/* Committee Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Committee Overview</CardTitle>
              <CardDescription>
                Status and details of all barangay committees
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left p-2">Committee</th>
                      <th className="text-left p-2">Person In Charge</th>
                      <th className="text-center p-2">Projects Proposed</th>
                      <th className="text-center p-2">Projects Approved</th>
                      <th className="text-right p-2">Budget Allocated</th>
                      <th className="text-right p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {committees.map((committee) => {
                      const proposedProjects = projectProposals.filter(
                        (p) => p.committee === committee.name
                      );
                      const approvedProjects = proposedProjects.filter(
                        (p) => p.status === "Approved"
                      );
                      const totalBudgetAllocated = approvedProjects.reduce(
                        (sum, p) => sum + p.budget,
                        0
                      );

                      return (
                        <tr
                          key={committee.id}
                          className="border-t hover:bg-gray-50"
                        >
                          <td className="p-2 font-medium">{committee.name}</td>
                          <td className="p-2">{committee.person}</td>
                          <td className="p-2 text-center">
                            {proposedProjects.length}
                          </td>
                          <td className="p-2 text-center">
                            {approvedProjects.length}
                          </td>
                          <td className="p-2 text-right">
                            ₱{totalBudgetAllocated.toLocaleString()}
                          </td>
                          <td className="p-2 text-right">
                            <a
                              href={committee.path}
                              className="text-blue-600 text-sm hover:underline"
                            >
                              View Details
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Priority Matrix Explanation */}
          <Card>
            <CardHeader>
              <CardTitle>Priority Matrix Explanation</CardTitle>
              <CardDescription>
                How projects are categorized based on approvals and due dates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg bg-red-50">
                  <h3 className="font-bold text-red-800 mb-2">
                    Urgent & Important
                  </h3>
                  <p className="text-sm">
                    Projects with at least 4 committee approvals and due date
                    within 30 days.
                  </p>
                  <p className="text-sm mt-2">
                    These projects require immediate attention and have broad
                    support.
                  </p>
                </div>

                <div className="p-4 border rounded-lg bg-yellow-50">
                  <h3 className="font-bold text-yellow-800 mb-2">
                    Urgent but Not Important
                  </h3>
                  <p className="text-sm">
                    Projects with fewer than 4 committee approvals but due date
                    within 30 days.
                  </p>
                  <p className="text-sm mt-2">
                    These projects have deadlines approaching but lack broad
                    committee support.
                  </p>
                </div>

                <div className="p-4 border rounded-lg bg-blue-50">
                  <h3 className="font-bold text-blue-800 mb-2">
                    Important but Not Urgent
                  </h3>
                  <p className="text-sm">
                    Projects with at least 4 committee approvals but due date
                    beyond 30 days.
                  </p>
                  <p className="text-sm mt-2">
                    These projects have strong committee support but longer
                    implementation timelines.
                  </p>
                </div>

                <div className="p-4 border rounded-lg bg-gray-50">
                  <h3 className="font-bold text-gray-800 mb-2">Not Urgent</h3>
                  <p className="text-sm">
                    Projects with fewer than 4 committee approvals and due date
                    beyond 30 days.
                  </p>
                  <p className="text-sm mt-2">
                    These projects require further committee review and have
                    flexible timelines.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Approval Dialog */}
        {/* Updated Approval Dialog */}
        <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Approve Project Proposal</DialogTitle>
              <DialogDescription>
                {selectedProject &&
                  `Review details for "${selectedProject.name}"`}
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              {selectedProject && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Project Details
                    </h3>
                    <p className="font-medium">{selectedProject.name}</p>
                    <p className="text-sm text-gray-700">
                      {selectedProject.description}
                    </p>
                    <div className="mt-1 text-sm">
                      <span className="text-gray-500">Budget: </span>
                      <span className="font-medium">
                        ₱{selectedProject.budget.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Due Date: </span>
                      <span className="font-medium">
                        {selectedProject.dueDate.toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Committee: </span>
                      <span className="font-medium">
                        {selectedProject.committee}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Current Committee Approvals
                    </h3>
                    <div className="space-y-2 border rounded-md p-3 bg-gray-50">
                      {committees.map((committee) => {
                        // Find if this committee has an approval record
                        const approval = selectedProject.approvals.find(
                          (a: { committeeId: number }) =>
                            a.committeeId === committee.id
                        );

                        // Determine if approved
                        const isApproved = approval ? approval.approved : false;

                        return (
                          <div
                            key={committee.id}
                            className="flex items-center justify-between"
                          >
                            <div className="text-sm">
                              {committee.name} ({committee.person})
                            </div>
                            <div>
                              {isApproved ? (
                                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Approved
                                </span>
                              ) : (
                                <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Not Approved
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-4 bg-blue-50 p-3 rounded-md text-sm text-blue-800">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 mt-0.5" />
                        <p>
                          Note: A project requires at least 4 committee
                          approvals to be fully approved. Currently, this
                          project has{" "}
                          {
                            selectedProject.approvals.filter(
                              (a: { approved: boolean }) => a.approved
                            ).length
                          }{" "}
                          approvals.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="sm:justify-end">
              <Button
                variant="outline"
                onClick={() => setShowApprovalDialog(false)}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  // Create a new approved implementation object
                  const newImplementation = {
                    startDate: new Date(
                      new Date().getTime() + 7 * 24 * 60 * 60 * 1000
                    ), // Start in a week
                    endDate: new Date(selectedProject.dueDate),
                    status: "Scheduled",
                    completion: 0,
                  };

                  // Update the project
                  const updatedProjects = projectProposals.map((project) => {
                    if (project.id === selectedProject.id) {
                      return {
                        ...project,
                        status: "Approved",
                        implementation: newImplementation,
                      };
                    }
                    return project;
                  });

                  setProjectProposals(updatedProjects);
                  setShowApprovalDialog(false);
                }}
              >
                Approve Project
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Rejection Dialog */}
        <Dialog
          open={showRejectionDialog}
          onOpenChange={setShowRejectionDialog}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Reject Project Proposal</DialogTitle>
              <DialogDescription>
                {selectedProject &&
                  `Provide a reason for rejecting "${selectedProject.name}"`}
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              {selectedProject && (
                <div>
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-500">
                      Rejection Reason
                    </h3>
                    <textarea
                      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      placeholder="Provide a reason for rejecting this project proposal..."
                      rows={4}
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                    />
                  </div>

                  <div className="bg-red-50 p-3 rounded-md text-sm text-red-800">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 mt-0.5" />
                      <p>
                        Note: Rejecting a project proposal is permanent and will
                        notify the committee that submitted it. Please provide a
                        clear reason for the rejection.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="sm:justify-end">
              <Button
                variant="outline"
                onClick={() => setShowRejectionDialog(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleReject}>
                Reject Project
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </SessionGuard>
  );
}
