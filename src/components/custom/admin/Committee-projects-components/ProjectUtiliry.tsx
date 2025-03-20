import { ThumbsUp, ThumbsDown, Clock } from "lucide-react";
import { Project } from "./ProjectDetails";

// Helper utilities for project data and UI

// Get status badge styling
export const getStatusBadge = (status: string) => {
  switch (status) {
    case "Approved":
      return "bg-green-100 border-green-200 text-green-800";
    case "Pending":
      return "bg-yellow-100 border-yellow-200 text-yellow-800";
    case "Rejected":
      return "bg-red-100 border-red-200 text-red-800";
    default:
      return "bg-gray-100 border-gray-200 text-gray-800";
  }
};

// Determine priority based on approval count and due date
export const determinePriority = (project: Project) => {
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

// Get vote count badge JSX
export const getVoteCountBadge = (project: Project) => {
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
    </div>
  );
};

// Committee info mapping
export const committeeInfoMap = {
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
export const roleToCommittee = {
  Admin: { name: "Captain", id: 0 },
  Education: { name: "Education", id: 1 },
  Environment: { name: "Environment", id: 2 },
  Finance: { name: "Finance", id: 3 },
  HealthServices: { name: "Health", id: 4 },
  PeaceOrder: { name: "Peace & Order", id: 5 },
  PublicWorks: { name: "Public Works", id: 6 },
  Women: { name: "Women & Family", id: 7 },
};
