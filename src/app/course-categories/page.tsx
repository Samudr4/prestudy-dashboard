
"use client";

import * as React from "react";
import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PlusCircle, Edit, Trash2, Search, Package } from "lucide-react";
import { usePageTitle } from '@/contexts/PageTitleContext';
import { mockCourseCategories, type CourseCategory } from "@/data/mock-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function CourseCategoriesPage() {
  const { setPageTitle } = usePageTitle();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [categories, setCategories] = React.useState<CourseCategory[]>([...mockCourseCategories]);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);

  // Form state for Add/Edit Dialog
  const [editCategory, setEditCategory] = React.useState<CourseCategory | null>(null);
  const [categoryName, setCategoryName] = React.useState("");
  const [categoryDescription, setCategoryDescription] = React.useState("");
  const [categoryQuizCount, setCategoryQuizCount] = React.useState(0);
  const [categoryImageUrl, setCategoryImageUrl] = React.useState("");
  const [categoryImageHint, setCategoryImageHint] = React.useState("");


  React.useEffect(() => {
    setPageTitle("Course Categories");
    setCategories([...mockCourseCategories]);
  }, [setPageTitle]);

  React.useEffect(() => {
    if (editCategory) {
      setCategoryName(editCategory.name);
      setCategoryDescription(editCategory.description);
      setCategoryQuizCount(editCategory.quizCount);
      setCategoryImageUrl(editCategory.imageUrl);
      setCategoryImageHint(editCategory.imageHint);
    } else {
      // Reset form for Add
      setCategoryName("");
      setCategoryDescription("");
      setCategoryQuizCount(0);
      setCategoryImageUrl("");
      setCategoryImageHint("");
    }
  }, [editCategory, isAddDialogOpen]);


  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (editCategory) { // Editing existing category
      const updatedCategory: CourseCategory = {
        ...editCategory,
        name: categoryName,
        description: categoryDescription,
        quizCount: categoryQuizCount,
        imageUrl: categoryImageUrl || 'https://placehold.co/300x200.png',
        imageHint: categoryImageHint || 'course category',
        lastUpdated: new Date().toISOString().split('T')[0],
      };
      setCategories(prev => prev.map(cat => cat.id === editCategory.id ? updatedCategory : cat));
      const globalIndex = mockCourseCategories.findIndex(cat => cat.id === editCategory.id);
      if (globalIndex > -1) mockCourseCategories[globalIndex] = updatedCategory;
      
      toast({ title: "Category Updated", description: `Category "${updatedCategory.name}" updated successfully.` });
    } else { // Adding new category
      const newCategory: CourseCategory = {
        id: `ccat${categories.length + 1 + Date.now()}`,
        name: categoryName,
        description: categoryDescription,
        quizCount: categoryQuizCount,
        imageUrl: categoryImageUrl || 'https://placehold.co/300x200.png',
        imageHint: categoryImageHint || 'course category',
        lastUpdated: new Date().toISOString().split('T')[0],
      };
      setCategories(prev => [newCategory, ...prev]);
      mockCourseCategories.unshift(newCategory);
      toast({ title: "Category Added", description: `Category "${newCategory.name}" added successfully.` });
    }
    
    setIsAddDialogOpen(false);
    setEditCategory(null); 
  };

  const handleDeleteCategory = (categoryId: string) => {
    const categoryToDelete = categories.find(cat => cat.id === categoryId);
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    const globalIndex = mockCourseCategories.findIndex(cat => cat.id === categoryId);
    if (globalIndex > -1) mockCourseCategories.splice(globalIndex, 1);

    toast({ title: "Category Deleted", description: `Category "${categoryToDelete?.name}" has been removed.`, variant: "destructive" });
  };
  
  const openEditDialog = (category: CourseCategory) => {
    setEditCategory(category);
    setIsAddDialogOpen(true);
  };
  
  const openAddDialog = () => {
    setEditCategory(null); // Ensure form is for adding
    setIsAddDialogOpen(true);
  };


  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground md:hidden">Course Categories</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={openAddDialog}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Category
          </Button>
        </div>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={(isOpen) => {
          setIsAddDialogOpen(isOpen);
          if (!isOpen) setEditCategory(null); // Reset edit state when dialog closes
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editCategory ? "Edit Course Category" : "Add New Course Category"}</DialogTitle>
            <DialogDescription>
              {editCategory ? "Update the details for this course category." : "Fill in the details for the new course category."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFormSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" name="name" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea id="description" name="description" value={categoryDescription} onChange={(e) => setCategoryDescription(e.target.value)} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="quizCount" className="text-right">Quiz Count</Label>
                <Input id="quizCount" name="quizCount" type="number" value={categoryQuizCount} onChange={(e) => setCategoryQuizCount(parseInt(e.target.value) || 0)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="imageUrl" className="text-right">Image URL</Label>
                <Input id="imageUrl" name="imageUrl" value={categoryImageUrl} onChange={(e) => setCategoryImageUrl(e.target.value)} placeholder="https://placehold.co/300x200.png" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="imageHint" className="text-right">Image Hint</Label>
                <Input id="imageHint" name="imageHint" value={categoryImageHint} onChange={(e) => setCategoryImageHint(e.target.value)} placeholder="e.g. science book" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
              <Button type="submit">{editCategory ? "Save Changes" : "Save Category"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>


      {filteredCategories.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCategories.map((category) => (
            <Card key={category.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <CardHeader className="p-0">
                <Image
                  src={category.imageUrl}
                  alt={category.name}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover rounded-t-lg"
                  data-ai-hint={category.imageHint}
                />
              </CardHeader>
              <CardContent className="p-4 flex-grow">
                <CardTitle className="text-lg mb-2">{category.name}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground mb-3 h-20 overflow-hidden text-ellipsis">
                  {category.description}
                </CardDescription>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Package className="mr-1.5 h-3.5 w-3.5" />
                  <span>{category.quizCount} Quizzes</span>
                </div>
              </CardContent>
              <CardFooter className="p-4 border-t flex justify-between items-center">
                <p className="text-xs text-muted-foreground">Updated: {category.lastUpdated}</p>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary" onClick={() => openEditDialog(category)}>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit Category</span>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive/80">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete Category</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the category "{category.name}".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteCategory(category.id)} className={buttonVariants({ variant: "destructive" })}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="shadow-lg">
          <CardContent className="p-10 text-center">
            <p className="text-muted-foreground">No course categories found matching your search criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
