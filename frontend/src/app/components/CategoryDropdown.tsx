'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

interface Category {
    _id: string;
    name: string;
}


export const CategoryDropdown = ({ 
    categories, 
    selectedCategories, 
    onChange 
}: {
    categories: Category[];
    selectedCategories: string[];
    onChange: (categories: string[]) => void;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Handle clicking outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle category selection
    const handleCategoryChange = (categoryId: string) => {
        const updatedCategories = selectedCategories.includes(categoryId)
            ? selectedCategories.filter(id => id !== categoryId)
            : [...selectedCategories, categoryId];
        onChange(updatedCategories);
    };

    // Get selected categories names for display
    const getSelectedCategoriesText = () => {
        if (selectedCategories.length === 0) return 'Select Categories';
        if (selectedCategories.length === 1) {
            return categories.find(cat => cat._id === selectedCategories[0])?.name;
        }
        return `${selectedCategories.length} categories selected`;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Dropdown Button */}
            <button
                type="button"
                className="relative w-full cursor-pointer rounded-md bg-white dark:bg-gray-800 py-2 pl-3 pr-10 text-left border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="block truncate text-gray-700 dark:text-gray-200">
                    {getSelectedCategoriesText()}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-10 mt-1 w-full rounded-md bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="max-h-60 overflow-auto rounded-md py-1">
                        {categories.map((category) => (
                            <label
                                key={category.name}
                                className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedCategories.includes(category.name)}
                                    onChange={() => handleCategoryChange(category.name)}
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                                />
                                <span className="ml-3 text-gray-700 dark:text-gray-200">
                                    {category.name}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};