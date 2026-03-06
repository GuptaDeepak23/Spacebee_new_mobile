import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';


import { uselogout } from '../../api/hooks/useApi';
import { setLogoutCallback } from '../../api/axiosInstance';



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

        // Register logout callback for 401 errors
        setLogoutCallback(logout);
    }, [logout]);


    const login = async (email, user) => {
        setUserEmail(email);
        if (user) {
            setUserData(user);
            await SecureStore.setItemAsync("userData", JSON.stringify(user));
            console.log("✅ User data stored in SecureStore:", user.id);
        }
        setIsAuthenticated(true);
    };

    const logoutMutation = uselogout();

    const logout = async () => {
        try {
            // Trigger API logout - wrap in try/catch as it might 401 if already expired
            await logoutMutation.mutateAsync();
        } catch (e) {
            console.log("Session already expired or API error during logout:", e);
        }


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
