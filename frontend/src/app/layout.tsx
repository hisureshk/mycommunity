import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';

import './globals.css';
//import ProtectedRoute from './components/ProtectedRoute';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
                <ThemeProvider>
                    <AuthProvider>
                        <CartProvider>
                            <div className="flex flex-col min-h-screen">
                                <Navbar />
                                <main className="flex-grow">
                                    {children}
                                </main>
                            </div>
                            <Toaster 
                                position="top-right"
                                toastOptions={{
                                    className: 'dark:bg-gray-800 dark:text-white'
                                }}
                            />
                            {children}
                        </CartProvider>
                        </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
