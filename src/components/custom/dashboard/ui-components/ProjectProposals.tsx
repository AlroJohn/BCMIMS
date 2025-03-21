"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, Pencil, Plus } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { format } from "date-fns";
import { toast } from "sonner";
import CreateNewProjectModal from "./CreateNewProject";
import ProjectCalendar from "./ProjectCalendar";
import Link from "next/link";

// Define types for our data
type User = {
  id: string;
  name: string;
  role: string;
};

type Vote = {
  id: string;
  userId: string;
  proposalId: string;
  vote: "Approved" | "Rejected";
  votedAt: string;
  comment: string;
  user: User;
};

type Approval = {
  id: string;
  updatedAt: string;
  userId: string;
  status: "Pending" | "Approved" | "Rejected";
  comment?: string;
  proposalId: string;
  approvedBy: User;
  createdAt?: string;
};

type ProjectProposalType = {
  id: string;
  title: string;
  description: string;
  proposedDate: string;
  fileUrl: string;
  postedById: string;
  budget: number;
  postedBy: User;
  approvedBy: Approval[];
  votes: Vote[];
  createdAt?: string;
  committee: string;
  implementation?: {
    status: string;
    completion: number;
  };
  // No static status field; computed dynamically
};

const ProjectProposals = () => {
  const { user, role } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projectProposals, setProjectProposals] = useState<
    ProjectProposalType[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] =
    useState<ProjectProposalType | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const params = useParams();
  const searchParams = useSearchParams();

  const formatCommitteeParam = (param: string): string => {
    if (!param) return "";
    return param
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join("");
  };

  const rawCommitteeParam =
    (params?.committee as string) || searchParams.get("committee") || "";
  const committeeParam = formatCommitteeParam(rawCommitteeParam);

  useEffect(() => {
    fetchProposals();
  }, [committeeParam]);

  const fetchProposals = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/project-proposal/fetch-proposal");
      if (!response.ok) throw new Error("Failed to fetch proposals");

      const data = await response.json();
      const currentUserRole = role;
      const userId = user?.id;
      const isAdmin = currentUserRole === "Admin";

      const filteredData = data.filter((proposal: ProjectProposalType) => {
        if (proposal.postedById === userId) return true;
        if (isAdmin && committeeParam)
          return proposal.committee === committeeParam;
        if (isAdmin && !committeeParam) return true;
        if (currentUserRole === proposal.committee) return true;
        return false;
      });

      const enhancedData = filteredData.map((proposal: ProjectProposalType) => {
        const isApproved = getProposalStatus(proposal) === "Approved";
        if (isApproved) {
          const approvalDate = proposal.approvedBy.find(
            (a) => a.status === "Approved"
          )?.updatedAt;
          const daysSinceApproval = approvalDate
            ? Math.floor(
                (Date.now() - new Date(approvalDate).getTime()) /
                  (1000 * 60 * 60 * 24)
              )
            : 0;

          let implementationStatus = "Scheduled";
          let completion = 0;
          if (daysSinceApproval > 30) {
            implementationStatus = "Completed";
            completion = 100;
          } else if (daysSinceApproval > 5) {
            implementationStatus = "In Progress";
            completion = Math.min(
              Math.floor((daysSinceApproval / 30) * 100),
              95
            );
          }

          return {
            ...proposal,
            implementation: { status: implementationStatus, completion },
          };
        }
        return proposal;
      });

      setProjectProposals(enhancedData);
    } catch (err) {
      console.error("Error fetching proposals:", err);
      setError("Failed to load project proposals");
      toast.error("Failed to load project proposals");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = () => {
    setSelectedProject(null);
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEditProject = (project: ProjectProposalType) => {
    setSelectedProject(project);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProject(null);
    setIsEditing(false);
  };

  const handleProjectSubmit = (project: ProjectProposalType) => {
    if (isEditing) {
      setProjectProposals(
        projectProposals.map((p) => (p.id === project.id ? project : p))
      );
      toast.success("Project proposal updated successfully!");
    } else {
      setProjectProposals([project, ...projectProposals]);
      toast.success("Project proposal created successfully!");
    }
    setShowModal(false);
    setIsEditing(false);
    setSelectedProject(null);
  };

  const openProjectDetails = (project: ProjectProposalType) => {
    console.log("Opening project details:", project);
  };

  const getProposalStatus = (proposal: ProjectProposalType): string => {
    // Prioritize Vote table as per your requirement
    if (proposal.votes && proposal.votes.length > 0) {
      const approvedVotes = proposal.votes.filter(
        (v) => v.vote === "Approved"
      ).length;
      const rejectedVotes = proposal.votes.filter(
        (v) => v.vote === "Rejected"
      ).length;
      const totalVotes = proposal.votes.length;

      if (approvedVotes > rejectedVotes && approvedVotes > totalVotes / 2)
        return "Approved";
      if (rejectedVotes > approvedVotes && rejectedVotes > totalVotes / 2)
        return "Rejected";
    }

    // Fallback to ApprovedBy if no conclusive vote
    if (proposal.approvedBy && proposal.approvedBy.length > 0) {
      const latestApproval = proposal.approvedBy.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )[0];
      return latestApproval.status;
    }

    return "Pending";
  };

  const filteredProjects = projectProposals.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    const status = getProposalStatus(project);
    if (activeTab === "all") return true;
    if (activeTab === "approved") return status === "Approved";
    if (activeTab === "pending approval") return status === "Pending";
    if (activeTab === "rejected") return status === "Rejected";
    return false;
  });

  const approvedProjects = projectProposals.filter(
    (p) => getProposalStatus(p) === "Approved"
  ).length;
  const pendingProjects = projectProposals.filter(
    (p) => getProposalStatus(p) === "Pending"
  ).length;
  const rejectedProjects = projectProposals.filter(
    (p) => getProposalStatus(p) === "Rejected"
  ).length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "Rejected":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const determinePriority = (project: ProjectProposalType) => {
    const dueDate = new Date(project.proposedDate);
    const today = new Date();
    const dayDiff = Math.ceil(
      (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (dayDiff < 7) return { level: "High", badge: "bg-red-100 text-red-800" };
    if (dayDiff < 14)
      return { level: "Medium", badge: "bg-yellow-100 text-yellow-800" };
    return { level: "Low", badge: "bg-blue-100 text-blue-800" };
  };

  const canEditProject = (project: ProjectProposalType) => {
    const isAdmin = role === "Admin";
    const isCreator = project.postedById === user?.id;
    const isPending = getProposalStatus(project) === "Pending";
    return isPending && (isCreator || isAdmin);
  };

  const renderTableContent = (projects: ProjectProposalType[]) => (
    <CardContent>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left p-2 whitespace-nowrap">Project</th>
              <th className="text-left p-2 whitespace-nowrap">Due Date</th>
              <th className="text-left p-2 whitespace-nowrap">Status</th>
              <th className="text-left p-2 whitespace-nowrap">Total Budget</th>
              <th className="text-left p-2 whitespace-nowrap">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {projects.length > 0 ? (
              projects.map((project) => {
                const priority = determinePriority(project);
                const dueDate = new Date(project.proposedDate);
                const status = getProposalStatus(project);

                return (
                  <tr key={project.id} className="border-t hover:bg-gray-50">
                    <td className="p-2">
                      <div>
                        <div className="font-medium">{project.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {project.description.length > 60
                            ? project.description.substring(0, 60) + "..."
                            : project.description}
                        </div>
                      </div>
                    </td>
                    <td className="p-2">
                      {format(dueDate, "MMM d")}
                      <div className="text-xs text-gray-500">
                        {Math.ceil(
                          (dueDate.getTime() - new Date().getTime()) /
                            (1000 * 60 * 60 * 24)
                        )}{" "}
                        days left
                      </div>
                    </td>
                    <td className="p-2">
                      <Badge className={getStatusBadge(status)}>{status}</Badge>
                      {project.implementation && (
                        <div className="text-xs text-gray-500 mt-1">
                          {project.implementation.status} (
                          {project.implementation.completion}%)
                        </div>
                      )}
                    </td>
                    <td className="p-2">₱{project.budget.toLocaleString()}</td>
                    <td className="p-2">
                      <div className="flex justify-center gap-2">
                        <Link
                          href={project.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-auto p-1 text-blue-600 hover:text-blue-800 hover:underline flex items-center"
                        >
                          <FileText className="h-3 w-3 mr-1" />
                          View File
                        </Link>
                        {canEditProject(project) && role !== "Admin" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-1"
                            onClick={() => handleEditProject(project)}
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
  );

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <p className="text-gray-500">Loading project proposals...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <p className="text-red-500">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card className="max-h-[calc(100vh-8rem)] h-full overflow-hidden overflow-y-auto scroll-none">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <CardTitle>
                  {committeeParam
                    ? `${committeeParam} Project Proposals`
                    : "Project Proposals"}
                </CardTitle>
                <CardDescription>
                  {committeeParam
                    ? `All project proposals for ${committeeParam} committee`
                    : role === "Admin"
                    ? "All project proposals from all committees"
                    : `All project proposals for ${role || "your"} committee`}
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search projects..."
                    className="pl-8 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                {/* {role === "Admin" ? null : (
                  <Button
                    onClick={handleCreateProject}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    New Project
                  </Button>
                )} */}
              </div>
            </div>
          </CardHeader>

          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <div className="px-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">
                  All ({projectProposals.length})
                </TabsTrigger>
                <TabsTrigger value="approved">
                  Approved ({approvedProjects})
                </TabsTrigger>
                <TabsTrigger value="pending approval">
                  Pending ({pendingProjects})
                </TabsTrigger>
                <TabsTrigger value="rejected">
                  Disapproved ({rejectedProjects})
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="m-0">
              {renderTableContent(filteredProjects)}
            </TabsContent>
            <TabsContent value="approved" className="m-0">
              {renderTableContent(
                filteredProjects.filter(
                  (p) => getProposalStatus(p) === "Approved"
                )
              )}
            </TabsContent>
            <TabsContent value="pending approval" className="m-0">
              {renderTableContent(
                filteredProjects.filter(
                  (p) => getProposalStatus(p) === "Pending"
                )
              )}
            </TabsContent>
            <TabsContent value="rejected" className="m-0">
              {renderTableContent(
                filteredProjects.filter(
                  (p) => getProposalStatus(p) === "Rejected"
                )
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </div>
      <div className="lg:col-span-1">
        <ProjectCalendar />
      </div>

      {/* {role === "Admin" ? null : (
        <ProjectCalendar
          projectProposals={projectProposals}
          onViewProject={openProjectDetails}
        />
      )} */}

      <CreateNewProjectModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSubmit={handleProjectSubmit}
        project={selectedProject}
        isEditing={isEditing}
      />
    </div>
  );
};

export default ProjectProposals;
