
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { mockLeaderboardData, type LeaderboardUser } from "@/data/mock-data";
import { Award, BarChart3, CheckCircle, Crown, Download, Filter, Search, Star, TrendingUp } from "lucide-react";
import { usePageTitle } from '@/contexts/PageTitleContext';
import { cn } from "@/lib/utils";

const RankBadge = ({ rank }: { rank: number }) => {
  let color = "bg-muted text-muted-foreground";
  let icon = <Star className="h-3 w-3 mr-1" />;

  if (rank === 1) {
    color = "bg-yellow-400/20 text-yellow-600 dark:bg-yellow-500/30 dark:text-yellow-400 border-yellow-500";
    icon = <Crown className="h-3.5 w-3.5 mr-1" />;
  } else if (rank === 2) {
    color = "bg-gray-300/30 text-gray-600 dark:bg-gray-600/30 dark:text-gray-400 border-gray-500";
  } else if (rank === 3) {
    color = "bg-orange-400/20 text-orange-600 dark:bg-orange-500/30 dark:text-orange-400 border-orange-500";
  }

  return (
    <div className={cn("inline-flex items-center justify-center h-7 w-7 rounded-full text-xs font-semibold border", color)}>
      {icon}
      {rank > 3 && rank}
    </div>
  );
};

export default function LeaderboardPage() {
  const { setPageTitle } = usePageTitle();
  const [currentPage, setCurrentPage] = React.useState(1);
  const usersPerPage = 10;
  const [searchTerm, setSearchTerm] = React.useState("");

  React.useEffect(() => {
    setPageTitle("Leaderboard");
  }, [setPageTitle]);

  const filteredUsers = React.useMemo(() => {
    return mockLeaderboardData.filter(user => 
      user.userName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

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
      
      if (currentPage < totalPages - 2 && endPage < totalPages -1) items.push('ellipsis-end');
      if (totalPages > 1) items.push(totalPages); 
    }
    return items;
  };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
                <CardTitle>Top Users Leaderboard</CardTitle>
                <CardDescription>See who is leading the charts in PRESTUDY.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" /> Export Leaderboard
                </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex flex-col items-stretch gap-4 p-4 md:flex-row md:items-center md:justify-between border-b">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by username..." 
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
               <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" /> Filter
                </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px] text-center">Rank</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead className="text-center">Quizzes Completed</TableHead>
                  <TableHead className="text-center">Average Score</TableHead>
                  <TableHead className="text-right">Total Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow key={user.rank}>
                    <TableCell className="w-[80px] text-center">
                      <RankBadge rank={user.rank} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={user.avatarUrl} alt={user.userName} data-ai-hint="person avatar" />
                          <AvatarFallback>{user.userName.substring(0,2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.userName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                        <div className="flex items-center justify-center">
                            <CheckCircle className="h-4 w-4 mr-1.5 text-green-500"/>
                            {user.quizCompletions}
                        </div>
                    </TableCell>
                     <TableCell className="text-center">
                        <div className="flex items-center justify-center">
                            <TrendingUp className="h-4 w-4 mr-1.5 text-blue-500"/>
                            {user.avgScore}%
                        </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end font-semibold text-primary">
                        <Award className="h-4 w-4 mr-1.5 opacity-80" />
                        {user.points.toLocaleString()}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {paginatedUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No users found.
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

    