
"use client";

import * as React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';
import {
  mockUserStatCards,
  mockCustomerOverviewStats,
  mockCustomerOverviewChartData,
  mockCustomers,
  type UserStatCardData,
  type CustomerOverviewStat,
  type CustomerOverviewChartPoint,
  type Customer,
  type CustomerStatus,
} from "@/data/mock-data";
import { MoreVertical, ArrowUp, ArrowDown, Trash2, Eye } from "lucide-react"; 
import { cn } from "@/lib/utils";
import { usePageTitle } from '@/contexts/PageTitleContext';
import { UserDetailsDialog } from "@/components/user/user-details-dialog"; 
import { useToast } from "@/hooks/use-toast";
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


const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    if (data.highlighted && data.highlightLabel) {
      return (
        <div className="rounded-md bg-background/80 p-2 text-foreground shadow-lg backdrop-blur">
          <p className="text-sm font-semibold">{data.highlightLabel}</p>
        </div>
      );
    }
    return (
      <div className="rounded-md bg-background/80 p-2 text-foreground shadow-lg backdrop-blur">
        <p className="text-sm">{`${label} : ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const SingleUserStatCard = ({ title, value, percentageChange, isPositiveChange, periodLabel }: UserStatCardData) => {
  const TrendIcon = isPositiveChange ? ArrowUp : ArrowDown;
  const trendColor = isPositiveChange ? "text-green-500" : "text-red-500";
  const { toast } = useToast();

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2 flex flex-row items-start justify-between">
        <CardTitle className="text-base font-medium text-muted-foreground">{title}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6 -mt-1">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => toast({ title: "View Details Clicked", description: "This feature is not yet implemented."})}>View Details</DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast({ title: "Export Clicked", description: "This feature is not yet implemented."})}>Export</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        <div className="flex items-center text-sm">
          <TrendIcon className={cn("mr-1 h-4 w-4", trendColor)} />
          <span className={trendColor}>{percentageChange}%</span>
          <span className="ml-1 text-muted-foreground text-xs">vs {periodLabel}</span>
        </div>
      </CardContent>
    </Card>
  );
};

const CustomerStatusBadge = ({ status }: { status: CustomerStatus }) => {
  const statusConfig = {
    Active: { color: "bg-green-500", text: "Active" },
    Inactive: { color: "bg-red-500", text: "Inactive" },
    VIP: { color: "bg-orange-500", text: "VIP" },
  };
  const config = statusConfig[status];

  return (
    <div className="flex items-center">
      <span className={cn("mr-2 h-2.5 w-2.5 rounded-full", config.color)} />
      <span>{config.text}</span>
    </div>
  );
};

export default function AllUsersPage() {
  const { setPageTitle } = usePageTitle();
  const { toast } = useToast();
  const [customers, setCustomers] = React.useState<Customer[]>([...mockCustomers]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const usersPerPage = 8; 

  const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | null>(null);
  const [isUserDetailsDialogOpen, setIsUserDetailsDialogOpen] = React.useState(false);

  React.useEffect(() => {
    setPageTitle("Customers");
    setCustomers([...mockCustomers]);
  }, [setPageTitle]);

  const customerOverviewChartData: CustomerOverviewChartPoint[] = mockCustomerOverviewChartData;

  const paginatedCustomers = customers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );
  const totalPages = Math.ceil(customers.length / usersPerPage);

  const yAxisFormatter = (value: number) => {
    if (value >= 1000) return `${value / 1000}k`;
    return value.toString();
  };
  const highlightedPoint = customerOverviewChartData.find(d => d.highlighted);

  const getPaginationItems = () => {
    const items = [];
    if (totalPages <= 5) { 
      for (let i = 1; i <= totalPages; i++) items.push(i);
    } else {
      items.push(1); 
      if (currentPage > 3) items.push('ellipsis-start');
      
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <=3) {
        startPage = 2;
        endPage = Math.min(totalPages - 1, 4);
      } else if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3);
        endPage = totalPages - 1;
      }
      
      for (let i = startPage; i <= endPage; i++) items.push(i);
      
      if (currentPage < totalPages - 2 && endPage < totalPages -1 ) items.push('ellipsis-end');
      if (totalPages > 1) items.push(totalPages); 
    }
    return items;
  };

  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsUserDetailsDialogOpen(true);
  };

  const handleDeleteCustomer = (customerId: string) => {
    const customerToDelete = customers.find(c => c.id === customerId);
    setCustomers(prev => prev.filter(c => c.id !== customerId));
    const globalIndex = mockCustomers.findIndex(c => c.id === customerId);
    if (globalIndex > -1) mockCustomers.splice(globalIndex, 1);

    toast({
      title: "Customer Deleted",
      description: `Customer "${customerToDelete?.name}" has been removed.`,
      variant: "destructive",
    });
  };


  return (
    <>
      <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
        {/* Top Stat Cards & Customer Overview */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column: Stat Cards */}
          <div className="lg:col-span-1 space-y-6">
            {mockUserStatCards.map((stat) => (
              <SingleUserStatCard
                key={stat.title}
                title={stat.title}
                value={stat.value}
                percentageChange={stat.percentageChange}
                isPositiveChange={stat.isPositiveChange}
                periodLabel={stat.periodLabel}
              />
            ))}
          </div>

          {/* Right Column: Customer Overview Card */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Customer Overview</CardTitle>
                  <div className="flex items-center gap-2">
                    <Tabs defaultValue="thisWeek" className="w-auto">
                      <TabsList className="grid h-8 grid-cols-2 p-0">
                        <TabsTrigger value="thisWeek" className="h-full rounded-l-md rounded-r-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">This week</TabsTrigger>
                        <TabsTrigger value="lastWeek" className="h-full rounded-l-none rounded-r-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Last week</TabsTrigger>
                      </TabsList>
                    </Tabs>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => toast({ title: "Download Report Clicked", description: "This feature is not yet implemented."})}>Download Report</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast({ title: "Settings Clicked", description: "This feature is not yet implemented."})}>Settings</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {mockCustomerOverviewStats.map((stat) => (
                    <div key={stat.label}>
                      <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <div className="h-[260px] w-full"> 
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={customerOverviewChartData} margin={{ top: 5, right: 0, left: -25, bottom: 5 }}>
                      <defs>
                        <linearGradient id="colorCustomerOverview" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
                      <XAxis dataKey="day" tickLine={false} axisLine={false} dy={10} />
                      <YAxis tickFormatter={yAxisFormatter} tickLine={false} axisLine={false} dx={-5} />
                      <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '3 3' }} />
                      <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorCustomerOverview)" />
                      {highlightedPoint && (
                        <ReferenceDot 
                          x={highlightedPoint.day} 
                          y={highlightedPoint.value} 
                          r={6} 
                          fill="hsl(var(--primary))" 
                          stroke="hsl(var(--background))" 
                          strokeWidth={2} 
                          isFront={true} 
                        />
                      )}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Users Table Section */}
        <section className="space-y-4">
          <Card className="shadow-lg">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User Id</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Total Purchase</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">{customer.userId}</TableCell>
                        <TableCell>{customer.name}</TableCell>
                        <TableCell>{customer.phone}</TableCell>
                        <TableCell>₹{customer.totalPurchase}</TableCell>
                        <TableCell>
                          <CustomerStatusBadge status={customer.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleViewDetails(customer)}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View User Details</span>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete User</span>
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the customer "{customer.name}".
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteCustomer(customer.id)} className={buttonVariants({ variant: "destructive" })}>
                                    Delete
                                </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                            </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                    {paginatedCustomers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No customers found.
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
                          <PaginationEllipsis key={item + index} />
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
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
      <UserDetailsDialog
        customer={selectedCustomer}
        isOpen={isUserDetailsDialogOpen}
        onOpenChange={setIsUserDetailsDialogOpen}
      />
    </>
  );
}
