'use client';

import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import api from '../../lib/api';
import LoadingSpinner from '../../components/LoadingSpinner';

interface Item {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    seller: string;
    image?: string;
}

export default function ItemDetailPage() {
    const [item, setItem] = useState<Item | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const { addItem } = useCart();
    const params = useParams();

    useEffect(() => {
        const fetchItem = async () => {
            try {
                if (!params.id) return;           
                const response = await api.get(`/items/${params.id}`);
                console.log(" ###### Response is" + response.data);
                setItem(response.data);
            } catch (error) {
                toast.error('Failed to fetch item details');
                console.error('Error fetching item:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchItem();
    }, [params.id]);

    const handleAddToCart = () => {
        if (!item) return;

        addItem({
            _id: item._id,
            name: item.name,
            price: item.price,
            quantity: quantity,
            image: item.image || '/images/default-item.png',
            seller: item.seller
        });
        toast.success('Item added to cart');
    };

    const handleQuantityChange = (change: number) => {
        const newQuantity = quantity + change;
        if (newQuantity >= 1 && item && newQuantity <= item.stock) {
            setQuantity(newQuantity);
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!item) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl text-gray-600">Item not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="w-full md:w-1/2 relative">
                                <Image
                                    src={item.image || '/images/default-item.png'}
                                    alt={item.name}
                                    width={400}
                                    height={400}
                                    className="rounded-lg object-cover"
                                    priority
                                />
                            </div>

                            <div className="w-full md:w-1/2">
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                    {item.name}
                                </h1>
                                
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    {item.description}
                                </p>

                                <div className="mb-4">
                                    <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                                        ${item.price.toFixed(2)}
                                    </span>
                                </div>

                                <div className="mb-4">
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Category: {item.category}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Seller: {item.seller}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Stock: {item.stock}
                                    </p>
                                </div>

                                <div className="flex items-center space-x-4 mb-6">
                                    <button
                                        onClick={() => handleQuantityChange(-1)}
                                        className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 
                                                 hover:bg-gray-200 dark:hover:bg-gray-600"
                                        disabled={quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <span className="text-gray-900 dark:text-white">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => handleQuantityChange(1)}
                                        className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 
                                                 hover:bg-gray-200 dark:hover:bg-gray-600"
                                        disabled={quantity >= item.stock}
                                    >
                                        +
                                    </button>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    disabled={item.stock === 0}
                                    className="w-full bg-indigo-600 text-white px-6 py-3 rounded-md
                                             hover:bg-indigo-700 disabled:bg-gray-400 
                                             disabled:cursor-not-allowed transition-colors"
                                >
                                    {item.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
