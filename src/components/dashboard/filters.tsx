"use client";

import type { DateRange } from "react-day-picker";
import { DateRangePicker } from "./date-range-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
// import { mockCategoryData } from "@/data/mock-data"; // Assuming this might change or be removed

// Placeholder if mockCategoryData structure changes
const uniqueCategoriesFromMock = ["all", "electronics", "clothing", "groceries"];


type FiltersProps = {
  currentFilters: {
    dateRange?: DateRange;
    category: string;
  };
  onFilterChange: (newFilters: { dateRange?: DateRange; category: string }) => void;
};

export function Filters({ currentFilters, onFilterChange }: FiltersProps) {
  const handleDateChange = (dateRange?: DateRange) => {
    onFilterChange({ ...currentFilters, dateRange });
  };

  const handleCategoryChange = (category: string) => {
    onFilterChange({ ...currentFilters, category });
  };

  // const uniqueCategories = ["all", ...new Set(mockCategoryData.map(cat => cat.name.toLowerCase()))];
  const uniqueCategories = uniqueCategoriesFromMock;


  return (
    <div className="grid grid-cols-1 gap-4 rounded-lg border bg-card p-4 shadow md:grid-cols-2 lg:grid-cols-3">
      <div>
        <Label htmlFor="date-range" className="mb-2 block text-sm font-medium">
          Date Range
        </Label>
        <DateRangePicker
          date={currentFilters.dateRange}
          onDateChange={handleDateChange}
        />
      </div>
      <div>
        <Label htmlFor="category-select" className="mb-2 block text-sm font-medium">
          Category
        </Label>
        <Select
          value={currentFilters.category}
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger id="category-select" className="w-full">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {uniqueCategories.map((category) => (
              <SelectItem key={category} value={category} className="capitalize">
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
