"use client";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockTransactionsData, type Transaction } from "@/data/mock-data";
import { Filter, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";


const StatusBadge = ({ status }: { status: Transaction["status"] }) => {
  return (
    <div className="flex items-center">
      <span
        className={cn(
          "mr-2 h-2 w-2 rounded-full",
          status === "Paid" && "bg-green-500",
          status === "Pending" && "bg-yellow-500",
          status === "Failed" && "bg-red-500"
        )}
      />
      {status}
    </div>
  );
};

export function TransactionsCard() {
  const transactionsData: Transaction[] = mockTransactionsData;

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow col-span-1 lg:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Transaction</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                <DropdownMenuItem>Export All</DropdownMenuItem>
                <DropdownMenuItem>Mark as Resolved</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px] pl-6">No.</TableHead>
              <TableHead>Id Customer</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right pr-6">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactionsData.map((transaction, index) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium text-muted-foreground pl-6">{index + 1}.</TableCell>
                <TableCell>{transaction.customerId}</TableCell>
                <TableCell>{transaction.orderDate}</TableCell>
                <TableCell>
                  <StatusBadge status={transaction.status} />
                </TableCell>
                <TableCell className="text-right pr-6">{transaction.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="pt-4">
        <Button variant="outline" className="w-full sm:w-auto ml-auto">Details</Button>
      </CardFooter>
    </Card>
  );
}
