"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  Check,
  PenLine,
  Plus,
  Search,
  Trash2,
  UserPlus,
  UserCog,
  Filter,
  Download,
  MoreHorizontal
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import SessionGuard from "@/components/custom/guard/session-guard";

// Define user types
type UserStatus = "Active" | "Inactive" | "Pending";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  position: string;
  phone: string;
  status: UserStatus;
  lastActive: Date;
  dateAdded: Date;
  image?: string;
};

// Committee roles based on UserRole enum
const committeeRoles = [
  { id: "Admin", name: "Admin" },
  { id: "Education", name: "Committee on Education and Culture" },
  { id: "Environment", name: "Committee on Environment" },
  { id: "Finance", name: "Committee on Finance, Budget and Appropriations" },
  { id: "HealthServices", name: "Committee on Health and Services" },
  { id: "PeaceOrder", name: "Committee on Peace and Order" },
  { id: "PublicWorks", name: "Committee on Public Work and Infrastructure" },
  { id: "Women", name: "Committee on Women, Children and Family" },
  { id: "Staff", name: "Staff" }
];

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<UserStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // New state for success message

  // Edit User Dialog State
  const [showEditUserDialog, setShowEditUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editPosition, setEditPosition] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editStatus, setEditStatus] = useState<UserStatus>("Active");

  // Fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users/fetch-user");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();

        // Parse date strings into Date objects
        const formattedUsers = data.map((user: any) => ({
          ...user,
          lastActive: new Date(user.lastActive), // Parse lastActive
          dateAdded: new Date(user.dateAdded),   // Parse dateAdded
        }));

        setUsers(formattedUsers);
        setFilteredUsers(formattedUsers);
      } catch (error) {
        setError("Failed to fetch users. Please try again later.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on active tab, search term, and filters
  useEffect(() => {
    let result = [...users];

    // Filter by tab
    if (activeTab === "active") {
      result = result.filter(user => user.status === "Active");
    } else if (activeTab === "inactive") {
      result = result.filter(user => user.status === "Inactive");
    } else if (activeTab === "pending") {
      result = result.filter(user => user.status === "Pending");
    }

    // Filter by search term
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      result = result.filter(
        user =>
          user.name.toLowerCase().includes(lowercasedSearch) ||
          user.email.toLowerCase().includes(lowercasedSearch) ||
          user.position.toLowerCase().includes(lowercasedSearch) ||
          user.phone.includes(searchTerm)
      );
    }

    // Filter by committee/role
    if (selectedRole) {
      result = result.filter(user => user.role === selectedRole);
    }

    // Filter by status
    if (selectedStatus) {
      result = result.filter(user => user.status === selectedStatus);
    }

    setFilteredUsers(result);
  }, [users, searchTerm, activeTab, selectedRole, selectedStatus]);

  // Calculate statistics
  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.status === "Active").length;
  const inactiveUsers = users.filter(user => user.status === "Inactive").length;
  const pendingUsers = users.filter(user => user.status === "Pending").length;

  // Function to get status badge styling
  const getStatusBadge = (status: UserStatus) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200";
      case "Inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Open Edit User Dialog
  const openEditUserDialog = (user: User) => {
    setSelectedUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRole(user.role);
    setEditPosition(user.position);
    setEditPhone(user.phone);
    setEditStatus(user.status);
    setShowEditUserDialog(true);
  };

  // Handle Edit User
  const handleEditUser = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch(`/api/users/update-user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedUser.id,
          name: editName,
          email: editEmail,
          role: editRole,
          position: editPosition,
          phone: editPhone,
          status: editStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      // Update the user in the local state
      const updatedUsers = users.map((user) =>
        user.id === selectedUser.id
          ? {
              ...user,
              name: editName,
              email: editEmail,
              role: editRole,
              position: editPosition,
              phone: editPhone,
              status: editStatus,
            }
          : user
      );

      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      setShowEditUserDialog(false);
    } catch (error) {
      console.error("Error updating user:", error);
      setError("Failed to update user. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <SessionGuard requiredRoles={["Admin"]}>
      <div className="space-y-6 p-6">
        {/* Success Alert */}
        {successMessage && (
          <Alert className="bg-green-100 border-green-400 text-green-800">
            <Check className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Manage Users</h1>
            <p className="text-gray-500">Add, edit, and manage user accounts and permissions</p>
          </div>
        </div>

        {/* User Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Total Users</span>
                <span className="text-2xl font-bold">{users.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Active Users</span>
                <span className="text-2xl font-bold text-green-600">
                  {users.filter(user => user.status === "Active").length}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Inactive Users</span>
                <span className="text-2xl font-bold text-gray-600">
                  {users.filter(user => user.status === "Inactive").length}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Pending Users</span>
                <span className="text-2xl font-bold text-yellow-600">
                  {users.filter(user => user.status === "Pending").length}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users List */}
        <Card>
          <CardHeader className="pb-0">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle>User Accounts</CardTitle>
                <CardDescription>
                  Manage user accounts and their access permissions
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <div className="relative flex-grow">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search users..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Filter className="h-4 w-4" />
                      Filters
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Filter Users</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <div className="p-2">
                      <Label htmlFor="role-filter" className="text-xs block mb-1">Committee / Role</Label>
                      <Select
                        value={selectedRole || ""}
                        onValueChange={(value) => setSelectedRole(value || null)}
                      >
                        <SelectTrigger id="role-filter" className="w-full">
                          <SelectValue placeholder="All Committees" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Committees</SelectItem>
                          {committeeRoles.map((role) => (
                            <SelectItem key={role.id} value={role.id}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="p-2">
                      <Label htmlFor="status-filter" className="text-xs block mb-1">Status</Label>
                      <Select
                        value={selectedStatus || ""}
                        onValueChange={(value) => setSelectedStatus(value as UserStatus || null)}
                      >
                        <SelectTrigger id="status-filter" className="w-full">
                          <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Statuses</SelectItem>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <DropdownMenuSeparator />
                    <div className="p-2">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setSearchTerm("");
                          setSelectedRole(null);
                          setSelectedStatus(null);
                          setActiveTab("all");
                        }}
                        className="w-full justify-center text-sm"
                      >
                        Reset Filters
                      </Button>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
            <div className="px-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All Users ({users.length})</TabsTrigger>
                <TabsTrigger value="active">Active ({users.filter(user => user.status === "Active").length})</TabsTrigger>
                <TabsTrigger value="inactive">Inactive ({users.filter(user => user.status === "Inactive").length})</TabsTrigger>
                <TabsTrigger value="pending">Pending ({users.filter(user => user.status === "Pending").length})</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="m-0">
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Position & Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Active</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium uppercase overflow-hidden">
                                  {user.image ? (
                                    <img
                                      src={user.image}
                                      alt={user.name}
                                      className="w-10 h-10 object-cover"
                                    />
                                  ) : (
                                    user.name.charAt(0)
                                  )}
                                </div>
                                <div>
                                  <div className="font-medium">{user.name}</div>
                                  <div className="text-sm text-gray-500">{user.email}</div>
                                  <div className="text-xs text-gray-500">{user.phone}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {user.position}
                              </div>
                              <Badge variant="outline" className="font-normal mt-1">
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusBadge(user.status)}>
                                {user.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {user.lastActive instanceof Date && !isNaN(user.lastActive.getTime())
                                ? user.lastActive.toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })
                                : "Invalid Date"}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => openEditUserDialog(user)}>
                                    <PenLine className="h-4 w-4 mr-2" />
                                    Edit User
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center">
                            No users found. Try adjusting your filters.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Edit User Dialog */}
        <Dialog open={showEditUserDialog} onOpenChange={setShowEditUserDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update the details for {selectedUser?.name}.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditUserDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditUser}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </SessionGuard>
  );
}