'use client'

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

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

const OrdersPage = () => {
    const [activeTab, setActiveTab] = useState('sold');
    const [soldOrders, setSoldOrders] = useState<Order[]>([]);
    const [boughtOrders, setBoughtOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                //const response = await api.get(`/orders/user/${user._id}`);

                const [boughtResponse, soldResponse] = await Promise.all([
                    api.get(`/orders/user/${user._id}`),
                    api.get(`/orders/seller/${user._id}`)
                ]);
                setSoldOrders(soldResponse.data);
                setBoughtOrders(boughtResponse.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'text-green-600 dark:text-green-400';
            case 'pending':
                return 'text-yellow-600 dark:text-yellow-400';
            case 'cancelled':
                return 'text-red-600 dark:text-red-400';
            default:
                return 'text-gray-600 dark:text-gray-400';
        }
    };
    

    const OrdersTable = ({ orders, type }: { orders: Order[], type: 'sold' | 'bought' }) => (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Order #
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Item Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Item Quantity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            {type === 'sold' ? 'Buyer' : 'Seller'}
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {orders.map((order) => (
                        order.items.map((item) => (
                            <tr key={`${order._id}-${item.item._id}`} 
                                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                    {order._id.slice(-8)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                    {item.item.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                    {item.quantity}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                    ₹{(item.price * item.quantity).toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`${getStatusColor(item.status)} capitalize`}>
                                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                    {type === 'sold' ? order._id : item.item._id}
                                </td>
                            </tr>
                        ))
                    ))}
                </tbody>
            </table>

        </div>
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">My Orders</h1>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex">
                    <button
                        className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'sold'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                        onClick={() => setActiveTab('sold')}
                    >
                        Orders Sold
                    </button>
                    <button
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'bought'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                        onClick={() => setActiveTab('bought')}
                    >
                        Orders Bought
                    </button>
                </nav>
            </div>

            {/* Content */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                {activeTab === 'sold' && (
                    <div>
                        {soldOrders.length > 0 ? (
                            <OrdersTable orders={soldOrders} type="sold" />
                        ) : (
                            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                                No orders sold yet.
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'bought' && (
                    <div>
                        {boughtOrders.length > 0 ? (
                            <OrdersTable orders={boughtOrders} type="bought" />
                        ) : (
                            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                                No orders bought yet.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersPage;
