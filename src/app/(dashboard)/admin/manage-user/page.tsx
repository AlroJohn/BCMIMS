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
  id: number;
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

// Committee roles based on provided officials data
const committeeRoles = [
  { id: "captain", name: "Captain" },
  { id: "education", name: "Committee on Education and Culture" },
  { id: "public-works", name: "Committee on Public Work and Infrastructure" },
  { id: "peace-order", name: "Committee on Peace and Order" },
  { id: "finance", name: "Committee on Finance, Budget and Appropriations" },
  { id: "health", name: "Committee on Health and Services" },
  { id: "women", name: "Committee on Women, Children and Family" },
  { id: "environment", name: "Committee on Environment" },
  { id: "staff", name: "Staff" }
];

// Sample user data based on provided officials
const sampleUsers: User[] = [
  {
    id: 1,
    name: "Benjamin D. Rosin",
    position: "Barangay Captain",
    email: "Captain@barangay.gov.ph",
    phone: "09154059163",
    role: "Captain",
    status: "Active",
    lastActive: new Date(2025, 2, 10),
    dateAdded: new Date(2024, 6, 15),
    image: "/images/officials/chairperson.jpg"
  },
  {
    id: 2,
    name: "Baberly A. De Baguio",
    position: "Committee on Education and Culture",
    email: "Education@barangay.gov.ph",
    phone: "09630305154",
    role: "Committee on Education and Culture",
    status: "Active",
    lastActive: new Date(2025, 2, 9),
    dateAdded: new Date(2024, 7, 1),
    image: "/images/officials/kagawad1.jpg"
  },
  {
    id: 3,
    name: "Roderick A. Madronio",
    position: "Committee on Public Work and Infrastructure",
    email: "Publicwork@barangay.gov.ph",
    phone: "09564182754",
    role: "Committee on Public Work and Infrastructure",
    status: "Active",
    lastActive: new Date(2025, 2, 6),
    dateAdded: new Date(2024, 7, 25),
    image: "/images/officials/kagawad2.jpg"
  },
  {
    id: 4,
    name: "Francis Alejo",
    position: "Committee on Peace and Order",
    email: "Peace@barangay.gov.ph",
    phone: "09915171977",
    role: "Committee on Peace and Order",
    status: "Active",
    lastActive: new Date(2025, 2, 5),
    dateAdded: new Date(2024, 7, 20),
    image: "/images/officials/kagawad3.jpg"
  },
  {
    id: 5,
    name: "Emma M. Jadie",
    position: "Committee on Finance, Budget and Appropriations",
    email: "Finance@barangay.gov.ph",
    phone: "09925609960",
    role: "Committee on Finance, Budget and Appropriations",
    status: "Active",
    lastActive: new Date(2025, 2, 11),
    dateAdded: new Date(2024, 7, 10),
    image: "/images/officials/kagawad4.jpg"
  },
  {
    id: 6,
    name: "Edna J. Padre",
    position: "Committee on Health and Services",
    email: "Health@barangay.gov.ph",
    phone: "09564182754",
    role: "Committee on Health and Services",
    status: "Active",
    lastActive: new Date(2025, 2, 7),
    dateAdded: new Date(2024, 7, 15),
    image: "/images/officials/kagawad5.jpg"
  },
  {
    id: 7,
    name: "Emma M. Jadie",
    position: "Committee on Women, Children and Family",
    email: "Women@barangay.gov.ph",
    phone: "09630305154",
    role: "Committee on Women, Children and Family",
    status: "Active",
    lastActive: new Date(2025, 2, 12),
    dateAdded: new Date(2024, 7, 12),
    image: "/images/officials/kagawad6.jpg"
  },
  {
    id: 8,
    name: "Wilfranz B. Correa",
    position: "Committee on Environment",
    email: "Environment@barangay.gov.ph",
    phone: "09813878957",
    role: "Committee on Environment",
    status: "Active",
    lastActive: new Date(2025, 2, 8),
    dateAdded: new Date(2024, 7, 5),
    image: "/images/officials/kagawad7.jpg"
  },
  {
    id: 9,
    name: "Maria Santos",
    position: "Administrative Staff",
    email: "maria.santos@barangay.gov.ph",
    phone: "09123456789",
    role: "Staff",
    status: "Active",
    lastActive: new Date(2025, 2, 3),
    dateAdded: new Date(2024, 8, 5),
    image: ""
  },
  {
    id: 10,
    name: "Juan Dela Cruz",
    position: "Technical Support",
    email: "juan.delacruz@barangay.gov.ph",
    phone: "09987654321",
    role: "Staff",
    status: "Inactive",
    lastActive: new Date(2025, 1, 15),
    dateAdded: new Date(2024, 8, 10),
    image: ""
  }
];

// Available user roles - using the committee titles
const userRoles = committeeRoles.map(role => role.name);

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>(sampleUsers);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(sampleUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<UserStatus | null>(null);

  // Dialog states
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [showEditUserDialog, setShowEditUserDialog] = useState(false);
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Form states for new user
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("");
  const [newUserPosition, setNewUserPosition] = useState("");
  const [newUserPhone, setNewUserPhone] = useState("");
  const [newUserStatus, setNewUserStatus] = useState<UserStatus>("Active");

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

  // Function to handle adding a new user
  const handleAddUser = () => {
    const newUser: User = {
      id: users.length + 1,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      position: newUserPosition,
      phone: newUserPhone,
      status: newUserStatus,
      lastActive: new Date(),
      dateAdded: new Date(),
      image: ""
    };

    setUsers([...users, newUser]);
    resetFormState();
    setShowAddUserDialog(false);
  };

  // Function to handle editing a user
  const handleEditUser = () => {
    if (!selectedUser) return;

    const updatedUsers = users.map(user => {
      if (user.id === selectedUser.id) {
        return {
          ...user,
          name: newUserName,
          email: newUserEmail,
          role: newUserRole,
          position: newUserPosition,
          phone: newUserPhone,
          status: newUserStatus
        };
      }
      return user;
    });

    setUsers(updatedUsers);
    resetFormState();
    setShowEditUserDialog(false);
  };

  // Function to handle deleting a user
  const handleDeleteUser = () => {
    if (!selectedUser) return;

    const updatedUsers = users.filter(user => user.id !== selectedUser.id);
    setUsers(updatedUsers);
    setSelectedUser(null);
    setShowDeleteConfirmDialog(false);
  };

  // Function to open the edit user dialog
  const openEditUserDialog = (user: User) => {
    setSelectedUser(user);
    setNewUserName(user.name);
    setNewUserEmail(user.email);
    setNewUserRole(user.role);
    setNewUserPosition(user.position);
    setNewUserPhone(user.phone);
    setNewUserStatus(user.status);
    setShowEditUserDialog(true);
  };

  // Function to open the delete confirmation dialog
  const openDeleteConfirmDialog = (user: User) => {
    setSelectedUser(user);
    setShowDeleteConfirmDialog(true);
  };

  // Function to reset form state
  const resetFormState = () => {
    setNewUserName("");
    setNewUserEmail("");
    setNewUserRole("");
    setNewUserPosition("");
    setNewUserPhone("");
    setNewUserStatus("Active");
    setSelectedUser(null);
  };

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

  // Function to reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedRole(null);
    setSelectedStatus(null);
    setActiveTab("all");
  };

  return (
    <SessionGuard requiredRoles={["Admin"]}>
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Manage Users</h1>
          <p className="text-gray-500">Add, edit, and manage user accounts and permissions</p>
        </div>
        <Button onClick={() => setShowAddUserDialog(true)} className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add New User
        </Button>
      </div>

      {/* User Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Total Users</span>
              <span className="text-2xl font-bold">{totalUsers}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Active Users</span>
              <span className="text-2xl font-bold text-green-600">{activeUsers}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Inactive Users</span>
              <span className="text-2xl font-bold text-gray-600">{inactiveUsers}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Pending Users</span>
              <span className="text-2xl font-bold text-yellow-600">{pendingUsers}</span>
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
                          <SelectItem key={role.id} value={role.name}>
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
                      onClick={resetFilters}
                      className="w-full justify-center text-sm"
                    >
                      Reset Filters
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Export as Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Export as PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Users ({totalUsers})</TabsTrigger>
              <TabsTrigger value="active">Active ({activeUsers})</TabsTrigger>
              <TabsTrigger value="inactive">Inactive ({inactiveUsers})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({pendingUsers})</TabsTrigger>
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
                            {user.lastActive.toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
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
                                <DropdownMenuItem>
                                  <UserCog className="h-4 w-4 mr-2" />
                                  Change Password
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => openDeleteConfirmDialog(user)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete User
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

          <TabsContent value="active" className="m-0">
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
                            {user.lastActive.toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
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
                                <DropdownMenuItem>
                                  <UserCog className="h-4 w-4 mr-2" />
                                  Change Password
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => openDeleteConfirmDialog(user)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No active users found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </TabsContent>

          <TabsContent value="inactive" className="m-0">
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
                            {user.lastActive.toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
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
                                <DropdownMenuItem>
                                  <UserCog className="h-4 w-4 mr-2" />
                                  Change Password
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => openDeleteConfirmDialog(user)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No inactive users found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </TabsContent>

          <TabsContent value="pending" className="m-0">
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Position & Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date Added</TableHead>
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
                            {user.dateAdded.toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
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
                                <DropdownMenuItem>
                                  <UserCog className="h-4 w-4 mr-2" />
                                  Change Password
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => openDeleteConfirmDialog(user)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No pending users found.
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

      {/* Add User Dialog */}
      <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account with appropriate access permissions.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter user's full name"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter user's email address"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="Enter user's phone number"
                value={newUserPhone}
                onChange={(e) => setNewUserPhone(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Committee/Role</Label>
                <Select
                  value={newUserRole}
                  onValueChange={setNewUserRole}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {committeeRoles.map((role) => (
                      <SelectItem key={role.id} value={role.name}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Account Status</Label>
                <Select
                  value={newUserStatus}
                  onValueChange={(value) => setNewUserStatus(value as UserStatus)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position/Title</Label>
              <Input
                id="position"
                placeholder="Enter user's position or title"
                value={newUserPosition}
                onChange={(e) => setNewUserPosition(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-avatar">Profile Photo</Label>
              <Input
                id="user-avatar"
                type="file"
                accept="image/*"
                className="cursor-pointer"
              />
              <p className="text-xs text-gray-500">Upload a profile photo (optional).</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddUserDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddUser}
              disabled={!newUserName || !newUserEmail || !newUserRole}
            >
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={showEditUserDialog} onOpenChange={setShowEditUserDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              {selectedUser && `Update information for ${selectedUser.name}`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                placeholder="Enter user's full name"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">Email Address</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="Enter user's email address"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone Number</Label>
              <Input
                id="edit-phone"
                placeholder="Enter user's phone number"
                value={newUserPhone}
                onChange={(e) => setNewUserPhone(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-role">Committee/Role</Label>
                <Select
                  value={newUserRole}
                  onValueChange={setNewUserRole}
                >
                  <SelectTrigger id="edit-role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {committeeRoles.map((role) => (
                      <SelectItem key={role.id} value={role.name}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-status">Account Status</Label>
                <Select
                  value={newUserStatus}
                  onValueChange={(value) => setNewUserStatus(value as UserStatus)}
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-position">Position/Title</Label>
              <Input
                id="edit-position"
                placeholder="Enter user's position or title"
                value={newUserPosition}
                onChange={(e) => setNewUserPosition(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-avatar">Change Profile Photo</Label>
              <Input
                id="edit-avatar"
                type="file"
                accept="image/*"
                className="cursor-pointer"
              />
              <p className="text-xs text-gray-500">Upload a new profile photo (optional).</p>
            </div>

            {selectedUser && selectedUser.image && (
              <div className="space-y-2">
                <Label className="block mb-1">Current Photo</Label>
                <div className="w-16 h-16 rounded-full overflow-hidden border">
                  <img
                    src={selectedUser.image}
                    alt={selectedUser.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditUserDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleEditUser}
              disabled={!newUserName || !newUserEmail || !newUserRole}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirmDialog} onOpenChange={setShowDeleteConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">Confirm Deletion</DialogTitle>
            <DialogDescription>
              {selectedUser && `Are you sure you want to delete the user account for ${selectedUser.name}? This action cannot be undone.`}
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="py-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  Deleting this user will remove all associated data and permissions. This action is permanent.
                </AlertDescription>
              </Alert>

              <div className="border rounded-md p-3 mt-4 bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium uppercase overflow-hidden">
                    {selectedUser.image ? (
                      <img
                        src={selectedUser.image}
                        alt={selectedUser.name}
                        className="w-10 h-10 object-cover"
                      />
                    ) : (
                      selectedUser.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{selectedUser.name}</div>
                    <div className="text-sm text-gray-500">{selectedUser.email}</div>
                    <div className="text-sm text-gray-500">{selectedUser.role}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirmDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
            >
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </SessionGuard>
  );
}