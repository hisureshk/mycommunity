'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { CategorySidebar } from '../components/CategorySidebar';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../lib/api';

interface Item {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    seller: any;
}

interface Category {
    _id: string;
    name: string;
}

export default function ItemsPage() {
    const [items, setItems] = useState<Item[]>([]);
    const { user , isLoading} = useAuth();
    const { addItem } = useCart();
    const [layout, setLayout] = useState({
        sidebarOpen: true,
    });

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await api.get('/items');
                setItems(response.data);
            } catch (error) {
                console.error('Failed to fetch items:', error);
                toast.error('Failed to fetch items');
            } 
        };

        fetchItems();
    }, []);

    const handleAddToCart = (item: Item) => {
        addItem({
            _id: item._id,
            name: item.name,
            price: item.price,
            quantity: 1,
            image: '',
            seller: item.seller
        });
        toast.success('Item added to cart');
    };
    const [filters, setFilters] = useState<{
        categories: string[];
        search: string;
        minPrice: string;
        maxPrice: string;
    }>({
        categories: [],
        search: '',
        minPrice: '',
        maxPrice: '',
    });
    
    const [categories, setCategories] = useState<Category[]>([]);
    
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/items/categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
                toast.error('Failed to fetch categories');
            }
        };
    
        fetchCategories();
    }, []);
    
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const params = new URLSearchParams();
                if (filters.categories) params.append('category', filters.categories.join(','));
                if (filters.search) params.append('search', filters.search);
                if (filters.minPrice) params.append('minPrice', filters.minPrice);
                if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    
                const response = await api.get(`/items?${params.toString()}`);
                setItems(response.data);
            } catch (error) {
                console.error('Failed to fetch items:', error);
                toast.error('Failed to fetch items');
            } 
        };
    
        fetchItems();
    }, [filters]);

    const handleCategoryChange = (selectedCategories: string[]) => {
        setFilters(prev => ({ ...prev, selectedCategories }));
    };

    return (
        <ProtectedRoute>
            <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
                {/* Sidebar for larger screens */}
                <div className="hidden md:block">
                    <CategorySidebar
                        categories={categories}
                        selectedCategories={filters.categories}
                        onCategoryChange={(categories) => 
                            setFilters(prev => ({ ...prev, categories }))
                        }
                    />
                </div>

                {/* Mobile sidebar */}
                <div className="md:hidden">
                    <button
                        onClick={() => setLayout(prev => ({ 
                            ...prev, 
                            sidebarOpen: !prev.sidebarOpen 
                        }))}
                        className="fixed z-50 bottom-4 right-4 p-2 rounded-full bg-indigo-600 text-white"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                  d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    {layout.sidebarOpen && (
                        <div className="fixed inset-0 z-40">
                            <div className="absolute inset-0 bg-black opacity-50" 
                                 onClick={() => setLayout(prev => ({ 
                                     ...prev, 
                                     sidebarOpen: false 
                                 }))}
                            />
                            <div className="absolute left-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-800">
                                <CategorySidebar
                                    categories={categories}
                                    selectedCategories={filters.categories}
                                    onCategoryChange={(categories) => {
                                        setFilters(prev => ({ ...prev, categories }));
                                        setLayout(prev => ({ 
                                            ...prev, 
                                            sidebarOpen: false 
                                        }));
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Main content */}
                <div className="flex-1">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex flex-col space-y-4">
                            {/* Search and price filters */}
                            <div className="flex flex-wrap gap-4">
                                <input
                                    type="text"
                                    placeholder="Search items..."
                                    value={filters.search}
                                    onChange={(e) => setFilters(prev => ({ 
                                        ...prev, 
                                        search: e.target.value 
                                    }))}
                                    className="flex-1 rounded-md border p-2"
                                />
                                <input
                                    type="number"
                                    placeholder="Min Price"
                                    value={filters.minPrice}
                                    onChange={(e) => setFilters(prev => ({ 
                                        ...prev, 
                                        minPrice: e.target.value 
                                    }))}
                                    className="w-24 rounded-md border p-2"
                                />
                                <input
                                    type="number"
                                    placeholder="Max Price"
                                    value={filters.maxPrice}
                                    onChange={(e) => setFilters(prev => ({ 
                                        ...prev, 
                                        maxPrice: e.target.value 
                                    }))}
                                    className="w-24 rounded-md border p-2"
                                />
                            </div>

                            {/* Active filters */}
                            {filters.categories.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {filters.categories.map(categoryId => {
                                        const category = categories.find(c => c._id === categoryId);
                                        return category ? (
                                            <span
                                                key={categoryId}
                                                className="inline-flex items-center px-3 py-1 rounded-full 
                                                         text-sm font-medium bg-indigo-100 text-indigo-800
                                                         dark:bg-indigo-900 dark:text-indigo-200"
                                            >
                                                {category.name}
                                                <button
                                                    onClick={() => setFilters(prev => ({
                                                        ...prev,
                                                        categories: prev.categories.filter(id => id !== categoryId)
                                                    }))}
                                                    className="ml-2 inline-flex items-center"
                                                >
                                                    <span className="sr-only">Remove</span>
                                                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </span>
                                        ) : null;
                                    })}
                                </div>
                            )}

                
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.filter(item => item.seller._id !== user._id).map((item) => (
                        // {items.map((item) => (
                                <div 
                                    key={item._id}
                                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
                                >
                                    <Link href={`/items/detail?id=${item._id}`}>

                                    <img
                                        src={'./images/item.png'}
                                        alt={item.name}
                                        className="w-full h-48 object-cover"
                                    />
                                    </Link>
                                    <div className="p-4">
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            {item.name}
                                        </h2>
                                        <p className="mt-2 text-gray-600 dark:text-gray-300">
                                            {item.description}
                                        </p>
                                        <p className="mt-2 text-gray-600 dark:text-gray-300">
                                            Seller: {item.seller.firstName} {item.seller.lastName}
                                        </p>
                                        <div className="mt-4 flex items-center justify-between">
                                            <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                                                ₹{item.price.toFixed(2)}
                                            </span>
                                            <button
                                                onClick={() => handleAddToCart(item)}
                                                disabled={item.stock === 0}
                                                className="bg-indigo-600 text-white px-4 py-2 rounded-md
                                                hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed
                                                transition-colors"
                                            >
                                                {item.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </ProtectedRoute>
);
}
