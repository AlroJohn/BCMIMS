"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Piegraph } from "@/components/custom/dashboard/Piegraph";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Calendar, CheckCircle, Clock, Download, FileText, Filter,
  Pencil, Search, XCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";


// Create simple Badge component
const Badge = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${className}`}>
    {children}
  </span>
);

// Create simple Progress component
const Progress = ({ value = 0, className = "" }: { value?: number; className?: string }) => (
  <div className={`h-2 w-full overflow-hidden rounded-full bg-gray-200 ${className}`}>
    <div
      className="h-full bg-blue-500 transition-all"
      style={{ width: `${Math.min(Math.max(0, value), 100)}%` }}
    />
  </div>
);

// Committee dashboard component that adapts based on committee prop
export default function CommitteeDashboard({
  committee = "EDUCATION_COMMITTEE" // Default to Education
}: {
  committee?: string
}) {
  const [date, setDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewFilter, setViewFilter] = useState("calendar"); // "calendar" or "list"
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  // Form states for new project
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [newProjectBudget, setNewProjectBudget] = useState("");
  const [newProjectDueDate, setNewProjectDueDate] = useState("");

  // Committee info mapping
  const committeeInfoMap = {
    "EDUCATION_COMMITTEE": {
      id: 1,
      name: "Education",
      path: "/education",
      person: "Maria Santos",
      description: "Responsible for educational programs and initiatives in the barangay, including scholarships, school supplies distribution, and learning center management.",
      budget: 250000,
      themeColor: "blue",
      progressColor: "bg-blue-500",
      calendarHighlight: "bg-blue-100",
      calendarDot: "bg-blue-50"
    },
    "ENVIRONMENT_COMMITTEE": {
      id: 2,
      name: "Environment",
      path: "/environment",
      person: "Juan Cruz",
      description: "Responsible for environmental conservation, waste management, tree planting activities, and promoting sustainable practices in the barangay.",
      budget: 200000,
      themeColor: "green",
      progressColor: "bg-green-500",
      calendarHighlight: "bg-green-100",
      calendarDot: "bg-green-50"
    },
    "FINANCE_COMMITTEE": {
      id: 3,
      name: "Finance",
      path: "/finance",
      person: "Pedro Reyes",
      description: "Responsible for budget management, financial planning, and ensuring transparency in barangay finances.",
      budget: 300000,
      themeColor: "amber",
      progressColor: "bg-amber-500",
      calendarHighlight: "bg-amber-100",
      calendarDot: "bg-amber-50"
    },
    "HEALTH_COMMITTEE": {
      id: 4,
      name: "Health Services",
      path: "/health-services",
      person: "Ana Garcia",
      description: "Responsible for health initiatives, medical missions, and healthcare access for barangay residents.",
      budget: 280000,
      themeColor: "red",
      progressColor: "bg-red-500",
      calendarHighlight: "bg-red-100",
      calendarDot: "bg-red-50"
    },
    "PEACE_ORDER_COMMITTEE": {
      id: 5,
      name: "Peace Order",
      path: "/peace-order",
      person: "Ramon Diaz",
      description: "Responsible for maintaining peace and order, conflict resolution, and community safety initiatives.",
      budget: 180000,
      themeColor: "purple",
      progressColor: "bg-purple-500",
      calendarHighlight: "bg-purple-100",
      calendarDot: "bg-purple-50"
    },
    "PUBLIC_WORKS_COMMITTEE": {
      id: 6,
      name: "Public Works",
      path: "/public-works",
      person: "Elena Lim",
      description: "Responsible for infrastructure projects, road maintenance, and public facility improvements.",
      budget: 350000,
      themeColor: "indigo",
      progressColor: "bg-indigo-500",
      calendarHighlight: "bg-indigo-100",
      calendarDot: "bg-indigo-50"
    },
    "WOMEN_COMMITTEE": {
      id: 7,
      name: "Women",
      path: "/women",
      person: "Sofia Mendoza",
      description: "Responsible for women's rights, gender equality initiatives, and women's livelihood programs.",
      budget: 220000,
      themeColor: "pink",
      progressColor: "bg-pink-500",
      calendarHighlight: "bg-pink-100",
      calendarDot: "bg-pink-50"
    }
  };

  // Get committee info based on current committee
  const committeeInfo = committeeInfoMap[committee as keyof typeof committeeInfoMap];

  // All projects in the database
  const allProjects = [
    // Education Committee Projects
    {
      id: 1,
      name: "School Supply Drive",
      description: "Distribute school supplies to underprivileged children",
      committee: "Education",
      committeeId: 1,
      budget: 15000,
      documentTitle: "School Supply Drive Proposal.pdf",
      documentUrl: "/documents/school-supply-drive.pdf",
      dueDate: new Date(2025, 3, 15), // April 15, 2025
      dateProposed: new Date(2025, 2, 1), // March 1, 2025
      status: "Approved",
      rejectionReason: null,
      approvals: [
        { committeeId: 1, approved: true },
        { committeeId: 3, approved: true },
        { committeeId: 4, approved: true },
        { committeeId: 7, approved: true }
      ],
      implementation: {
        startDate: new Date(2025, 3, 5), // April 5, 2025
        endDate: new Date(2025, 3, 15), // April 15, 2025
        status: "In Progress",
        completion: 65
      }
    },
    {
      id: 8,
      name: "Reading Center Renovation",
      description: "Renovate the community reading center with new books, shelves, tables, chairs, and educational materials.",
      committee: "Education",
      committeeId: 1,
      budget: 50000,
      documentTitle: "Reading Center Renovation Proposal.pdf",
      documentUrl: "/documents/reading-center.pdf",
      dueDate: new Date(2025, 3, 10), // April 10, 2025
      dateProposed: new Date(2025, 2, 12), // March 12, 2025
      status: "Pending Approval",
      rejectionReason: null,
      approvals: [
        { committeeId: 1, approved: true },
        { committeeId: 3, approved: false },
        { committeeId: 6, approved: false }
      ],
      implementation: null
    },
    {
      id: 13,
      name: "Scholarship Program",
      description: "Provide scholarships for 20 deserving students from low-income families in the barangay.",
      committee: "Education",
      committeeId: 1,
      budget: 55000,
      documentTitle: "Scholarship Program Proposal.pdf",
      documentUrl: "/documents/scholarship-program.pdf",
      dueDate: new Date(2025, 4, 30), // May 30, 2025
      dateProposed: new Date(2025, 2, 5), // March 5, 2025
      status: "Approved",
      rejectionReason: null,
      approvals: [
        { committeeId: 1, approved: true },
        { committeeId: 3, approved: true },
        { committeeId: 7, approved: true },
        { committeeId: 5, approved: true }
      ],
      implementation: {
        startDate: new Date(2025, 3, 1), // April 1, 2025
        endDate: new Date(2025, 4, 30), // May 30, 2025
        status: "Scheduled",
        completion: 10
      }
    },

    // Environment Committee Projects
    {
      id: 2,
      name: "Tree Planting Activity",
      description: "Plant 500 tree seedlings in barangay areas to increase green cover and combat pollution.",
      committee: "Environment",
      committeeId: 2,
      budget: 12000,
      documentTitle: "Tree Planting Proposal.pdf",
      documentUrl: "/documents/tree-planting.pdf",
      dueDate: new Date(2025, 5, 5), // June 5, 2025
      dateProposed: new Date(2025, 2, 5), // March 5, 2025
      status: "Approved",
      rejectionReason: null,
      approvals: [
        { committeeId: 2, approved: true },
        { committeeId: 5, approved: true },
        { committeeId: 6, approved: true },
        { committeeId: 7, approved: true },
        { committeeId: 1, approved: true }
      ],
      implementation: {
        startDate: new Date(2025, 2, 18), // March 18, 2025
        endDate: new Date(2025, 5, 1), // June 1, 2025
        status: "In Progress",
        completion: 45
      }
    },
    {
      id: 16,
      name: "Community Clean-up Drive",
      description: "Organize monthly community clean-up drives in different areas of the barangay.",
      committee: "Environment",
      committeeId: 2,
      budget: 8000,
      documentTitle: "Clean-up Drive Proposal.pdf",
      documentUrl: "/documents/cleanup-drive.pdf",
      dueDate: new Date(2025, 4, 15), // May 15, 2025
      dateProposed: new Date(2025, 2, 10), // March 10, 2025
      status: "Approved",
      rejectionReason: null,
      approvals: [
        { committeeId: 2, approved: true },
        { committeeId: 3, approved: true },
        { committeeId: 4, approved: true },
        { committeeId: 5, approved: true }
      ],
      implementation: {
        startDate: new Date(2025, 3, 1), // April 1, 2025
        endDate: new Date(2025, 4, 15), // May 15, 2025
        status: "In Progress",
        completion: 30
      }
    },

    // Finance Committee Projects
    {
      id: 3,
      name: "Budget Transparency Portal",
      description: "Create an online portal for barangay budget transparency",
      committee: "Finance",
      committeeId: 3,
      budget: 5000,
      documentTitle: "Budget Portal Proposal.pdf",
      documentUrl: "/documents/budget-portal.pdf",
      dueDate: new Date(2025, 6, 30), // July 30, 2025
      dateProposed: new Date(2025, 2, 10), // March 10, 2025
      status: "Approved",
      rejectionReason: null,
      approvals: [
        { committeeId: 3, approved: true },
        { committeeId: 5, approved: true },
        { committeeId: 1, approved: false }
      ],
      implementation: {
        startDate: new Date(2025, 3, 1), // April 1, 2025
        endDate: new Date(2025, 6, 30), // July 30, 2025
        status: "In Progress",
        completion: 80
      }
    },

    // Health Services Committee Projects
    {
      id: 4,
      name: "Free Medical Checkup",
      description: "Provide free medical checkups for senior citizens",
      committee: "Health Services",
      committeeId: 4,
      budget: 35000,
      documentTitle: "Medical Checkup Proposal.pdf",
      documentUrl: "/documents/medical-checkup.pdf",
      dueDate: new Date(2025, 2, 25), // March 25, 2025
      dateProposed: new Date(2025, 1, 15), // February 15, 2025
      status: "Approved",
      rejectionReason: null,
      approvals: [
        { committeeId: 4, approved: true },
        { committeeId: 3, approved: true },
        { committeeId: 7, approved: true },
        { committeeId: 1, approved: true }
      ],
      implementation: {
        startDate: new Date(2025, 2, 22), // March 22, 2025
        endDate: new Date(2025, 2, 25), // March 25, 2025
        status: "Scheduled",
        completion: 20
      }
    },

    // Peace Order Committee Projects
    {
      id: 5,
      name: "CCTV Installation",
      description: "Install CCTV cameras in strategic locations",
      committee: "Peace Order",
      committeeId: 5,
      budget: 80000,
      documentTitle: "CCTV Installation Proposal.pdf",
      documentUrl: "/documents/cctv-installation.pdf",
      dueDate: new Date(2025, 8, 30), // September 30, 2025
      dateProposed: new Date(2025, 2, 15), // March 15, 2025
      status: "Approved",
      rejectionReason: null,
      approvals: [
        { committeeId: 5, approved: true },
        { committeeId: 3, approved: true },
        { committeeId: 6, approved: true }
      ],
      implementation: {
        startDate: new Date(2025, 4, 1), // May 1, 2025
        endDate: new Date(2025, 8, 30), // September 30, 2025
        status: "In Progress",
        completion: 50
      }
    },

    // Public Works Committee Projects
    {
      id: 6,
      name: "Road Repair Project",
      description: "Repair damaged roads in the barangay",
      committee: "Public Works",
      committeeId: 6,
      budget: 120000,
      documentTitle: "Road Repair Proposal.pdf",
      documentUrl: "/documents/road-repair.pdf",
      dueDate: new Date(2025, 3, 20), // April 20, 2025
      dateProposed: new Date(2025, 1, 10), // February 10, 2025
      status: "Approved",
      rejectionReason: null,
      approvals: [
        { committeeId: 6, approved: true },
        { committeeId: 3, approved: true },
        { committeeId: 5, approved: true }
      ],
      implementation: {
        startDate: new Date(2025, 2, 25), // March 25, 2025
        endDate: new Date(2025, 3, 20), // April 20, 2025
        status: "In Progress",
        completion: 35
      }
    },

    // Women Committee Projects
    {
      id: 7,
      name: "Women's Livelihood Program",
      description: "Implement livelihood programs for women",
      committee: "Women",
      committeeId: 7,
      budget: 60000,
      documentTitle: "Women's Livelihood Proposal.pdf",
      documentUrl: "/documents/womens-livelihood.pdf",
      dueDate: new Date(2025, 5, 15), // June 15, 2025
      dateProposed: new Date(2025, 2, 8), // March 8, 2025
      status: "Approved",
      rejectionReason: null,
      approvals: [
        { committeeId: 7, approved: true },
        { committeeId: 3, approved: true },
        { committeeId: 1, approved: true },
        { committeeId: 4, approved: true }
      ],
      implementation: {
        startDate: new Date(2025, 2, 28), // March 28, 2025
        endDate: new Date(2025, 5, 15), // June 15, 2025
        status: "In Progress",
        completion: 40
      }
    }
  ];

  // Filter projects for the current committee
  const projectProposals = allProjects.filter(project => {
    // Compare committee name with the project's committee
    return project.committee === committeeInfo.name;
  });

  // Filter projects based on active tab and search term
  const filteredProjects = projectProposals.filter(project => {
    // Filter by tab
    if (activeTab !== "all" && project.status.toLowerCase() !== activeTab) {
      return false;
    }

    // Filter by search term
    if (searchTerm && !project.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !project.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    return true;
  });

  // Function to determine priority level based on status and due date
  const determinePriority = (project: any) => {
    if (project.status === "Approved") {
      return { level: "Approved", badge: "bg-green-100 border-green-200 text-green-800" };
    }

    if (project.status === "Rejected") {
      return { level: "Rejected", badge: "bg-red-100 border-red-200 text-red-800" };
    }

    const now = new Date();
    const daysUntilDue = Math.ceil((project.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilDue <= 7) {
      return { level: "Critical", badge: "bg-red-100 border-red-200 text-red-800" };
    }
    if (daysUntilDue <= 30) {
      return { level: "Urgent", badge: "bg-yellow-100 border-yellow-200 text-yellow-800" };
    }
    return { level: "Normal", badge: "bg-blue-100 border-blue-200 text-blue-800" };
  };

  // Create calendar activities from approved projects that have implementation dates
  const calendarActivities = projectProposals
    .filter(project => project.status === "Approved" && project.implementation !== null)
    .flatMap(project => {
      const activities: Array<{
        date: Date;
        title: string;
        project: typeof project;
      }> = [];

      if (project.implementation && project.implementation.startDate) {
        activities.push({
          date: project.implementation.startDate,
          title: `Start: ${project.name}`,
          project: project
        });
      }

      if (project.implementation && project.implementation.endDate) {
        activities.push({
          date: project.implementation.endDate,
          title: `Due: ${project.name}`,
          project: project
        });
      }

      // Special handling for specific projects
      if (project.id === 2 && committeeInfo.name === "Environment" && project.implementation) {
        // For tree planting, add maintenance dates
        const startDate = project.implementation.startDate;
        const endDate = project.implementation.endDate;

        const currentDate = new Date(startDate); // Changed 'let' to 'const' to fix ESLint warning
        currentDate.setDate(currentDate.getDate() + 14); // First maintenance after two weeks

        // Create a new date variable for iteration
        let iterationDate = new Date(currentDate);

        while (iterationDate < endDate) {
          activities.push({
            date: new Date(iterationDate),
            title: `Maintenance: ${project.name}`,
            project: project
          });

          // Update the iteration date
          iterationDate = new Date(iterationDate);
          iterationDate.setDate(iterationDate.getDate() + 14); // Next maintenance after two weeks
        }
      }

      return activities;
    });

  // Filter activities for the selected date
  const selectedDateActivities = calendarActivities.filter(
    (activity) => activity.date.toDateString() === date.toDateString()
  );

  // Upcoming activities sorted by date
  const upcomingActivities = [...calendarActivities]
    .filter(activity => activity.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  // Statistics
  const totalProjects = projectProposals.length;
  const approvedProjects = projectProposals.filter(p => p.status === "Approved").length;
  const pendingProjects = projectProposals.filter(p => p.status === "Pending Approval").length;
  const rejectedProjects = projectProposals.filter(p => p.status === "Rejected").length;
  const totalBudget = projectProposals
    .filter(p => p.status === "Approved")
    .reduce((sum, project) => sum + project.budget, 0);

  // Data for budget chart
  const budgetData = [
    { name: "Allocated", value: totalBudget },
    { name: "Remaining", value: committeeInfo.budget - totalBudget }
  ];

  // Data for project status chart
  const projectStatusData = [
    { name: "Approved", value: approvedProjects },
    { name: "Pending", value: pendingProjects },
    { name: "Rejected", value: rejectedProjects }
  ];

  // Function to open project details
  const openProjectDetails = (project: any) => {
    setSelectedProject(project);
    setShowProjectDetails(true);
  };

  // Function to handle new project submission
  const handleCreateProject = () => {
    // In a real app, this would send data to the server
    // For demo purposes, just close the dialog
    setShowCreateProject(false);

    // Reset form fields
    setNewProjectName("");
    setNewProjectDescription("");
    setNewProjectBudget("");
    setNewProjectDueDate("");
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
      default:
        return "bg-gray-100 border-gray-200 text-gray-800";
    }
  };

  // Dynamic styling based on committee
  const getProgressClass = () => {
    return committeeInfo.progressColor || "bg-blue-500";
  };

  const getCalendarHighlight = () => {
    return committeeInfo.calendarHighlight || "bg-blue-100";
  };

  const getCalendarDot = () => {
    return committeeInfo.calendarDot || "bg-blue-50";
  };

  return (
 
    <div>
      <div className="min-h-screen w-full p-6 bg-gray-50">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              {committeeInfo.name} Committee Dashboard
            </h1>
            {/* <Button 
              onClick={() => setShowCreateProject(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Project Proposal
            </Button> */}
          </div>

          {/* Committee Info Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2">Committee Information</h2>
                  <p className="text-gray-600 mb-4">{committeeInfo.description}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Committee Head</p>
                      <p className="font-medium">{committeeInfo.person}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Projects</p>
                      <p className="font-medium">{totalProjects}</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2">Budget Overview</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Total Budget</p>
                      <p className="font-medium">₱{committeeInfo.budget.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Allocated</p>
                      <p className="font-medium">₱{totalBudget.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Remaining</p>
                      <p className="font-medium">₱{(committeeInfo.budget - totalBudget).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-1">Budget Utilization</p>
                    <Progress value={(totalBudget / committeeInfo.budget) * 100} className={getProgressClass()} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
            <Card className="h-fit ">
              <CardHeader>
                <CardTitle>Budget Allocation</CardTitle>
                <CardDescription>Budget allocated vs remaining</CardDescription>
              </CardHeader>
              <CardContent>

                <Piegraph data={budgetData} />

              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project Status</CardTitle>
                <CardDescription>Overview of all project proposals</CardDescription>
              </CardHeader>
              <CardContent>

                <Piegraph data={projectStatusData} />

              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Project Proposals Section */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                      <CardTitle>Project Proposals</CardTitle>
                      <CardDescription>
                        All project proposals submitted by Education Committee
                      </CardDescription>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                          placeholder="Search projects..."
                          className="pl-8"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <Tabs defaultValue="all" onValueChange={setActiveTab}>
                  <div className="px-6">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="all">All ({projectProposals.length})</TabsTrigger>
                      <TabsTrigger value="approved">Approved ({approvedProjects})</TabsTrigger>
                      <TabsTrigger value="pending approval">Pending ({pendingProjects})</TabsTrigger>
                      <TabsTrigger value="rejected">Rejected ({rejectedProjects})</TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="all" className="m-0">
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr>
                              <th className="text-left p-2">Project</th>
                              <th className="text-left p-2">Due Date</th>
                              <th className="text-left p-2">Status</th>
                              <th className="text-left p-2">Budget</th>
                              <th className="text-center p-2">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredProjects.length > 0 ? (
                              filteredProjects.map((project) => {
                                const priority = determinePriority(project);

                                return (
                                  <tr key={project.id} className="border-t hover:bg-gray-50">
                                    <td className="p-2">
                                      <div>
                                        <div className="font-medium">{project.name}</div>
                                        <div className="text-sm text-gray-500 truncate max-w-xs">
                                          {project.description.length > 60
                                            ? project.description.substring(0, 60) + "..."
                                            : project.description}
                                        </div>
                                      </div>
                                    </td>
                                    <td className="p-2">
                                      {project.dueDate.toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric'
                                      })}
                                      <div className="text-xs text-gray-500">
                                        {Math.ceil((project.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left
                                      </div>
                                    </td>
                                    <td className="p-2">
                                      <Badge className={getStatusBadge(project.status)}>
                                        {project.status}
                                      </Badge>
                                      {project.implementation && (
                                        <div className="text-xs text-gray-500 mt-1">
                                          {project.implementation.status} ({project.implementation.completion}%)
                                        </div>
                                      )}
                                    </td>
                                    <td className="p-2">₱{project.budget.toLocaleString()}</td>
                                    <td className="p-2">
                                      <div className="flex justify-center gap-2">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="flex items-center gap-1"
                                          onClick={() => openProjectDetails(project)}
                                        >
                                          <FileText className="h-4 w-4" />
                                          <span className="hidden sm:inline">Details</span>
                                        </Button>
                                        {project.status === "Pending Approval" && (
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex items-center gap-1"
                                          >
                                            <Pencil className="h-4 w-4" />
                                            <span className="hidden sm:inline">Edit</span>
                                          </Button>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })
                            ) : (
                              <tr>
                                <td colSpan={5} className="p-4 text-center text-gray-500">
                                  No projects found matching your criteria
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </TabsContent>

                  <TabsContent value="approved" className="m-0">
                    <CardContent>
                      {/* Same table structure as "all" but filtered for approved */}
                      {/* Content is filtered through the filteredProjects variable */}
                    </CardContent>
                  </TabsContent>

                  <TabsContent value="pending approval" className="m-0">
                    <CardContent>
                      {/* Same table structure as "all" but filtered for pending */}
                      {/* Content is filtered through the filteredProjects variable */}
                    </CardContent>
                  </TabsContent>

                  <TabsContent value="rejected" className="m-0">
                    <CardContent>
                      {/* Same table structure as "all" but filtered for rejected */}
                      {/* Content is filtered through the filteredProjects variable */}
                    </CardContent>
                  </TabsContent>
                </Tabs>
              </Card>
            </div>

            {/* Calendar Section */}
            <div>
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Calendar of Activities</CardTitle>
                      <CardDescription>
                        Based on approved projects
                      </CardDescription>
                    </div>
                    <div className="flex bg-gray-100 rounded-md p-0.5">
                      <Button
                        variant={viewFilter === 'calendar' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewFilter('calendar')}
                        className="flex items-center gap-1"
                      >
                        <Calendar className="h-4 w-4" />
                        <span className="hidden sm:inline">Calendar</span>
                      </Button>
                      <Button
                        variant={viewFilter === 'list' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewFilter('list')}
                        className="flex items-center gap-1"
                      >
                        <Clock className="h-4 w-4" />
                        <span className="hidden sm:inline">Timeline</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  {viewFilter === 'calendar' ? (
                    <div className="border rounded-md p-4 w-full">
                      <h3 className="font-medium mb-4 text-center">March 2025</h3>
                      <div className="grid grid-cols-7 gap-1">
                        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                          <div key={day} className="text-center text-sm font-medium p-2">
                            {day}
                          </div>
                        ))}
                        {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                          const currentDate = new Date(2025, 2, day);
                          const hasActivity = calendarActivities.some(
                            (activity) => activity.date.toDateString() === currentDate.toDateString()
                          );
                          const isSelected = date.toDateString() === currentDate.toDateString();

                          return (
                            <button
                              key={day}
                              className={`text-center p-2 rounded-full hover:bg-gray-100 ${hasActivity ? "font-bold bg-blue-50" : ""
                                } ${isSelected ? "bg-blue-100 font-bold" : ""}`}
                              onClick={() => setDate(currentDate)}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="border rounded-md p-4 w-full mb-4">
                      <h3 className="font-medium mb-4">Upcoming Timeline</h3>
                      <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute h-full w-0.5 bg-gray-200 left-2 top-0"></div>

                        {upcomingActivities.length > 0 ? (
                          upcomingActivities.slice(0, 10).map((activity, index) => (
                            <div key={index} className="ml-7 mb-4 relative">
                              {/* Timeline dot */}
                              <div className="absolute w-4 h-4 rounded-full bg-blue-500 -left-5 top-1.5"></div>

                              <div className="p-3 border rounded-lg bg-white shadow-sm">
                                <div className="font-medium">{activity.title}</div>
                                <div className="text-sm text-gray-500">
                                  {activity.date.toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </div>
                                <div className="flex justify-between items-center mt-1">
                                  <Badge className={determinePriority(activity.project).badge}>
                                    {activity.project.implementation?.status || "Scheduled"}
                                  </Badge>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-auto p-1 text-blue-600"
                                    onClick={() => openProjectDetails(activity.project)}
                                  >
                                    <FileText className="h-3 w-3 mr-1" />
                                    Details
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4 text-gray-500">
                            No upcoming activities
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {viewFilter === 'calendar' && (
                    <div className="mt-6 flex-1">
                      <h3 className="font-medium mb-2">
                        Activities for {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </h3>

                      {selectedDateActivities.length > 0 ? (
                        <div className="space-y-2">
                          {selectedDateActivities.map((activity, index) => {
                            const project = activity.project;

                            return (
                              <div key={index} className="p-3 border rounded-lg bg-white shadow-sm">
                                <div className="font-medium">{activity.title}</div>
                                <div className="text-sm text-gray-500">
                                  Budget: ₱{project.budget.toLocaleString()}
                                </div>
                                <div className="mt-1">
                                  <div className="flex justify-between items-center">
                                    <Badge className={getStatusBadge(project.status)}>
                                      {project.status}
                                    </Badge>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-auto p-1 text-blue-600"
                                      onClick={() => openProjectDetails(project)}
                                    >
                                      <FileText className="h-3 w-3 mr-1" />
                                      Details
                                    </Button>
                                  </div>
                                </div>
                                {project.implementation && (
                                  <div className="mt-2">
                                    <div className="flex justify-between items-center text-sm">
                                      <span>Progress:</span>
                                      <span>{project.implementation.completion}%</span>
                                    </div>
                                    <Progress value={project.implementation.completion} className="h-2 mt-1" />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-gray-500 text-sm">No activities scheduled for this date.</div>
                      )}
                    </div>
                  )}

                  <div className="mt-auto pt-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Activity Stats</h3>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Download className="h-4 w-4" />
                        <span>Export</span>
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="p-2 bg-green-50 rounded-md border border-green-100">
                        <div className="text-sm text-gray-600">Completed</div>
                        <div className="font-medium">
                          {projectProposals.filter(p =>
                            p.implementation?.status === "Completed"
                          ).length}
                        </div>
                      </div>
                      <div className="p-2 bg-blue-50 rounded-md border border-blue-100">
                        <div className="text-sm text-gray-600">In Progress</div>
                        <div className="font-medium">
                          {projectProposals.filter(p =>
                            p.implementation?.status === "In Progress" || p.implementation?.status === "Scheduled"
                          ).length}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Project Details Dialog */}
      <Dialog open={showProjectDetails} onOpenChange={setShowProjectDetails}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Project Details</DialogTitle>
            <DialogDescription>
              {selectedProject && `Detailed information for "${selectedProject.name}"`}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {selectedProject && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Project Details</h3>
                  <p className="font-medium">{selectedProject.name}</p>
                  <p className="text-sm text-gray-700">{selectedProject.description}</p>
                  <div className="mt-1 text-sm">
                    <span className="text-gray-500">Budget: </span>
                    <span className="font-medium">₱{selectedProject.budget.toLocaleString()}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Due Date: </span>
                    <span className="font-medium">
                      {selectedProject.dueDate.toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Proposed Date: </span>
                    <span className="font-medium">
                      {selectedProject.dateProposed.toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Current Status</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getStatusBadge(selectedProject.status)}>
                      {selectedProject.status}
                    </Badge>
                    {selectedProject.implementation && (
                      <Badge className="bg-purple-100 border-purple-200 text-purple-800">
                        {selectedProject.implementation.status} - {selectedProject.implementation.completion}% complete
                      </Badge>
                    )}
                  </div>

                  {selectedProject.status === "Rejected" && selectedProject.rejectionReason && (
                    <div className="p-3 border rounded-md bg-red-50 text-sm">
                      <p className="font-medium text-red-800">Rejection Reason:</p>
                      <p className="text-red-700">{selectedProject.rejectionReason}</p>
                    </div>
                  )}

                  {selectedProject.implementation && (
                    <div className="mt-2">
                      <div className="flex justify-between items-center text-sm">
                        <span>Implementation Progress:</span>
                        <span>{selectedProject.implementation.completion}%</span>
                      </div>
                      <Progress value={selectedProject.implementation.completion} className={getProgressClass()} />

                      <div className="grid grid-cols-2 gap-4 mt-3">
                        <div>
                          <p className="text-xs text-gray-500">Start Date</p>
                          <p className="text-sm">
                            {selectedProject.implementation.startDate.toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">End Date</p>
                          <p className="text-sm">
                            {selectedProject.implementation.endDate.toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Committee Approvals</h3>
                  <div className="border rounded-md p-3 bg-gray-50">
                    <div className="flex flex-col gap-2">
                      {selectedProject.approvals.map((approval: any, index: number) => {
                        // Get committee info based on committee ID
                        const committeeId = approval.committeeId;
                        const committeeKey = Object.keys(committeeInfoMap).find(key =>
                          committeeInfoMap[key as keyof typeof committeeInfoMap].id === committeeId
                        );

                        const committeeName = committeeKey ?
                          committeeInfoMap[committeeKey as keyof typeof committeeInfoMap].name :
                          "Unknown";

                        return (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm">{committeeName}</span>
                            {approval.approved ? (
                              <span className="inline-flex items-center text-green-600 text-sm">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approved
                              </span>
                            ) : (
                              <span className="inline-flex items-center text-gray-500 text-sm">
                                <XCircle className="h-4 w-4 mr-1" />
                                Not Approved
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Attached Document</h3>
                  <a
                    href={selectedProject.documentUrl}
                    className="flex items-center gap-2 p-3 border rounded-md hover:bg-gray-50"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-600">{selectedProject.documentTitle}</p>
                      <p className="text-xs text-gray-500">Click to view document</p>
                    </div>
                  </a>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="sm:justify-end">
            <Button variant="outline" onClick={() => setShowProjectDetails(false)}>
              Close
            </Button>
            {selectedProject && selectedProject.status === "Pending Approval" && (
              <Button variant="default">
                Edit Proposal
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Project Dialog */}
      <Dialog open={showCreateProject} onOpenChange={setShowCreateProject}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Project Proposal</DialogTitle>
            <DialogDescription>
              Fill in the details below to submit a new project proposal.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <label htmlFor="project-name" className="text-sm font-medium">
                Project Name
              </label>
              <Input
                id="project-name"
                placeholder="Enter project name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="project-description" className="text-sm font-medium">
                Project Description
              </label>
              <textarea
                id="project-description"
                placeholder="Describe the project and its goals"
                rows={4}
                value={newProjectDescription}
                onChange={(e) => setNewProjectDescription(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="project-budget" className="text-sm font-medium">
                  Budget (PHP)
                </label>
                <Input
                  id="project-budget"
                  placeholder="Enter budget amount"
                  type="number"
                  value={newProjectBudget}
                  onChange={(e) => setNewProjectBudget(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="project-due-date" className="text-sm font-medium">
                  Due Date
                </label>
                <Input
                  id="project-due-date"
                  type="date"
                  value={newProjectDueDate}
                  onChange={(e) => setNewProjectDueDate(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="project-document" className="text-sm font-medium">
                Project Document
              </label>
              <Input
                id="project-document"
                type="file"
                className="cursor-pointer"
              />
              <p className="text-xs text-gray-500">
                Upload a PDF document with detailed project proposal (max 10MB)
              </p>
            </div>
          </div>

          <DialogFooter className="sm:justify-end">
            <Button variant="outline" onClick={() => setShowCreateProject(false)}>
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleCreateProject}
              disabled={!newProjectName || !newProjectDescription || !newProjectBudget || !newProjectDueDate}
            >
              Submit Proposal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>

  );
}