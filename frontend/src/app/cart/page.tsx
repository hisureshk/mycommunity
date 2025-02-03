'use client';

import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function CartPage() {
    const { items, updateQuantity, removeItem, totalAmount } = useCart();
    const router = useRouter();

    const handleQuantityChange = (itemId: string, newQuantity: number) => {
        updateQuantity(itemId, newQuantity);
    };

    const handleCheckout = () => {
        if (items.length === 0) {
            toast.error('Your cart is empty');
            return;
        }
        router.push('/checkout');
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                    Shopping Cart
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
                                            ${item.price.toFixed(2)}
                                        </p>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Seller: {item.seller.firstName} {item.seller.lastName}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                                            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            -
                                        </button>
                                        <span className="text-gray-900 dark:text-white">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                                            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => removeItem(item._id)}
                                        className="text-red-500 hover:text-red-600"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 space-y-4">
                            <div className="flex justify-between text-lg font-medium">
                                <span className="text-gray-900 dark:text-white">Total</span>
                                <span className="text-indigo-600 dark:text-indigo-400">
                                    ${totalAmount.toFixed(2)}
                                </span>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md
                                hover:bg-indigo-700 transition-colors"
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
