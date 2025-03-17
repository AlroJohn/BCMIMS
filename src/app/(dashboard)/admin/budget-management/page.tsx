"use client"

import SessionGuard from "@/components/custom/guard/session-guard"
import { useEffect, useState } from "react"
import EditBudgetModal from "./editBudget"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"

// Define interfaces for your data structure
interface Proposal {
  id: string
  title: string
}

interface BudgetOverview {
  id: string
  totalBudget: number
  allocatedBudget: number
  remainingBudget: number
  month: string
  committeeRole: string
  proposals?: Proposal[]
}

export default function ManageBudget() {
  const [budgetData, setBudgetData] = useState<BudgetOverview[]>([])
  const [error, setError] = useState<Error | null>(null)
  const [editingBudget, setEditingBudget] = useState<BudgetOverview | null>(null)

  useEffect(() => {
    async function fetchBudgetData() {
      try {
        const response = await fetch("/api/get-budget")
        if (!response.ok) {
          throw new Error("Failed to fetch budget data")
        }
        const data: BudgetOverview[] = await response.json()
        setBudgetData(data)
      } catch (err: any) {
        console.error("Error fetching budget data:", err)
        setError(err)
      }
    }
    fetchBudgetData()
  }, [])

  const handleEdit = (budget: BudgetOverview) => {
    setEditingBudget(budget)
  }

  const handleModalClose = () => {
    setEditingBudget(null)
  }

  const handleBudgetUpdate = (updatedBudget: BudgetOverview) => {
    setBudgetData((prevData) =>
      prevData.map((budget) => (budget.id === updatedBudget.id ? updatedBudget : budget))
    )
  }

  // Fixed progress calculation
  const getProgressValue = (budget: BudgetOverview) => {
    return (budget.allocatedBudget / budget.totalBudget) * 100
  }

  // Updated function for progress color
  const getProgressColor = (budget: BudgetOverview) => {
    const utilizationPercentage = (budget.allocatedBudget / budget.totalBudget) * 100

    if (utilizationPercentage > 90) return "[--progress-foreground:theme(colors.red.500)]"
    if (utilizationPercentage > 70) return "[--progress-foreground:theme(colors.yellow.500)]"
    return "[--progress-foreground:theme(colors.green.500)]"
  }

  // Filter out budgets with committeeRole "Admin"
  const filteredBudgetData = budgetData.filter((budget) => budget.committeeRole !== "Admin")

  return (
    <SessionGuard requiredRoles={["Admin"]}>
      <div className="p-4 h-full">
        {error && (
          <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
            Error: {error.message}
          </div>
        )}

        {filteredBudgetData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBudgetData.map((budget) => (
              <Card key={budget.id} className="shadow-sm hover:shadow-md transition-shadow relative pb-10">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">{budget.committeeRole}</h3>
                    <span className="text-sm text-muted-foreground">
                      {new Date(budget.month).toLocaleDateString(undefined, { month: "short", year: "numeric" })}
                    </span>
                  </div>

                  <div className="space-y-3 mt-2">
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Budget Allocation</span>
                        <span className="font-medium">{getProgressValue(budget).toFixed(0)}%</span>
                      </div>
                      <Progress value={getProgressValue(budget)} className={`h-2 ${getProgressColor(budget)}`} />
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Total</p>
                        <p className="font-medium">₱{budget.totalBudget.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Allocated</p>
                        <p className="font-medium">₱{budget.allocatedBudget.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Remaining</p>
                        <p className="font-medium">₱{budget.remainingBudget.toLocaleString()}</p>
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
                            <p className="text-muted-foreground">+{budget.proposals.length - 2} more</p>
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
                    onClick={() => handleEdit(budget)}
                    className="flex items-center justify-center gap-1 text-xs shadow-sm"
                  >
                    <Edit className="h-3 w-3" />
                    Edit Budget
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-64">
            <p className="text-muted-foreground">Loading budget data...</p>
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
  )
}
