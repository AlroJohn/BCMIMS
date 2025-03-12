"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertCircle, CheckCircle, FileText, Pencil, Plus, Search, XCircle } from "lucide-react";
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

// Sample project data
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
  }
];

export default function CommitteeProjectProposalsTemplate({
  committee,
  initialTab = "all",
}: {
  committee: string;
  initialTab?: string;
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchTerm, setSearchTerm] = useState("");
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  
  // Form states for new project
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [newProjectBudget, setNewProjectBudget] = useState("");
  const [newProjectDueDate, setNewProjectDueDate] = useState("");

  // Set active tab based on URL param if provided
  useEffect(() => {
    if (initialTab && initialTab !== "all") {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Get committee info
  const committeeInfo = committeeInfoMap[committee as keyof typeof committeeInfoMap];

  // Filter projects for the current committee
  const projectProposals = allProjects.filter(project => {
    return project.committee === committeeInfo.name;
  });

  // Filter projects based on active tab and search term
  const filteredProjects = projectProposals.filter(project => {
    // Filter by tab
    if (activeTab !== "all" && project.status.toLowerCase() !== activeTab.toLowerCase()) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && !project.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !project.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Statistics
  const totalProjects = projectProposals.length;
  const approvedProjects = projectProposals.filter(p => p.status === "Approved").length;
  const pendingProjects = projectProposals.filter(p => p.status === "Pending Approval").length;
  const rejectedProjects = projectProposals.filter(p => p.status === "Rejected").length;

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {committeeInfo.name} Committee Project Proposals
        </h1>
        <Button 
          onClick={() => setShowCreateProject(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Project Proposal
        </Button>
      </div>

      {/* Project Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Total Projects</span>
              <span className="text-2xl font-bold">{totalProjects}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Approved</span>
              <span className="text-2xl font-bold text-green-600">{approvedProjects}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Pending</span>
              <span className="text-2xl font-bold text-blue-600">{pendingProjects}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Rejected</span>
              <span className="text-2xl font-bold text-red-600">{rejectedProjects}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <CardTitle>Project Proposals</CardTitle>
              <CardDescription>
                All project proposals submitted by {committeeInfo.name} Committee
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
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
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
              {/* Content is filtered through the filteredProjects variable */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  {/* Table header and body similar to "all" tab */}
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
                      filteredProjects.map((project) => (
                        <tr key={project.id} className="border-t hover:bg-gray-50">
                          {/* Table cells similar to "all" tab */}
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
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="flex items-center gap-1"
                              onClick={() => openProjectDetails(project)}
                            >
                              <FileText className="h-4 w-4" />
                              <span className="hidden sm:inline">Details</span>
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-4 text-center text-gray-500">
                          No approved projects found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </TabsContent>
          
          <TabsContent value="pending approval" className="m-0">
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
                              <Badge className={priority.badge}>
                                {priority.level}
                              </Badge>
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
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="flex items-center gap-1"
                                >
                                  <Pencil className="h-4 w-4" />
                                  <span className="hidden sm:inline">Edit</span>
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-4 text-center text-gray-500">
                          No pending projects found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </TabsContent>
          
          <TabsContent value="rejected" className="m-0">
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left p-2">Project</th>
                      <th className="text-left p-2">Due Date</th>
                      <th className="text-left p-2">Rejection Reason</th>
                      <th className="text-left p-2">Budget</th>
                      <th className="text-center p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProjects.length > 0 ? (
                      filteredProjects.map((project) => (
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
                          </td>
                          <td className="p-2 text-sm text-gray-700">
                            {project.rejectionReason || "No reason provided"}
                          </td>
                          <td className="p-2">₱{project.budget.toLocaleString()}</td>
                          <td className="p-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="flex items-center gap-1"
                              onClick={() => openProjectDetails(project)}
                            >
                              <FileText className="h-4 w-4" />
                              <span className="hidden sm:inline">Details</span>
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-4 text-center text-gray-500">
                          No rejected projects found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>

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