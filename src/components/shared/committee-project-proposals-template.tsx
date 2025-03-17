"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  CheckCircle,
  FileText,
  Pencil,
  Plus,
  Search,
  ThumbsUp,
  ThumbsDown,
  XCircle,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import UploadProjectModal from "./upload-project-modal";
import { useAuth } from "../providers/auth-provider";
import { supabase } from "@/lib/supabase-client";
import { Textarea } from "../ui/textarea";
import { useCallback } from "react";
import CreateNewProjectModal from "../custom/dashboard/ui-components/CreateNewProject";
import Link from "next/link";

// Define types aligned with your Prisma schema
type VoteStatus = "Approved" | "Rejected";
type ProjectVote = {
  id: string;
  userId: string;
  proposalId: string;
  vote: VoteStatus; // "Approved" or "Rejected"
  votedAt: Date;
  comment: string;
  user: {
    id: string;
    name: string;
    role: string;
  };
};

type Project = {
  id: string;
  name: string; // Maps to title
  description: string;
  committee: string; // Derived from postedBy.role
  committeeId: number; // Derived from role
  budget: number;
  documentTitle: string; // Extracted from fileUrl
  documentUrl: string; // Maps to fileUrl
  dueDate: Date; // Using proposedDate as placeholder
  dateProposed: Date; // Maps to proposedDate
  status: string; // Derived from approvedBy records
  rejectionReason: string | null; // Derived from votes/comments
  votes: ProjectVote[];
  implementation: null; // Not in schema yet
  postedBy: {
    id: string;
    name: string;
    role: string;
  };
};

// Badge and Progress components
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

// Committee info mapping
const committeeInfoMap = {
  CAPTAIN_COMMITTEE: {
    id: 0,
    name: "Captain",
    path: "/captain",
    person: "Benjamin D. Rosin",
    description: "Barangay Captain who oversees all committees.",
    budget: 500000,
    themeColor: "slate",
    progressColor: "bg-slate-500",
    calendarHighlight: "bg-slate-100",
    calendarDot: "bg-slate-50",
  },
  EDUCATION_COMMITTEE: {
    id: 1,
    name: "Education",
    path: "/education",
    person: "Baberly A. De Baguio",
    description: "Responsible for educational programs.",
    budget: 250000,
    themeColor: "blue",
    progressColor: "bg-blue-500",
    calendarHighlight: "bg-blue-100",
    calendarDot: "bg-blue-50",
  },
  ENVIRONMENT_COMMITTEE: {
    id: 2,
    name: "Environment",
    path: "/environment",
    person: "Wilfranz B. Correa",
    description: "Responsible for environmental conservation.",
    budget: 200000,
    themeColor: "green",
    progressColor: "bg-green-500",
    calendarHighlight: "bg-green-100",
    calendarDot: "bg-green-50",
  },
  FINANCE_COMMITTEE: {
    id: 3,
    name: "Finance",
    path: "/finance",
    person: "Emma M. Jadie",
    description: "Responsible for budget management.",
    budget: 300000,
    themeColor: "amber",
    progressColor: "bg-amber-500",
    calendarHighlight: "bg-amber-100",
    calendarDot: "bg-amber-50",
  },
  HEALTH_SERVICES_COMMITTEE: {
    id: 4,
    name: "HealthServices",
    path: "/health",
    person: "Edna J. Padre",
    description: "Responsible for health initiatives.",
    budget: 280000,
    themeColor: "red",
    progressColor: "bg-red-500",
    calendarHighlight: "bg-red-100",
    calendarDot: "bg-red-50",
  },
  PEACE_ORDER_COMMITTEE: {
    id: 5,
    name: "PeaceOrder",
    path: "/peace-order",
    person: "Francis Alejo",
    description: "Responsible for maintaining peace and order.",
    budget: 180000,
    themeColor: "purple",
    progressColor: "bg-purple-500",
    calendarHighlight: "bg-purple-100",
    calendarDot: "bg-purple-50",
  },
  PUBLIC_WORKS_COMMITTEE: {
    id: 6,
    name: "PublicWorks",
    path: "/public-works",
    person: "Roderick A. Madronio",
    description: "Responsible for infrastructure projects.",
    budget: 350000,
    themeColor: "indigo",
    progressColor: "bg-indigo-500",
    calendarHighlight: "bg-indigo-100",
    calendarDot: "bg-indigo-50",
  },
  WOMEN_COMMITTEE: {
    id: 7,
    name: "Women",
    path: "/women",
    person: "Emma M. Jadie",
    description: "Responsible for women's rights and family programs.",
    budget: 220000,
    themeColor: "pink",
    progressColor: "bg-pink-500",
    calendarHighlight: "bg-pink-100",
    calendarDot: "bg-pink-50",
  },
};

// Role to committee mapping
const roleToCommittee = {
  Admin: { name: "Captain", id: 0 },
  Education: { name: "Education", id: 1 },
  Environment: { name: "Environment", id: 2 },
  Finance: { name: "Finance", id: 3 },
  HealthServices: { name: "Health", id: 4 },
  PeaceOrder: { name: "Peace & Order", id: 5 },
  PublicWorks: { name: "Public Works", id: 6 },
  Women: { name: "Women & Family", id: 7 },
};

// Corrected action buttons rendering function to be used in all table views
const renderActionButtons = (
  project: Project,
  isAdmin: boolean,
  user: any,
  hasVoted: (project: Project) => boolean,
  openProjectDetails: (project: Project) => void,
  openEditProject: (project: Project) => void,
  openVoteDialog: (project: Project) => void,
  onApprove?: (project: Project) => void,
  onReject?: (project: Project) => void
) => {
  // Always show Details button for all projects
  const detailsButton = (
    <Button
      size="sm"
      variant="outline"
      className="flex items-center gap-1"
      onClick={() => openProjectDetails(project)}
    >
      <FileText className="h-4 w-4" />
      <span className="hidden sm:inline">Details</span>
    </Button>
  );

  // For rejected or approved projects, only show details button
  if (project.status === "Rejected" || project.status === "Approved") {
    return <div className="flex justify-center gap-2">{detailsButton}</div>;
  }

  return (
    <div className="flex justify-center gap-2">
      {detailsButton}

      {/* Edit button: only for pending projects where user is the author */}
      {!isAdmin &&
        project.postedBy.id === user.id &&
        project.status === "Pending" && (
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-1"
            onClick={() => openEditProject(project)}
          >
            <Pencil className="h-4 w-4" />
            <span className="hidden sm:inline">Edit</span>
          </Button>
        )}

      {/* Vote button: only for pending projects where user hasn't voted yet (regardless of authorship) */}
      {!isAdmin && !hasVoted(project) && project.status === "Pending" && (
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

      {/* Admin approve/reject buttons: only for pending projects */}
      {isAdmin && project.status === "Pending" && (
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-1 bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
            onClick={() => {
              if (onApprove) onApprove(project);
            }}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
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
            <XCircle className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Reject</span>
          </Button>
        </div>
      )}
    </div>
  );
};

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
  const [voteStatus, setVoteStatus] = useState<boolean>(false);
  const [voteComment, setVoteComment] = useState("");
  const [showPriorityMatrix, setShowPriorityMatrix] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [votes, setVotes] = useState<any[]>([]);
  const { user } = useAuth();

  // Fetch projects
  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/project-proposal/fetch-proposal");
      if (!res.ok) throw new Error("Failed to fetch projects");
      const rawProjects = await res.json();

      const mappedProjects: Project[] = rawProjects.map((p: any) => {
        const committeeObj = roleToCommittee[
          p.postedBy?.role as keyof typeof roleToCommittee
        ] || {
          name: "Unknown",
          id: -1,
        };

        const votes = Array.isArray(p.votes) ? p.votes : [];
        const mappedVotes = votes.map((v: any) => ({
          id: v.id || "unknown-vote-id",
          userId: v.userId || "unknown-user-id",
          proposalId: v.proposalId || p.id || "unknown-proposal-id",
          vote: v.vote,
          votedAt: new Date(v.votedAt || new Date()),
          comment: v.comment || "",
          user: {
            id: v.user?.id || "unknown-user-id",
            name: v.user?.name || "Unknown User",
            role: v.user?.role || "Unknown Role",
          },
        }));

        const approvalStatuses = Array.isArray(p.approvedBy)
          ? p.approvedBy.map((approval: any) => approval.status)
          : [];
        let status = "Pending";
        if (approvalStatuses.includes("Rejected")) {
          status = "Rejected";
        } else if (approvalStatuses.includes("Approved")) {
          status = "Approved";
        }

        return {
          id: p.id || "unknown-id",
          name: p.title || "Untitled Project",
          description: p.description || "",
          committee: committeeObj.name,
          committeeId: committeeObj.id,
          budget: p.budget || 0,
          documentTitle: p.fileUrl
            ? p.fileUrl.split("/").pop() || "Document"
            : "Document",
          documentUrl: p.fileUrl || "",
          dueDate: new Date(p.proposedDate || new Date()),
          dateProposed: new Date(p.proposedDate || new Date()),
          status,
          rejectionReason:
            mappedVotes.find((v: any) => v.vote === "Rejected")?.comment ||
            null,
          votes: mappedVotes,
          implementation: null,
          postedBy: {
            id: p.postedBy?.id || "unknown-poster-id",
            name: p.postedBy?.name || "Unknown User",
            role: p.postedBy?.role || "Unknown Role",
          },
        };
      });

      console.log("Mapped projects:", mappedProjects);
      setProjects(mappedProjects);
    } catch (err) {
      setError("Failed to load projects. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Sync initialTab
  useEffect(() => {
    if (initialTab && initialTab !== "all") {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const committeeInfo =
    committeeInfoMap[committee as keyof typeof committeeInfoMap];
  const projectProposals = isAdmin ? projects : projects.filter(() => true);

  // Memoize filtered projects based on search and tab
  const filteredProjects = useMemo(() => {
    return projectProposals.filter((project) => {
      const matchesSearch =
        !searchTerm ||
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      if (activeTab === "to-vote" && !isAdmin) {
        const committeeVote = project.votes.find(
          (vote) => vote.user.role === committeeInfo.name.replace(" & ", "")
        );
        return !committeeVote;
      }

      if (activeTab === "all" || activeTab === "to-vote") return true;
      return project.status.toLowerCase() === activeTab.toLowerCase();
    });
  }, [projectProposals, searchTerm, activeTab, isAdmin, committeeInfo.name]);

  // Statistics
  const totalProjects = projectProposals.length;
  const approvedProjects = projectProposals.filter(
    (p) => p.status === "Approved"
  ).length;
  const pendingProjects = projectProposals.filter(
    (p) => p.status === "Pending"
  ).length;
  const rejectedProjects = projectProposals.filter(
    (p) => p.status === "Rejected"
  ).length;
  const toVoteProjects = !isAdmin
    ? projectProposals.filter(
        (project) =>
          !project.votes.some(
            (vote) => vote.user.role === committeeInfo.name.replace(" & ", "")
          )
      ).length
    : 0;

  // Determine priority based on approval count and due date.
  const determinePriority = (project: Project) => {
    const approvalCount = project.votes.filter(
      (vote) => vote.vote === "Approved"
    ).length;
    const now = new Date();
    const daysUntilDue = Math.ceil(
      (project.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (project.status === "Approved") {
      return {
        level: "Approved",
        badge: "bg-green-100 border-green-200 text-green-800",
      };
    }
    if (project.status === "Rejected") {
      return {
        level: "Rejected",
        badge: "bg-red-100 border-red-200 text-red-800",
      };
    }
    if (approvalCount >= 4 && daysUntilDue <= 30) {
      return {
        level: "Urgent & Important",
        badge: "bg-red-100 border-red-200 text-red-800",
      };
    }
    if (approvalCount < 4 && daysUntilDue <= 30) {
      return {
        level: "Urgent but Not Important",
        badge: "bg-yellow-100 border-yellow-200 text-yellow-800",
      };
    }
    if (approvalCount >= 4 && daysUntilDue > 30) {
      return {
        level: "Important but Not Urgent",
        badge: "bg-blue-100 border-blue-200 text-blue-800",
      };
    }
    return {
      level: "Neither Urgent nor Important",
      badge: "bg-gray-100 border-gray-200 text-gray-800",
    };
  };

  const openProjectDetails = (project: Project) => {
    setSelectedProject(project);
    setShowProjectDetails(true);
  };

  const openEditProject = (project: Project) => {
    setSelectedProject(project);
    setShowCreateProject(true);
  };

  const openVoteDialog = (project: Project) => {
    setSelectedProject(project);
    setVoteComment("");
    setShowVoteDialog(true);
  };

  // When submitVote is clicked, we send vote as the passed vote type ("Approved" or "Rejected")
  const submitVote = async (voteType: VoteStatus) => {
    if (!selectedProject) return;
    try {
      setLoading(true);
      const currentUserId = user.id;
      if (!currentUserId) {
        throw new Error("Cannot determine user ID for vote.");
      }
      const response = await fetch("/api/project-proposal/updateVote", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proposalId: selectedProject.id,
          vote: voteType,
          userId: currentUserId,
          comment: voteComment,
        }),
      });
      const responseText = await response.text();
      console.log("Raw response:", responseText);
      if (!response.ok) {
        throw new Error(
          `Server error: ${response.status} ${response.statusText} - ${responseText}`
        );
      }
      // Hide the vote dialog
      setShowVoteDialog(false);
      // Re-fetch projects to update the list after vote submission
      await fetchProjects();
    } catch (error) {
      console.error("Vote submission failed:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to submit vote. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 border-green-200 text-green-800";
      case "Pending":
        return "bg-blue-100 border-blue-200 text-blue-800";
      case "Rejected":
        return "bg-red-100 border-red-200 text-red-800";
      default:
        return "bg-gray-100 border-gray-200 text-gray-800";
    }
  };

  const getVoteCountBadge = (project: Project) => {
    const approvalCount = project.votes.filter(
      (vote) => vote.vote === "Approved"
    ).length;
    const rejectionCount = project.votes.filter(
      (vote) => vote.vote === "Rejected"
    ).length;
    const pendingCount = 7 - (approvalCount + rejectionCount); // Assuming 7 committees
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

  const hasVoted = (project: Project) => {
    if (isAdmin) return true;
    return project.votes.some(
      (vote) => vote.user.role === committeeInfo.name.replace(" & ", "")
    );
  };

  const getProgressClass = () => committeeInfo.progressColor || "bg-blue-500";

  if (loading) {
    return <div>Loading projects...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {isAdmin ? "All" : committeeInfo.name} Committee Project Proposals
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowPriorityMatrix(true)}>
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
              <span className="text-sm text-gray-500">Projects</span>
              <span className="text-2xl font-bold">{totalProjects}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Approved</span>
              <span className="text-2xl font-bold text-green-600">
                {approvedProjects}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Pending</span>
              <span className="text-2xl font-bold text-blue-600">
                {pendingProjects}
              </span>
            </div>
          </CardContent>
        </Card>
        {isAdmin ? (
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Rejected</span>
                <span className="text-2xl font-bold text-red-600">
                  {rejectedProjects}
                </span>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Needs Your Vote</span>
                <span className="text-2xl font-bold text-yellow-600">
                  {toVoteProjects}
                </span>
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
                {isAdmin
                  ? "All project proposals from all committees"
                  : `All project proposals requiring ${committeeInfo.name} Committee input`}
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
              <TabsTrigger value="all">
                All ({projectProposals.length})
              </TabsTrigger>
              {!isAdmin && (
                <TabsTrigger value="to-vote">
                  To Vote ({toVoteProjects})
                </TabsTrigger>
              )}
              <TabsTrigger value="approved">
                Approved ({approvedProjects})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({pendingProjects})
              </TabsTrigger>
              {isAdmin && (
                <TabsTrigger value="rejected">
                  Rejected ({rejectedProjects})
                </TabsTrigger>
              )}
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
                          <tr
                            key={project.id}
                            className="border-t hover:bg-gray-50"
                          >
                            <td className="p-2">
                              <div>
                                <div className="font-medium">
                                  {project.name}
                                </div>
                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                  {project.description.length > 40
                                    ? project.description.substring(0, 40) +
                                      "..."
                                    : project.description}
                                </div>
                              </div>
                            </td>
                            <td className="p-2">{project.committee}</td>
                            <td className="p-2">
                              {project.dueDate.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                              <div className="text-xs text-gray-500">
                                {Math.ceil(
                                  (project.dueDate.getTime() -
                                    new Date().getTime()) /
                                    (1000 * 60 * 60 * 24)
                                )}{" "}
                                days left
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
                              {renderActionButtons(
                                project,
                                isAdmin,
                                user,
                                hasVoted,
                                openProjectDetails,
                                openEditProject,
                                openVoteDialog,
                                onApprove,
                                onReject
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={7}
                          className="p-4 text-center text-gray-500"
                        >
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
                            <tr
                              key={project.id}
                              className="border-t hover:bg-gray-50"
                            >
                              <td className="p-2">
                                <div>
                                  <div className="font-medium">
                                    {project.name}
                                  </div>
                                  <div className="text-sm text-gray-500 truncate max-w-xs">
                                    {project.description.length > 40
                                      ? project.description.substring(0, 40) +
                                        "..."
                                      : project.description}
                                  </div>
                                </div>
                              </td>
                              <td className="p-2">{project.committee}</td>
                              <td className="p-2">
                                {project.dueDate.toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                                <div className="text-xs text-gray-500">
                                  {Math.ceil(
                                    (project.dueDate.getTime() -
                                      new Date().getTime()) /
                                      (1000 * 60 * 60 * 24)
                                  )}{" "}
                                  days left
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
                                <Badge
                                  className={getStatusBadge(project.status)}
                                >
                                  {project.status}
                                </Badge>
                              </td>
                              <td className="p-2">
                                {renderActionButtons(
                                  project,
                                  isAdmin,
                                  user,
                                  hasVoted,
                                  openProjectDetails,
                                  openEditProject,
                                  openVoteDialog,
                                  onApprove,
                                  onReject
                                )}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td
                            colSpan={7}
                            className="p-4 text-center text-gray-500"
                          >
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
                        <tr
                          key={project.id}
                          className="border-t hover:bg-gray-50"
                        >
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
                          <td className="p-2">{project.committee}</td>
                          <td className="p-2">
                            {project.dueDate.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </td>
                          <td className="p-2">{getVoteCountBadge(project)}</td>
                          <td className="p-2">
                            <span className="text-sm text-gray-500">
                              Not started
                            </span>
                          </td>
                          <td className="p-2">
                            {renderActionButtons(
                              project,
                              isAdmin,
                              user,
                              hasVoted,
                              openProjectDetails,
                              openEditProject,
                              openVoteDialog,
                              onApprove,
                              onReject
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="p-4 text-center text-gray-500"
                        >
                          No approved projects found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </TabsContent>

          <TabsContent value="pending" className="m-0">
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
                          <tr
                            key={project.id}
                            className="border-t hover:bg-gray-50"
                          >
                            <td className="p-2">
                              <div>
                                <div className="font-medium">
                                  {project.name}
                                </div>
                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                  {project.description.length > 40
                                    ? project.description.substring(0, 40) +
                                      "..."
                                    : project.description}
                                </div>
                              </div>
                            </td>
                            <td className="p-2">{project.committee}</td>
                            <td className="p-2">
                              {project.dueDate.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                              <div className="text-xs text-gray-500">
                                {Math.ceil(
                                  (project.dueDate.getTime() -
                                    new Date().getTime()) /
                                    (1000 * 60 * 60 * 24)
                                )}{" "}
                                days left
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
                              {renderActionButtons(
                                project,
                                isAdmin,
                                user,
                                hasVoted,
                                openProjectDetails,
                                openEditProject,
                                openVoteDialog,
                                onApprove,
                                onReject
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="p-4 text-center text-gray-500"
                        >
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
                          <tr
                            key={project.id}
                            className="border-t hover:bg-gray-50"
                          >
                            <td className="p-2">
                              <div>
                                <div className="font-medium">
                                  {project.name}
                                </div>
                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                  {project.description.length > 40
                                    ? project.description.substring(0, 40) +
                                      "..."
                                    : project.description}
                                </div>
                              </div>
                            </td>
                            <td className="p-2">{project.committee}</td>
                            <td className="p-2">
                              {project.dueDate.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </td>
                            <td className="p-2">
                              {getVoteCountBadge(project)}
                            </td>
                            <td className="p-2 text-sm text-gray-700">
                              {project.rejectionReason || "No reason provided"}
                            </td>
                            <td className="p-2">
                              {renderActionButtons(
                                project,
                                isAdmin,
                                user,
                                hasVoted,
                                openProjectDetails,
                                openEditProject,
                                openVoteDialog,
                                onApprove,
                                onReject
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={6}
                            className="p-4 text-center text-gray-500"
                          >
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
        <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Project Details</DialogTitle>
            <DialogDescription>
              {selectedProject &&
                `Detailed information for "${selectedProject.name}"`}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 overflow-y-auto flex-grow pr-2">
            {selectedProject && (
              <div className="space-y-6">
                {/* Project Info Section */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">
                    Project Information
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-md border">
                    <p className="font-medium text-lg mb-2">
                      {selectedProject.name}
                    </p>
                    <p className="text-sm text-gray-700 mb-4">
                      {selectedProject.description}
                    </p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <div>
                        <span className="text-gray-500">Proposed by: </span>
                        <span className="font-medium">
                          {selectedProject.postedBy.name} (
                          {selectedProject.committee})
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Status: </span>
                        <span className="font-medium">
                          <Badge
                            className={getStatusBadge(selectedProject.status)}
                          >
                            {selectedProject.status}
                          </Badge>
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Budget: </span>
                        <span className="font-medium">
                          ₱{selectedProject.budget.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Committee: </span>
                        <span className="font-medium">
                          {selectedProject.committee}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Due Date: </span>
                        <span className="font-medium">
                          {selectedProject.dueDate.toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Proposed Date: </span>
                        <span className="font-medium">
                          {selectedProject.dateProposed.toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Document Section */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">
                    Project Document
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-md border">
                    <div className="flex items-center">
                      <FileText className="h-6 w-6 text-blue-600 mr-2" />
                      <div>
                        <p className="font-medium">
                          {selectedProject.documentTitle}
                        </p>
                        {selectedProject.documentUrl && (
                          <Link
                            href={selectedProject.documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            View Document
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Votes Section */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">
                    Committee Votes ({selectedProject.votes.length})
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-md border">
                    {selectedProject.votes.length > 0 ? (
                      <div className="space-y-3">
                        {selectedProject.votes.map((vote) => (
                          <div
                            key={vote.id}
                            className="flex items-center justify-between border-b pb-2 last:border-b-0"
                          >
                            <div>
                              <p className="font-medium">{vote.user.name}</p>
                              <p className="text-xs text-gray-500">
                                {vote.user.role} Committee
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                Voted on{" "}
                                {new Date(vote.votedAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </p>
                              {vote.comment && (
                                <>
                                  <p className="font-medium text-md text-gray-500">
                                    Comment :
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {vote.comment}
                                  </p>
                                </>
                              )}
                            </div>
                            <div className="flex items-center">
                              {vote.vote === "Approved" ? (
                                <span className="inline-flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                                  <ThumbsUp className="h-4 w-4 mr-1" /> Approved
                                </span>
                              ) : (
                                <span className="inline-flex items-center bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">
                                  <ThumbsDown className="h-4 w-4 mr-1" />{" "}
                                  Rejected
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No votes yet.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setShowProjectDetails(false)}
            >
              Close
            </Button>

            {/* Only show Vote Now button for pending projects where user hasn't voted yet */}
            {!isAdmin &&
              selectedProject &&
              !hasVoted(selectedProject) &&
              selectedProject.status === "Pending" && (
                <Button
                  variant="default"
                  onClick={() => {
                    setShowProjectDetails(false);
                    openVoteDialog(selectedProject);
                  }}
                >
                  Vote Now
                </Button>
              )}

            {/* Only show approve/reject buttons for admin on pending projects */}
            {isAdmin &&
              selectedProject &&
              selectedProject.status === "Pending" && (
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
              {selectedProject &&
                `Casting your approval vote for "${selectedProject.name}"`}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {selectedProject && (
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="font-medium">{selectedProject.name}</h3>
                <p className="text-sm text-gray-700 mt-1">
                  {selectedProject.description}
                </p>
                <div className="mt-2 text-xs text-gray-500">
                  <div>Proposed by: {selectedProject.committee} Committee</div>
                  <div>Budget: ₱{selectedProject.budget.toLocaleString()}</div>
                  <div>
                    Due Date: {selectedProject.dueDate.toLocaleDateString()}
                  </div>
                </div>
              </div>
            )}

            <Textarea
              placeholder="Comment"
              value={voteComment}
              onChange={(e) => setVoteComment(e.target.value)}
            />
          </div>
          <DialogFooter className="sm:justify-end">
            <Button variant="outline" onClick={() => setShowVoteDialog(false)}>
              Cancel
            </Button>
            <Button variant="default" onClick={() => submitVote("Approved")}>
              {loading ? "Approving..." : "Approve"}
            </Button>
            <Button variant="default" onClick={() => submitVote("Rejected")}>
              {loading ? "Rejecting..." : "Reject"}
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
                <h3 className="font-bold text-red-800 mb-2">
                  Urgent & Important
                </h3>
                <p className="text-sm">
                  Projects with at least 4 approvals and due within 30 days.
                </p>
              </div>
              <div className="p-4 border rounded-lg bg-yellow-50">
                <h3 className="font-bold text-yellow-800 mb-2">
                  Urgent but Not Important
                </h3>
                <p className="text-sm">
                  Projects with fewer than 4 approvals but due within 30 days.
                </p>
              </div>
              <div className="p-4 border rounded-lg bg-blue-50">
                <h3 className="font-bold text-blue-800 mb-2">
                  Important but Not Urgent
                </h3>
                <p className="text-sm">
                  Projects with at least 4 approvals but due beyond 30 days.
                </p>
              </div>
              <div className="p-4 border rounded-lg bg-gray-50">
                <h3 className="font-bold text-gray-800 mb-2">Not Urgent</h3>
                <p className="text-sm">
                  Projects with fewer than 4 approvals and due beyond 30 days.
                </p>
              </div>
            </div>
            <Alert className="mt-4 bg-blue-50">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Note on Approvals</AlertTitle>
              <AlertDescription>
                Projects require a minimum of 4 approvals to move forward.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowPriorityMatrix(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Project Modal */}

      <CreateNewProjectModal
        isOpen={showCreateProject}
        onClose={() => {
          setShowCreateProject(false);
          setSelectedProject(null);
        }}
        project={
          selectedProject
            ? {
                ...selectedProject,
                title: selectedProject.name,
                proposedDate: selectedProject.dateProposed.toISOString(),
                fileUrl: selectedProject.documentUrl,
                postedById: selectedProject.postedBy.id,
              }
            : null
        }
        isEditing={selectedProject !== null}
      />
    </div>
  );
}
