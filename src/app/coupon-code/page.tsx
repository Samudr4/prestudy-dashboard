
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
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
import {
  PlusCircle,
  Edit,
  Trash2,
  Search,
  ListFilter,
  MoreVertical,
  CalendarIcon,
  Ticket,
  CheckCircle2,
  Users,
  XCircle,
  DollarSign,
  Percent
} from "lucide-react";
import { usePageTitle } from "@/contexts/PageTitleContext";
import { mockCoupons, mockCouponStats, mockCustomers, mockDiscoverCategories, type Coupon, type CouponStatSummary, type DiscountType, type AssignmentType, type CouponStatus } from "@/data/mock-data";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const couponFormSchema = z.object({
  code: z.string().min(3, "Coupon code must be at least 3 characters").max(20),
  description: z.string().min(5, "Description is required").max(100),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.coerce.number().positive("Discount value must be positive"),
  startDate: z.date({ required_error: "Start date is required." }),
  expiryDate: z.date({ required_error: "Expiry date is required." }),
  usageLimit: z.coerce.number().int().positive("Usage limit must be a positive integer"),
  minPurchaseAmount: z.coerce.number().nonnegative("Minimum purchase must be non-negative").optional(),
  assignmentType: z.enum(["all_users", "specific_user", "all_categories", "specific_categories"]),
  assignedToUser: z.string().optional(),
  assignedToCategories: z.array(z.string()).optional(),
  status: z.boolean(), // true for active, false for inactive
}).refine(data => {
    if (data.assignmentType === "specific_user" && !data.assignedToUser) {
        return false;
    }
    return true;
}, {
    message: "User selection is required for 'Specific User' assignment.",
    path: ["assignedToUser"],
}).refine(data => {
    if (data.assignmentType === "specific_categories" && (!data.assignedToCategories || data.assignedToCategories.length === 0)) {
        return false;
    }
    return true;
}, {
    message: "Category selection is required for 'Specific Categories' assignment.",
    path: ["assignedToCategories"],
});

type CouponFormValues = z.infer<typeof couponFormSchema>;

const CouponSummaryCard = ({ title, value, icon: Icon, iconColor }: CouponStatSummary) => (
  <Card className="shadow-sm">
    <CardHeader className="pb-2 flex flex-row items-center justify-between">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className={cn("h-5 w-5", iconColor)} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

const CouponStatusBadge = ({ status }: { status: CouponStatus }) => {
  const statusConfig = {
    active: { text: "Active", color: "bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300 border-green-300 dark:border-green-600" },
    inactive: { text: "Inactive", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-700/30 dark:text-yellow-300 border-yellow-300 dark:border-yellow-600" },
    expired: { text: "Expired", color: "bg-red-100 text-red-700 dark:bg-red-700/30 dark:text-red-300 border-red-300 dark:border-red-600" },
  };
  const config = statusConfig[status];
  return <Badge variant="outline" className={cn("capitalize", config.color)}>{config.text}</Badge>;
};


export default function CouponCodePage() {
  const { setPageTitle } = usePageTitle();
  const { toast } = useToast();
  const [coupons, setCoupons] = React.useState<Coupon[]>([...mockCoupons]);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const couponsPerPage = 7;
  const [searchTerm, setSearchTerm] = React.useState(""); // Added for search functionality

  React.useEffect(() => {
    setPageTitle("Coupon Management");
    setCoupons([...mockCoupons]); // Re-sync with global mock data on mount or if mockCoupons changes
  }, [setPageTitle]);


  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponFormSchema),
    defaultValues: {
      code: "",
      description: "",
      discountType: "percentage",
      discountValue: 10,
      startDate: new Date(),
      expiryDate: new Date(new Date().setDate(new Date().getDate() + 30)), // Default 30 days expiry
      usageLimit: 100,
      minPurchaseAmount: 0,
      assignmentType: "all_users",
      assignedToUser: undefined,
      assignedToCategories: [],
      status: true,
    },
  });

  const assignmentType = form.watch("assignmentType");

  function onSubmit(data: CouponFormValues) {
    const newCoupon: Coupon = {
        id: `cpn${coupons.length + 1 + Date.now()}`,
        code: data.code,
        description: data.description,
        discountType: data.discountType,
        discountValue: data.discountValue,
        startDate: data.startDate,
        expiryDate: data.expiryDate,
        usageLimit: data.usageLimit,
        usedCount: 0, // New coupons start with 0 used
        minPurchaseAmount: data.minPurchaseAmount,
        assignmentType: data.assignmentType,
        assignedToUser: data.assignedToUser,
        assignedToCategories: data.assignedToCategories,
        status: data.status ? "active" : "inactive",
    };

    setCoupons(prev => [newCoupon, ...prev]); // Add to local state
    // Also add to global mockCoupons for persistence across navigation (demo only)
    mockCoupons.unshift(newCoupon);


    toast({
      title: "Coupon Created",
      description: `Coupon ${data.code} has been successfully created.`,
    });
    form.reset();
    setIsFormOpen(false);
  }
  
  const filteredCoupons = React.useMemo(() => {
    return coupons.filter(coupon => 
        coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coupon.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [coupons, searchTerm]);


  const paginatedCoupons = filteredCoupons.slice(
    (currentPage - 1) * couponsPerPage,
    currentPage * couponsPerPage
  );
  const totalPages = Math.ceil(filteredCoupons.length / couponsPerPage);

  const getPaginationItems = () => {
    const items = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) items.push(i);
    } else {
      items.push(1);
      if (currentPage > 3) items.push('ellipsis-start');
      
      let startPageNum = Math.max(2, currentPage - 1);
      let endPageNum = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        startPageNum = 2;
        endPageNum = Math.min(totalPages - 1, 4);
      } else if (currentPage >= totalPages - 2) {
        startPageNum = Math.max(2, totalPages - 3);
        endPageNum = totalPages - 1;
      }
      
      for (let i = startPageNum; i <= endPageNum; i++) items.push(i);
      
      if (currentPage < totalPages - 2 && endPageNum < totalPages -1) items.push('ellipsis-end');
      if (totalPages > 1) items.push(totalPages);
    }
    return items;
  };
  
  const handleGenerateCode = () => {
    const randomCode = `PRESTUDY${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    form.setValue("code", randomCode);
  };

  const handleDeleteCoupon = (couponId: string) => {
    setCoupons(prev => prev.filter(c => c.id !== couponId));
    // Also remove from global mockCoupons (demo only)
    const index = mockCoupons.findIndex(c => c.id === couponId);
    if (index > -1) mockCoupons.splice(index, 1);
    toast({
        title: "Coupon Deleted",
        description: "The coupon has been removed.",
        variant: "destructive",
    });
  };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground md:hidden">Coupon Management</h1>
        <div className="flex items-center gap-2 ml-auto">
          <Button onClick={() => setIsFormOpen(!isFormOpen)}>
            <PlusCircle className="mr-2 h-4 w-4" /> {isFormOpen ? "Cancel" : "Add New Coupon"}
          </Button>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {mockCouponStats.map(stat => (
          <CouponSummaryCard key={stat.title} {...stat} />
        ))}
      </section>

      {isFormOpen && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Create New Coupon</CardTitle>
            <CardDescription>Fill in the details to generate a new coupon code.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Coupon Code</FormLabel>
                        <div className="flex gap-2">
                          <FormControl>
                            <Input placeholder="E.g., SUMMER25" {...field} />
                          </FormControl>
                          <Button type="button" variant="outline" onClick={handleGenerateCode}>Generate</Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Brief description of the coupon" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="discountType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select discount type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="percentage">Percentage (%)</SelectItem>
                            <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="discountValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount Value</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder={form.getValues("discountType") === "percentage" ? "E.g., 10 for 10%" : "E.g., 100 for ₹100"} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="minPurchaseAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min Purchase (₹, optional)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="E.g., 500" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date(new Date().setHours(0,0,0,0)) }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="expiryDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Expiry Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < (form.getValues("startDate") || new Date())}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="usageLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Usage Limit</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="E.g., 100" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="assignmentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assign To</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select assignment type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="all_users">All Users</SelectItem>
                            <SelectItem value="specific_user">Specific User</SelectItem>
                            <SelectItem value="all_categories">All Categories</SelectItem>
                            <SelectItem value="specific_categories">Specific Categories</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {assignmentType === "specific_user" && (
                    <FormField
                      control={form.control}
                      name="assignedToUser"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select User</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a user" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {mockCustomers.map(customer => (
                                <SelectItem key={customer.id} value={customer.id}>
                                  {customer.name} ({customer.email})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  {assignmentType === "specific_categories" && (
                    <FormField
                      control={form.control}
                      name="assignedToCategories"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Categories</FormLabel>
                          <Select onValueChange={(value) => field.onChange(value ? [value] : [])} >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select categories (multiple can be implemented with custom component)" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {mockDiscoverCategories.map(category => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                           <FormDescription>For multiple categories, a custom multi-select component would be better.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
                
                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm col-span-full md:col-span-1">
                            <div className="space-y-0.5">
                                <FormLabel>Coupon Status</FormLabel>
                                <FormDescription>
                                    {field.value ? "Coupon is active and can be used." : "Coupon is inactive and cannot be used."}
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />


                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => { form.reset(); setIsFormOpen(false); }}>Cancel</Button>
                    <Button type="submit">Create Coupon</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Manage Coupons</CardTitle>
              <CardDescription>View and manage all existing coupon codes.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-full md:max-w-xs">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search coupons..." className="pl-8 w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <Button variant="outline" size="icon" onClick={() => toast({ title: "Filter Clicked", description: "This feature is not yet implemented."})}>
                <ListFilter className="h-4 w-4" />
                <span className="sr-only">Filter</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Valid Dates</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCoupons.map((coupon) => (
                  <TableRow key={coupon.id}>
                    <TableCell className="font-medium">{coupon.code}</TableCell>
                    <TableCell>
                      {coupon.discountType === "percentage"
                        ? `${coupon.discountValue}%`
                        : `₹${coupon.discountValue}`}
                    </TableCell>
                    <TableCell>
                      {format(coupon.startDate, "dd MMM yyyy")} - {format(coupon.expiryDate, "dd MMM yyyy")}
                    </TableCell>
                    <TableCell>{coupon.usedCount}/{coupon.usageLimit}</TableCell>
                    <TableCell className="capitalize">
                      {coupon.assignmentType === "specific_user" ? `User: ${mockCustomers.find(c=>c.id === coupon.assignedToUser)?.name || coupon.assignedToUser || 'N/A'}` : 
                       coupon.assignmentType === "specific_categories" ? `Categories: ${coupon.assignedToCategories?.map(catId => mockDiscoverCategories.find(c=>c.id === catId)?.title).join(', ') || 'N/A'}` :
                       coupon.assignmentType.replace("_", " ")}
                    </TableCell>
                    <TableCell>
                      <CouponStatusBadge status={coupon.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary" onClick={() => toast({ title: "Edit Coupon Clicked", description: `Editing ${coupon.code}. (Not implemented)`})}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit Coupon</span>
                      </Button>
                       <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive/80">
                            <Trash2 className="h-4 w-4" />
                             <span className="sr-only">Delete Coupon</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the coupon "{coupon.code}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteCoupon(coupon.id)} className={buttonVariants({ variant: "destructive" })}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
                {paginatedCoupons.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No coupons found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        {totalPages > 1 && (
          <CardFooter className="border-t p-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => { e.preventDefault(); setCurrentPage(prev => Math.max(1, prev - 1)); }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
                    aria-disabled={currentPage === 1}
                  />
                </PaginationItem>
                {getPaginationItems().map((item, index) =>
                  typeof item === 'number' ? (
                    <PaginationItem key={index}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => { e.preventDefault(); setCurrentPage(item); }}
                        isActive={currentPage === item}
                      >
                        {item}
                      </PaginationLink>
                    </PaginationItem>
                  ) : (
                    <PaginationEllipsis key={item + index.toString()} />
                  )
                )}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => { e.preventDefault(); setCurrentPage(prev => Math.min(totalPages, prev + 1)); }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined}
                    aria-disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
