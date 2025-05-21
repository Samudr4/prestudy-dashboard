
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PlusCircle, Save, RotateCcw } from "lucide-react";
import { usePageTitle } from '@/contexts/PageTitleContext';
import { useToast } from "@/hooks/use-toast";
import { quizCategories, quizDifficulties, type AddQuizFormValues, type QuizDifficulty, mockQuizListItems, type QuizListItem } from "@/data/mock-data";

const addQuizFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  category: z.string({ required_error: "Category is required." }),
  difficulty: z.enum(["Easy", "Medium", "Hard"], { required_error: "Difficulty is required." }),
  description: z.string().min(10, "Description must be at least 10 characters").max(500),
  questionsJson: z.string().refine((val) => {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) && parsed.length > 0;
    } catch (e) {
      return false;
    }
  }, "Must be a valid JSON array of questions and not empty."),
});


export default function AddQuizPage() {
  const { setPageTitle } = usePageTitle();
  const { toast } = useToast();

  React.useEffect(() => {
    setPageTitle("Add New Quiz");
  }, [setPageTitle]);

  const form = useForm<AddQuizFormValues>({
    resolver: zodResolver(addQuizFormSchema),
    defaultValues: {
      title: "",
      category: "",
      difficulty: "Easy",
      description: "",
      questionsJson: JSON.stringify([
        {
          id: "q1",
          type: "multiple-choice",
          text: "What is the capital of France?",
          options: ["Berlin", "Madrid", "Paris", "Rome"],
          correctAnswer: "Paris",
          explanation: "Paris is the capital and most populous city of France."
        }
      ], null, 2),
    },
  });

  function onSubmit(data: AddQuizFormValues) {
    try {
      const questions = JSON.parse(data.questionsJson);
      if (!Array.isArray(questions) || questions.length === 0) {
        toast({
          title: "Invalid Questions Format",
          description: "Questions JSON must be a non-empty array.",
          variant: "destructive",
        });
        return;
      }

      const newQuiz: QuizListItem = {
        id: `quiz${mockQuizListItems.length + 1 + Date.now()}`, // More unique ID
        title: data.title,
        category: data.category,
        questionsCount: questions.length,
        difficulty: data.difficulty,
        status: "Draft", // Default status for new quizzes
        createdDate: new Date().toISOString().split('T')[0],
        lastUpdatedDate: new Date().toISOString().split('T')[0],
      };

      // Add to the global mock data array (for demo purposes)
      mockQuizListItems.push(newQuiz);

      toast({
        title: "Quiz Created Successfully!",
        description: `Quiz "${data.title}" has been added. It will appear in the Quiz List after navigating there.`,
      });
      form.reset();
    } catch (e) {
      console.error("Error submitting quiz:", e);
      toast({
        title: "Error Parsing Questions JSON",
        description: "Please ensure the questions are in valid JSON format.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
      <Card className="shadow-lg max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Create a New Quiz</CardTitle>
          <CardDescription>Fill in the details below to add a new quiz to the platform.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quiz Title</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., Indian History Basics" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {quizCategories.map(cat => (
                            <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Difficulty Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {quizDifficulties.map(diff => (
                            <SelectItem key={diff.value} value={diff.value}>{diff.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Provide a brief summary of the quiz content..." {...field} rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="questionsJson"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Questions (JSON format)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Enter questions as a JSON array. E.g., [{"id":"q1", "text":"...", ...}]'
                        {...field}
                        rows={10}
                        className="font-mono text-sm"
                      />
                    </FormControl>
                    <FormDescription>
                      Each question should be an object in an array. See placeholder for an example structure.
                      For a real app, a dynamic question builder would be more user-friendly.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-end gap-2 border-t pt-6">
              <Button type="button" variant="outline" onClick={() => form.reset()}>
                <RotateCcw className="mr-2 h-4 w-4" /> Reset Form
              </Button>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" /> Save Quiz
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
