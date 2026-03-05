import axios from 'axios';
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
    const response = await axiosInstance.get('/employee/dashboard/stat');
    return response.data;
};

//form 

export const getBranch = async () => {
    const response = await axiosInstance.get("/employee/dashboard/branches/")
    return response.data;
}

export const findavailableroom = async (data) => {
    const response = await axiosInstance.post("/employee/dashboard/rooms/search-available", data)
    return response.data;
}

export const mybookinghome = async () => {
    const response = await axiosInstance.get("/bookings/my-bookings")
    return response.data;
}

export const bookroom = async (data) => {
    const response = await axiosInstance.post("/bookings/", data)
    return response.data;
}

export const explorerooms = async (status) => {
    const response = await axiosInstance.get(`/employee/dashboard/explore-rooms?status=${status}`)
    return response.data;
}

export const bookings = async (params) => {
    const response = await axiosInstance.get("/bookings/my-bookings", { params })
    return response.data;
}

export const allbooking = async (params) => {
    const response = await axiosInstance.get("/bookings/all", { params })
    return response.data;
}