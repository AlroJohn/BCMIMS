"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, FileText, Pencil, Plus, Search, ThumbsUp, ThumbsDown, XCircle, AlertTriangle, Clock } from "lucide-react";
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

// Define the type for votes to fix the TypeScript error
type ProjectVote = {
  committeeId: number;
  approved: boolean | null;
  comment: string | null;
};

// Define the implementation type
type ProjectImplementation = {
  startDate: Date;
  endDate: Date;
  status: string;
  completion: number;
} | null;

// Define the project type
export type Project = {
  id: number;
  name: string;
  description: string;
  committee: string;
  committeeId: number;
  budget: number;
  documentTitle: string;
  documentUrl: string;
  dueDate: Date;
  dateProposed: Date;
  status: string;
  rejectionReason: string | null;
  votes: ProjectVote[];
  implementation: ProjectImplementation;
};

// Committee info mapping
const committeeInfoMap = {
    "CAPTAIN_COMMITTEE": {
        id: 0, // Use 0 to distinguish it from regular committees
        name: "Captain",
        path: "/captain",
        person: "Benjamin D. Rosin",
        description: "Barangay Captain who oversees all committees and has final approval authority on projects.",
        budget: 500000, // Higher budget for Captain's office
        themeColor: "slate",
        progressColor: "bg-slate-500",
        calendarHighlight: "bg-slate-100",
        calendarDot: "bg-slate-50"
      },
  "EDUCATION_COMMITTEE": {
    id: 1,
    name: "Education",
    path: "/education",
    person: "Baberly A. De Baguio",
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
    person: "Wilfranz B. Correa",
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
    person: "Emma M. Jadie",
    description: "Responsible for budget management, financial planning, and ensuring transparency in barangay finances.",
    budget: 300000,
    themeColor: "amber",
    progressColor: "bg-amber-500",
    calendarHighlight: "bg-amber-100",
    calendarDot: "bg-amber-50"
  },
  "HEALTH_COMMITTEE": {
    id: 4,
    name: "Health",
    path: "/health",
    person: "Edna J. Padre",
    description: "Responsible for health initiatives, medical missions, and healthcare access for barangay residents.",
    budget: 280000,
    themeColor: "red",
    progressColor: "bg-red-500",
    calendarHighlight: "bg-red-100",
    calendarDot: "bg-red-50"
  },
  "PEACE_ORDER_COMMITTEE": {
    id: 5,
    name: "Peace & Order",
    path: "/peace-order",
    person: "Francis Alejo",
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
    person: "Roderick A. Madronio",
    description: "Responsible for infrastructure projects, road maintenance, and public facility improvements.",
    budget: 350000,
    themeColor: "indigo",
    progressColor: "bg-indigo-500",
    calendarHighlight: "bg-indigo-100",
    calendarDot: "bg-indigo-50"
  },
  "WOMEN_COMMITTEE": {
    id: 7,
    name: "Women & Family",
    path: "/women",
    person: "Emma M. Jadie",
    description: "Responsible for women's rights, gender equality initiatives, and women's livelihood programs.",
    budget: 220000,
    themeColor: "pink",
    progressColor: "bg-pink-500",
    calendarHighlight: "bg-pink-100",
    calendarDot: "bg-pink-50"
  }
};

// Get all committees
const allCommittees = Object.values(committeeInfoMap);

// Sample project data
const allProjects: Project[] = [
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
    votes: [
      { committeeId: 1, approved: true, comment: "Fully support this initiative." },
      { committeeId: 3, approved: true, comment: "Budget is reasonable." },
      { committeeId: 4, approved: true, comment: "Good for children's well-being." },
      { committeeId: 7, approved: true, comment: "Supports family development." },
      { committeeId: 2, approved: false, comment: "Concerned about waste from supplies." },
      { committeeId: 5, approved: null, comment: null },
      { committeeId: 6, approved: null, comment: null }
    ],
    implementation: {
      startDate: new Date(2025, 3, 5), // April 5, 2025
      endDate: new Date(2025, 3, 15), // April 15, 2025
      status: "In Progress",
      completion: 65
    }
  },
  { 
    id: 2,
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
    votes: [
      { committeeId: 1, approved: true, comment: "Essential for community learning." },
      { committeeId: 3, approved: false, comment: "Budget concerns - requesting detailed breakdown." },
      { committeeId: 6, approved: false, comment: "Need structural assessment first." },
      { committeeId: 2, approved: true, comment: "Supports environmental education." },
      { committeeId: 4, approved: null, comment: null },
      { committeeId: 5, approved: null, comment: null },
      { committeeId: 7, approved: null, comment: null }
    ],
    implementation: null
  },
  
  // Environment Committee Projects
  { 
    id: 3,
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
    votes: [
      { committeeId: 2, approved: true, comment: "Core to our environmental mission." },
      { committeeId: 5, approved: true, comment: "Supports community engagement." },
      { committeeId: 6, approved: true, comment: "Will help with erosion control." },
      { committeeId: 7, approved: true, comment: "Good family activity." },
      { committeeId: 1, approved: true, comment: "Educational opportunities for students." },
      { committeeId: 3, approved: true, comment: "Budget is appropriate." },
      { committeeId: 4, approved: true, comment: "Health benefits from better air quality." }
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
    id: 4,
    name: "Budget Transparency Portal", 
    description: "Create an online portal for barangay budget transparency",
    committee: "Finance",
    committeeId: 3,
    budget: 5000,
    documentTitle: "Budget Portal Proposal.pdf",
    documentUrl: "/documents/budget-portal.pdf",
    dueDate: new Date(2025, 6, 30), // July 30, 2025
    dateProposed: new Date(2025, 2, 10), // March 10, 2025
    status: "Pending Approval",
    rejectionReason: null,
    votes: [
      { committeeId: 3, approved: true, comment: "Essential for transparency." },
      { committeeId: 5, approved: true, comment: "Good governance initiative." },
      { committeeId: 1, approved: false, comment: "Need to consider digital literacy issues." },
      { committeeId: 2, approved: null, comment: null },
      { committeeId: 4, approved: null, comment: null },
      { committeeId: 6, approved: null, comment: null },
      { committeeId: 7, approved: null, comment: null }
    ],
    implementation: null
  },
  
  // Health Committee Projects
  { 
    id: 5,
    name: "Community Health Screening", 
    description: "Conduct free health screenings for common conditions.",
    committee: "Health",
    committeeId: 4,
    budget: 25000,
    documentTitle: "Health Screening Proposal.pdf",
    documentUrl: "/documents/health-screening.pdf",
    dueDate: new Date(2025, 4, 20), // May 20, 2025
    dateProposed: new Date(2025, 2, 15), // March 15, 2025
    status: "Pending Approval",
    rejectionReason: null,
    votes: [
      { committeeId: 4, approved: true, comment: "Essential preventive health initiative." },
      { committeeId: 3, approved: true, comment: "Budget is acceptable." },
      { committeeId: 7, approved: true, comment: "Important for family health." },
      { committeeId: 1, approved: true, comment: "Educational opportunity on health topics." },
      { committeeId: 2, approved: null, comment: null },
      { committeeId: 5, approved: null, comment: null },
      { committeeId: 6, approved: null, comment: null }
    ],
    implementation: null
  }
];

export default function CommitteeProjectProposalsTemplate({
    committee,
    initialTab = "all",
    isAdmin = false,
    onApprove,
    onReject,
  }: {
    committee: string;
    initialTab?: string;
    isAdmin?: boolean;
    onApprove?: ((project: Project) => void) | undefined;
    onReject?: ((project: Project) => void) | undefined;
  }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchTerm, setSearchTerm] = useState("");
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [showVoteDialog, setShowVoteDialog] = useState(false);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [voteStatus, setVoteStatus] = useState<boolean | null>(null);
  const [voteComment, setVoteComment] = useState("");
  const [showPriorityMatrix, setShowPriorityMatrix] = useState(false);
  const [projects, setProjects] = useState<Project[]>(allProjects);
  
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

  // For admin, show all projects, for committees, show only relevant projects
  const projectProposals = isAdmin ? 
    projects : 
    projects.filter(project => {
      // Show all projects for voting if you're a committee
      return true;
    });

  // Filter projects based on active tab and search term
  const filteredProjects = projectProposals.filter(project => {
    // Filter by tab
    if (activeTab === "to-vote" && !isAdmin) {
      // Show only projects that this committee hasn't voted on yet
      const committeeVote = project.votes.find(vote => vote.committeeId === committeeInfo.id);
      return committeeVote && committeeVote.approved === null;
    } else if (activeTab !== "all" && activeTab !== "to-vote" && project.status.toLowerCase() !== activeTab.toLowerCase()) {
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
  
  // Projects needing votes from this committee
  const toVoteProjects = !isAdmin ? projectProposals.filter(project => {
    const committeeVote = project.votes.find(vote => vote.committeeId === committeeInfo.id);
    return committeeVote && committeeVote.approved === null;
  }).length : 0;

  // Function to determine priority level based on votes, status and due date
  const determinePriority = (project: Project) => {
    if (project.status === "Approved") {
      return { level: "Approved", badge: "bg-green-100 border-green-200 text-green-800" };
    }
    
    if (project.status === "Rejected") {
      return { level: "Rejected", badge: "bg-red-100 border-red-200 text-red-800" };
    }
    
    // Count committee approvals
    const approvalCount = project.votes.filter(vote => vote.approved === true).length;
    
    const now = new Date();
    const daysUntilDue = Math.ceil((project.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    // Urgent & Important: 4+ approvals, due within 30 days
    if (approvalCount >= 4 && daysUntilDue <= 30) {
      return { level: "Urgent & Important", badge: "bg-red-100 border-red-200 text-red-800" };
    }
    
    // Urgent but Not Important: <4 approvals, due within 30 days
    if (approvalCount < 4 && daysUntilDue <= 30) {
      return { level: "Urgent but Not Important", badge: "bg-yellow-100 border-yellow-200 text-yellow-800" };
    }
    
    // Important but Not Urgent: 4+ approvals, due after 30 days
    if (approvalCount >= 4 && daysUntilDue > 30) {
      return { level: "Important but Not Urgent", badge: "bg-blue-100 border-blue-200 text-blue-800" };
    }
    
    // Neither Urgent nor Important: <4 approvals, due after 30 days
    return { level: "Neither Urgent nor Important", badge: "bg-gray-100 border-gray-200 text-gray-800" };
  };

  // Function to open project details
  const openProjectDetails = (project: Project) => {
    setSelectedProject(project);
    setShowProjectDetails(true);
  };

  // Function to open voting dialog
  const openVoteDialog = (project: Project) => {
    setSelectedProject(project);
    // Check if this committee has already voted
    const committeeVote = project.votes.find(vote => vote.committeeId === committeeInfo.id);
    if (committeeVote) {
      setVoteStatus(committeeVote.approved);
      setVoteComment(committeeVote.comment || "");
    } else {
      setVoteStatus(null);
      setVoteComment("");
    }
    setShowVoteDialog(true);
  };

// Function to submit a vote
const submitVote = () => {
    if (!selectedProject) return;
    
    // Find project in the list
    const updatedProjects = projects.map(project => {
      if (project.id === selectedProject.id) {
        // Update the vote for this committee
        const updatedVotes = project.votes.map(vote => {
          if (vote.committeeId === committeeInfo.id) {
            return { ...vote, approved: voteStatus, comment: voteComment };
          }
          return vote;
        });
        
        // Update project status based on votes
        let updatedStatus = project.status;
        const approvalCount = updatedVotes.filter(vote => vote.approved === true).length;
        const rejectionCount = updatedVotes.filter(vote => vote.approved === false).length;
        
        // If we have at least 4 approvals and no more pending votes, approve the project
        if (approvalCount >= 4 && approvalCount + rejectionCount === 7) {
          updatedStatus = "Approved";
        }
        
        // If we have at least 4 rejections and no more pending votes, reject the project
        if (rejectionCount >= 4 && approvalCount + rejectionCount === 7) {
          updatedStatus = "Rejected";
        }
        
        return { ...project, votes: updatedVotes, status: updatedStatus };
      }
      return project;
    });
    
    setProjects(updatedProjects);
    setShowVoteDialog(false);
  };

  // Function to handle new project submission
  const handleCreateProject = () => {
    // Create a new project
    const newProject: Project = {
      id: projects.length + 1,
      name: newProjectName,
      description: newProjectDescription,
      committee: committeeInfo.name,
      committeeId: committeeInfo.id,
      budget: parseInt(newProjectBudget),
      documentTitle: `${newProjectName} Proposal.pdf`,
      documentUrl: `/documents/${newProjectName.toLowerCase().replace(/\s+/g, '-')}.pdf`,
      dueDate: new Date(newProjectDueDate),
      dateProposed: new Date(),
      status: "Pending Approval",
      rejectionReason: null,
      votes: allCommittees.map(committee => ({
        committeeId: committee.id,
        approved: committee.id === committeeInfo.id ? true : null, // Auto approve own committee's project
        comment: committee.id === committeeInfo.id ? "Proposed by our committee" : null
      })),
      implementation: null
    };
    
    // Add to projects list
    setProjects([...projects, newProject]);
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

  // Function to get vote count badge
  const getVoteCountBadge = (project: Project) => {
    const approvalCount = project.votes.filter(vote => vote.approved === true).length;
    const rejectionCount = project.votes.filter(vote => vote.approved === false).length;
    const pendingCount = project.votes.filter(vote => vote.approved === null).length;
    
    return (
      <div className="flex gap-1">
        <span className="inline-flex items-center text-green-600 text-xs">
          <ThumbsUp className="h-3 w-3 mr-1" />
          {approvalCount}
        </span>
        <span className="inline-flex items-center text-red-600 text-xs">
          <ThumbsDown className="h-3 w-3 mr-1" />
          {rejectionCount}
        </span>
        {pendingCount > 0 && (
          <span className="inline-flex items-center text-gray-500 text-xs">
            <Clock className="h-3 w-3 mr-1" />
            {pendingCount}
          </span>
        )}
      </div>
    );
  };

// Check if current committee has voted on a project
const hasVoted = (project: Project) => {
    if (isAdmin) return true; // Admin doesn't vote
    const committeeVote = project.votes.find(vote => vote.committeeId === committeeInfo.id);
    return committeeVote && committeeVote.approved !== null;
  };

  // Dynamic styling based on committee
  const getProgressClass = () => {
    return committeeInfo.progressColor || "bg-blue-500";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {isAdmin ? "All" : committeeInfo.name} Committee Project Proposals
        </h1>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => setShowPriorityMatrix(true)}
          >
            <AlertTriangle className="h-4 w-4 mr-1" />
            Priority Matrix
          </Button>
          {!isAdmin && (
            <Button 
              onClick={() => setShowCreateProject(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Project Proposal
            </Button>
          )}
        </div>
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
        
        {isAdmin ? (
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Rejected</span>
                <span className="text-2xl font-bold text-red-600">{rejectedProjects}</span>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Needs Your Vote</span>
                <span className="text-2xl font-bold text-yellow-600">{toVoteProjects}</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Project List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <CardTitle>Project Proposals</CardTitle>
              <CardDescription>
                {isAdmin ? "All project proposals from all committees" : `All project proposals requiring ${committeeInfo.name} Committee input`}
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
              {!isAdmin && <TabsTrigger value="to-vote">To Vote ({toVoteProjects})</TabsTrigger>}
              <TabsTrigger value="approved">Approved ({approvedProjects})</TabsTrigger>
              <TabsTrigger value="pending approval">Pending ({pendingProjects})</TabsTrigger>
              {isAdmin && <TabsTrigger value="rejected">Rejected ({rejectedProjects})</TabsTrigger>}
            </TabsList>
          </div>
          
          <TabsContent value="all" className="m-0">
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left p-2">Project</th>
                      <th className="text-left p-2">Committee</th>
                      <th className="text-left p-2">Due Date</th>
                      <th className="text-left p-2">Priority</th>
                      <th className="text-left p-2">Votes</th>
                      <th className="text-left p-2">Status</th>
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
                                  {project.description.length > 40 
                                    ? project.description.substring(0, 40) + "..." 
                                    : project.description}
                                </div>
                              </div>
                            </td>
                            <td className="p-2">
                              {project.committee}
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
                            <td className="p-2">
                              {getVoteCountBadge(project)}
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
                                {!isAdmin && !hasVoted(project) && (
  <Button 
    size="sm" 
    variant="default"
    className="flex items-center gap-1"
    onClick={() => openVoteDialog(project)}
  >
    <ThumbsUp className="h-4 w-4" />
    <span className="hidden sm:inline">Vote</span>
  </Button>
)}
                           {isAdmin && project.status === "Pending Approval" && (
  <div className="flex gap-1">
    <Button 
      size="sm" 
      variant="outline"
      className="flex items-center gap-1 bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
      onClick={() => {
        if (onApprove) onApprove(project);
      }}    >
      <CheckCircle className="h-4 w-4" />
      <span className="hidden sm:inline">Approve</span>
    </Button>
    <Button 
      size="sm" 
      variant="outline"
      className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
      onClick={() => {
        if (onReject) onReject(project);
      }}
          >
      <XCircle className="h-4 w-4" />
      <span className="hidden sm:inline">Reject</span>
    </Button>
  </div>
)}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={7} className="p-4 text-center text-gray-500">
                          No projects found matching your criteria
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </TabsContent>
          
          {!isAdmin && (
            <TabsContent value="to-vote" className="m-0">
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left p-2">Project</th>
                        <th className="text-left p-2">Committee</th>
                        <th className="text-left p-2">Due Date</th>
                        <th className="text-left p-2">Priority</th>
                        <th className="text-left p-2">Votes</th>
                        <th className="text-left p-2">Status</th>
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
                                    {project.description.length > 40 
                                      ? project.description.substring(0, 40) + "..." 
                                      : project.description}
                                  </div>
                                </div>
                              </td>
                              <td className="p-2">
                                {project.committee}
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
                              <td className="p-2">
                                {getVoteCountBadge(project)}
                              </td>
                              <td className="p-2">
                                <Badge className={getStatusBadge(project.status)}>
                                  {project.status}
                                </Badge>
                              </td>
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
                                    variant="default"
                                    className="flex items-center gap-1"
                                    onClick={() => openVoteDialog(project)}
                                  >
                                    <ThumbsUp className="h-4 w-4" />
                                    <span className="hidden sm:inline">Vote</span>
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={7} className="p-4 text-center text-gray-500">
                            No projects found requiring your vote
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </TabsContent>
          )}
          
          <TabsContent value="approved" className="m-0">
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left p-2">Project</th>
                      <th className="text-left p-2">Committee</th>
                      <th className="text-left p-2">Due Date</th>
                      <th className="text-left p-2">Votes</th>
                      <th className="text-left p-2">Implementation</th>
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
                                {project.description.length > 40
                                  ? project.description.substring(0, 40) + "..." 
                                  : project.description}
                              </div>
                            </div>
                          </td>
                          <td className="p-2">
                            {project.committee}
                          </td>
                          <td className="p-2">
                            {project.dueDate.toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </td>
                          <td className="p-2">
                            {getVoteCountBadge(project)}
                          </td>
                          <td className="p-2">
                            {project.implementation ? (
                              <div>
                                <div className="flex justify-between items-center text-xs mb-1">
                                  <span>{project.implementation.status}</span>
                                  <span>{project.implementation.completion}%</span>
                                </div>
                                <Progress value={project.implementation.completion} className={getProgressClass()} />
                              </div>
                            ) : (
                              <span className="text-sm text-gray-500">Not started</span>
                            )}
                          </td>
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
                        <td colSpan={6} className="p-4 text-center text-gray-500">
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
                      <th className="text-left p-2">Committee</th>
                      <th className="text-left p-2">Due Date</th>
                      <th className="text-left p-2">Priority</th>
                      <th className="text-left p-2">Votes</th>
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
                                  {project.description.length > 40 
                                    ? project.description.substring(0, 40) + "..." 
                                    : project.description}
                                </div>
                              </div>
                            </td>
                            <td className="p-2">
                              {project.committee}
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
                            <td className="p-2">
                              {getVoteCountBadge(project)}
                            </td>
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
                                {!isAdmin && !hasVoted(project) && (
  <Button 
    size="sm" 
    variant="default"
    className="flex items-center gap-1"
    onClick={() => openVoteDialog(project)}
  >
    <ThumbsUp className="h-4 w-4" />
    <span className="hidden sm:inline">Vote</span>
  </Button>
)}
                                {isAdmin && (
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
                        <td colSpan={6} className="p-4 text-center text-gray-500">
                          No pending projects found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </TabsContent>
          
          {isAdmin && (
            <TabsContent value="rejected" className="m-0">
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left p-2">Project</th>
                        <th className="text-left p-2">Committee</th>
                        <th className="text-left p-2">Due Date</th>
                        <th className="text-left p-2">Votes</th>
                        <th className="text-left p-2">Rejection Reason</th>
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
                                  {project.description.length > 40 
                                    ? project.description.substring(0, 40) + "..." 
                                    : project.description}
                                </div>
                              </div>
                            </td>
                            <td className="p-2">
                              {project.committee}
                            </td>
                            <td className="p-2">
                              {project.dueDate.toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </td>
                            <td className="p-2">
                              {getVoteCountBadge(project)}
                            </td>
                            <td className="p-2 text-sm text-gray-700">
                              {project.rejectionReason || "No reason provided"}
                            </td>
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
                          <td colSpan={6} className="p-4 text-center text-gray-500">
                            No rejected projects found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </TabsContent>
          )}
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
                  <div className="text-sm mt-2">
                    <span className="text-gray-500">Proposed by: </span>
                    <span className="font-medium">{selectedProject.committee} Committee</span>
                  </div>
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
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Committee Votes</h3>
                  <div className="border rounded-md p-3 bg-gray-50">
                    <div className="flex flex-col gap-2">
                      {selectedProject.votes.map((vote: any, index: number) => {
                        // Get committee info based on committee ID
                        const committeeId = vote.committeeId;
                        const committeeKey = Object.keys(committeeInfoMap).find(key => 
                          committeeInfoMap[key as keyof typeof committeeInfoMap].id === committeeId
                        );
                        
                        const committeeName = committeeKey ? 
                          committeeInfoMap[committeeKey as keyof typeof committeeInfoMap].name : 
                          "Unknown";
                        
                        return (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm">{committeeName} Committee</span>
                            {vote.approved === true ? (
                              <span className="inline-flex items-center text-green-600 text-sm">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approved
                              </span>
                            ) : vote.approved === false ? (
                              <span className="inline-flex items-center text-red-600 text-sm">
                                <XCircle className="h-4 w-4 mr-1" />
                                Rejected
                              </span>
                            ) : (
                              <span className="inline-flex items-center text-gray-500 text-sm">
                                <Clock className="h-4 w-4 mr-1" />
                                Pending
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Committee Comments</h3>
                  <div className="border rounded-md divide-y">
                    {selectedProject.votes.filter((vote: any) => vote.comment).map((vote: any, index: number) => {
                      // Get committee info based on committee ID
                      const committeeId = vote.committeeId;
                      const committeeKey = Object.keys(committeeInfoMap).find(key => 
                        committeeInfoMap[key as keyof typeof committeeInfoMap].id === committeeId
                      );
                      
                      const committeeName = committeeKey ? 
                        committeeInfoMap[committeeKey as keyof typeof committeeInfoMap].name : 
                        "Unknown";
                      
                      return (
                        <div key={index} className="p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{committeeName} Committee</span>
                            {vote.approved === true ? (
                              <Badge className="bg-green-100 border-green-200 text-green-800">Approved</Badge>
                            ) : vote.approved === false ? (
                              <Badge className="bg-red-100 border-red-200 text-red-800">Rejected</Badge>
                            ) : (
                              <Badge className="bg-gray-100 border-gray-200 text-gray-800">Pending</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-700">{vote.comment}</p>
                        </div>
                      );
                    })}
                    
                    {selectedProject.votes.filter((vote: any) => vote.comment).length === 0 && (
                      <div className="p-3 text-center text-sm text-gray-500">
                        No comments provided by committees
                      </div>
                    )}
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
            {!isAdmin && selectedProject && !hasVoted(selectedProject) && (
              <Button variant="default" onClick={() => {
                setShowProjectDetails(false);
                openVoteDialog(selectedProject);
              }}>
                Vote Now
              </Button>
            )}
           {isAdmin && selectedProject && selectedProject.status === "Pending Approval" && (
  <>
    <Button 
      variant="outline"
      className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
      onClick={() => {
        setShowProjectDetails(false);
        if (onApprove) onApprove(selectedProject);
    }}
    >
      <CheckCircle className="h-4 w-4 mr-2" />
      Approve Project
    </Button>
    <Button 
      variant="outline"
      className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
      onClick={() => {
        setShowProjectDetails(false);
        if (onReject) onReject(selectedProject);
    }}
    >
      <XCircle className="h-4 w-4 mr-2" />
      Reject Project
    </Button>
  </>
)}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Vote Dialog */}
      <Dialog open={showVoteDialog} onOpenChange={setShowVoteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Vote on Project Proposal</DialogTitle>
            <DialogDescription>
              {selectedProject && `Cast your committee's vote for "${selectedProject.name}"`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            {selectedProject && (
              <>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-medium">{selectedProject.name}</h3>
                  <p className="text-sm text-gray-700 mt-1">{selectedProject.description}</p>
                  <div className="mt-2 text-xs text-gray-500">
                    <div>Proposed by: {selectedProject.committee} Committee</div>
                    <div>Budget: ₱{selectedProject.budget.toLocaleString()}</div>
                    <div>Due Date: {selectedProject.dueDate.toLocaleDateString()}</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Your Vote</h3>
                  <div className="flex gap-3">
                    <Button 
                      variant={voteStatus === true ? "default" : "outline"}
                      className={`flex-1 ${voteStatus === true ? 'bg-green-600 hover:bg-green-700' : ''}`}
                      onClick={() => setVoteStatus(true)}
                    >
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button 
                      variant={voteStatus === false ? "default" : "outline"}
                      className={`flex-1 ${voteStatus === false ? 'bg-red-600 hover:bg-red-700' : ''}`}
                      onClick={() => setVoteStatus(false)}
                    >
                      <ThumbsDown className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Comment (Optional)</h3>
                  <textarea
                    placeholder="Provide a comment explaining your vote..."
                    rows={3}
                    value={voteComment}
                    onChange={(e) => setVoteComment(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </>
            )}
          </div>
          
          <DialogFooter className="sm:justify-end">
            <Button variant="outline" onClick={() => setShowVoteDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="default" 
              onClick={submitVote}
              disabled={voteStatus === null}
            >
              Submit Vote
            </Button>
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

      {/* Priority Matrix Dialog */}
      <Dialog open={showPriorityMatrix} onOpenChange={setShowPriorityMatrix}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Priority Matrix Explanation</DialogTitle>
            <DialogDescription>
              How projects are categorized based on approvals and due dates
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg bg-red-50">
                <h3 className="font-bold text-red-800 mb-2">Urgent & Important</h3>
                <p className="text-sm">Projects with at least 4 committee approvals and due date within 30 days.</p>
                <p className="text-sm mt-2">These projects require immediate attention and have broad support.</p>
              </div>
              
              <div className="p-4 border rounded-lg bg-yellow-50">
                <h3 className="font-bold text-yellow-800 mb-2">Urgent but Not Important</h3>
                <p className="text-sm">Projects with fewer than 4 committee approvals but due date within 30 days.</p>
                <p className="text-sm mt-2">These projects have deadlines approaching but lack broad committee support.</p>
              </div>
              
              <div className="p-4 border rounded-lg bg-blue-50">
                <h3 className="font-bold text-blue-800 mb-2">Important but Not Urgent</h3>
                <p className="text-sm">Projects with at least 4 committee approvals but due date beyond 30 days.</p>
                <p className="text-sm mt-2">These projects have strong committee support but longer implementation timelines.</p>
              </div>
              
              <div className="p-4 border rounded-lg bg-gray-50">
                <h3 className="font-bold text-gray-800 mb-2">Not Urgent</h3>
                <p className="text-sm">Projects with fewer than 4 committee approvals and due date beyond 30 days.</p>
                <p className="text-sm mt-2">These projects require further committee review and have flexible timelines.</p>
              </div>
            </div>
            
            <Alert className="mt-4 bg-blue-50">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Note on Approvals</AlertTitle>
              <AlertDescription>
                Projects require a minimum of 4 committee approvals to move forward to implementation. Once a project receives votes from all 7 committees, its final status is determined.
              </AlertDescription>
            </Alert>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setShowPriorityMatrix(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}