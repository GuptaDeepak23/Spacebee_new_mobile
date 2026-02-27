import axios from "axios";
import * as SecureStore from "expo-secure-store";
import Toast from "react-native-toast-message";

const axiosInstance = axios.create({
    baseURL: "https://spacebee-uat.kanishkatech.com/backend/api",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});


// ======================
// REQUEST INTERCEPTOR
// ======================
axiosInstance.interceptors.request.use(
    async (config) => {
        try {
            const token = await SecureStore.getItemAsync("accessToken");

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            return config;
        } catch (err) {
            return Promise.reject(err);
        }
    },
    (error) => Promise.reject(error)
);


// ======================
// RESPONSE INTERCEPTOR
// ======================
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response) {
            const status = error.response.status;
            const message =
                error.response.data?.message ||
                "Something went wrong";

            // 🔴 Unauthorized
            if (status === 401) {
                await SecureStore.deleteItemAsync("accessToken");

                Toast.show({
                    type: "error",
                    text1: "Session Expired",
                    text2: "Please login again",
                });

                // TODO: Navigate to login screen
            }

            // 🔴 Other API errors
            else {
                Toast.show({
                    type: "error",
                    text1: "Error",
                    text2: message,
                });
            }
        }

        // 🔴 Network Error
        else if (error.request) {
            Toast.show({
                type: "error",
                text1: "Network Error",
                text2: "Check your internet connection",
            });
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;