'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { toast } from 'react-hot-toast';

interface Item {
    _id: string;
    name: string;
    price: number;
    image: string;
    seller: string;
}

interface OrderItem {
    _id: string;
    item: Item;
    status: string;
    quantity: number;
    price: number;
}

interface Order {
    _id: string;
    items: OrderItem[];
    totalAmount: number;
    createdAt: string;
    buyer: {
        _id: string;
        name: string;
        email: string;
    };
}

export default function DeliverItemsPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        fetchSellerOrders();
    }, []);

    const fetchSellerOrders = async () => {
        try {
            const response = await api.get(`/orders/seller/${user._id}`);
            setOrders(response.data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId: string, itemId: string, newStatus: string) => {
        try {
            await api.patch(`/orders/${orderId}/items/${itemId}`, {
                status: newStatus
            });
            
            // Update local state
            setOrders(orders.map(order => {
                if (order._id === orderId) {
                    return {
                        ...order,
                        items: order.items.map(item => {
                            if (item._id === itemId) {
                                return { ...item, status: newStatus };
                            }
                            return item;
                        })
                    };
                }
                return order;
            }));

            toast.success('Order status updated successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to update order status');
        }
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
                    Deliver Items
                </h1>

                {orders.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600 dark:text-gray-400">
                            No orders to fulfill
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.filter(order => order.items.some(item => item.item.seller === user._id && item.status !== 'delivered')).map((order) => (
                       // {orders.map((order) => (
                            <div
                                key={order._id}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <div>
                                            <h2 className="text-lg font-semibold">
                                                Order #{order._id.slice(-8)}
                                            </h2>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Customer: {order.buyer.name}
                                            </p>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        {order.items.filter(item => item.item.seller === user._id && item.status !== 'delivered').map((item) => (
                                            <div key={item._id} 
                                                className="flex items-center justify-between p-4 border rounded-lg"
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <img
                                                        src="./images/item.png"
                                                        alt={item.item.name}
                                                        className="w-16 h-16 object-cover rounded"
                                                    />
                                                    <div>
                                                        <h3 className="font-medium">{item.item.name}</h3>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            Quantity: {item.quantity}
                                                        </p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            Price: ₹{item.price.toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-4">
                                                    <span className={`px-3 py-1 rounded-full text-sm ${
                                                        item.status === 'completed' 
                                                            ? 'bg-green-100 text-green-800'
                                                            : item.status === 'processing'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                                    </span>

                                                    <select
                                                        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                        value={item.status}
                                                        onChange={(e) => updateOrderStatus(order._id, item._id, e.target.value)}
                                                        disabled={item.status === 'delivered'}
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="processing">Processing</option>
                                                        <option value="delivered">Delivered</option>
                                                    </select>
                                                </div>
                                            </div>
                                        ))}
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
