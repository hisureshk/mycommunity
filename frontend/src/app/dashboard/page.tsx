'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProfileEditForm from '../components/ProfileEditForm';
import ProtectedRoute from '../components/ProtectedRoute';
import LoadingSpinner from '../components/LoadingSpinner';


export default function DashboardPage() {
    const { user, isLoading, login } = useAuth();
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);

    if (!isLoading && !user) {
        router.push('/login');
        return null;
    }

    const handleProfileUpdate = (updatedUser: any) => {
        login({ user: updatedUser, token: localStorage.getItem('token') });
        setIsEditing(true);
    };

    if (isLoading) {
        return (
          <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner />
          </div>
        );
      }

    return (
        <ProtectedRoute>    
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Welcome, {user.firstName}!</h1>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-md 
                            hover:bg-indigo-700 transition-colors"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Profile Information */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        {isEditing ? (
                            <ProfileEditForm
                                user={user}
                                onUpdate={handleProfileUpdate}
                                onCancel={() => setIsEditing(false)}
                            />
                        ) : (
                            <>
                                <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                                            First Name
                                        </label>
                                        <p className="mt-1">{user.firstName}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Last Name
                                        </label>
                                        <p className="mt-1">{user.lastName}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Email
                                        </label>
                                        <p className="mt-1">{user.email}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Phone
                                        </label>
                                        <p className="mt-1">{user.phone || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Age
                                        </label>
                                        <p className="mt-1">{user.age || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Member Since
                                        </label>
                                        <p className="mt-1">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                        <div className="space-y-4">
                            <Link 
                                href="/items" 
                                className="block p-4 bg-indigo-50 dark:bg-gray-700 rounded-lg 
                                hover:bg-indigo-100 dark:hover:bg-gray-600 transition-colors"
                            >
                                <h3 className="font-medium">Browse Items</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Explore our collection of items
                                </p>
                            </Link>
                            
                            <Link 
                                href="/items/add" 
                                className="block p-4 bg-indigo-50 dark:bg-gray-700 rounded-lg 
                                hover:bg-indigo-100 dark:hover:bg-gray-600 transition-colors"
                            >
                                <h3 className="font-medium">Sell Items</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    List your items for sale
                                </p>
                            </Link>
                            
                            <Link 
                                href="/orders" 
                                className="block p-4 bg-indigo-50 dark:bg-gray-700 rounded-lg 
                                hover:bg-indigo-100 dark:hover:bg-gray-600 transition-colors"
                            >
                                <h3 className="font-medium">View Orders</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Check your order history
                                </p>
                            </Link>
                            
                            <Link 
                                href="/cart" 
                                className="block p-4 bg-indigo-50 dark:bg-gray-700 rounded-lg 
                                hover:bg-indigo-100 dark:hover:bg-gray-600 transition-colors"
                            >
                                <h3 className="font-medium">Shopping Cart</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    View your cart and checkout
                                </p>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </ProtectedRoute>
    );
}
