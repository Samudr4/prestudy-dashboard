
"use client";

import * as React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockProductReviews, type ProductReview, type ReviewStatus } from "@/data/mock-data"; 
import { MoreVertical, Search, ListFilter, Star, ThumbsUp, ThumbsDown, Edit3, Trash2, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePageTitle } from '@/contexts/PageTitleContext';
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
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

const ReviewStatusBadge = ({ status }: { status: ReviewStatus }) => {
  const statusConfig = {
    Approved: { color: "bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300 border-green-300 dark:border-green-600", icon: CheckCircle },
    Pending: { color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-700/30 dark:text-yellow-300 border-yellow-300 dark:border-yellow-600", icon: AlertTriangle },
    Rejected: { color: "bg-red-100 text-red-700 dark:bg-red-700/30 dark:text-red-300 border-red-300 dark:border-red-600", icon: XCircle },
  };
  const config = statusConfig[status];
  const Icon = config.icon;
  return (
    <Badge variant="outline" className={cn("capitalize items-center gap-1", config.color)}>
      <Icon className="h-3.5 w-3.5" />
      {status}
    </Badge>
  );
};

const RatingStars = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            i < rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"
          )}
        />
      ))}
    </div>
  );
};

export default function ProductReviewsPage() {
  const { setPageTitle } = usePageTitle();
  const { toast } = useToast();
  const [reviews, setReviews] = React.useState<ProductReview[]>([...mockProductReviews]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const reviewsPerPage = 10;
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<ReviewStatus[]>([]);
  const [ratingFilter, setRatingFilter] = React.useState<number[]>([]);

  React.useEffect(() => {
    setPageTitle("Product Reviews");
    setReviews([...mockProductReviews]);
  }, [setPageTitle]);

  const allStatuses: ReviewStatus[] = ["Pending", "Approved", "Rejected"];
  const allRatings: number[] = [1, 2, 3, 4, 5];

  const filteredReviews = React.useMemo(() => {
    return reviews.filter(review => {
      const matchesSearch = searchTerm === "" ||
        review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter.length === 0 || statusFilter.includes(review.status);
      const matchesRating = ratingFilter.length === 0 || ratingFilter.includes(review.rating);

      return matchesSearch && matchesStatus && matchesRating;
    });
  }, [reviews, searchTerm, statusFilter, ratingFilter]);

  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

  const getPaginationItems = () => {
    const items = [];
    if (totalPages <= 5) { for (let i = 1; i <= totalPages; i++) items.push(i); } 
    else {
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

  const handleReviewStatusChange = (reviewId: string, newStatus: ReviewStatus) => {
    setReviews(prevReviews => 
      prevReviews.map(r => r.id === reviewId ? {...r, status: newStatus, date: new Date().toISOString()} : r)
    );
    const globalIndex = mockProductReviews.findIndex(r => r.id === reviewId);
    if (globalIndex > -1) mockProductReviews[globalIndex] = {...mockProductReviews[globalIndex], status: newStatus, date: new Date().toISOString()};
    
    toast({
      title: `Review ${newStatus}`,
      description: `The review has been ${newStatus.toLowerCase()}.`
    });
  };

  const handleDeleteReview = (reviewId: string) => {
    const reviewToDelete = reviews.find(r => r.id === reviewId);
    setReviews(prevReviews => prevReviews.filter(r => r.id !== reviewId));
    const globalIndex = mockProductReviews.findIndex(r => r.id === reviewId);
    if (globalIndex > -1) mockProductReviews.splice(globalIndex, 1);
    
    toast({
      title: "Review Deleted",
      description: `Review by ${reviewToDelete?.userName} for "${reviewToDelete?.productName}" has been removed.`,
      variant: "destructive"
    });
  };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
                <CardTitle>Product Reviews</CardTitle>
                <CardDescription>Manage and moderate customer reviews for products/quizzes.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex flex-col items-stretch gap-4 p-4 md:flex-row md:items-center md:justify-between border-b">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search reviews..." 
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
                <DropdownMenuTrigger asChild><Button variant="outline"><ListFilter className="mr-2 h-4 w-4" />Rating</Button></DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {allRatings.map(r => <DropdownMenuCheckboxItem key={r} checked={ratingFilter.includes(r)} onCheckedChange={() => handleFilterChange(setRatingFilter, r)}>{r} Star{r > 1 ? 's' : ''}</DropdownMenuCheckboxItem>)}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product/Quiz</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedReviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell className="font-medium max-w-xs truncate">{review.productName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                           <AvatarImage src={review.userAvatarUrl} alt={review.userName} data-ai-hint="person avatar" />
                           <AvatarFallback>{review.userName.substring(0,1)}</AvatarFallback>
                        </Avatar>
                        <span>{review.userName}</span>
                      </div>
                    </TableCell>
                    <TableCell><RatingStars rating={review.rating} /></TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-sm truncate">{review.comment}</TableCell>
                    <TableCell>{format(parseISO(review.date), "dd MMM, yyyy")}</TableCell>
                    <TableCell><ReviewStatusBadge status={review.status} /></TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {review.status === "Pending" && (
                            <>
                              <DropdownMenuItem onClick={() => handleReviewStatusChange(review.id, "Approved")} className="text-green-600 focus:text-green-700"><ThumbsUp className="mr-2 h-4 w-4" /> Approve</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleReviewStatusChange(review.id, "Rejected")} className="text-red-600 focus:text-red-700"><ThumbsDown className="mr-2 h-4 w-4" /> Reject</DropdownMenuItem>
                              <DropdownMenuSeparator/>
                            </>
                          )}
                           {review.status === "Rejected" && ( // Option to re-approve a rejected one
                            <DropdownMenuItem onClick={() => handleReviewStatusChange(review.id, "Approved")} className="text-green-600 focus:text-green-700"><ThumbsUp className="mr-2 h-4 w-4" /> Approve</DropdownMenuItem>
                          )}
                          {review.status === "Approved" && ( // Option to make pending again
                            <DropdownMenuItem onClick={() => handleReviewStatusChange(review.id, "Pending")} className="text-yellow-600 focus:text-yellow-700"><AlertTriangle className="mr-2 h-4 w-4" /> Mark as Pending</DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => toast({ title: "Edit Review Clicked", description: `Editing review by ${review.userName}. (Not implemented)`})}><Edit3 className="mr-2 h-4 w-4" /> Edit Review</DropdownMenuItem>
                          <DropdownMenuSeparator/>
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
                                  This action cannot be undone. This will permanently delete the review by {review.userName} for "{review.productName}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteReview(review.id)} className={buttonVariants({ variant: "destructive" })}>
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
                {paginatedReviews.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No reviews found.
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
                  <PaginationItem><PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(prev => Math.max(1, prev - 1)); }} className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined} aria-disabled={currentPage === 1}/></PaginationItem>
                  {getPaginationItems().map((item, index) =>
                    typeof item === 'number' ? (
                      <PaginationItem key={index}><PaginationLink href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(item); }} isActive={currentPage === item}>{item}</PaginationLink></PaginationItem>
                    ) : (<PaginationEllipsis key={item + index.toString()} />)
                  )}
                  <PaginationItem><PaginationNext href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(prev => Math.min(totalPages, prev + 1)); }} className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined} aria-disabled={currentPage === totalPages}/></PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
