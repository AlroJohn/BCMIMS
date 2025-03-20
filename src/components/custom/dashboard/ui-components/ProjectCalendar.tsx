"use client";

import { useState, useEffect } from "react";
import { format, isSameDay, addMonths, subMonths, isToday } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  Calendar,
  Clock,
  Download,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock3,
  CalendarIcon,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Types
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
  status?: string;
  implementation?: {
    status: string;
    completion: number;
  };
};

type Activity = {
  date: Date;
  title: string;
  project: ProjectProposalType;
};

// Utility functions
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

const getEventColor = (project: ProjectProposalType) => {
  if (!project.implementation) return "bg-blue-500";

  switch (project.implementation.status) {
    case "Completed":
      return "bg-green-500";
    case "In Progress":
      return "bg-purple-500";
    case "Scheduled":
      return "bg-amber-500";
    default:
      return "bg-blue-500";
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

const getProposalStatus = (proposal: ProjectProposalType): string => {
  // If status is already provided in the data, use it
  if (proposal.status) return proposal.status;

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

  if (proposal.approvedBy && proposal.approvedBy.length > 0) {
    const latestApproval = proposal.approvedBy.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )[0];
    return latestApproval.status;
  }

  return "Pending";
};

// Project Details Dialog Component
interface ProjectDetailsDialogProps {
  showProjectDetails: boolean;
  setShowProjectDetails: (show: boolean) => void;
  selectedProject: ProjectProposalType | null;
}

const ProjectDetailsDialog = ({
  showProjectDetails,
  setShowProjectDetails,
  selectedProject,
}: ProjectDetailsDialogProps) => {
  if (!selectedProject) return null;

  // Return a basic dialog with project details
  // In a real application, you'd use your UI library's dialog component
  return (
    <div
      className={`fixed inset-0 bg-black/50 z-50 ${
        showProjectDetails ? "flex" : "hidden"
      } items-center justify-center`}
    >
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{selectedProject.title}</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowProjectDetails(false)}
          >
            ✕
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Description</h3>
            <p>{selectedProject.description}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Budget</h3>
            <p>₱{selectedProject.budget.toLocaleString()}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Proposed Date</h3>
            <p>{format(new Date(selectedProject.proposedDate), "PPP")}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Posted By</h3>
            <p>{selectedProject.postedBy.name}</p>
          </div>

          {selectedProject.implementation && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Implementation Status
              </h3>
              <div className="flex items-center gap-2">
                <Badge>{selectedProject.implementation.status}</Badge>
                <span>
                  {selectedProject.implementation.completion}% complete
                </span>
              </div>
              <Progress
                value={selectedProject.implementation.completion}
                className="h-2 mt-2"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ProjectCalendar = () => {
  const [viewFilter, setViewFilter] = useState<"calendar" | "list">("calendar");
  const [date, setDate] = useState(new Date());
  const [projectProposals, setProjectProposals] = useState<
    ProjectProposalType[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for project details dialog
  const [selectedProject, setSelectedProject] =
    useState<ProjectProposalType | null>(null);
  const [showProjectDetails, setShowProjectDetails] = useState(false);

  // Handler for viewing project details
  const handleViewProject = (project: ProjectProposalType) => {
    setSelectedProject(project);
    setShowProjectDetails(true);
  };

  // Fetch project proposals
  useEffect(() => {
    const fetchProposals = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          "/api/project-proposal/fetch-proposal-calendar"
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch proposals: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Fetched approved proposals:", data);

        // Add implementation data if it doesn't exist
        const enhancedProposals = data.map((proposal: ProjectProposalType) => {
          if (!proposal.implementation) {
            // Determine implementation status based on proposed date
            const proposedDate = new Date(proposal.proposedDate);
            const currentDate = new Date();

            let status;
            let completion;

            if (proposedDate > currentDate) {
              // Future event - scheduled
              status = "Scheduled";
              completion = 0;
            } else {
              // Past or current event - randomly assign In Progress or Completed
              // Events older than 30 days have higher chance to be completed
              const daysDifference = Math.floor(
                (currentDate.getTime() - proposedDate.getTime()) /
                  (1000 * 60 * 60 * 24)
              );

              if (daysDifference > 30 || Math.random() > 0.7) {
                status = "Completed";
                completion = 100;
              } else {
                status = "In Progress";
                completion = Math.floor(Math.random() * 70) + 10; // 10-80% complete
              }
            }

            return {
              ...proposal,
              implementation: {
                status,
                completion,
              },
            };
          }
          return proposal;
        });

        setProjectProposals(enhancedProposals);
      } catch (err) {
        console.error("Error fetching proposals:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, []);

  const calendarActivities: Activity[] = projectProposals.map((project) => ({
    date: new Date(project.proposedDate),
    title: project.title,
    project,
  }));

  const selectedDateActivities = calendarActivities.filter((activity) =>
    isSameDay(activity.date, date)
  );

  const upcomingActivities = [...calendarActivities]
    .filter((activity) => activity.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const completedProjects = projectProposals.filter(
    (p) => p.implementation?.status === "Completed"
  ).length;

  const inProgressProjects = projectProposals.filter(
    (p) =>
      p.implementation?.status === "In Progress" ||
      p.implementation?.status === "Scheduled"
  ).length;

  const generateCalendarDays = () => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const previousMonthDays: {
      day: number;
      currentMonth: boolean;
      date: Date;
    }[] = [];
    if (firstDayOfMonth > 0) {
      const daysInPreviousMonth = new Date(year, month, 0).getDate();
      for (let i = firstDayOfMonth - 1; i >= 0; i--) {
        previousMonthDays.push({
          day: daysInPreviousMonth - i,
          currentMonth: false,
          date: new Date(year, month - 1, daysInPreviousMonth - i),
        });
      }
    }

    const currentMonthDays: {
      day: number;
      currentMonth: boolean;
      date: Date;
    }[] = [];
    for (let i = 1; i <= daysInMonth; i++) {
      currentMonthDays.push({
        day: i,
        currentMonth: true,
        date: new Date(year, month, i),
      });
    }

    const nextMonthDays: { day: number; currentMonth: boolean; date: Date }[] =
      [];
    const totalDaysDisplayed =
      previousMonthDays.length + currentMonthDays.length;
    const daysNeeded =
      Math.ceil(totalDaysDisplayed / 7) * 7 - totalDaysDisplayed;

    for (let i = 1; i <= daysNeeded; i++) {
      nextMonthDays.push({
        day: i,
        currentMonth: false,
        date: new Date(year, month + 1, i),
      });
    }

    return [...previousMonthDays, ...currentMonthDays, ...nextMonthDays];
  };

  const calendarDays = generateCalendarDays();

  const handlePreviousMonth = () => setDate(subMonths(date, 1));
  const handleNextMonth = () => setDate(addMonths(date, 1));

  // Get activities for a specific day
  const getActivitiesForDay = (day: Date) => {
    return calendarActivities.filter((activity) =>
      isSameDay(activity.date, day)
    );
  };

  // Loading state
  if (loading) {
    return (
      <Card className="h-full w-full flex flex-col max-h-[calc(100vh-8rem)]">
        <CardHeader>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-40" />
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          <div className="flex flex-col h-full space-y-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="h-full w-full flex flex-col max-h-[calc(100vh-8rem)]">
        <CardHeader>
          <CardTitle>Calendar of Activities</CardTitle>
          <CardDescription>Based on approved projects</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-red-50 p-6 rounded-lg border border-red-100">
              <h3 className="text-lg font-medium text-red-800 mb-2">
                Error Loading Calendar
              </h3>
              <p className="text-red-600 mb-4">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Retry Loading
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col max-h-[calc(100vh-8rem)]">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Calendar of Activities</CardTitle>
            <CardDescription>Based on approved projects</CardDescription>
          </div>
          <div className="flex bg-gray-100 rounded-md p-0.5">
            <Button
              variant={viewFilter === "calendar" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewFilter("calendar")}
              className="flex items-center gap-1"
            >
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Calendar</span>
            </Button>
            <Button
              variant={viewFilter === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewFilter("list")}
              className="flex items-center gap-1"
            >
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Timeline</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col overflow-hidden overflow-y-auto scroll-none">
        {viewFilter === "calendar" ? (
          <div className="border rounded-md p-4 w-full">
            <div className="flex justify-between items-center mb-4">
              <Button variant="ghost" size="sm" onClick={handlePreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h3 className="font-medium text-center">
                {format(date, "MMMM yyyy")}
              </h3>
              <Button variant="ghost" size="sm" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div key={day} className="text-center text-sm font-medium p-2">
                  {day}
                </div>
              ))}
              {calendarDays.map((day, index) => {
                const dayActivities = getActivitiesForDay(day.date);
                const hasActivity = dayActivities.length > 0;
                const isSelected = isSameDay(date, day.date);
                const isCurrentDay = isToday(day.date);

                return (
                  <button
                    key={index}
                    className={`
                      aspect-square flex flex-col items-center justify-start p-1 
                      ${!day.currentMonth ? "opacity-40" : ""} 
                      ${
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : day.currentMonth
                          ? "hover:bg-muted"
                          : ""
                      }
                      ${
                        isCurrentDay && day.currentMonth && !isSelected
                          ? "border border-primary"
                          : ""
                      }
                      transition-all duration-200
                    `}
                    onClick={() => day.currentMonth && setDate(day.date)}
                    disabled={!day.currentMonth}
                  >
                    <span className="text-sm">{day.day}</span>

                    {hasActivity && day.currentMonth && (
                      <div className="flex flex-wrap gap-0.5 mt-1 justify-center">
                        {dayActivities.slice(0, 3).map((activity, i) => (
                          <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full ${
                              isSelected
                                ? "bg-primary-foreground"
                                : getEventColor(activity.project)
                            }`}
                            title={activity.title}
                          />
                        ))}
                        {dayActivities.length > 3 && (
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              isSelected
                                ? "bg-primary-foreground"
                                : "bg-gray-400"
                            }`}
                            title={`${dayActivities.length - 3} more events`}
                          />
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="border rounded-md p-4 w-full mb-4">
            <h3 className="font-medium mb-4">Upcoming Timeline</h3>
            <div className="relative">
              <div className="absolute h-full w-0.5 bg-gray-200 left-2 top-0"></div>
              {upcomingActivities.length > 0 ? (
                upcomingActivities.slice(0, 10).map((activity, index) => (
                  <div key={index} className="ml-7 mb-4 relative">
                    <div className="absolute w-4 h-4 rounded-full bg-blue-500 -left-5 top-1.5"></div>
                    <div className="p-3 border rounded-lg bg-white shadow-sm">
                      <div className="font-medium">{activity.title}</div>
                      <div className="text-sm text-gray-500">
                        {format(activity.date, "MMM d, yyyy")}
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <Badge
                          className={determinePriority(activity.project).badge}
                        >
                          {activity.project.implementation?.status ||
                            "Scheduled"}
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-auto p-1 text-blue-600"
                          onClick={() => handleViewProject(activity.project)}
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
              {upcomingActivities.length > 10 && (
                <div className="text-center mt-4">
                  <Button variant="outline" size="sm">
                    Show More
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {viewFilter === "calendar" && (
          <div className="mt-6 flex-1">
            <h3 className="font-medium mb-2">
              Activities for {format(date, "MMMM d, yyyy")}
            </h3>
            {selectedDateActivities.length > 0 ? (
              <div className="space-y-2">
                {selectedDateActivities.map((activity, index) => {
                  const project = activity.project;
                  const status = "Approved"; // Since all proposals are approved

                  return (
                    <div
                      key={index}
                      className="p-3 border rounded-lg bg-white shadow-sm"
                    >
                      <div className="font-medium">{activity.title}</div>
                      <div className="text-sm text-gray-500">
                        Budget: ₱{project.budget.toLocaleString()}
                      </div>
                      <div className="mt-1">
                        <div className="flex justify-between items-center">
                          <Badge className={getStatusBadge(status)}>
                            {status}
                          </Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-auto p-1 text-blue-600"
                            onClick={() => handleViewProject(project)}
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
                          <Progress
                            value={project.implementation.completion}
                            className="h-2 mt-1"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-gray-500 text-sm">
                No activities scheduled for this date.
              </div>
            )}
          </div>
        )}

        <div className="mt-auto pt-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Activity Stats</h3>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="p-2 bg-green-50 rounded-md border border-green-100">
              <div className="text-sm text-gray-600">Completed</div>
              <div className="font-medium">{completedProjects}</div>
            </div>
            <div className="p-2 bg-blue-50 rounded-md border border-blue-100">
              <div className="text-sm text-gray-600">In Progress</div>
              <div className="font-medium">{inProgressProjects}</div>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Project Details Dialog */}
      <ProjectDetailsDialog
        showProjectDetails={showProjectDetails}
        setShowProjectDetails={setShowProjectDetails}
        selectedProject={selectedProject}
      />
    </Card>
  );
};

export default ProjectCalendar;
