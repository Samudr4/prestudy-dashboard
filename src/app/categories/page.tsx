
"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { 
  PlusCircle, 
  MoreVertical, 
  Search, 
  ListFilter, 
  Edit, 
  Trash2,
  ChevronRight,
  BookOpen,
  FileText as ExamIcon // Using FileText for Exam icon as a placeholder
} from "lucide-react";
import { usePageTitle } from "@/contexts/PageTitleContext";
import { 
  mockDiscoverCategories, 
  mockProductListItems, 
  type DiscoverCategory, 
  type ProductListItem,
  totalQuizCount,
  featuredProductCount,
  onSaleProductCount
} from "@/data/mock-data";
import { cn } from "@/lib/utils";

const DiscoverCard = ({ category }: { category: DiscoverCategory }) => {
  const isLargeCard = category.id === "topic" || category.id === "exam";
  const Icon = category.id === "topic" ? BookOpen : category.id === "exam" ? ExamIcon : null;

  return (
    <Card className={cn(
      "shadow-sm hover:shadow-md transition-shadow flex flex-col",
      isLargeCard ? "p-4 md:p-6" : "p-3",
      category.bgColorClass
    )}>
      <div className={cn("flex items-start gap-3", isLargeCard ? "flex-row items-center" : "flex-col")}>
        <div className={cn(
            "rounded-md flex items-center justify-center",
            isLargeCard ? "h-16 w-16 p-0" : "h-10 w-10 mb-2 p-0",
            !isLargeCard && "bg-muted" // Default background for small cards if not specified
          )}
        >
          {Icon && !category.imageUrl && <Icon className={cn("h-8 w-8", category.textColorClass || "text-primary")} />}
          {category.imageUrl && (
            <Image 
              src={category.imageUrl} 
              alt={category.title} 
              width={isLargeCard ? 64 : 40} 
              height={isLargeCard ? 48 : 30} 
              className="rounded-md object-cover"
              data-ai-hint={category.imageHint}
            />
          )}
        </div>
        <div className="flex-1">
          <h3 className={cn(
            "font-semibold", 
            isLargeCard ? "text-lg" : "text-sm",
            category.textColorClass
          )}>{category.title}</h3>
          {isLargeCard && category.itemCount && (
            <p className={cn("text-xs", category.textColorClass || "text-muted-foreground")}>{category.itemCount} items</p>
          )}
        </div>
      </div>
    </Card>
  );
};


export default function CategoriesPage() {
  const { setPageTitle } = usePageTitle();
  const [currentPage, setCurrentPage] = React.useState(1);
  const productsPerPage = 7;
  const [activeTab, setActiveTab] = React.useState("all");

  React.useEffect(() => {
    setPageTitle("Categories");
  }, [setPageTitle]);

  // TODO: Implement filtering based on activeTab
  const paginatedProducts = mockProductListItems.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );
  const totalPages = Math.ceil(mockProductListItems.length / productsPerPage);

  const getPaginationItems = () => {
    const items = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) items.push(i);
    } else {
      items.push(1);
      if (currentPage > 3) items.push('ellipsis-start');
      
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
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

  const generalCategories = mockDiscoverCategories.filter(cat => cat.id !== "topic" && cat.id !== "exam");
  const firstRowGeneralCategories = generalCategories.slice(0, 4);
  const secondRowGeneralCategories = generalCategories.slice(4, 8);

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground md:hidden">Categories</h1> {/* Hidden on md+ as header shows it */}
        <div className="flex items-center gap-2 ml-auto">
          <Button variant="default">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Product
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                More Action <MoreVertical className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Import Products</DropdownMenuItem>
              <DropdownMenuItem>Export Products</DropdownMenuItem>
              <DropdownMenuItem>Manage Categories</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Discover Section */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold">Discover</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {mockDiscoverCategories.filter(cat => cat.id === "topic" || cat.id === "exam").map(cat => (
            <DiscoverCard key={cat.id} category={cat} />
          ))}
        </div>
        
        {[firstRowGeneralCategories, secondRowGeneralCategories].map((rowCategories, rowIndex) => (
          rowCategories.length > 0 && (
            <div key={`row-${rowIndex}`} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 items-center gap-4">
              <div className="grid grid-cols-subgrid col-span-full lg:col-span-4 gap-4">
                {rowCategories.map(cat => (
                    <DiscoverCard key={cat.id} category={cat} />
                ))}
              </div>
              <Button variant="ghost" size="icon" className="hidden lg:flex h-10 w-10 bg-muted hover:bg-muted/80 rounded-full self-center justify-self-center">
                <ChevronRight className="h-5 w-5" />
                <span className="sr-only">View more</span>
              </Button>
            </div>
          )
        ))}
      </section>

      {/* Product List Section */}
      <section className="space-y-4">
        <Card className="shadow-lg">
          <CardHeader className="p-4 border-b">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All Quiz ({totalQuizCount})</TabsTrigger>
                <TabsTrigger value="featured">Featured Products ({featuredProductCount})</TabsTrigger>
                <TabsTrigger value="onsale">On Sale ({onSaleProductCount})</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-col items-stretch gap-4 p-4 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:max-w-sm">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search your product" className="pl-8 w-full" />
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button variant="outline" size="icon">
                  <ListFilter className="h-4 w-4" />
                  <span className="sr-only">Filter</span>
                </Button>
                <Button variant="outline" size="icon">
                  <PlusCircle className="h-4 w-4" />
                  <span className="sr-only">Add</span>
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
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="w-[80px]">No.</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Created Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedProducts.map((product, index) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium text-muted-foreground">
                        {(currentPage - 1) * productsPerPage + index + 1}
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.createdDate}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit Product</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive/80">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete Product</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {paginatedProducts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No products found.
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
      </section>
    </div>
  );
}
