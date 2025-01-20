'use client';

import { useAuth } from '../context/AuthContext';
import AuthForm from '../components/AuthForm';
import { register } from '../lib/api';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function RegisterPage() {
    const { login } = useAuth();

    const handleRegister = async (values: any) => {
        try {
            const data = await register(values);
            login(data);
            toast.success('Registered successfully');
        } catch (error: any) {
            throw error;
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold">
                        Create your account
                    </h2>
                </div>

                <AuthForm mode="register" onSubmit={handleRegister} />

                <p className="text-center">
                    Already have an account?{' '}
                    <Link href="/login" className="text-blue-500 hover:text-blue-600">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
