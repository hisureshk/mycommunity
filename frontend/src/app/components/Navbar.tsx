'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import ThemeToggle from './ThemeToggle';
import { useState } from 'react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const { totalItems } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0">
                            <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                                Store
                            </span>
                        </Link>

                        <div className="hidden md:ml-6 md:flex md:space-x-4">
                            {user && (
                            <Link href="/items" className="nav-link">
                                Shop
                            </Link>
                            )}
                            {user && (
                            <Link href="/orders" className="nav-link">
                                Orders
                            </Link>
                            )}
                            {user && (
                            <Link href="/deliver-items" className="nav-link">
                                Deliver Items
                            </Link>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        
                        {user && (
                            <Link href="/cart" className="relative">
                                <svg 
                                    className="h-6 w-6 text-gray-700 dark:text-gray-300"
                                    fill="none" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth="2" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                >
                                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                {totalItems > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {totalItems}
                                    </span>
                                )}
                            </Link>
                        )}

                        <div className="hidden md:flex items-center space-x-4">
                            {user ? (
                                <>
                                    <span className="text-gray-700 dark:text-gray-300">
                                        {user.name}
                                    </span>
                                    <button
                                        onClick={logout}
                                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                        <div className="absolute top-4 right-4">
                            <ThemeToggle />
                        </div>


                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden rounded-md p-2 text-gray-700 dark:text-gray-300"
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                {isMenuOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                    {user && (
                        <Link
                            href="/items"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300"
                        >
                            Shop
                        </Link>
                    )}
                        {user && (
                            <Link
                                href="/orders"
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300"
                            >
                                Orders
                            </Link>
                        )}
                        {user ? (
                            <button
                                onClick={logout}
                                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-500"
                            >
                                Logout
                            </button>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
