"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import ProjectDetailsDialog, {
  Project,
  ProjectVote,
} from "../custom/admin/Committee-projects-components/ProjectDetails";
import { useAuth } from "../providers/auth-provider";
import { determinePriority } from "../custom/admin/Committee-projects-components/ProjectUtiliry";
import Badge from "../custom/admin/Committee-projects-components/Badge";
import { FileText } from "lucide-react";

// Define an interface for the vote data returned by your API
interface VoteData {
  id: string;
  userId: string;
  proposalId: string;
  vote: "Approved" | "Rejected";
  votedAt: string;
  comment: string;
  user: {
    id: string;
    name: string;
    role: string;
  };
}

// Extend the Proposal interface based on your Prisma schema
interface Proposal {
  id: string;
  title: string;
  committee: string; // For example, "Finance", "Education", etc.
  proposedDate: string;
  description: string;
  status: string;
  fileUrl: string;
  budget: number;
  postedBy: {
    id: string;
    name: string;
    role: string;
  };
  votes: VoteData[];
}

// Convert a Proposal to a full Project object required by ProjectDetailsDialog
const mapProposalToProject = (proposal: Proposal): Project => ({
  id: proposal.id,
  name: proposal.title, // Map title to name
  description: proposal.description,
  committee: proposal.committee,
  committeeId: 0, // Default value; update as needed if you have a committee ID logic
  budget: proposal.budget,
  documentTitle: proposal.fileUrl
    ? proposal.fileUrl.split("/").pop() || proposal.title
    : proposal.title,
  documentUrl: proposal.fileUrl,
  dueDate: new Date(proposal.proposedDate), // Using proposedDate as dueDate; adjust if needed
  dateProposed: new Date(proposal.proposedDate),
  status: proposal.status,
  rejectionReason: null, // Set to null; update if your API returns a rejection reason
  votes: proposal.votes.map(
    (vote): ProjectVote => ({
      id: vote.id,
      userId: vote.userId,
      proposalId: vote.proposalId,
      vote: vote.vote,
      votedAt: new Date(vote.votedAt),
      comment: vote.comment,
      user: vote.user,
    })
  ),
  implementation: null, // Default value; update as needed
  postedBy: proposal.postedBy,
});

const ROWS_PER_PAGE_OPTIONS = [5, 10, 25];

export default function ProjectTable() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // State for the project details modal
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin";

  useEffect(() => {
    async function fetchProposals() {
      try {
        const res = await fetch("/api/approved-proposals");
        if (!res.ok) {
          throw new Error("Failed to fetch proposals");
        }
        const data = await res.json();
        setProposals(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProposals();
  }, []);

  // Filter proposals based on the search term
  const filteredProposals = useMemo(() => {
    if (!searchTerm) return proposals;
    const term = searchTerm.toLowerCase();
    return proposals.filter(
      (proposal) =>
        proposal.title.toLowerCase().includes(term) ||
        proposal.description.toLowerCase().includes(term) ||
        proposal.committee.toLowerCase().includes(term)
    );
  }, [proposals, searchTerm]);

  // Calculate total pages based on filtered proposals
  const totalPages = Math.ceil(filteredProposals.length / rowsPerPage);

  // Memoize proposals for the current page from filtered proposals
  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredProposals.slice(startIndex, startIndex + rowsPerPage);
  }, [currentPage, rowsPerPage, filteredProposals]);

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Reset page to 1 when search term or rows per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, rowsPerPage]);

  if (loading) return <p>Loading proposals...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <CardTitle>Projects</CardTitle>
            <div className="mt-2 sm:mt-0">
              <Input
                placeholder="Search proposals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-xs"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Committee</TableHead>
                  <TableHead>Target Completion</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.map((proposal, index) => {
                  // Calculate the absolute index for the proposal
                  const absoluteIndex = (currentPage - 1) * rowsPerPage + index;
                  // Convert the proposal to a Project to leverage determinePriority
                  const project = mapProposalToProject(proposal);
                  const priority = determinePriority(project);
                  return (
                    <TableRow key={proposal.id} className="hover:bg-gray-50">
                      <TableCell>{proposal.title}</TableCell>
                      <TableCell>{proposal.committee}</TableCell>
                      <TableCell>
                        {new Date(proposal.proposedDate).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={priority.badge}>
                          {absoluteIndex + 1}
                        </Badge>
                      </TableCell>
                      <TableCell>{proposal.status}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1"
                          onClick={() => {
                            setSelectedProject(project);
                            setIsModalOpen(true);
                          }}
                        >
                          <FileText className="h-4 w-4" />
                          <span className="hidden sm:inline">View Details</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          <div className="py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span>Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                }}
                className="border rounded p-1"
              >
                {ROWS_PER_PAGE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={currentPage === 1 ? undefined : goToPreviousPage}
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={currentPage === page}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={
                      currentPage === totalPages ? undefined : goToNextPage
                    }
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
        </CardContent>
      </Card>

      {/* Project Details Modal */}
      {selectedProject && (
        <ProjectDetailsDialog
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          selectedProject={selectedProject}
          isAdmin={isAdmin}
          hasVoted={() => false}
          openVoteDialog={() => {}}
        />
      )}
    </>
  );
}
