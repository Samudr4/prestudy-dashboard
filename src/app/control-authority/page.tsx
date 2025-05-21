
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { mockPermissions, type Permission, type AdminRoleType } from "@/data/mock-data"; 
import { PlusCircle, Search, Edit, ShieldAlert } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

export default function ControlAuthorityPage() {
  const { setPageTitle } = usePageTitle();
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = React.useState(1);
  const permissionsPerPage = 10;
  const [searchTerm, setSearchTerm] = React.useState("");
  const [permissions, setPermissions] = React.useState<Permission[]>([...mockPermissions]);
  const [isAddPermissionDialogOpen, setIsAddPermissionDialogOpen] = React.useState(false);

  // Form state for Add/Edit Dialog
  const [featureName, setFeatureName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [selectedRoles, setSelectedRoles] = React.useState<AdminRoleType[]>([]);

  React.useEffect(() => {
    setPageTitle("Control Authority");
    setPermissions([...mockPermissions]);
  }, [setPageTitle]);

  const filteredPermissions = permissions.filter(permission =>
    permission.featureName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    permission.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedPermissions = filteredPermissions.slice(
    (currentPage - 1) * permissionsPerPage,
    currentPage * permissionsPerPage
  );
  const totalPages = Math.ceil(filteredPermissions.length / permissionsPerPage);

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

  const handleAddPermissionSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
     const newPermission: Permission = {
      id: `perm${permissions.length + 1 + Date.now()}`,
      featureName,
      description,
      rolesAllowed: selectedRoles,
      lastModified: new Date().toISOString().split('T')[0],
    };
    setPermissions(prev => [newPermission, ...prev]);
    mockPermissions.unshift(newPermission); // Add to global for demo
    
    toast({ title: "Permission Added", description: `Permission "${newPermission.featureName}" has been added.` });
    setIsAddPermissionDialogOpen(false);
    // Reset form
    setFeatureName("");
    setDescription("");
    setSelectedRoles([]);
  };
  
  const adminRoleTypes: AdminRoleType[] = ["Super Admin", "Content Manager", "User Manager", "Support Staff"];

  const handleRoleCheckboxChange = (role: AdminRoleType, checked: boolean | 'indeterminate') => {
    if (checked) {
      setSelectedRoles(prev => [...prev, role]);
    } else {
      setSelectedRoles(prev => prev.filter(r => r !== role));
    }
  };


  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Control Authority & Permissions</CardTitle>
              <CardDescription>Manage feature access permissions for different admin roles.</CardDescription>
            </div>
            <Dialog open={isAddPermissionDialogOpen} onOpenChange={setIsAddPermissionDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setIsAddPermissionDialogOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add New Permission
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Permission</DialogTitle>
                  <DialogDescription>
                    Define a new feature and assign roles that can access it.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddPermissionSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-1">
                      <Label htmlFor="featureName">Feature Name</Label>
                      <Input id="featureName" name="featureName" value={featureName} onChange={e => setFeatureName(e.target.value)} required />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" name="description" value={description} onChange={e => setDescription(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Allowed Roles</Label>
                      {adminRoleTypes.map(role => (
                        <div key={role} className="flex items-center space-x-2">
                          <Checkbox 
                            id={role} 
                            name={role} 
                            checked={selectedRoles.includes(role)}
                            onCheckedChange={(checked) => handleRoleCheckboxChange(role, checked)}
                          />
                          <Label htmlFor={role} className="font-normal">{role}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <DialogFooter>
                     <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                    <Button type="submit">Save Permission</Button>
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
                placeholder="Search by feature name or description..." 
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
                  <TableHead>Feature Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Allowed Roles</TableHead>
                  <TableHead>Last Modified</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPermissions.map((permission) => (
                  <TableRow key={permission.id}>
                    <TableCell className="font-medium">{permission.featureName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-md truncate">{permission.description}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {permission.rolesAllowed.map(role => (
                          <Badge key={role} variant="secondary">{role}</Badge>
                        ))}
                        {permission.rolesAllowed.length === 0 && <Badge variant="outline">None</Badge>}
                      </div>
                    </TableCell>
                    <TableCell>{permission.lastModified}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary" onClick={() => toast({title: "Edit Permission Clicked", description: `Editing ${permission.featureName}. (Not Implemented)`})}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit Permission</span>
                      </Button>
                       {/* Delete for permissions is less common, usually edit. Add if needed. */}
                    </TableCell>
                  </TableRow>
                ))}
                {paginatedPermissions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No permissions found.
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
