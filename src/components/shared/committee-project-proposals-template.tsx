"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useAuth } from "../providers/auth-provider";
import CreateNewProjectModal from "../custom/dashboard/ui-components/CreateNewProject";
import PriorityMatrixDialog from "../custom/admin/Committee-projects-components/PriorityMatrix";
import VoteDialog from "../custom/admin/Committee-projects-components/VoteDialog";
import ProjectDetailsDialog, {
  Project,
} from "../custom/admin/Committee-projects-components/ProjectDetails";
import ActionButtons from "../custom/admin/Committee-projects-components/ActionButton";
import Badge from "../custom/admin/Committee-projects-components/Badge";
import {
  committeeInfoMap,
  determinePriority,
  getStatusBadge,
  getVoteCountBadge,
  roleToCommittee,
} from "../custom/admin/Committee-projects-components/ProjectUtiliry";

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
  const [showPriorityMatrix, setShowPriorityMatrix] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Default to 5 items per page
  const rowsPerPageOptions = [5, 10, 25, 50]; // Available options for rows per page

  const { user } = useAuth();

  const committeeInfo =
    committeeInfoMap[committee as keyof typeof committeeInfoMap];

  // Define hasVoted function BEFORE using it in useMemo
  const hasVoted = useCallback(
    (project: Project) => {
      if (isAdmin) return true;
      return project.votes.some(
        (vote) => vote.user.role === committeeInfo?.name?.replace(" & ", "")
      );
    },
    [isAdmin, committeeInfo?.name]
  );

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

  // Reset pagination when tab, search, or items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm, itemsPerPage]);

  const projectProposals = isAdmin ? projects : projects.filter(() => true);

  // Memoize filtered projects based on search and tab
  const filteredProjects = useMemo(() => {
    return projectProposals.filter((project) => {
      const matchesSearch =
        !searchTerm ||
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      if (activeTab === "all") return true;
      return project.status.toLowerCase() === activeTab.toLowerCase();
    });
  }, [projectProposals, searchTerm, activeTab]);

  // Get current page projects
  const currentProjects = useMemo(() => {
    const indexOfLastProject = currentPage * itemsPerPage;
    const indexOfFirstProject = indexOfLastProject - itemsPerPage;
    return filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
  }, [filteredProjects, currentPage, itemsPerPage]);

  // Calculate total number of pages
  const totalPages = Math.max(
    1,
    Math.ceil(filteredProjects.length / itemsPerPage)
  );

  // Generate page numbers for pagination
  const pageNumbers = useMemo(() => {
    // Explicitly define the type for pages array to include both numbers and string
    const pages: Array<number | "ellipsis"> = [];
    const maxPagesToShow = 5; // Maximum number of page links to display

    if (totalPages <= maxPagesToShow) {
      // If fewer pages than max, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Complex pagination with ellipsis
      if (currentPage <= 3) {
        // Near the start
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Somewhere in the middle
        pages.push(1);
        pages.push("ellipsis");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }

    return pages;
  }, [currentPage, totalPages]);

  // Pagination functions
  const goToPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    },
    [totalPages]
  );

  const goToPreviousPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  }, [currentPage]);

  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  }, [currentPage, totalPages]);

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
    setShowVoteDialog(true);
  };

  // When submitVote is clicked, we send vote as the passed vote type ("Approved" or "Rejected")
  const submitVote = async (
    voteType: "Approved" | "Rejected",
    comment: string
  ) => {
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
          comment,
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

  if (loading) {
    return <div>Loading projects...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  // Dynamically determine which columns to display based on the active tab
  const getColumnsForTab = (tab: string) => {
    // Default columns for most tabs
    const defaultColumns = [
      { key: "project", header: "Project" },
      { key: "committee", header: "Committee" },
      { key: "dueDate", header: "Due Date" },
    ];

    // Additional columns based on tab
    const tabSpecificColumns: Record<
      string,
      Array<{ key: string; header: string }>
    > = {
      all: [
        ...defaultColumns,
        { key: "priority", header: "Priority" },
        { key: "status", header: "Status" },
        { key: "actions", header: "Actions" },
      ],
      pending: [
        ...defaultColumns,
        { key: "priority", header: "Priority" },
        { key: "actions", header: "Actions" },
      ],
      approved: [
        ...defaultColumns,
        { key: "implementation", header: "Implementation" },
        { key: "actions", header: "Actions" },
      ],
      rejected: [
        ...defaultColumns,
        { key: "rejectionReason", header: "Rejection Reason" },
        { key: "actions", header: "Actions" },
      ],
    };

    return tabSpecificColumns[tab] || defaultColumns;
  };

  // Get columns for the current active tab
  const columns = getColumnsForTab(activeTab);

  // Render cell content based on column key and project
  const renderCellContent = (
    project: Project,
    columnKey: string,
    index: number
  ) => {
    const priority = determinePriority(project);
    // Calculate the absolute index based on pagination
    const absoluteIndex = (currentPage - 1) * itemsPerPage + index;

    switch (columnKey) {
      case "project":
        return (
          <div>
            <div className="font-medium">{project.name}</div>
            <div className="text-sm text-gray-500 truncate max-w-xs">
              {project.description.length > 40
                ? project.description.substring(0, 40) + "..."
                : project.description}
            </div>
          </div>
        );
      case "committee":
        return project.committee;
      case "dueDate":
        return (
          <div>
            {project.dueDate.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
            {activeTab !== "approved" && activeTab !== "rejected" && (
              <div className="text-xs text-gray-500">
                {Math.ceil(
                  (project.dueDate.getTime() - new Date().getTime()) /
                    (1000 * 60 * 60 * 24)
                )}{" "}
                days left
              </div>
            )}
          </div>
        );
      case "priority":
        return <Badge className={priority.badge}>{absoluteIndex + 1}</Badge>;
      case "status":
        return (
          <Badge className={getStatusBadge(project.status)}>
            {project.status === "Pending"
              ? "Pending"
              : project.status === "Approved"
              ? "Approved"
              : "Disapprove"}
          </Badge>
        );
      case "votes":
        return getVoteCountBadge(project);
      case "implementation":
        return <span className="text-sm text-gray-500">Not started</span>;
      case "rejectionReason":
        return (
          <span className="text-sm text-gray-700">
            {project.rejectionReason || "No reason provided"}
          </span>
        );
      case "actions":
        return (
          <ActionButtons
            project={project}
            isAdmin={isAdmin}
            user={user}
            hasVoted={hasVoted}
            openProjectDetails={openProjectDetails}
            openEditProject={openEditProject}
            openVoteDialog={openVoteDialog}
            onApprove={onApprove}
            onReject={onReject}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {isAdmin ? "All" : committeeInfo?.name} Committee Project Proposals
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

      {/* Project List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <CardTitle>Project Proposals</CardTitle>
              <CardDescription>
                {isAdmin
                  ? "All project proposals from all committees"
                  : `All project proposals requiring ${committeeInfo?.name} Committee input`}
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
            <TabsList
              className="grid w-full"
              style={{
                gridTemplateColumns: "repeat(4, 1fr)",
              }}
            >
              <TabsTrigger value="all">All ({totalProjects})</TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({pendingProjects})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved ({approvedProjects})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected ({rejectedProjects})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="m-0">
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {columns.map((column) => (
                        <TableHead key={column.key} className="w-1/6">
                          {column.header}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentProjects.length > 0 ? (
                      currentProjects.map((project, index) => (
                        <TableRow key={project.id} className="hover:bg-gray-50">
                          {columns.map((column) => (
                            <TableCell
                              key={`${project.id}-${column.key}`}
                              className="p-2"
                            >
                              {renderCellContent(project, column.key, index)}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={columns.length}
                          className="h-32 p-4 text-center text-gray-500"
                        >
                          {activeTab === "approved"
                            ? "No approved projects found"
                            : activeTab === "rejected"
                            ? "No rejected projects found"
                            : activeTab === "pending"
                            ? "No pending projects found"
                            : "No projects found matching your criteria"}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>

                <div className="py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <span>Rows per page:</span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => setItemsPerPage(Number(e.target.value))}
                      className="border rounded p-1"
                    >
                      {rowsPerPageOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  {filteredProjects.length > itemsPerPage && (
                    <div className="">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={goToPreviousPage}
                              className={
                                currentPage === 1
                                  ? "pointer-events-none opacity-50"
                                  : "cursor-pointer"
                              }
                            />
                          </PaginationItem>

                          {pageNumbers.map((page, index) => (
                            <PaginationItem key={`page-${index}`}>
                              {page === "ellipsis" ? (
                                <PaginationEllipsis />
                              ) : (
                                <PaginationLink
                                  isActive={currentPage === page}
                                  onClick={() => goToPage(page)}
                                >
                                  {page}
                                </PaginationLink>
                              )}
                            </PaginationItem>
                          ))}

                          <PaginationItem>
                            <PaginationNext
                              onClick={goToNextPage}
                              className={
                                currentPage === totalPages
                                  ? "pointer-events-none opacity-50"
                                  : "cursor-pointer"
                              }
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </div>
              </div>

              {/* Pagination Component */}
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Project Details Dialog */}
      <ProjectDetailsDialog
        open={showProjectDetails}
        onOpenChange={setShowProjectDetails}
        selectedProject={selectedProject}
        isAdmin={isAdmin}
        hasVoted={hasVoted}
        openVoteDialog={openVoteDialog}
        onApprove={onApprove}
        onReject={onReject}
      />

      {/* Vote Dialog */}
      <VoteDialog
        open={showVoteDialog}
        onOpenChange={setShowVoteDialog}
        selectedProject={selectedProject}
        onVote={submitVote}
        loading={loading}
      />

      {/* Priority Matrix Dialog */}
      <PriorityMatrixDialog
        open={showPriorityMatrix}
        onOpenChange={setShowPriorityMatrix}
      />

      {/* Create Project Modal */}
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
