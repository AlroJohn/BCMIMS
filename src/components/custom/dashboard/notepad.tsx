// components/custom/dashboard/CommitteeDashboard.tsx
"use client";

export default function CommitteeDashboard() {
  return (
    <div>
      <div className="min-h-screen w-full p-6 bg-gray-50">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Committee Dashboard
            </h1>
            <Button
              onClick={() => setShowCreateProject(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Project Proposal
            </Button>
          </div>

          {/* Committee Info Card */}
          {/* <CommitteeCards /> */}

          {/* Project Statistics */}
          {/* <BudgetAllocated /> */}
        </div>
      </div>

      {/* Project Details Dialog */}

      {/* Create Project Dialog */}
    </div>
  );
}
