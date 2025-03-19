"use client";

import SessionGuard from "@/components/custom/guard/session-guard";
import { useEffect, useState } from "react";
import EditBudgetModal from "./editBudget";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, AlertCircle, Plus, Filter } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [editingBudget, setEditingBudget] = useState<BudgetOverview | null>(
    null
  );
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    async function fetchBudgetData() {
      try {
        const response = await fetch("/api/get-budget");
        if (!response.ok) {
          throw new Error("Failed to fetch budget data");
        }
        const data: BudgetOverview[] = await response.json();
        console.log("Raw budget data:", data);
        setBudgetData(data);
      } catch (err: any) {
        console.error("Error fetching budget data:", err);
        setError(err);
      } finally {
        setLoading(false);
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

  // Fixed progress calculation
  const getProgressValue = (budget: BudgetOverview) => {
    return (budget.allocatedBudget / budget.totalBudget) * 100;
  };

  // Updated function for progress color
  const getProgressColor = (budget: BudgetOverview) => {
    const utilizationPercentage =
      (budget.allocatedBudget / budget.totalBudget) * 100;

    if (utilizationPercentage > 90)
      return "[--progress-foreground:theme(colors.red.500)]";
    if (utilizationPercentage > 70)
      return "[--progress-foreground:theme(colors.yellow.500)]";
    return "[--progress-foreground:theme(colors.green.500)]";
  };

  // Filter budgets based on active tab
  const getFilteredBudgets = () => {
    if (activeTab === "admin") {
      return budgetData.filter((budget) => budget.committeeRole === "Admin");
    } else if (activeTab === "committees") {
      return budgetData.filter((budget) => budget.committeeRole !== "Admin");
    }
    return budgetData; // "all" tab shows everything
  };

  const filteredBudgetData = getFilteredBudgets();

  // Render empty state with notification
  if (!loading && budgetData.length === 0) {
    return (
      <SessionGuard requiredRoles={["Admin"]}>
        <div className="p-4 h-full">
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Budget Data Available</AlertTitle>
            <AlertDescription>
              There are no budgets configured in the system yet. Please create a
              new budget to get started.
            </AlertDescription>
          </Alert>

          {/* <div className="flex justify-center mt-8">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Create New Budget
            </Button>
          </div> */}
        </div>
      </SessionGuard>
    );
  }

  // Check if we have admin budgets
  const hasAdminBudgets = budgetData.some(
    (budget) => budget.committeeRole === "Admin"
  );
  const hasCommitteeBudgets = budgetData.some(
    (budget) => budget.committeeRole !== "Admin"
  );

  return (
    <SessionGuard requiredRoles={["Admin"]}>
      <div className="p-4 h-full">
        {error && (
          <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
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
              defaultValue="all"
              className="w-full"
              onValueChange={setActiveTab}
            >
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="all">All Budgets</TabsTrigger>
                  <TabsTrigger value="admin">Admin Budgets</TabsTrigger>
                  <TabsTrigger value="committees">
                    Committee Budgets
                  </TabsTrigger>
                </TabsList>

                {/* Uncomment if you want to add a create button
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" /> Create Budget
                </Button>
                */}
              </div>

              <TabsContent value="all" className="mt-0">
                {budgetData.length === 0 ? (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>No Budgets Available</AlertTitle>
                    <AlertDescription>
                      There are no budgets configured in the system.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <BudgetCards budgets={budgetData} onEdit={handleEdit} />
                )}
              </TabsContent>

              <TabsContent value="admin" className="mt-0">
                {!hasAdminBudgets ? (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>No Admin Budgets</AlertTitle>
                    <AlertDescription>
                      There are no Admin budgets configured in the system.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <BudgetCards
                    budgets={budgetData.filter(
                      (b) => b.committeeRole === "Admin"
                    )}
                    onEdit={handleEdit}
                  />
                )}
              </TabsContent>

              <TabsContent value="committees" className="mt-0">
                {!hasCommitteeBudgets ? (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>No Committee Budgets</AlertTitle>
                    <AlertDescription>
                      There are no Committee budgets configured in the system.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <BudgetCards
                    budgets={budgetData.filter(
                      (b) => b.committeeRole !== "Admin"
                    )}
                    onEdit={handleEdit}
                  />
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}

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

// Extracted budget cards into a separate component for reuse
function BudgetCards({
  budgets,
  onEdit,
}: {
  budgets: BudgetOverview[];
  onEdit: (budget: BudgetOverview) => void;
}) {
  // Fixed progress calculation
  const getProgressValue = (budget: BudgetOverview) => {
    return (budget.allocatedBudget / budget.totalBudget) * 100;
  };

  // Updated function for progress color
  const getProgressColor = (budget: BudgetOverview) => {
    const utilizationPercentage =
      (budget.allocatedBudget / budget.totalBudget) * 100;

    if (utilizationPercentage > 90)
      return "[--progress-foreground:theme(colors.red.500)]";
    if (utilizationPercentage > 70)
      return "[--progress-foreground:theme(colors.yellow.500)]";
    return "[--progress-foreground:theme(colors.green.500)]";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {budgets.map((budget) => (
        <Card
          key={budget.id}
          className="shadow-sm hover:shadow-md transition-shadow relative pb-10"
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">{budget.committeeRole}</h3>
              <span className="text-sm text-muted-foreground">
                {new Date(budget.month).toLocaleDateString(undefined, {
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>

            <div className="space-y-3 mt-2">
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Budget Allocation</span>
                  <span className="font-medium">
                    {getProgressValue(budget).toFixed(0)}%
                  </span>
                </div>
                <Progress
                  value={getProgressValue(budget)}
                  className={`h-2 ${getProgressColor(budget)}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Total</p>
                  <p className="font-medium">
                    ₱{budget.totalBudget.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Allocated</p>
                  <p className="font-medium">
                    ₱{budget.allocatedBudget.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Remaining</p>
                  <p className="font-medium">
                    ₱{budget.remainingBudget.toLocaleString()}
                  </p>
                </div>
              </div>

              {budget.proposals && budget.proposals.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    Proposals ({budget.proposals.length})
                  </p>
                  <div className="max-h-12 overflow-hidden text-xs">
                    {budget.proposals.slice(0, 2).map((proposal) => (
                      <p key={proposal.id} className="truncate">
                        {proposal.title}
                      </p>
                    ))}
                    {budget.proposals.length > 2 && (
                      <p className="text-muted-foreground">
                        +{budget.proposals.length - 2} more
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(budget)}
              className="flex items-center justify-center gap-1 text-xs shadow-sm"
            >
              <Edit className="h-3 w-3" />
              Edit Budget
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
