
"use client";

import * as React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockAdminUsers, type AdminUser, type AdminRoleType } from "@/data/mock-data"; 
import { PlusCircle, MoreVertical, Search, UserCog, Edit, Trash2, ShieldCheck, ShieldOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePageTitle } from '@/contexts/PageTitleContext';
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";


const AdminStatusBadge = ({ status }: { status: AdminUser["status"] }) => {
  const statusConfig = {
    Active: { color: "bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300 border-green-300 dark:border-green-600", icon: ShieldCheck },
    Suspended: { color: "bg-red-100 text-red-700 dark:bg-red-700/30 dark:text-red-300 border-red-300 dark:border-red-600", icon: ShieldOff },
  };
  const config = statusConfig[status];
  const Icon = config.icon;
  return (
    <Badge variant="outline" className={cn("capitalize items-center gap-1", config.color)}>
      <Icon className="h-3.5 w-3.5" />
      {status}
    </Badge>
  );
};

const AdminRoleBadge = ({ role }: { role: AdminRoleType }) => {
  let colorClass = "bg-blue-100 text-blue-700 dark:bg-blue-700/30 dark:text-blue-300 border-blue-300 dark:border-blue-600";
  if (role === "Super Admin") colorClass = "bg-purple-100 text-purple-700 dark:bg-purple-700/30 dark:text-purple-300 border-purple-300 dark:border-purple-600";
  if (role === "Content Manager") colorClass = "bg-orange-100 text-orange-700 dark:bg-orange-700/30 dark:text-orange-300 border-orange-300 dark:border-orange-600";
  
  return <Badge variant="outline" className={cn(colorClass)}>{role}</Badge>;
};

export default function AdminRolePage() {
  const { setPageTitle } = usePageTitle();
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = React.useState(1);
  const adminsPerPage = 10;
  const [searchTerm, setSearchTerm] = React.useState("");
  const [adminUsers, setAdminUsers] = React.useState<AdminUser[]>([...mockAdminUsers]);
  const [isAddAdminDialogOpen, setIsAddAdminDialogOpen] = React.useState(false);
  
  // Form state for Add/Edit Dialog (simplified for Add initially)
  const [adminName, setAdminName] = React.useState("");
  const [adminEmail, setAdminEmail] = React.useState("");
  const [adminRole, setAdminRole] = React.useState<AdminRoleType>("Support Staff");
  const [adminStatus, setAdminStatus] = React.useState<AdminUser["status"]>("Active");


  React.useEffect(() => {
    setPageTitle("Admin Roles");
    setAdminUsers([...mockAdminUsers]);
  }, [setPageTitle]);

  const filteredAdmins = adminUsers.filter(admin =>
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedAdmins = filteredAdmins.slice(
    (currentPage - 1) * adminsPerPage,
    currentPage * adminsPerPage
  );
  const totalPages = Math.ceil(filteredAdmins.length / adminsPerPage);

  const getPaginationItems = () => {
    const items = [];
    if (totalPages <= 5) { for (let i = 1; i <= totalPages; i++) items.push(i); } 
    else {
      items.push(1); 
      if (currentPage > 3) items.push('ellipsis-start');
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      if (currentPage <=3) { startPage = 2; endPage = Math.min(totalPages - 1, 4); } 
      else if (currentPage >= totalPages - 2) { startPage = Math.max(2, totalPages - 3); endPage = totalPages - 1; }
      for (let i = startPage; i <= endPage; i++) items.push(i);
      if (currentPage < totalPages - 2 && endPage < totalPages -1) items.push('ellipsis-end');
      if (totalPages > 1) items.push(totalPages); 
    }
    return items;
  };

  const handleAddAdminSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newAdmin: AdminUser = {
      id: `admin${adminUsers.length + 1 + Date.now()}`,
      name: adminName,
      email: adminEmail,
      role: adminRole,
      status: adminStatus,
      lastLogin: new Date().toLocaleString(),
      avatarUrl: `https://placehold.co/40x40.png?text=${adminName.substring(0,1).toUpperCase()}`
    };
    setAdminUsers(prev => [newAdmin, ...prev]);
    mockAdminUsers.unshift(newAdmin); // Add to global for demo persistence
    
    toast({ title: "Admin User Added", description: `Admin ${newAdmin.name} has been added.`});
    setIsAddAdminDialogOpen(false);
    // Reset form fields
    setAdminName("");
    setAdminEmail("");
    setAdminRole("Support Staff");
    setAdminStatus("Active");
  };
  
  const adminRoleTypes: AdminRoleType[] = ["Super Admin", "Content Manager", "User Manager", "Support Staff"];

  const handleAdminStatusToggle = (adminId: string, currentStatus: AdminUser["status"]) => {
    const newStatus = currentStatus === "Active" ? "Suspended" : "Active";
    setAdminUsers(prev => prev.map(admin => admin.id === adminId ? {...admin, status: newStatus, lastLogin: new Date().toLocaleString()} : admin));
    const globalIndex = mockAdminUsers.findIndex(admin => admin.id === adminId);
    if (globalIndex > -1) mockAdminUsers[globalIndex] = {...mockAdminUsers[globalIndex], status: newStatus, lastLogin: new Date().toLocaleString()};

    toast({ title: `Admin ${newStatus}`, description: `Admin user has been ${newStatus.toLowerCase()}.` });
  };

  const handleDeleteAdmin = (adminId: string) => {
    const adminToDelete = adminUsers.find(admin => admin.id === adminId);
    setAdminUsers(prev => prev.filter(admin => admin.id !== adminId));
    const globalIndex = mockAdminUsers.findIndex(admin => admin.id === adminId);
    if (globalIndex > -1) mockAdminUsers.splice(globalIndex, 1);

    toast({ title: "Admin User Removed", description: `Admin ${adminToDelete?.name} has been removed.`, variant: "destructive"});
  };


  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Admin User Management</CardTitle>
              <CardDescription>Manage admin users and their roles within the platform.</CardDescription>
            </div>
            <Dialog open={isAddAdminDialogOpen} onOpenChange={setIsAddAdminDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setIsAddAdminDialogOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add New Admin
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Admin User</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new admin user.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddAdminSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">Name</Label>
                      <Input id="name" name="name" value={adminName} onChange={(e) => setAdminName(e.target.value)} className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">Email</Label>
                      <Input id="email" name="email" type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="role" className="text-right">Role</Label>
                      <Select name="role" value={adminRole} onValueChange={(value: AdminRoleType) => setAdminRole(value)} required>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          {adminRoleTypes.map(role => (
                            <SelectItem key={role} value={role}>{role}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="status" className="text-right">Status</Label>
                       <Select name="status" value={adminStatus} onValueChange={(value: AdminUser["status"]) => setAdminStatus(value)} >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Suspended">Suspended</SelectItem>
                          </SelectContent>
                        </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                    <Button type="submit">Save Admin</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex flex-col items-stretch gap-4 p-4 md:flex-row md:items-center md:justify-between border-b">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name, email, or role..." 
                className="pl-8 w-full" 
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1);}}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedAdmins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={admin.avatarUrl} alt={admin.name} data-ai-hint="person portrait" />
                          <AvatarFallback>{admin.name.substring(0,2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{admin.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell><AdminRoleBadge role={admin.role} /></TableCell>
                    <TableCell>{admin.lastLogin}</TableCell>
                    <TableCell><AdminStatusBadge status={admin.status} /></TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => toast({title: "Edit Role Clicked", description: `Editing ${admin.name}. (Not Implemented)`})}><Edit className="mr-2 h-4 w-4" /> Edit Role</DropdownMenuItem>
                           {admin.status === "Active" ? (
                            <DropdownMenuItem onClick={() => handleAdminStatusToggle(admin.id, admin.status)} className="text-orange-600 focus:text-orange-700"><ShieldOff className="mr-2 h-4 w-4" /> Suspend</DropdownMenuItem>
                           ) : (
                            <DropdownMenuItem onClick={() => handleAdminStatusToggle(admin.id, admin.status)} className="text-green-600 focus:text-green-700"><ShieldCheck className="mr-2 h-4 w-4" /> Activate</DropdownMenuItem>
                           )}
                          <DropdownMenuSeparator/>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive/90">
                                <Trash2 className="mr-2 h-4 w-4" /> Remove Admin
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently remove the admin user "{admin.name}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteAdmin(admin.id)} className={buttonVariants({ variant: "destructive" })}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {paginatedAdmins.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No admin users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-end gap-4 border-t p-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem><PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(prev => Math.max(1, prev - 1)); }} className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined} aria-disabled={currentPage === 1}/></PaginationItem>
                  {getPaginationItems().map((item, index) =>
                    typeof item === 'number' ? (
                      <PaginationItem key={index}><PaginationLink href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(item); }} isActive={currentPage === item}>{item}</PaginationLink></PaginationItem>
                    ) : (<PaginationEllipsis key={item + index.toString()} />)
                  )}
                  <PaginationItem><PaginationNext href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(prev => Math.min(totalPages, prev + 1)); }} className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined} aria-disabled={currentPage === totalPages}/></PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
