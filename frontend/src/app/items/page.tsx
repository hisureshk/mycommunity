'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { CategoryDropdown } from '../components/CategoryDropdown';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
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
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { addItem } = useCart();

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await api.get('/items');
                setItems(response.data);
            } catch (error) {
                console.error('Failed to fetch items:', error);
                toast.error('Failed to fetch items');
            } finally {
                setLoading(false);
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
            } finally {
                setLoading(false);
            }
        };
    
        fetchItems();
    }, [filters]);

    const handleCategoryChange = (selectedCategories: string[]) => {
        setFilters(prev => ({ ...prev, selectedCategories }));
    };
    
    
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                    Available Items
                </h1>

                <div className="mb-8 space-y-4">
                    <div className="flex flex-wrap gap-4">
                        <input
                            type="text"
                            placeholder="Search items..."
                            value={filters.search}
                            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                            className="flex-1 rounded-md border p-2"
                        />

                    <CategoryDropdown
                        categories={categories}
                        selectedCategories={filters.categories}
                        onChange={handleCategoryChange}
                    />
                
                        <input
                            type="number"
                            placeholder="Min Price"
                            value={filters.minPrice}
                            onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                            className="w-24 rounded-md border p-2"
                        />
                        <input
                            type="number"
                            placeholder="Max Price"
                            value={filters.maxPrice}
                            onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                            className="w-24 rounded-md border p-2"
                        />
                    </div>
                </div>
                
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
    );
}
