
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { mockQuizListItems, quizCategories, quizDifficulties, type QuizListItem, type QuizStatus, type QuizDifficulty } from "@/data/mock-data";
import { PlusCircle, MoreVertical, Search, ListFilter, Download, Eye, Edit, Trash2, Archive, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePageTitle } from '@/contexts/PageTitleContext';
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Link from "next/link";
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


const QuizStatusBadge = ({ status }: { status: QuizStatus }) => {
  const statusConfig = {
    Published: { color: "bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300 border-green-300 dark:border-green-600" },
    Draft: { color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-700/30 dark:text-yellow-300 border-yellow-300 dark:border-yellow-600" },
    Archived: { color: "bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-300 border-gray-300 dark:border-gray-600" },
  };
  const config = statusConfig[status];
  return <Badge variant="outline" className={cn("capitalize", config.color)}>{status}</Badge>;
};

const QuizDifficultyBadge = ({ difficulty }: { difficulty: QuizDifficulty }) => {
  const difficultyConfig = {
    Easy: { color: "bg-blue-100 text-blue-700 dark:bg-blue-700/30 dark:text-blue-300 border-blue-300 dark:border-blue-600" },
    Medium: { color: "bg-orange-100 text-orange-700 dark:bg-orange-700/30 dark:text-orange-300 border-orange-300 dark:border-orange-600" },
    Hard: { color: "bg-red-100 text-red-700 dark:bg-red-700/30 dark:text-red-300 border-red-300 dark:border-red-600" },
  };
  const config = difficultyConfig[difficulty];
  return <Badge variant="outline" className={cn("capitalize", config.color)}>{difficulty}</Badge>;
};


export default function QuizListPage() {
  const { setPageTitle } = usePageTitle();
  const { toast } = useToast();
  const [quizzes, setQuizzes] = React.useState<QuizListItem[]>([...mockQuizListItems]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const quizzesPerPage = 10;
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<QuizStatus[]>([]);
  const [difficultyFilter, setDifficultyFilter] = React.useState<QuizDifficulty[]>([]);
  const [categoryFilter, setCategoryFilter] = React.useState<string[]>([]);


  React.useEffect(() => {
    setPageTitle("Quiz List");
    // Re-initialize from mock data if it changes (e.g., after adding a quiz on another page)
    // This is a simple way to reflect changes from `mockQuizListItems`
    setQuizzes([...mockQuizListItems]);
  }, [setPageTitle, mockQuizListItems]); // Add mockQuizListItems dependency

  const allStatuses: QuizStatus[] = ["Published", "Draft", "Archived"];
  const allDifficulties: QuizDifficulty[] = ["Easy", "Medium", "Hard"];

  const filteredQuizzes = React.useMemo(() => {
    return quizzes.filter(quiz => {
      const matchesSearch = searchTerm === "" ||
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter.length === 0 || statusFilter.includes(quiz.status);
      const matchesDifficulty = difficultyFilter.length === 0 || difficultyFilter.includes(quiz.difficulty);
      const matchesCategory = categoryFilter.length === 0 || categoryFilter.includes(quiz.category);

      return matchesSearch && matchesStatus && matchesDifficulty && matchesCategory;
    });
  }, [quizzes, searchTerm, statusFilter, difficultyFilter, categoryFilter]);

  const paginatedQuizzes = filteredQuizzes.slice(
    (currentPage - 1) * quizzesPerPage,
    currentPage * quizzesPerPage
  );
  const totalPages = Math.ceil(filteredQuizzes.length / quizzesPerPage);

  const getPaginationItems = () => {
    const items = [];
    if (totalPages <= 5) { 
      for (let i = 1; i <= totalPages; i++) items.push(i);
    } else {
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
  
  const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<any[]>>, value: any) => {
    setter((prev: any[]) => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
    setCurrentPage(1);
  };

  const handleQuizStatusChange = (quizId: string, newStatus: QuizStatus) => {
    setQuizzes(prevQuizzes =>
      prevQuizzes.map(quiz =>
        quiz.id === quizId ? { ...quiz, status: newStatus, lastUpdatedDate: new Date().toISOString().split('T')[0] } : quiz
      )
    );
    toast({
      title: `Quiz ${newStatus}`,
      description: `The quiz has been ${newStatus.toLowerCase()}.`,
    });
  };

  const handleDeleteQuiz = (quizId: string) => {
    setQuizzes(prevQuizzes => prevQuizzes.filter(quiz => quiz.id !== quizId));
    toast({
      title: "Quiz Deleted",
      description: "The quiz has been removed.",
      variant: "destructive"
    });
  };


  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
                <CardTitle>Manage Quizzes</CardTitle>
                <CardDescription>View, edit, and manage all quizzes on the platform.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
                <Link href="/add-quiz">
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add New Quiz
                    </Button>
                </Link>
                <Button variant="outline" onClick={() => toast({ title: "Export All Clicked", description: "This feature is not yet implemented."})}>
                    <Download className="mr-2 h-4 w-4" /> Export All
                </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex flex-col items-stretch gap-4 p-4 md:flex-row md:items-center md:justify-between border-b">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by quiz title..." 
                className="pl-8 w-full" 
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1);}}
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <DropdownMenu>
                <DropdownMenuTrigger asChild><Button variant="outline"><ListFilter className="mr-2 h-4 w-4" />Status</Button></DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {allStatuses.map(s => <DropdownMenuCheckboxItem key={s} checked={statusFilter.includes(s)} onCheckedChange={() => handleFilterChange(setStatusFilter, s)}>{s}</DropdownMenuCheckboxItem>)}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild><Button variant="outline"><ListFilter className="mr-2 h-4 w-4" />Difficulty</Button></DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {allDifficulties.map(d => <DropdownMenuCheckboxItem key={d} checked={difficultyFilter.includes(d)} onCheckedChange={() => handleFilterChange(setDifficultyFilter, d)}>{d}</DropdownMenuCheckboxItem>)}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild><Button variant="outline"><ListFilter className="mr-2 h-4 w-4" />Category</Button></DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="max-h-60 overflow-y-auto">
                  {quizCategories.map(c => <DropdownMenuCheckboxItem key={c.value} checked={categoryFilter.includes(c.value)} onCheckedChange={() => handleFilterChange(setCategoryFilter, c.value)}>{c.label}</DropdownMenuCheckboxItem>)}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-center">Questions</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedQuizzes.map((quiz) => (
                  <TableRow key={quiz.id}>
                    <TableCell className="font-medium">{quiz.title}</TableCell>
                    <TableCell>{quizCategories.find(c => c.value === quiz.category)?.label || quiz.category}</TableCell>
                    <TableCell className="text-center">{quiz.questionsCount}</TableCell>
                    <TableCell><QuizDifficultyBadge difficulty={quiz.difficulty} /></TableCell>
                    <TableCell><QuizStatusBadge status={quiz.status} /></TableCell>
                    <TableCell>{format(new Date(quiz.lastUpdatedDate), "dd MMM, yyyy")}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => toast({ title: "View Quiz Clicked", description: `Details for ${quiz.title}`})}><Eye className="mr-2 h-4 w-4" /> View</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast({ title: "Edit Quiz Clicked", description: `Editing ${quiz.title}. (Not implemented)`})}><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                           <DropdownMenuSeparator />
                           {quiz.status !== "Published" && <DropdownMenuItem onClick={() => handleQuizStatusChange(quiz.id, "Published")} className="text-green-600 focus:text-green-700"><Rocket className="mr-2 h-4 w-4" /> Publish</DropdownMenuItem>}
                           {quiz.status !== "Archived" && <DropdownMenuItem onClick={() => handleQuizStatusChange(quiz.id, "Archived")}><Archive className="mr-2 h-4 w-4" /> Archive</DropdownMenuItem>}
                           {quiz.status === "Archived" && <DropdownMenuItem onClick={() => handleQuizStatusChange(quiz.id, "Draft")}><Edit className="mr-2 h-4 w-4" /> Unarchive to Draft</DropdownMenuItem>}
                          <DropdownMenuSeparator />
                           <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive/90">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the quiz "{quiz.title}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteQuiz(quiz.id)} className={buttonVariants({ variant: "destructive" })}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {paginatedQuizzes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No quizzes found.
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
                    <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(prev => Math.max(1, prev - 1)); }} className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined} aria-disabled={currentPage === 1}/>
                  </PaginationItem>
                  {getPaginationItems().map((item, index) =>
                    typeof item === 'number' ? (
                      <PaginationItem key={index}><PaginationLink href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(item); }} isActive={currentPage === item}>{item}</PaginationLink></PaginationItem>
                    ) : (<PaginationEllipsis key={item + index.toString()} />)
                  )}
                  <PaginationItem>
                    <PaginationNext href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(prev => Math.min(totalPages, prev + 1)); }} className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined} aria-disabled={currentPage === totalPages}/>
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
