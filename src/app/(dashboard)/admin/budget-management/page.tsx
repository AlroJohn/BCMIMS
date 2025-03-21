"use client";

import SessionGuard from "@/components/custom/guard/session-guard";
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define interfaces for your data structure
interface ApprovedProposal {
  committee: string;
  totalApprovedBudget: number;
  approvedProposalsCount: number;
}

export default function ManageBudget() {
  const [approvedBudgets, setApprovedBudgets] = useState<ApprovedProposal[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [activeTab, setActiveTab] = useState("approved");

  useEffect(() => {
    async function fetchBudgetData() {
      try {
        const response = await fetch("/api/get-budget");
        if (!response.ok) {
          throw new Error("Failed to fetch budget data");
        }

        const data: ApprovedProposal[] = await response.json();
        console.log("Approved proposals data:", data);
        setApprovedBudgets(data);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchBudgetData();
  }, []);

  return (
    <SessionGuard requiredRoles={["Admin"]}>
      <div className="p-4 h-full">
        {error && (
          <div className="mb-4 p-2 bg-red-100 border text-red-700 rounded">
            Error: {error.message}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-muted-foreground">Loading budget data...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <Tabs
              defaultValue="approved"
              className="w-full"
              onValueChange={setActiveTab}
            >
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="approved">Approved Budgets</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="approved" className="mt-0">
                <BudgetCards budgets={approvedBudgets} />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </SessionGuard>
  );
}

// Extracted budget cards into a separate component for reuse
function BudgetCards({ budgets }: { budgets: ApprovedProposal[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {budgets.length === 0 ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Approved Budgets</AlertTitle>
          <AlertDescription>
            No project proposals have been approved yet.
          </AlertDescription>
        </Alert>
      ) : (
        budgets.map((budget) => (
          <Card key={budget.committee}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">{budget.committee}</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Approved Proposals:{" "}
                <span className="font-semibold">
                  {budget.approvedProposalsCount}
                </span>
              </p>
              <p className="text-sm text-muted-foreground">
                Total Appropriation:{" "}
                <span className="font-semibold">
                  ₱{budget.totalApprovedBudget.toLocaleString()}
                </span>
              </p>
              <Progress value={budget.totalApprovedBudget} className="mt-2" />
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
