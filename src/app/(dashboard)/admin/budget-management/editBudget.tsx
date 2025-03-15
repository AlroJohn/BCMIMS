"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface EditBudgetModalProps {
  budget: {
    id: string;
    totalBudget: number;
    allocatedBudget: number;
  };
  onClose: () => void;
  onSave: (updatedBudget: any) => void;
}

export default function EditBudgetModal({
  budget,
  onClose,
  onSave,
}: EditBudgetModalProps) {
  const [totalBudget, setTotalBudget] = useState(budget.totalBudget);
  const [allocatedBudget, setAllocatedBudget] = useState(budget.allocatedBudget);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Calculate remainingBudget based on totalBudget - allocatedBudget
    const remainingBudget = totalBudget - allocatedBudget;
    const updatedData = { id: budget.id, totalBudget, allocatedBudget, remainingBudget };

    try {
      const response = await fetch("/api/get-budget/update-budget", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        throw new Error("Failed to update budget");
      }
      const updatedBudget = await response.json();
      onSave(updatedBudget);
      onClose();
    } catch (err: any) {
      console.error("Error updating budget:", err);
      setError(err.message || "Something went wrong");
    }
  }

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Budget</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-600 mb-4">{error}</p>}
          <div className="mb-4">
            <label className="block mb-1">Total Budget</label>
            <input
              type="number"
              step="0.01"
              value={totalBudget}
              onChange={(e) => setTotalBudget(Number(e.target.value))}
              className="border p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Allocated Budget</label>
            <input
              type="number"
              step="0.01"
              value={allocatedBudget}
              onChange={(e) => setAllocatedBudget(Number(e.target.value))}
              className="border p-2 w-full"
              required
            />
          </div>
          <p className="mb-4">
            Calculated Remaining Budget: {(totalBudget - allocatedBudget).toFixed(2)}
          </p>
          <DialogFooter>
            <button
              type="button"
              onClick={onClose}
              className="mr-4 px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Save
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
