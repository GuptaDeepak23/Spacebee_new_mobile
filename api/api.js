import axiosInstance from './axiosInstance';

export const requestOtp = async (email) => {
    const response = await axiosInstance.post('/auth/employee/request-otp', { email });
    return response.data;
};

export const verifyOtp = async ({ email, otp }) => {
    const response = await axiosInstance.post('/auth/employee/login', { email, otp });
    return response.data;
};

export const stats = async () => {
    const response = await axiosInstance.get('/auth/employee/stats');
    return response.data;
};