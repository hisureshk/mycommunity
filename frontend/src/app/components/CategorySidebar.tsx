// src/components/CategorySidebar.tsx
import { useState } from 'react';

interface Category {
    _id: string;
    name: string;
}

interface CategorySidebarProps {
  categories: Category[];
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
}

export const CategorySidebar = ({ 
  categories, 
  selectedCategories, 
  onCategoryChange 
}: CategorySidebarProps) => {
  return (
    <div className="w-64 min-h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Categories
      </h2>
      <div className="space-y-2">
        {categories.map((category) => (
          <label 
            key={category.name} 
            className="flex items-center space-x-2 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedCategories.includes(category.name)}
              onChange={(e) => {
                if (e.target.checked) {
                  onCategoryChange([...selectedCategories, category.name]);
                } else {
                  onCategoryChange(selectedCategories.filter(name => name !== category.name));
                }
              }}
              className="rounded border-gray-300 text-indigo-600 
                         focus:ring-indigo-500 dark:border-gray-600 
                         dark:bg-gray-700 dark:checked:bg-indigo-500"
            />
            <span className="text-gray-700 dark:text-gray-200">
              {category.name}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};
