'use client';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';

interface AuthFormProps {
    mode: 'login' | 'register';
    onSubmit: (values: any) => Promise<void>;
}

const AuthForm = ({ mode, onSubmit }: AuthFormProps) => {
    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            age: '',
            phone: ''
        },
        validationSchema: Yup.object({
            ...(mode === 'register' && {
                firstName: Yup.string().required('First Name is required'),
            }),
            ...(mode === 'register' && {
                lastName: Yup.string().required('Last Name is required'),
            }),
            email: Yup.string()
                .email('Invalid email address')
                .required('Email is required'),
            password: Yup.string()
                .min(6, 'Password must be at least 6 characters')
                .required('Password is required'),
            ...(mode === 'register' && {
                phone: Yup.string().required('Contact Number is required'),
            }),
        }),
        onSubmit: async (values) => {
            try {
                await onSubmit(values);
            } catch (error) {
                console.error(error);
                toast.error('An error occurred');
            }
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-6 w-full max-w-md">
            {mode === 'register' && (
                <div>
                    <label htmlFor="firstName" className="block text-sm font-medium">
                        First Name
                    </label>
                    <input
                        id="firstName"
                        type="text"
                        {...formik.getFieldProps('firstName')}
                        className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 
                        bg-white dark:bg-gray-800 px-4 py-2 text-gray-900 dark:text-gray-100 
                        focus:border-indigo-500 focus:ring-indigo-500 dark:focus:border-indigo-400 
                        dark:focus:ring-indigo-400 transition-colors"
                    />
                    {formik.touched.firstName && formik.errors.firstName && (
                        <div className="text-red-500 dark:text-red-400 text-sm mt-1">
                            {formik.errors.firstName}
                        </div>
                    )}
                </div>
            )}

            {mode === 'register' && (
                <div>
                    <label htmlFor="lastName" className="block text-sm font-medium">
                        Last Name
                    </label>
                    <input
                        id="lastName"
                        type="text"
                        {...formik.getFieldProps('lastName')}
                        className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 
                        bg-white dark:bg-gray-800 px-4 py-2 text-gray-900 dark:text-gray-100 
                        focus:border-indigo-500 focus:ring-indigo-500 dark:focus:border-indigo-400 
                        dark:focus:ring-indigo-400 transition-colors"
                    />
                    {formik.touched.lastName && formik.errors.lastName && (
                        <div className="text-red-500 dark:text-red-400 text-sm mt-1">
                            {formik.errors.lastName}
                        </div>
                    )}
                </div>
            )}

            <div>
                <label htmlFor="email" className="block text-sm font-medium">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    {...formik.getFieldProps('email')}
                    className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 
                    bg-white dark:bg-gray-800 px-4 py-2 text-gray-900 dark:text-gray-100 
                    focus:border-indigo-500 focus:ring-indigo-500 dark:focus:border-indigo-400 
                    dark:focus:ring-indigo-400 transition-colors"
                />
                {formik.touched.email && formik.errors.email && (
                    <div className="text-red-500 dark:text-red-400 text-sm mt-1">
                        {formik.errors.email}
                    </div>
                )}
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium">
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    {...formik.getFieldProps('password')}
                    className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 
                    bg-white dark:bg-gray-800 px-4 py-2 text-gray-900 dark:text-gray-100 
                    focus:border-indigo-500 focus:ring-indigo-500 dark:focus:border-indigo-400 
                    dark:focus:ring-indigo-400 transition-colors"
                />
                {formik.touched.password && formik.errors.password && (
                    <div className="text-red-500 dark:text-red-400 text-sm mt-1">
                        {formik.errors.password}
                    </div>
                )}
            </div>
            {mode === 'register' && (
            <div>
                <label htmlFor="age" className="block text-sm font-medium">
                    Age
                </label>
                <input
                    id="age"
                    type="text"
                    {...formik.getFieldProps('age')}
                    className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 
                    bg-white dark:bg-gray-800 px-4 py-2 text-gray-900 dark:text-gray-100 
                    focus:border-indigo-500 focus:ring-indigo-500 dark:focus:border-indigo-400 
                    dark:focus:ring-indigo-400 transition-colors"
                />
                {formik.touched.age && formik.errors.age && (
                    <div className="text-red-500 dark:text-red-400 text-sm mt-1">
                        {formik.errors.age}
                    </div>
                )}
            </div>
            )}
            
            {mode === 'register' && (
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium">
                        Phone
                    </label>
                    <input
                        id="phone"
                        type="text"
                        {...formik.getFieldProps('phone')}
                        className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 
                        bg-white dark:bg-gray-800 px-4 py-2 text-gray-900 dark:text-gray-100 
                        focus:border-indigo-500 focus:ring-indigo-500 dark:focus:border-indigo-400 
                        dark:focus:ring-indigo-400 transition-colors"
                    />
                    {formik.touched.phone && formik.errors.phone && (
                        <div className="text-red-500 dark:text-red-400 text-sm mt-1">
                            {formik.errors.phone}
                        </div>
                    )}
                </div>
            )}

            <button
                type="submit"
                disabled={formik.isSubmitting}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg
                shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors
                dark:focus:ring-offset-gray-900"
            >
                {formik.isSubmitting ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Register'}
            </button>
        </form>
    );
};

export default AuthForm;
