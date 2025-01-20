'use client';

import { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
    _id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    seller: string;
}

interface CartContextType {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalAmount: number;
}

const CartContext = createContext<CartContextType>({
    items: [],
    addItem: () => {},
    removeItem: () => {},
    updateQuantity: () => {},
    clearCart: () => {},
    totalItems: 0,
    totalAmount: 0
});

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setItems(JSON.parse(savedCart));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
    }, [items]);

    const addItem = (item: CartItem) => {
        setItems(currentItems => {
            const existingItem = currentItems.find(i => i._id === item._id);
            if (existingItem) {
                return currentItems.map(i =>
                    i._id === item._id
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
            }
            return [...currentItems, { ...item, quantity: 1 }];
        });
    };

    const removeItem = (itemId: string) => {
        setItems(currentItems => currentItems.filter(item => item._id !== itemId));
    };

    const updateQuantity = (itemId: string, quantity: number) => {
        setItems(currentItems =>
            currentItems.map(item =>
                item._id === itemId
                    ? { ...item, quantity: Math.max(0, quantity) }
                    : item
            ).filter(item => item.quantity > 0)
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{
            items,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            totalItems,
            totalAmount
        }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
