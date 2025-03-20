"use client";

import type React from "react";

import { useState } from "react";
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
  CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock3,
  CalendarIcon as CalendarIconFull,
} from "lucide-react";
import ProjectDetailsDialog from "./ProjectDetailsDialog";

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

interface ProjectCalendarProps {
  projectProposals: ProjectProposalType[];
}

// Utility functions (could be moved to a separate file)
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

const getStatusColor = (status: string) => {
  switch (status) {
    case "Approved":
      return "bg-green-500";
    case "Pending":
      return "bg-yellow-500";
    case "Rejected":
      return "bg-red-500";
    case "In Progress":
      return "bg-blue-500";
    case "Completed":
      return "bg-purple-500";
    case "Scheduled":
      return "bg-indigo-500";
    default:
      return "bg-gray-500";
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

// Function to get event colors based on implementation status
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

// Sample data for demonstration
const demoProjects: ProjectProposalType[] = [
  {
    id: "1",
    title: "Community Garden Project",
    description: "Creating a community garden in the local park",
    proposedDate: new Date().toISOString(),
    fileUrl: "/files/proposal1.pdf",
    postedById: "user1",
    budget: 5000,
    postedBy: { id: "user1", name: "Jane Smith", role: "Project Manager" },
    approvedBy: [
      {
        id: "approval1",
        updatedAt: new Date().toISOString(),
        userId: "user2",
        status: "Approved",
        proposalId: "1",
        approvedBy: { id: "user2", name: "John Doe", role: "Director" },
      },
    ],
    votes: [],
    committee: "Parks and Recreation",
    implementation: {
      status: "In Progress",
      completion: 45,
    },
  },
];

const ProjectCalendarEvents = ({
  projectProposals = demoProjects,
}: ProjectCalendarProps) => {
  const [date, setDate] = useState(new Date());

  // State for the details dialog
  const [selectedProject, setSelectedProject] =
    useState<ProjectProposalType | null>(null);
  const [showProjectDetails, setShowProjectDetails] = useState(false);

  // Handler for when "View Details" is clicked
  const handleViewProject = (project: ProjectProposalType) => {
    setSelectedProject(project);
    setShowProjectDetails(true);
  };

  const calendarActivities: Activity[] = projectProposals
    .filter((project) => getProposalStatus(project) === "Approved")
    .map((project) => ({
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

  return (
    <Card className="h-full w-full overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/20 to-primary/5 pb-4">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <CalendarIconFull className="h-5 w-5 text-primary" />
              Calendar of Activities
            </CardTitle>
            <CardDescription>Based on approved projects</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-[380px_1fr] h-full">
          {/* Calendar Side */}
          <div className="border-r p-4 bg-muted/20">
            <div className="flex justify-between items-center mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePreviousMonth}
                className="text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h3 className="font-medium text-center text-lg">
                {format(date, "MMMM yyyy")}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNextMonth}
                className="text-muted-foreground hover:text-foreground"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-medium p-2 text-muted-foreground"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
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

            <div className="mt-6 border-t pt-4">
              <h4 className="text-sm font-medium mb-2">Event Types</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span>In Progress</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span>Scheduled</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span>Default</span>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Activity Stats
                </h4>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-green-50 rounded-md border border-green-100 shadow-sm">
                  <div className="text-xs text-gray-600">Completed</div>
                  <div className="font-medium text-lg">{completedProjects}</div>
                </div>
                <div className="p-3 bg-blue-50 rounded-md border border-blue-100 shadow-sm">
                  <div className="text-xs text-gray-600">In Progress</div>
                  <div className="font-medium text-lg">
                    {inProgressProjects}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Details Side */}
          <div className="p-4 overflow-y-auto max-h-[calc(100vh-200px)]">
            <div className="flex items-center gap-2 mb-4">
              <CalendarIcon className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-medium">
                {format(date, "EEEE, MMMM d, yyyy")}
              </h2>
            </div>

            {selectedDateActivities.length > 0 ? (
              <div className="space-y-4">
                {selectedDateActivities.map((activity, index) => {
                  const project = activity.project;
                  const status = getProposalStatus(project);
                  const eventColor = getEventColor(project);

                  return (
                    <Card
                      key={index}
                      className="overflow-hidden border-l-4 hover:shadow-md transition-shadow"
                      style={{
                        borderLeftColor:
                          eventColor.replace("bg-", "") === "bg-green-500"
                            ? "#22c55e"
                            : eventColor.replace("bg-", "") === "bg-purple-500"
                            ? "#a855f7"
                            : eventColor.replace("bg-", "") === "bg-amber-500"
                            ? "#f59e0b"
                            : "#3b82f6",
                      }}
                    >
                      <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">
                            {activity.title}
                          </CardTitle>
                          <Badge className={getStatusBadge(status)}>
                            {status}
                          </Badge>
                        </div>
                        <CardDescription>
                          Budget: ₱{project.budget.toLocaleString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        {project.implementation && (
                          <div className="mt-2">
                            <div className="flex justify-between items-center text-sm">
                              <span>Progress:</span>
                              <span className="font-medium">
                                {project.implementation.completion}%
                              </span>
                            </div>
                            <Progress
                              value={project.implementation.completion}
                              className="h-2 mt-1"
                              style={
                                {
                                  "--progress-background":
                                    eventColor.replace("bg-", "") ===
                                    "bg-green-500"
                                      ? "#22c55e"
                                      : eventColor.replace("bg-", "") ===
                                        "bg-purple-500"
                                      ? "#a855f7"
                                      : eventColor.replace("bg-", "") ===
                                        "bg-amber-500"
                                      ? "#f59e0b"
                                      : "#3b82f6",
                                } as React.CSSProperties
                              }
                            />
                          </div>
                        )}
                        <div className="flex justify-end mt-3">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8"
                            onClick={() => handleViewProject(project)}
                          >
                            <FileText className="h-3.5 w-3.5 mr-1" />
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed rounded-lg bg-muted/30 h-[300px]">
                <Clock3 className="h-10 w-10 text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium mb-1">No Events</h3>
                <p className="text-muted-foreground">
                  There are no activities scheduled for this date.
                </p>
              </div>
            )}

            {upcomingActivities.length > 0 &&
              selectedDateActivities.length === 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Upcoming Events
                  </h3>
                  <div className="space-y-3">
                    {upcomingActivities.slice(0, 3).map((activity, index) => {
                      const eventColor = getEventColor(activity.project);
                      return (
                        <div
                          key={index}
                          className="p-3 border rounded-lg flex items-center gap-3 hover:bg-muted/30 transition-colors cursor-pointer"
                          onClick={() => setDate(activity.date)}
                        >
                          <div
                            className={`w-3 h-3 rounded-full ${eventColor}`}
                          ></div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">
                              {activity.title}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {format(activity.date, "EEE, MMM d, yyyy")}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewProject(activity.project);
                            }}
                          >
                            <FileText className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
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

export default ProjectCalendarEvents;
