
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockOrders, mockOrderStats, type Order, type OrderStat } from "@/data/mock-data"; 
import { PlusCircle, MoreVertical, Search, ListFilter, ArrowUpDown, CheckCircle2, XCircle, AlertCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePageTitle } from '@/contexts/PageTitleContext';

const OrderSummaryCard = ({ title, value, percentageChange, periodLabel, isPositive }: { title: string; value: string; percentageChange: string; periodLabel: string; isPositive: boolean }) => (
  <Card className="shadow-sm">
    <CardHeader className="pb-2 flex flex-row items-center justify-between">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <MoreVertical className="h-4 w-4 text-muted-foreground cursor-pointer" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">
        <span className={cn("mr-1", isPositive ? "text-green-500" : "text-red-500")}>
          {isPositive && !percentageChange.startsWith('+') ? '↑' : ''}
          {!isPositive && !percentageChange.startsWith('-') ? '↓' : ''} 
          {percentageChange}
        </span>
        {periodLabel}
      </p>
    </CardContent>
  </Card>
);

const OrderStatusBadge = ({ status }: { status: Order["status"] }) => {
  const statusConfig = {
    Complete: { icon: CheckCircle2, color: "text-green-600 dark:text-green-400", bgColor: "bg-green-100 dark:bg-green-500/20" },
    Pending: { icon: Clock, color: "text-yellow-600 dark:text-yellow-400", bgColor: "bg-yellow-100 dark:bg-yellow-500/20" },
    Canceled: { icon: XCircle, color: "text-red-600 dark:text-red-400", bgColor: "bg-red-100 dark:bg-red-500/20" },
  };
  const Icon = statusConfig[status]?.icon || AlertCircle;
  const color = statusConfig[status]?.color || "text-muted-foreground";
  const bgColor = statusConfig[status]?.bgColor || "bg-muted";

  return (
    <div className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold", bgColor, color)}>
      <Icon className="h-3.5 w-3.5" />
      {status}
    </div>
  );
};

const PaymentMethodBadge = ({ method }: { method: Order["paymentMethod"] }) => {
  return (
    <div className="flex items-center gap-1.5 text-sm">
      <div className={cn("h-2 w-2 rounded-full", 
        method === "UPI" ? "bg-green-500" : 
        method === "Debit Card" ? "bg-blue-500" :
        method === "Credit Card" ? "bg-purple-500" :
        "bg-gray-500" 
      )}></div>
      <span>{method}</span>
    </div>
  )
}

export default function OrderManagementPage() {
  const { setPageTitle } = usePageTitle();
  const [selectedOrders, setSelectedOrders] = React.useState<string[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [activeTab, setActiveTab] = React.useState<Order["status"] | "all">("all");
  const ordersPerPage = 10;

  React.useEffect(() => {
    setPageTitle("Order Management");
  }, [setPageTitle]);

  const ordersData: Order[] = mockOrders; 
  const orderStats: OrderStat[] = mockOrderStats;

  const filteredOrders = React.useMemo(() => {
    if (activeTab === "all") return ordersData;
    return ordersData.filter(order => order.status === activeTab);
  }, [activeTab, ordersData]);

  const totalFilteredOrders = filteredOrders.length;

  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      setSelectedOrders(paginatedOrders.map(order => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectRow = (orderId: string, checked: boolean) => {
    setSelectedOrders(prev => 
      checked ? [...prev, orderId] : prev.filter(id => id !== orderId)
    );
  };
  
  React.useEffect(() => {
    setSelectedOrders([]);
  }, [activeTab, currentPage]);

  const paginatedOrders = filteredOrders.slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage);
  const totalPages = Math.ceil(totalFilteredOrders / ordersPerPage);
  
  const currentTableOrderIds = paginatedOrders.map(o => o.id);
  const isAllSelectedOnPage = currentTableOrderIds.length > 0 && currentTableOrderIds.every(id => selectedOrders.includes(id));
  const isIndeterminateOnPage = currentTableOrderIds.some(id => selectedOrders.includes(id)) && !isAllSelectedOnPage;


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
      
      if (currentPage < totalPages - 2) items.push('ellipsis-end');
      items.push(totalPages); 
    }
    return items;
  };


  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
      {/* Summary Cards */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2"> {/* Adjusted grid here */}
        {orderStats.map(stat => (
          <OrderSummaryCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            percentageChange={stat.percentageChange}
            periodLabel={stat.periodLabel}
            isPositive={stat.isPositive}
          />
        ))}
      </section>

      {/* Order List Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Order List</h2>
        <Card className="shadow-lg">
          <CardContent className="p-0">
            <div className="flex flex-col gap-4 border-b p-4 md:flex-row md:items-center md:justify-between">
              <Tabs value={activeTab} onValueChange={(value) => { setActiveTab(value as Order["status"] | "all"); setCurrentPage(1);}} className="w-full md:w-auto">
                <TabsList>
                  <TabsTrigger value="all">All order ({mockOrders.length})</TabsTrigger>
                  <TabsTrigger value="Complete">Completed</TabsTrigger>
                  <TabsTrigger value="Pending">Pending</TabsTrigger>
                  <TabsTrigger value="Canceled">Canceled</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="flex flex-shrink-0 items-center gap-2">
                <Button variant="default">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Order
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      More Action <MoreVertical className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Export Orders</DropdownMenuItem>
                    <DropdownMenuItem>Bulk Update Status</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="flex flex-col items-stretch gap-4 p-4 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:max-w-sm">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search order report" className="pl-8 w-full" />
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button variant="outline" size="icon">
                  <ListFilter className="h-4 w-4" />
                  <span className="sr-only">Filter</span>
                </Button>
                <Button variant="outline" size="icon">
                  <ArrowUpDown className="h-4 w-4" />
                  <span className="sr-only">Sort</span>
                </Button>
                 <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <MoreVertical className="h-4 w-4" />
                       <span className="sr-only">More table actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Manage Columns</DropdownMenuItem>
                    <DropdownMenuItem>Download CSV</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px] px-4">
                      <Checkbox
                        checked={isIndeterminateOnPage ? "indeterminate" : isAllSelectedOnPage}
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all orders on this page"
                      />
                    </TableHead>
                    <TableHead>No.</TableHead>
                    <TableHead>Order Id</TableHead>
                    <TableHead>User Id</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedOrders.map((order, index) => (
                    <TableRow key={order.id} data-state={selectedOrders.includes(order.id) ? "selected" : ""}>
                      <TableCell className="px-4">
                        <Checkbox
                          checked={selectedOrders.includes(order.id)}
                          onCheckedChange={(checked) => handleSelectRow(order.id, !!checked)}
                          aria-label={`Select order ${order.orderId}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium text-muted-foreground">
                        {(currentPage - 1) * ordersPerPage + index + 1}
                      </TableCell>
                      <TableCell>{order.orderId}</TableCell>
                      <TableCell>{order.userId}</TableCell>
                      <TableCell>{order.productName}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell className="text-right">{order.price}</TableCell>
                      <TableCell>
                        <PaymentMethodBadge method={order.paymentMethod} />
                      </TableCell>
                      <TableCell>
                        <OrderStatusBadge status={order.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                  {paginatedOrders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9} className="h-24 text-center">
                        No orders found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {totalPages > 0 && ( 
              <div className="flex flex-col items-center justify-between gap-4 border-t p-4 sm:flex-row">
                 <div className="text-sm text-muted-foreground">
                    {selectedOrders.length} of {totalFilteredOrders} row(s) selected.
                </div>
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
  );
}
