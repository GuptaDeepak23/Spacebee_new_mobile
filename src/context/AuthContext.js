import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for token on app load
        const loadStoredToken = async () => {
            try {
                const token = await SecureStore.getItemAsync("accessToken");
                if (token) {
                    // In a real app, you might want to fetch user profile here
                    setIsAuthenticated(true);
                }
            } catch (e) {
                console.log("Error loading token:", e);
            } finally {
                setIsLoading(false);
            }
        };

        loadStoredToken();
    }, []);

    const login = (email) => {
        setUserEmail(email);
        setIsAuthenticated(true);
    };

    const logout = async () => {
        await SecureStore.deleteItemAsync("accessToken");
        setIsAuthenticated(false);
        setUserEmail('');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userEmail, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
