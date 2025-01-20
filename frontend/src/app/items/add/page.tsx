'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';
import api from '../../lib/api';
import ProtectedRoute from '../../components/ProtectedRoute';

const validationSchema = Yup.object({
    name: Yup.string()
        .required('Name is required')
        .min(3, 'Name must be at least 3 characters'),
    description: Yup.string()
        .required('Description is required')
        .min(10, 'Description must be at least 10 characters'),
    price: Yup.number()
        .required('Price is required')
        .positive('Price must be positive')
        .min(0.01, 'Price must be at least 0.01'),
    category: Yup.string()
        .required('Category is required'),
    stock: Yup.number()
        .required('Stock is required')
        .integer('Stock must be a whole number')
        .min(0, 'Stock cannot be negative'),
});

const categories = [
    'Electronics',
    'Clothing',
    'Books',
    'Home & Garden',
    'Sports',
    'Toys',
    'Health & Beauty',
    'Automotive',
    'Other'
];

export default function AddItemPage() {
    const router = useRouter();
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const { user } = useAuth();

    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
            price: '',
            category: '',
            stock: '',
            seller: user._id,
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                // Then, create the item with the image URL
                const itemData = {
                    name: values.name,
                    description: values.description,
                    price: Number(values.price),
                    category: values.category,
                    stock: Number(values.stock),
                    seller: user._id,
                };
                await api.post('/items', itemData);
                toast.success('Item added successfully');
                router.push('/items');
            } catch (error: any) {
                toast.error(error.response?.data?.message || 'Failed to add item');
            } finally {
                setUploading(false);
            }
        },
    });

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            Add New Item
                        </h1>

                        <form onSubmit={formik.handleSubmit} className="space-y-6">
                            
                            {/* Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    {...formik.getFieldProps('name')}
                                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 
                                    bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white 
                                    focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                {formik.touched.name && formik.errors.name && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formik.errors.name}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    rows={4}
                                    {...formik.getFieldProps('description')}
                                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 
                                    bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white 
                                    focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                {formik.touched.description && formik.errors.description && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formik.errors.description}</p>
                                )}
                            </div>

                            {/* Price and Stock */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Price ($)
                                    </label>
                                    <input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        {...formik.getFieldProps('price')}
                                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 
                                        bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white 
                                        focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    {formik.touched.price && formik.errors.price && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formik.errors.price}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Stock
                                    </label>
                                    <input
                                        id="stock"
                                        type="number"
                                        {...formik.getFieldProps('stock')}
                                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 
                                        bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white 
                                        focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    {formik.touched.stock && formik.errors.stock && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formik.errors.stock}</p>
                                    )}
                                </div>
                            </div>

                            {/* Category */}
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Category
                                </label>
                                <select
                                    id="category"
                                    {...formik.getFieldProps('category')}
                                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 
                                    bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white 
                                    focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                                {formik.touched.category && formik.errors.category && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formik.errors.category}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={formik.isSubmitting || uploading}
                                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md
                                hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2
                                focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {uploading ? 'Uploading...' : formik.isSubmitting ? 'Adding Item...' : 'Add Item'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
