
"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sun, Moon, Bell, Search as SearchIcon, Settings, User, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { usePageTitle } from '@/contexts/PageTitleContext'; // Add this

export default function AppHeader() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState("light");
  const { pageTitle } = usePageTitle(); // Consume context

  useEffect(() => {
    setMounted(true);
    const storedTheme = typeof window !== 'undefined' ? localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : "light";
    setTheme(storedTheme);
    if (storedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);
  
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem("theme", newTheme);
    }
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  if (!mounted) {
    return (
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur md:px-6">
        <div className="h-8 w-8 md:hidden" /> {/* Placeholder for SidebarTrigger */}
         <div className="hidden md:block h-6 w-32 rounded bg-muted" /> {/* Placeholder for Page Title */}
        <div className="flex-1 flex justify-center md:justify-start">
          <div className="relative w-full max-w-md">
            <div className="h-10 w-full rounded-md bg-muted" /> {/* Placeholder for Search */}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-muted" /> {/* Placeholder for Bell */}
          <div className="h-8 w-8 rounded-full bg-muted" /> {/* Placeholder for ThemeToggle */}
          <div className="h-8 w-8 rounded-full bg-muted" /> {/* Placeholder for Avatar */}
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur md:px-6">
      <SidebarTrigger className="md:hidden" />
      
      <div className="hidden md:block text-2xl font-semibold text-foreground">
        {pageTitle}
      </div>

      <div className="flex-1 flex justify-center md:justify-start">
        <div className="relative w-full max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search data, users, or reports"
            className="w-full rounded-lg bg-muted pl-10 pr-4 shadow-none focus:bg-background"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src="https://placehold.co/40x40.png" alt="User Avatar" data-ai-hint="person" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Admin</p>
                <p className="text-xs leading-none text-muted-foreground">
                  prestudy@example.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
