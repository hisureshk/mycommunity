'use client';

import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';

export default function DashboardPage() {
    const { user, logout } = useAuth();

    return (
        <ProtectedRoute>

            
            <div className="min-h-screen p-4">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl font-bold">Dashboard</h1>
                        <button
                            onClick={logout}
                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                        >
                            Logout
                        </button>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Welcome, {user?.name}!</h2>
                        <p>You are now logged in to your account.</p>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
