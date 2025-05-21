
"use client";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Ticket,
  LayoutGrid,
  ListOrdered,
  Star,
  PlusCircle,
  ListChecks,
  Network, 
  FileText, 
  UserCog,
  Settings2, 
  LogOut,
  ExternalLink,
  Briefcase, 
  MessageSquare, // Added for Product Reviews
  ShieldAlert // Added for Control Authority
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";


export default function AppSidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      group: "Main menu",
      items: [
        { href: "/", label: "Dashboard", icon: LayoutDashboard, activePaths: ["/"] },
        { href: "/order-management", label: "Order Management", icon: ShoppingCart, activePaths: ["/order-management"] },
        { href: "/all-users", label: "All Users", icon: Users, activePaths: ["/all-users"] },
        { href: "/coupon-code", label: "Coupon Code", icon: Ticket, activePaths: ["/coupon-code"] },
        { href: "/transactions", label: "Transaction", icon: ListOrdered, activePaths: ["/transactions"] },
        { href: "/leaderboard", label: "Leaderboard", icon: Star, activePaths: ["/leaderboard"] }, 
      ],
    },
    {
      group: "App Management",
      items: [
        { href: "/categories", label: "Categories", icon: LayoutGrid, activePaths: ["/categories"] },
        { href: "/add-quiz", label: "Add Quiz", icon: PlusCircle, activePaths: ["/add-quiz"] },
        { href: "/quiz-list", label: "Quiz List", icon: ListChecks, activePaths: ["/quiz-list"] },
        { href: "/course-categories", label: "Course Categories", icon: Network, activePaths: ["/course-categories"] },
        { href: "/product-reviews", label: "Product Reviews", icon: MessageSquare, activePaths: ["/product-reviews"] },
      ],
    },
    {
      group: "Admin",
      items: [
        { href: "/admin-role", label: "Admin role", icon: UserCog, activePaths: ["/admin-role"] },
        { href: "/control-authority", label: "Control Authority", icon: ShieldAlert, activePaths: ["/control-authority"] },
      ],
    },
  ];

  return (
    <Sidebar collapsible="icon"> {/* Changed here: enable icon collapsing for desktop */}
      <SidebarHeader className="p-4 flex flex-col items-start">
        <div className="flex items-center gap-2 mb-1">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-primary">PRESTUDY</span>
          </div>
        </div>
        <div className="text-xs text-muted-foreground ml-1 group-data-[collapsible=icon]:hidden">WAY TO SMART STUDY</div> {/* Hide subtitle in icon mode */}
      </SidebarHeader>

      <SidebarContent className="p-2">
        {menuItems.map((group, groupIndex) => (
          <div key={group.group} className="mb-3">
            <SidebarGroupLabel className="px-2 mb-1 text-xs font-semibold text-muted-foreground group-data-[collapsible=icon]:hidden">
              {group.group.toUpperCase()}
            </SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.activePaths ? item.activePaths.includes(pathname) : pathname === item.href}
                    tooltip={{ children: item.label, side: "right" }}
                    className={item.activePaths?.includes(pathname) || pathname === item.href ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}
                  >
                    <Link href={item.href || "#"}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            {groupIndex < menuItems.length - 1 && <SidebarSeparator className="my-3 group-data-[collapsible=icon]:hidden" />}
          </div>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-2 border-t border-sidebar-border">
        <div className="p-2 group-data-[collapsible=icon]:hidden">
            <Button variant="outline" className="w-full justify-start bg-card hover:bg-muted">
                <Briefcase className="mr-2 h-4 w-4" />
                Your App
                <ExternalLink className="ml-auto h-4 w-4 text-muted-foreground" />
            </Button>
        </div>
         <SidebarSeparator className="my-2 group-data-[collapsible=icon]:hidden"/>
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" className="w-full justify-start h-auto p-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src="https://placehold.co/40x40.png" alt="Admin" data-ai-hint="man portrait" />
                        <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                    <div className="ml-2 text-left group-data-[collapsible=icon]:hidden">
                        <p className="text-sm font-medium text-sidebar-foreground">Admin</p>
                        <p className="text-xs text-muted-foreground">prestudy@gmail.com</p>
                    </div>
                    {/* LogOut icon removed from trigger, only in popover or if sidebar expanded */}
                    <LogOut className="ml-auto h-4 w-4 text-muted-foreground group-data-[collapsible=icon]:hidden" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 mb-2" side="top" align="start">
                <Button variant="ghost" className="w-full justify-start">
                    <LogOut className="mr-2 h-4 w-4"/> Logout
                </Button>
            </PopoverContent>
        </Popover>
      </SidebarFooter>
    </Sidebar>
  );
}

    
