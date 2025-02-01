'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { setAuthToken } from '../lib/api';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: any;
    login: (userData: any) => void;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    login: () => {},
    logout: () => {},
    isAuthenticated: false,
    isLoading: true
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData && userData !== 'undefined') {
            setAuthToken(token);
            setUser(JSON.parse(userData));
        }
        setIsLoading(false);
    }, []);

    const login = (userData: any) => {
        setUser(userData.user);
        setAuthToken(userData.token);
        localStorage.setItem('user', JSON.stringify(userData.user));
        localStorage.setItem('token', userData.token);
        router.push('/dashboard');
    };

    const logout = () => {
        setUser(null);
        setAuthToken('');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        router.replace('/login'); 
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            login, 
            logout, 
            isAuthenticated: !!user, 
            isLoading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
