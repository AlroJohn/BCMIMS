"use client";

import SessionGuard from "@/components/custom/guard/session-guard";
import { useEffect, useState } from "react";
import EditBudgetModal from "./editBudget";


// Define interfaces for your data structure
interface Proposal {
  id: string;
  title: string;
}

interface BudgetOverview {
  id: string;
  totalBudget: number;
  allocatedBudget: number;
  remainingBudget: number;
  month: string;
  committeeRole: string;
  proposals?: Proposal[];
}

export default function ManageBudget() {
  const [budgetData, setBudgetData] = useState<BudgetOverview[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [editingBudget, setEditingBudget] = useState<BudgetOverview | null>(null);

  useEffect(() => {
    async function fetchBudgetData() {
      try {
        const response = await fetch("/api/get-budget");
        if (!response.ok) {
          throw new Error("Failed to fetch budget data");
        }
        const data: BudgetOverview[] = await response.json();
        setBudgetData(data);
      } catch (err: any) {
        console.error("Error fetching budget data:", err);
        setError(err);
      }
    }
    fetchBudgetData();
  }, []);

  const handleEdit = (budget: BudgetOverview) => {
    setEditingBudget(budget);
  };

  const handleModalClose = () => {
    setEditingBudget(null);
  };

  const handleBudgetUpdate = (updatedBudget: BudgetOverview) => {
    setBudgetData((prevData) =>
      prevData.map((budget) =>
        budget.id === updatedBudget.id ? updatedBudget : budget
      )
    );
  };

  return (
    <SessionGuard requiredRoles={["Admin"]}>
      <div className="flex flex-col h-screen p-4">
        {error && (
          <div className="mb-4 text-red-600">
            Error: {error.message}
          </div>
        )}
        <div className="flex-1 overflow-y-auto">
          {budgetData.length > 0 ? (
            <div className="space-y-4">
              {budgetData.map((budget) => (
                <div key={budget.id} className="p-4 border rounded shadow">
                  <h3 className="font-bold">Budget ID: {budget.id}</h3>
                  <p>Total Budget: {budget.totalBudget.toFixed(2)}</p>
                  <p>Allocated Budget: {budget.allocatedBudget.toFixed(2)}</p>
                  <p>Remaining Budget: {budget.remainingBudget.toFixed(2)}</p>
                  <p>
                    Month: {new Date(budget.month).toLocaleDateString()}
                  </p>
                  <p>Committee Role: {budget.committeeRole}</p>
                  {budget.proposals && budget.proposals.length > 0 && (
                    <div className="mt-2">
                      <h4 className="underline">Proposals:</h4>
                      <ul className="list-disc ml-5">
                        {budget.proposals.map((proposal) => (
                          <li key={proposal.id}>{proposal.title}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <button
                    onClick={() => handleEdit(budget)}
                    className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>Loading budget data...</p>
          )}
        </div>
        {editingBudget && (
          <EditBudgetModal
            budget={editingBudget}
            onClose={handleModalClose}
            onSave={handleBudgetUpdate}
          />
        )}
      </div>
    </SessionGuard>
  );
}
