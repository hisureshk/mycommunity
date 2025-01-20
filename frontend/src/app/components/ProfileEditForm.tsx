'use client';

import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';
import api from '../lib/api';

interface ProfileEditFormProps {
    user: any;
    onUpdate: (updatedUser: any) => void;
    onCancel: () => void;
}

const validationSchema = Yup.object({
    firstName: Yup.string()
        .required('First Name is required')
        .min(2, 'First Name must be at least 2 characters'),
    lastName: Yup.string()
        .required('Last Name is required')
        .min(2, 'Last Name must be at least 2 characters'),
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    phone: Yup.string()
        .matches(/^\+?[\d\s-]+$/, 'Invalid phone number'),
    age: Yup.string(),
    currentPassword: Yup.string()
        .min(6, 'Password must be at least 6 characters'),
    newPassword: Yup.string()
        .min(6, 'Password must be at least 6 characters'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Passwords must match'),
});

export default function ProfileEditForm({ user, onUpdate, onCancel }: ProfileEditFormProps) {
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const formik = useFormik({
        initialValues: {
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            phone: user.phone || '',
            age: user.age || '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const updateData: any = {
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                    phone: values.phone,
                    age: values.age,
                };

                if (isChangingPassword && values.currentPassword && values.newPassword) {
                    updateData.currentPassword = values.currentPassword;
                    updateData.newPassword = values.newPassword;
                }

                const response = await api.put('/users/' + user._id, updateData);
                onUpdate(response.data);
                toast.success('Profile updated successfully');
            } catch (error: any) {
                toast.error(error.response?.data?.message || 'Failed to update profile');
            }
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    First Name
                </label>
                <input
                    id="firstName"
                    type="text"
                    {...formik.getFieldProps('firstName')}
                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 
                    bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white 
                    focus:border-indigo-500 focus:ring-indigo-500"
                />
                {formik.touched.firstName && formik.errors.firstName && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">formik.errors.firstName</p>
                )}
            </div>

            <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Last Name
                </label>
                <input
                    id="lastName"
                    type="text"
                    {...formik.getFieldProps('lastName')}
                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 
                    bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white 
                    focus:border-indigo-500 focus:ring-indigo-500"
                />
                {formik.touched.lastName && formik.errors.firstName && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">formik.errors.lastName</p>
                )}
            </div>

            {/* Email */}
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    {...formik.getFieldProps('email')}
                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 
                    bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white 
                    focus:border-indigo-500 focus:ring-indigo-500"
                />
                {formik.touched.email && formik.errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">formik.errors.email</p>
                )}
            </div>

            {/* Phone */}
            <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Phone
                </label>
                <input
                    id="phone"
                    type="tel"
                    {...formik.getFieldProps('phone')}
                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 
                    bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white 
                    focus:border-indigo-500 focus:ring-indigo-500"
                />
                {formik.touched.phone && formik.errors.phone && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">formik.errors.phone</p>
                )}
            </div>

            {/* Age */}
            <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Age
                </label>
                <input
                    id="age"
                    type="tel"
                    {...formik.getFieldProps('age')}
                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 
                    bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white 
                    focus:border-indigo-500 focus:ring-indigo-500"
                />
                {formik.touched.age && formik.errors.age && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">formik.errors.age</p>
                )}
            </div>

            {/* Password Change Section */}
            <div className="space-y-4">
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="changePassword"
                        checked={isChangingPassword}
                        onChange={(e) => setIsChangingPassword(e.target.checked)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 
                        border-gray-300 rounded"
                    />
                    <label htmlFor="changePassword" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        Change Password
                    </label>
                </div>

                {isChangingPassword && (
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Current Password
                            </label>
                            <input
                                id="currentPassword"
                                type="password"
                                {...formik.getFieldProps('currentPassword')}
                                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 
                                bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white 
                                focus:border-indigo-500 focus:ring-indigo-500"
                            />
                            {formik.touched.currentPassword && formik.errors.currentPassword && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formik.errors.currentPassword}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                New Password
                            </label>
                            <input
                                id="newPassword"
                                type="password"
                                {...formik.getFieldProps('newPassword')}
                                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 
                                bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white 
                                focus:border-indigo-500 focus:ring-indigo-500"
                            />
                            {formik.touched.newPassword && formik.errors.newPassword && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formik.errors.newPassword}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Confirm New Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                {...formik.getFieldProps('confirmPassword')}
                                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 
                                bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white 
                                focus:border-indigo-500 focus:ring-indigo-500"
                            />
                            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formik.errors.confirmPassword}</p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 
                    rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 
                    hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={formik.isSubmitting}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm 
                    font-medium text-white bg-indigo-600 hover:bg-indigo-700 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                    disabled:bg-indigo-400 disabled:cursor-not-allowed"
                >
                    {formik.isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </form>
    );
}
