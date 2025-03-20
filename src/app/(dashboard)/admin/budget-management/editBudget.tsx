"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AlertCircle, Save, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BudgetOverview {
  id: string;
  totalBudget: number;
  allocatedBudget: number;
  remainingBudget: number;
  month: string;
  committeeRole: string;
  proposals?: any[];
}

interface EditBudgetModalProps {
  budget: BudgetOverview;
  onClose: () => void;
  onSave: (updatedBudget: BudgetOverview) => void;
}

export default function EditBudgetModal({
  budget,
  onClose,
  onSave,
}: EditBudgetModalProps) {
  const [totalBudget, setTotalBudget] = useState(budget.totalBudget);
  const [allocatedBudget, setAllocatedBudget] = useState(
    budget.allocatedBudget
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    totalBudget?: string;
    allocatedBudget?: string;
  }>({});

  // Calculate remaining budget
  const remainingBudget = totalBudget - allocatedBudget;

  // Minimal validation to prevent negative values
  useEffect(() => {
    const errors: {
      totalBudget?: string;
      allocatedBudget?: string;
    } = {};

    // Allow zero budget, only validate negative values
    if (totalBudget < 0) {
      errors.totalBudget = "Total budget cannot be negative";
    }

    if (allocatedBudget < 0) {
      errors.allocatedBudget = "Allocated budget cannot be negative";
    }

    setValidationErrors(errors);
  }, [totalBudget, allocatedBudget]);

  // Check if form has any validation errors
  const hasValidationErrors = Object.keys(validationErrors).length > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Don't submit if there are validation errors
    if (hasValidationErrors) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const updatedData = {
      id: budget.id,
      totalBudget,
      allocatedBudget,
      remainingBudget,
      // Preserve other properties from the original budget
      month: budget.month,
      committeeRole: budget.committeeRole,
    };

    try {
      const response = await fetch("/api/get-budget/update-budget", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || `Failed to update budget (${response.status})`
        );
      }

      const updatedBudget = await response.json();
      onSave(updatedBudget);
      onClose();
    } catch (err: any) {
      console.error("Error updating budget:", err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Budget for {budget.committeeRole}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="totalBudget">Total Budget (₱)</Label>
              <Input
                id="totalBudget"
                type="number"
                step="0.01"
                min="0"
                value={totalBudget}
                onChange={(e) => setTotalBudget(Number(e.target.value))}
                className={validationErrors.totalBudget ? "border-red-500" : ""}
                required
              />
              {validationErrors.totalBudget && (
                <p className="text-sm text-red-500">
                  {validationErrors.totalBudget}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="allocatedBudget">Allocated Budget (₱)</Label>
              <Input
                id="allocatedBudget"
                type="number"
                step="0.01"
                min="0"
                value={allocatedBudget}
                onChange={(e) => setAllocatedBudget(Number(e.target.value))}
                className={
                  validationErrors.allocatedBudget ? "border-red-500" : ""
                }
                required
              />
              {validationErrors.allocatedBudget && (
                <p className="text-sm text-red-500">
                  {validationErrors.allocatedBudget}
                </p>
              )}
            </div>

            <div className="pt-2">
              <Label>Remaining Budget</Label>
              <div className="text-lg font-medium mt-1">
                ₱{remainingBudget.toLocaleString()}
              </div>
              {/* Removed over-allocation warning */}
            </div>
          </div>

          <DialogFooter className="sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" /> Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || hasValidationErrors}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />{" "}
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
