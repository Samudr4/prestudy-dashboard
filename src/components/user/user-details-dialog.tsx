
"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Copy, Phone, MapPin } from "lucide-react";
import type { Customer } from "@/data/mock-data";
import { useToast } from "@/hooks/use-toast";

interface UserDetailsDialogProps {
  customer: Customer | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function UserDetailsDialog({ customer, isOpen, onOpenChange }: UserDetailsDialogProps) {
  const { toast } = useToast();

  if (!customer) {
    return null;
  }

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to clipboard",
        description: `${fieldName} copied.`,
      });
    }).catch(err => {
      console.error("Failed to copy: ", err);
      toast({
        title: "Failed to copy",
        description: `Could not copy ${fieldName}.`,
        variant: "destructive",
      });
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={customer.avatarUrl} alt={customer.name} data-ai-hint="person avatar" />
              <AvatarFallback>{customer.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-2xl font-semibold">{customer.name}</DialogTitle>
              <div className="flex items-center text-sm text-muted-foreground">
                <span>{customer.email}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2 h-6 w-6"
                  onClick={() => copyToClipboard(customer.email, "Email")}
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span className="sr-only">Copy email</span>
                </Button>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        <div className="space-y-6 p-6">
          <div>
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">Customer Info</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-md border p-3">
                <div className="flex items-center">
                  <Phone className="mr-3 h-5 w-5 text-muted-foreground" />
                  <span>{customer.phone}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => copyToClipboard(customer.phone, "Phone number")}
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span className="sr-only">Copy phone number</span>
                </Button>
              </div>
              <div className="flex items-center justify-between rounded-md border p-3">
                <div className="flex items-center">
                  <MapPin className="mr-3 h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">{customer.address}</span>
                </div>
                 <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => copyToClipboard(customer.address, "Address")}
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span className="sr-only">Copy address</span>
                </Button>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">Order overview</h3>
            <div className="grid grid-cols-3 gap-3">
              <Card className="text-center shadow-sm">
                <CardContent className="p-3">
                  <p className="text-2xl font-bold">{customer.orderOverview.totalPurchaseCount}</p>
                  <p className="text-xs text-primary">Total purchase</p>
                </CardContent>
              </Card>
              <Card className="text-center shadow-sm">
                <CardContent className="p-3">
                  <p className="text-2xl font-bold">{customer.orderOverview.completedCount}</p>
                  <p className="text-xs text-green-500">Completed</p>
                </CardContent>
              </Card>
              <Card className="text-center shadow-sm">
                <CardContent className="p-3">
                  <p className="text-2xl font-bold">{customer.orderOverview.incompleteCount}</p>
                  <p className="text-xs text-red-500">Incomplete</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">Activity</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Registration:</span>
                <span>{customer.registrationDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last purchase:</span>
                <span>{customer.lastPurchaseDate}</span>
              </div>
            </div>
          </div>
        </div>
        {/* Optional: Add DialogFooter with buttons if needed */}
        {/* <DialogFooter className="p-6 pt-0">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}
