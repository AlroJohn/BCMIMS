'use client';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge, CheckCircle, XCircle, FileText } from "lucide-react";

const DetailsDialog = () => {
    return (
        <Dialog open={showProjectDetails} onOpenChange={setShowProjectDetails}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Project Details</DialogTitle>
            <DialogDescription>
              {selectedProject && `Detailed information for "${selectedProject.name}"`}
            </DialogDescription>
          </DialogHeader>
        
          <div className="py-4">
            {selectedProject && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Project Details</h3>
                  <p className="font-medium">{selectedProject.name}</p>
                  <p className="text-sm text-gray-700">{selectedProject.description}</p>
                  <div className="mt-1 text-sm">
                    <span className="text-gray-500">Budget: </span>
                    <span className="font-medium">₱{selectedProject.budget.toLocaleString()}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Due Date: </span>
                    <span className="font-medium">
                      {selectedProject.dueDate.toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Proposed Date: </span>
                    <span className="font-medium">
                      {selectedProject.dateProposed.toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
        
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Current Status</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getStatusBadge(selectedProject.status)}>
                      {selectedProject.status}
                    </Badge>
                    {selectedProject.implementation && (
                      <Badge className="bg-purple-100 border-purple-200 text-purple-800">
                        {selectedProject.implementation.status} - {selectedProject.implementation.completion}% complete
                      </Badge>
                    )}
                  </div>
        
                  {selectedProject.status === "Rejected" && selectedProject.rejectionReason && (
                    <div className="p-3 border rounded-md bg-red-50 text-sm">
                      <p className="font-medium text-red-800">Rejection Reason:</p>
                      <p className="text-red-700">{selectedProject.rejectionReason}</p>
                    </div>
                  )}
        
                  {selectedProject.implementation && (
                    <div className="mt-2">
                      <div className="flex justify-between items-center text-sm">
                        <span>Implementation Progress:</span>
                        <span>{selectedProject.implementation.completion}%</span>
                      </div>
                      <Progress value={selectedProject.implementation.completion} className={getProgressClass()} />
        
                      <div className="grid grid-cols-2 gap-4 mt-3">
                        <div>
                          <p className="text-xs text-gray-500">Start Date</p>
                          <p className="text-sm">
                            {selectedProject.implementation.startDate.toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">End Date</p>
                          <p className="text-sm">
                            {selectedProject.implementation.endDate.toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
        
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Committee Approvals</h3>
                  <div className="border rounded-md p-3 bg-gray-50">
                    <div className="flex flex-col gap-2">
                      {selectedProject.approvals.map((approval: any, index: number) => {
                        // Get committee info based on committee ID
                        const committeeId = approval.committeeId;
                        const committeeKey = Object.keys(committeeInfoMap).find(key =>
                          committeeInfoMap[key as keyof typeof committeeInfoMap].id === committeeId
                        );
        
                        if (!committeeKey) {
                          return null;
                        }
        
                        const committeeName = committeeInfoMap[committeeKey as keyof typeof committeeInfoMap].name;
                        return (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm">{committeeName}</span>
                            {approval.approved ? (
                              <span className="inline-flex items-center text-green-600 text-sm">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approved
                              </span>
                            ) : (
                              <span className="inline-flex items-center text-gray-500 text-sm">
                                <XCircle className="h-4 w-4 mr-1" />
                                Not Approved
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
        
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Attached Document</h3>
                  <a
                    href={selectedProject.documentUrl}
                    className="flex items-center gap-2 p-3 border rounded-md hover:bg-gray-50"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-600">{selectedProject.documentTitle}</p>
                      <p className="text-xs text-gray-500">Click to view document</p>
                    </div>
                  </a>
                </div>
              </div>
            )}
          </div>
        
          <DialogFooter className="sm:justify-end">
            <Button variant="outline" onClick={() => setShowProjectDetails(false)}>
              Close
            </Button>
            {selectedProject && selectedProject.status === "Pending Approval" && (
              <Button variant="default">
                Edit Proposal
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
        </Dialog>
    );
};

export default DetailsDialog;