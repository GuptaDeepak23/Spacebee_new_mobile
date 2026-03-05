import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for token on app load
        const loadStoredToken = async () => {
            try {
                const token = await SecureStore.getItemAsync("accessToken");
                const user = await SecureStore.getItemAsync("userData");
                if (token) {
                    setIsAuthenticated(true);
                    if (user) setUserData(JSON.parse(user));
                }
            } catch (e) {
                console.log("Error loading token:", e);
            } finally {
                setIsLoading(false);
            }
        };

        loadStoredToken();
    }, []);

    const login = async (email, user) => {
        setUserEmail(email);
        if (user) {
            setUserData(user);
            await SecureStore.setItemAsync("userData", JSON.stringify(user));
            console.log("✅ User data stored in SecureStore:", user.id);
        }
        setIsAuthenticated(true);
    };

    const logout = async () => {
        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("userData");
        console.log("🚪 Logged out, cleared SecureStore");
        setIsAuthenticated(false);
        setUserEmail('');
        setUserData(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userEmail, userData, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
