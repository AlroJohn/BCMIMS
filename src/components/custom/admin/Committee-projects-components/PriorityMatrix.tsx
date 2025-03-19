import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const PriorityMatrixDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Priority Matrix Explanation</DialogTitle>
          <DialogDescription>
            How projects are categorized based on approvals and due dates
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg bg-red-50">
              <h3 className="font-bold text-red-800 mb-2">
                Urgent & Important
              </h3>
              <p className="text-sm">
                Projects with at least 4 approvals and due within 30 days.
              </p>
            </div>
            <div className="p-4 border rounded-lg bg-yellow-50">
              <h3 className="font-bold text-yellow-800 mb-2">
                Urgent but Not Important
              </h3>
              <p className="text-sm">
                Projects with fewer than 4 approvals but due within 30 days.
              </p>
            </div>
            <div className="p-4 border rounded-lg bg-blue-50">
              <h3 className="font-bold text-blue-800 mb-2">
                Important but Not Urgent
              </h3>
              <p className="text-sm">
                Projects with at least 4 approvals but due beyond 30 days.
              </p>
            </div>
            <div className="p-4 border rounded-lg bg-gray-50">
              <h3 className="font-bold text-gray-800 mb-2">Not Urgent</h3>
              <p className="text-sm">
                Projects with fewer than 4 approvals and due beyond 30 days.
              </p>
            </div>
          </div>
          <Alert className="mt-4 bg-blue-50">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Note on Approvals</AlertTitle>
            <AlertDescription>
              Projects require a minimum of 4 approvals to move forward.
            </AlertDescription>
          </Alert>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PriorityMatrixDialog;
