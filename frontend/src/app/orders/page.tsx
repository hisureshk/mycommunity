'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { toast } from 'react-hot-toast';

interface OrderItem {
    item: {
        _id: string;
        name: string;
        price: number;
        image: string;

    };
    status: string;
    quantity: number;
    price: number;
}

interface Order {
    _id: string;
    items: OrderItem[];
    totalAmount: number;
    createdAt: string;
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get('/orders/user/' + user._id);
                setOrders(response.data);
            } catch (error) {
                toast.error('Failed to fetch orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

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
                    Order History
                </h1>

                {orders.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600 dark:text-gray-400">
                            You haven't placed any orders yet
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div
                                key={order._id}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-lg font-semibold">
                                            Order #{order._id.slice(-8)}
                                        </h2>
                                    </div>

                                    <div className="space-y-4">
                                        {order.items.map((item, index) => (
                                            <div key={index} className="flex items-center space-x-4">
                                                <img
                                                    src="./images/item.png"
                                                    alt={item.item.name}
                                                    className="w-16 h-16 object-cover rounded"
                                                />
                                                <div className="flex-1">
                                                    <h3 className="font-medium">
                                                        {item.item.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        Quantity: {item.quantity}
                                                    </p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-sm ${
                                                    item.status === 'completed' 
                                                        ? 'bg-green-100 text-green-800'
                                                        : item.status === 'processing'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                                </span>
                                                <p className="text-gray-900 dark:text-white">
                                                    ₹{(item.price * item.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-6 pt-6 border-t">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Order Date
                                                </p>
                                                <p className="font-medium">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Total Amount
                                                </p>
                                                <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                                                    ₹{order.totalAmount.toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
