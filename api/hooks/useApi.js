import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { requestOtp, verifyOtp, stats } from "../api";

export const useRequestOtp = () => {
    return useMutation({
        mutationFn: requestOtp,
        onSuccess: (data) => {
            Toast.show({
                type: 'success',
                text1: 'OTP sent successfully',
                text2: data.message,
            });
            console.log("OTP sent successfully", data);
        },
        onError: (error) => {
            Toast.show({
                type: 'error',
                text1: error.message,
            });
            console.log("Error sending OTP", error);
        }
    });
}

export const useVerifyOtp = () => {
    return useMutation({
        mutationFn: verifyOtp,
    });
}

export const useStats = () => {
    return useQuery({
        queryKey: ['stats'], 
        queryFn: stats,
    });
}