"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockLeaderboardData, type LeaderboardUser } from "@/data/mock-data";
import { Search, MoreVertical, Award } from "lucide-react";
import Link from "next/link";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

export function LeaderboardCard() {
  const leaderboardData: LeaderboardUser[] = mockLeaderboardData;

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">Leaderboard</CardTitle>
          <Link href="#" className="text-xs text-primary hover:underline">
            All users
          </Link>
        </div>
        <div className="relative mt-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search" className="pl-8 bg-muted focus:bg-background" />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="sr-only"> {/* Visually hidden, but good for ARIA */}
            <TableRow>
              <TableHead className="w-[50px]">No</TableHead>
              <TableHead>User</TableHead>
              <TableHead className="text-right">Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboardData.slice(0, 5).map((user) => ( // Display top 5 for brevity in this card
              <TableRow key={user.rank}>
                <TableCell className="font-medium text-muted-foreground w-[50px] pl-6">{user.rank}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={user.avatarUrl} alt={user.userName} data-ai-hint="person avatar" />
                      <AvatarFallback>{user.userName.substring(1,3).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.userName}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <div className="flex items-center justify-end text-primary">
                     <Award className="h-3 w-3 mr-1 opacity-70" /> {/* Using Award as a generic points icon */}
                    {user.points.toLocaleString()}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
