'use client';

import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import api from '../lib/api';

export default function CheckoutPage() {
    const { items, totalAmount, clearCart } = useCart();
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const orderData = {
                buyer: user._id,    // user ID is used as buyer ID
                items: items.map(item => ({
                    item: item._id,
                    quantity: item.quantity,
                    price: item.price,
                    seller: item.seller._id,
                    status: 'pending',  // Initial status for the item
                })),
                totalAmount,
                otp: Math.floor(100000 + Math.random() * 900000).toString(),
            };

            await api.post('/orders', orderData);
            alert('Please write down the below OTP and share with Seller to deliver.' + '\n' + 'Order OTP:: ' + orderData.otp);
            clearCart();
            toast.success('Order placed successfully!');
            router.push('/orders');
        } catch (error) {
            console.error('Error placing order:', error);
            toast.error('Failed to place order');
        } finally {
            if(loading)
                setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                Checkout
            </h1>

            {items.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-600 dark:text-gray-400">
                        Your cart is empty
                    </p>
                </div>
            ) : (
                <>
                    <div className="space-y-4">
                        {items.map((item) => (
                            <div 
                                key={item._id}
                                className="flex items-center space-x-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
                            >
                                <img
                                    src='./images/item.png'
                                    alt={item.name}
                                    className="w-16 h-16 object-cover rounded"
                                />
                                <div className="flex-1">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                        {item.name}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        ₹{item.price.toFixed(2)}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Seller: {item.seller.firstName} {item.seller.lastName}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-gray-900 dark:text-white">
                                        {item.quantity}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 space-y-4">
                        <div className="flex justify-between text-lg font-medium">
                            <span className="text-gray-900 dark:text-white">Total</span>
                            <span className="text-indigo-600 dark:text-indigo-400">
                                ₹{totalAmount.toFixed(2)}
                            </span>
                        </div>

                        <button
                            onClick={handleSubmit}
                            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md
                            hover:bg-indigo-700 transition-colors"
                        >
                            Submit
                        </button>
                    </div>
                </>
            )}
        </div>
    </div>
);
}
